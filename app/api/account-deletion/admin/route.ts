import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ServerClient = ReturnType<typeof getSupabaseServerClient>;

// Status a request must have for each action: pending → approved | rejected, approved → completed.
const REQUIRED_STATUS: Record<string, string> = {
  approved: "pending",
  rejected: "pending",
  completed: "approved",
};

// Verifies the bearer token and that the user is an admin: they have an admin_roles row, the same
// check public.is_admin() and admin-dashboard use. Returns a service-role client for the request.
async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: adminRole, error: roleError } = await supabase
    .from("admin_roles")
    .select("user_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (roleError) {
    console.error("Error checking admin role:", roleError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  if (!adminRole) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  return { supabase, user };
}

// Storage blocks deleting files with SQL, so the files delete_user_account() returns are removed
// through the Storage API, one call per bucket.
async function removeStorageFiles(
  supabase: ServerClient,
  files: { storage_bucket: string; storage_path: string }[]
) {
  const pathsByBucket = new Map<string, string[]>();
  for (const file of files) {
    pathsByBucket.set(file.storage_bucket, [
      ...(pathsByBucket.get(file.storage_bucket) ?? []),
      file.storage_path,
    ]);
  }

  let removed = 0;
  const failed: string[] = [];
  for (const [bucket, paths] of pathsByBucket) {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error(`Error removing files from ${bucket}:`, error);
      failed.push(...paths.map((path) => `${bucket}/${path}`));
    } else {
      removed += data.length;
    }
  }

  return { removed, failed };
}

// Admin endpoint to list all deletion requests
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth instanceof NextResponse) {
      return auth;
    }
    const { supabase } = auth;

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch deletion requests
    let query = supabase
      .from("account_deletion_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: requests, error: fetchError, count } = await query;

    if (fetchError) {
      console.error("Error fetching deletion requests:", fetchError);
      return NextResponse.json(
        { error: "Gagal mengambil data permintaan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Admin get deletion requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Admin endpoint to process a deletion request
export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);
    if (auth instanceof NextResponse) {
      return auth;
    }
    const { supabase, user } = auth;

    // Parse request body
    const body = await request.json();
    const { request_id, action, notes } = body;

    if (!request_id || !action) {
      return NextResponse.json(
        { error: "request_id dan action harus diisi" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "completed"].includes(action)) {
      return NextResponse.json(
        { error: "action harus berupa approved, rejected, atau completed" },
        { status: 400 }
      );
    }

    const { data: currentRequest, error: fetchError } = await supabase
      .from("account_deletion_requests")
      .select("id, status, metadata")
      .eq("id", request_id)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching deletion request:", fetchError);
      return NextResponse.json(
        { error: "Gagal mengambil data permintaan" },
        { status: 500 }
      );
    }

    if (!currentRequest) {
      return NextResponse.json(
        { error: "Permintaan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (currentRequest.status !== REQUIRED_STATUS[action]) {
      return NextResponse.json(
        {
          error: `Permintaan berstatus ${currentRequest.status}; ${action} hanya untuk permintaan ${REQUIRED_STATUS[action]}`,
        },
        { status: 409 }
      );
    }

    if (action === "completed") {
      // Deletes the account and anonymizes the request in one transaction. The database refuses
      // unless the request is approved and the caller is an admin.
      const { data: files, error: deleteError } = await supabase.rpc(
        "delete_user_account",
        { p_request_id: request_id, p_admin_id: user.id }
      );

      if (deleteError) {
        console.error("Error deleting account:", deleteError);
        return NextResponse.json(
          { error: "Gagal menghapus akun" },
          { status: deleteError.code === "55000" ? 409 : 500 }
        );
      }

      const storageCleanup = await removeStorageFiles(supabase, files ?? []);

      const { data: completedRequest } = await supabase
        .from("account_deletion_requests")
        .select("*")
        .eq("id", request_id)
        .single();

      return NextResponse.json({
        success: true,
        message: "Akun berhasil dihapus",
        data: completedRequest,
        storage_cleanup: storageCleanup,
      });
    }

    // Keep the requester's email and request details: support needs them until the account is
    // deleted, when delete_user_account() anonymizes the request.
    const previousMetadata =
      currentRequest.metadata &&
      typeof currentRequest.metadata === "object" &&
      !Array.isArray(currentRequest.metadata)
        ? currentRequest.metadata
        : {};

    // Update the deletion request, unless another admin processed it in the meantime
    const { data: updatedRequest, error: updateError } = await supabase
      .from("account_deletion_requests")
      .update({
        status: action,
        processed_at: new Date().toISOString(),
        processed_by: user.id,
        metadata: {
          ...previousMetadata,
          notes: notes || null,
          processed_by_email: user.email,
        },
      })
      .eq("id", request_id)
      .eq("status", REQUIRED_STATUS[action])
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Error updating deletion request:", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui permintaan" },
        { status: 500 }
      );
    }

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Permintaan sudah diproses oleh admin lain" },
        { status: 409 }
      );
    }

    // TODO: Send email notification to user about the status

    return NextResponse.json({
      success: true,
      message: `Permintaan berhasil di${action}`,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Admin process deletion request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
