"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Ticket,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  Loader2,
  ShieldCheck,
  Flag,
} from "lucide-react";
import {
  fetchAllTickets,
  updateTicketStatus,
  adminReplyToTicket,
  TicketItem,
  TicketStatus,
  TicketPriority,
} from "@/lib/api/support";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-600" },
  open: { label: "Open", bg: "bg-blue-50", text: "text-blue-600" },
  in_progress: { label: "In Progress", bg: "bg-sky-50", text: "text-sky-600" },
  resolved: { label: "Resolved", bg: "bg-green-50", text: "text-green-600" },
  closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-500" },
};

const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; bg: string; text: string }
> = {
  low: { label: "Low", bg: "bg-gray-100", text: "text-gray-500" },
  normal: { label: "Normal", bg: "bg-green-50", text: "text-green-600" },
  high: { label: "High", bg: "bg-orange-50", text: "text-orange-600" },
  urgent: { label: "Urgent", bg: "bg-red-50", text: "text-red-600" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`px-2 py-0.5 ${cfg.bg} ${cfg.text} text-[9px] font-bold uppercase tracking-widest rounded`}
    >
      {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className={`px-2 py-0.5 ${cfg.bg} ${cfg.text} text-[9px] font-bold uppercase tracking-widest rounded flex items-center gap-1`}
    >
      <Flag size={9} />
      {cfg.label}
    </span>
  );
}

// ─── Ticket Detail Panel ─────────────────────────────────────────────────────

