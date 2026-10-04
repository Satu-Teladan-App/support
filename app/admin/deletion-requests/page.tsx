/**
 * Example Admin Dashboard Component
 * Use this as a starting point for building an admin interface
 */

"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface DeletionRequest {
  id: string;
  user_id: string | null; // null once the account is deleted and the request anonymized
  reason: string | null;
  status: string;
  requested_at: string;
  processed_at: string | null;
  metadata: any;
}

export default function AdminDeletionRequestsPage() {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadRequests();
  }, [filter]);

  async function loadRequests() {
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `/api/account-deletion/admin?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load requests");
      }

      const result = await response.json();
      setRequests(result.data);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function processRequest(requestId: string, action: string) {
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      let notes: string | null = null;
      if (action === "completed") {
        if (
          !confirm(
            "This permanently deletes the user's account, profile, content, messages and files. Continue?"
          )
        ) {
          return;
        }
      } else {
        notes = prompt(`Notes for ${action}:`);
      }

      const response = await fetch("/api/account-deletion/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          request_id: requestId,
          action,
          notes,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Failed to process request");
      }

      // Reload requests
      await loadRequests();
      const failedFiles: string[] = result.storage_cleanup?.failed ?? [];
      alert(
        failedFiles.length > 0
          ? `Account deleted, but these files could not be removed: ${failedFiles.join(", ")}`
          : "Request processed successfully"
      );
    } catch (error) {
      console.error("Error processing request:", error);
      alert(
        error instanceof Error ? error.message : "Failed to process request"
      );
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Account Deletion Requests</h1>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {["pending", "approved", "rejected", "completed", "all"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Requested At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                    {request.user_id
                      ? `${request.user_id.slice(0, 8)}...`
                      : "Deleted"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.metadata?.email ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                    {request.reason || "No reason provided"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(request.requested_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => processRequest(request.id, "approved")}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => processRequest(request.id, "rejected")}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status === "approved" && (
                      <button
                        onClick={() => processRequest(request.id, "completed")}
                        className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 text-xs font-semibold"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
