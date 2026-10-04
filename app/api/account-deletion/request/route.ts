import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

interface DeletionRequestBody {
  reason: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client with the user's access token
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Verify the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: DeletionRequestBody = await request.json();
    const { reason, email } = body;

    // Validate input
    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: "Alasan harus minimal 10 karakter" },
        { status: 400 }
      );
    }

    if (!email || email !== user.email) {
      return NextResponse.json(
        { error: "Email tidak sesuai dengan akun yang login" },
        { status: 400 }
      );
    }

    // Check if there's already an open request (pending or approved by support)
    const { data: existingRequest, error: checkError } = await supabase
      .from("account_deletion_requests")
      .select("id")
      .eq("user_id", user.id)
      .in("status", ["pending", "approved"])
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing request:", checkError);
      return NextResponse.json(
        { error: "Terjadi kesalahan saat memeriksa permintaan yang ada" },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "Anda sudah memiliki permintaan penghapusan akun yang sedang diproses",
        },
        { status: 400 }
      );
    }

    // Create deletion request
    const { data: deletionRequest, error: insertError } = await supabase
      .from("account_deletion_requests")
      .insert({
        user_id: user.id,
        reason: reason.trim(),
        status: "pending",
        requested_at: new Date().toISOString(),
        metadata: {
          email: user.email,
          user_agent: request.headers.get("user-agent"),
          ip_address:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip"),
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating deletion request:", insertError);
      return NextResponse.json(
        { error: "Gagal membuat permintaan penghapusan akun" },
        { status: 500 }
      );
    }

    // TODO: Send email notification to user
    // TODO: Send notification to admin team

    return NextResponse.json({
      success: true,
      message: "Permintaan penghapusan akun berhasil dibuat",
      data: {
        id: deletionRequest.id,
        status: deletionRequest.status,
        requested_at: deletionRequest.requested_at,
      },
    });
  } catch (error) {
    console.error("Account deletion request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's deletion request status
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client with the user's access token
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Verify the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's deletion requests
    const { data: requests, error: fetchError } = await supabase
      .from("account_deletion_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

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
    });
  } catch (error) {
    console.error("Get deletion request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