function TicketDetailPanel({
  ticket,
  adminUserId,
  onUpdated,
}: {
  ticket: TicketItem;
  adminUserId: string;
  onUpdated: (updated: TicketItem) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [adminNotes, setAdminNotes] = useState(ticket.admin_notes ?? "");
  const [isSending, setIsSending] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleStatusChange = async (status: TicketStatus) => {
    const updated = await updateTicketStatus(ticket.id, { status });
    if (updated) onUpdated(updated);
  };

  const handlePriorityChange = async (priority: TicketPriority) => {
    const updated = await updateTicketStatus(ticket.id, { priority });
    if (updated) onUpdated(updated);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    const updated = await updateTicketStatus(ticket.id, {
      admin_notes: adminNotes,
    });
    if (updated) onUpdated(updated);
    setIsSavingNotes(false);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      const reply = await adminReplyToTicket(ticket.id, adminUserId, replyText);
      setReplyText("");
      // Optimistically update the ticket's replies list
      onUpdated({
        ...ticket,
        status: ticket.status === "pending" ? "open" : ticket.status,
        replies: [...(ticket.replies ?? []), reply],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header meta */}
      <div className="flex flex-wrap gap-3 items-center">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority ?? "normal"} />
        <span className="text-[10px] text-gray-400 ml-auto">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
      </div>

      {/* Original message */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Pesan Awal
        </p>
        <p className="text-sm text-gray-800">{ticket.message}</p>
      </div>

      {/* Reply thread */}
      {(ticket.replies ?? []).length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Riwayat Balasan
          </p>
          {(ticket.replies ?? []).map((reply) => (
            <div
              key={reply.id}
              className={`flex gap-3 ${reply.is_admin_reply ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  reply.is_admin_reply
                    ? "bg-[#002587] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {reply.is_admin_reply ? (
                  <ShieldCheck size={14} />
                ) : (
                  <UserIcon size={14} />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg text-sm ${
                  reply.is_admin_reply
                    ? "bg-[#002587] text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{reply.message}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    reply.is_admin_reply ? "text-white/60" : "text-gray-400"
                  }`}
                >
                  {new Date(reply.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin reply input */}
      {ticket.status !== "closed" && (
        <div className="space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Tulis balasan kepada pengguna..."
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm resize-none focus:bg-white focus:border-[#002587] outline-none transition-all min-h-25"
          />
          <button
            onClick={handleReply}
            disabled={isSending || !replyText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#002587] text-white text-xs font-bold rounded-lg hover:bg-[#001d6b] disabled:opacity-50 transition-all"
          >
            {isSending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Kirim Balasan
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
        {/* Status */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Ubah Status
          </p>
          <div className="flex flex-wrap gap-2">
            {(["pending", "open", "in_progress", "resolved", "closed"] as TicketStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={ticket.status === s}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  ticket.status === s
                    ? "bg-[#002587] text-white border-[#002587]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#002587] hover:text-[#002587]"
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Ubah Prioritas
          </p>
          <div className="flex flex-wrap gap-2">
            {(["low", "normal", "high", "urgent"] as TicketPriority[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  disabled={(ticket.priority ?? "normal") === p}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    (ticket.priority ?? "normal") === p
                      ? "bg-[#002587] text-white border-[#002587]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#002587] hover:text-[#002587]"
                  }`}
                >
                  {PRIORITY_CONFIG[p].label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Admin notes */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Catatan Internal (tidak terlihat pengguna)
        </p>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Tambahkan catatan internal..."
          className="w-full p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm resize-none focus:border-amber-400 outline-none transition-all min-h-20"
        />
        <button
          onClick={handleSaveNotes}
          disabled={isSavingNotes}
          className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 bg-amber-50 text-xs font-bold rounded-lg hover:bg-amber-100 disabled:opacity-50 transition-all"
        >
          {isSavingNotes ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <CheckCircle2 size={12} />
          )}
          Simpan Catatan
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminUserId, setAdminUserId] = useState<string>("");

  // Stat counters
  const counts = {
    all: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const loadTickets = async () => {
    setLoading(true);
    const data = await fetchAllTickets(
      statusFilter === "all" ? undefined : statusFilter,
    );
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    // Get current admin user id
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setAdminUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchAllTickets(
        statusFilter === "all" ? undefined : statusFilter,
      );
      setTickets(data);
      setLoading(false);
    })();
  }, [statusFilter]);

  const handleTicketUpdated = (updated: TicketItem) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
    );
  };

  const filteredTickets = tickets; // already filtered by API

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#002587] flex items-center gap-3">
              <Ticket size={24} />
              Manajemen Tiket Support
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tinjau, balas, dan kelola semua tiket bantuan pengguna.
            </p>
          </div>
          <button
            onClick={loadTickets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:border-[#002587] hover:text-[#002587] transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(
            [
              {
                key: "all",
                label: "Semua Tiket",
                icon: Ticket,
                color: "text-gray-600",
              },
              {
                key: "pending",
                label: "Menunggu",
                icon: Clock,
                color: "text-amber-600",
              },
              {
                key: "open",
                label: "Aktif",
                icon: MessageSquare,
                color: "text-blue-600",
              },
              {
                key: "in_progress",
                label: "Diproses",
                icon: RefreshCw,
                color: "text-sky-600",
              },
              {
                key: "resolved",
                label: "Selesai",
                icon: CheckCircle2,
                color: "text-green-600",
              },
            ] as const
          ).map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`bg-white border rounded-lg p-4 text-left transition-all shadow-sm hover:border-[#002587] ${
                statusFilter === key
                  ? "border-[#002587] shadow-md"
                  : "border-gray-100"
              }`}
            >
              <Icon size={18} className={`${color} mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{counts[key]}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {label}
              </p>
            </button>
          ))}
        </div>

        {/* Ticket List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-30">
            <Loader2 className="animate-spin mb-3" size={28} />
            <p className="text-xs font-bold uppercase tracking-widest">
              Memuat Tiket...
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-24 bg-white border border-dashed border-gray-200 rounded-lg">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-500">Tidak ada tiket</h3>
            <p className="text-xs text-gray-400 mt-1">
              Tidak ditemukan tiket dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const isExpanded = expandedId === ticket.id;
              return (
                <div
                  key={ticket.id}
                  className={`bg-white border rounded-lg shadow-sm transition-all ${
                    isExpanded
                      ? "border-[#002587] shadow-md"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  {/* Ticket Row */}
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                      {ticket.user_alumni?.avatar ? (
                        <Image
                          src={ticket.user_alumni.avatar}
                          alt=""
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon size={18} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="grow min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-gray-800">
                          {ticket.user_alumni?.name ?? "Pengguna"}
                        </span>
                        {ticket.user_alumni?.batch && (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Ang. {ticket.user_alumni.batch}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {ticket.message}
                      </p>
                    </div>

                    {/* Badges & Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority ?? "normal"} />
                      {(ticket.replies?.length ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <MessageSquare size={11} />
                          {ticket.replies!.length}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-5">
                        <TicketDetailPanel
                          ticket={ticket}
                          adminUserId={adminUserId}
                          onUpdated={handleTicketUpdated}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
