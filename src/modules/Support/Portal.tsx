"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Search,
  Ticket,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Filter,
  X,
  User,
  Calendar,
  Hash,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import {
  fetchUserTickets,
  createTicket,
  addTicketReply,
  TicketItem,
  TicketReply,
  TicketPriority,
} from "@/lib/api/support";
import { submitDeletionRequest } from "@/lib/api/account-deletion";

// ─── Status Config (Satu Teladan Style) ──────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: {
    label: "Menunggu",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  open: {
    label: "Terbuka",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  in_progress: {
    label: "Sedang Diproses",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
  resolved: {
    label: "Selesai",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  closed: {
    label: "Ditutup",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
} as const;

// ─── Formatting ──────────────────────────────────────────────────────────────

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 hari yang lalu";
  if (diffDays < 30) return `${diffDays} hari yang lalu`;
  
  return date.toLocaleDateString('id-ID', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  });
};

// ─── Ticket Details Panel ────────────────────────────────────────────────────

function TicketDetails({ 
  ticket, 
  onClose,
  userId,
  onReplyAdded
}: { 
  ticket: TicketItem; 
  onClose: () => void;
  userId: string;
  onReplyAdded: (ticketId: string, reply: TicketReply) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      const reply = await addTicketReply(ticket.id, userId, replyText);
      setReplyText("");
      onReplyAdded(ticket.id, reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 overflow-hidden shadow-2xl font-sans">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white">
        <h2 className="text-base font-bold text-gray-900 font-title truncate mr-4">
          {ticket.subject}
        </h2>
        <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-all group shadow-sm bg-gray-50 border border-gray-100">
          <X size={20} className="text-gray-400 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
           <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">Pemohon</span>
              <span className="text-xs font-semibold text-gray-700">Anda</span>
           </div>
           <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">Dibuat</span>
              <span className="text-xs font-semibold text-gray-700">{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
           </div>
           <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">Nomor ID</span>
              <span className="text-xs font-semibold text-gray-700">#{ticket.id.slice(0, 8)}</span>
           </div>
           <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 block">Status</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                 <UserIcon size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Anda</p>
                <p className="text-[11px] text-gray-400 font-medium">{formatDate(ticket.created_at)}</p>
              </div>
           </div>
           <div className="pl-12 pr-4">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {ticket.message}
              </p>
           </div>
        </div>

        <div className="border-t border-gray-50 pt-8 space-y-8">
           {(ticket.replies ?? []).map((reply) => (
             <div key={reply.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${reply.is_admin_reply ? "bg-[#002587] border-[#002587]" : "bg-gray-100 border-gray-200"}`}>
                    {reply.is_admin_reply ? (
                      <ShieldCheck size={16} className="text-white" />
                    ) : (
                      <UserIcon size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${reply.is_admin_reply ? "text-[#002587]" : "text-gray-900"}`}>
                      {reply.is_admin_reply ? "Tim Dukungan" : "Anda"}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">{formatDate(reply.created_at)}</p>
                  </div>
                </div>
                <div className="pl-12 pr-4">
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {reply.message}
                  </p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {ticket.status !== "closed" && (
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis balasan tindak lanjut..."
              className="w-full text-sm p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#002587] outline-none transition-all min-h-[120px] resize-none font-medium text-gray-800 placeholder:text-gray-300 shadow-inner"
            />
            <div className="flex justify-end">
              <button
                onClick={handleReply}
                disabled={isSending || !replyText.trim()}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#002587] text-white text-xs font-bold rounded-xl hover:bg-[#001d6b] disabled:bg-gray-100 disabled:text-gray-300 transition-all shadow-lg shadow-blue-900/10"
              >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Kirim Balasan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {ticket.status === "closed" && (
        <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs font-semibold text-gray-400 leading-relaxed">
            Tiket ini telah ditutup. Anda dapat membuat <span className="text-[#002587] cursor-pointer hover:underline font-bold">tiket baru</span> jika masalah berlanjut.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SupportPortal({
  user,
}: {
  user: { id: string; email?: string };
}) {
  const [activeTab, setActiveTab] = useState<"requests" | "delete-account">("requests");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newSubject, setNewSubject] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [delReason, setDelReason] = useState("");
  const [delConfirm, setDelConfirm] = useState("");
  const [isDelLoading, setIsDelLoading] = useState(false);
  const [isDelSuccess, setIsDelSuccess] = useState(false);
  const [delError, setDelError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [user.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTicketId(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserTickets(user.id);
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      const data = await createTicket(user.id, newSubject, newQuestion, priority);
      setTickets([data, ...tickets]);
      setIsCreating(false);
      setNewSubject("");
      setNewQuestion("");
      setSelectedTicketId(data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (delConfirm.toUpperCase() !== "HAPUS AKUN" || delReason.length < 10) return;

    setIsDelLoading(true);
    setDelError("");
    try {
      await submitDeletionRequest({
        email: user.email || "",
        reason: delReason.trim(),
      });
      setIsDelSuccess(true);
    } catch (err: any) {
      setDelError(err.message || "Gagal mengirim permintaan");
    } finally {
      setIsDelLoading(false);
    }
  };

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-center bg-white relative z-10">
        <div className="flex items-center gap-8">
           <button 
             onClick={() => { setActiveTab("requests"); setIsCreating(false); }}
             className={`text-xs font-bold transition-all pb-2 border-b-2 font-title ${activeTab === "requests" ? "border-[#002587] text-[#002587]" : "border-transparent text-gray-400 hover:text-gray-900"}`}
           >
             Tiket Dukungan
           </button>
           <button 
             onClick={() => setActiveTab("delete-account")}
             className={`text-xs font-bold transition-all pb-2 border-b-2 font-title ${activeTab === "delete-account" ? "border-[#002587] text-[#002587]" : "border-transparent text-gray-400 hover:text-gray-900"}`}
           >
             Penghapusan Akun
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 overflow-y-auto w-full bg-gray-50/30">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 lg:py-24">
            <AnimatePresence mode="wait">
              {activeTab === "requests" ? (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-title tracking-tight">Aktivitas Terbaru</h1>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Pantau dan kelola tiket dukungan Anda</p>
                     </div>
                     {!isCreating && (
                       <div className="flex items-center gap-3">
                         <button 
                           onClick={fetchTickets}
                           className="p-3.5 text-gray-400 hover:text-[#002587] hover:bg-white rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                           title="Muat Ulang"
                         >
                           <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                         </button>
                         <button 
                           onClick={() => setIsCreating(true)}
                           className="flex items-center gap-2 px-8 py-3.5 bg-[#002587] text-white text-xs font-bold rounded-xl hover:bg-[#001d6b] transition-all shadow-xl shadow-blue-900/20"
                         >
                           <Plus size={18} /> Tiket Baru
                         </button>
                       </div>
                     )}
                  </div>

                  {isCreating ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-100 p-8 md:p-12 rounded-2xl shadow-xl shadow-gray-200/50 space-y-10"
                    >
                      <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                         <h2 className="text-lg font-bold font-title text-gray-900">Kirim tiket baru</h2>
                         <button onClick={() => setIsCreating(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                            <X size={24} />
                         </button>
                      </div>
                      <form onSubmit={handleCreateTicket} className="space-y-10">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-500 pl-1">Subjek</label>
                          <input 
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Judul singkat masalah Anda..."
                            className="w-full py-4 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#002587] outline-none transition-all text-sm font-semibold placeholder:text-gray-200"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-500 pl-1">Detail</label>
                          <textarea 
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Berikan detail agar kami dapat membantu lebih cepat..."
                            className="w-full py-5 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#002587] outline-none transition-all text-sm font-semibold placeholder:text-gray-200 min-h-[160px] resize-none"
                            required
                          />
                        </div>
                        <div className="flex justify-end pt-4">
                           <button 
                             type="submit"
                             disabled={isSubmitting}
                             className="px-12 py-4 bg-[#002587] text-white text-xs font-bold rounded-xl hover:bg-[#001d6b] transition-all disabled:bg-gray-100 flex items-center gap-3 shadow-lg shadow-blue-900/20"
                           >
                             {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                             Kirim Tiket
                           </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="py-32 flex flex-col items-center gap-4">
                           <Loader2 className="animate-spin text-blue-200" size={40} strokeWidth={1.5} />
                           <p className="text-xs font-bold text-gray-300">Mengakses catatan</p>
                        </div>
                      ) : tickets.length === 0 ? (
                        <div className="py-40 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-6 grayscale opacity-40">
                           <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                              <Ticket size={32} className="text-gray-300" />
                           </div>
                           <p className="text-sm font-bold text-gray-400 font-title">Belum ada tiket ditemukan</p>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden divide-y divide-gray-50">
                           {tickets.map((ticket) => {
                             const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
                             return (
                               <button 
                                 key={ticket.id}
                                 onClick={() => setSelectedTicketId(ticket.id)}
                                 className={`w-full flex md:items-center justify-between py-6 px-8 hover:bg-gray-50 transition-all group text-left ${selectedTicketId === ticket.id ? "bg-blue-50/30" : ""}`}
                               >
                                 <div className="flex-1 pr-6 space-y-2">
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#002587] transition-colors truncate max-w-lg font-title">
                                       {ticket.subject}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                       <span className="text-[11px] font-bold text-[#002587] bg-blue-50 px-2 py-0.5 rounded">#{ticket.id.slice(0, 8)}</span>
                                       <span className="text-[11px] font-semibold text-gray-400">{formatDate(ticket.created_at)}</span>
                                    </div>
                                 </div>
                                 <div className="shrink-0 flex items-center gap-6">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text} border border-transparent group-hover:border-current/10`}>
                                       <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                       {status.label}
                                    </span>
                                    <ArrowRight size={18} className={`text-gray-200 transition-all ${selectedTicketId === ticket.id ? "translate-x-1 text-[#002587]" : "group-hover:translate-x-1 group-hover:text-gray-400"}`} />
                                 </div>
                               </button>
                             );
                           })}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="delete"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900 font-title tracking-tight">Penghapusan Akun</h1>
                    <p className="text-sm text-gray-500 font-medium">Penghapusan data permanen dari basis data kami</p>
                  </div>

                  {isDelSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.98 }} animate={{ scale: 1 }}
                      className="bg-white border border-gray-100 p-16 rounded-3xl text-center shadow-xl shadow-gray-200/50 space-y-8"
                    >
                       <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                          <CheckCircle2 size={32} className="text-green-600" />
                       </div>
                       <h2 className="text-2xl font-bold font-title text-gray-900">Permintaan Diterima</h2>
                       <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                         Proses penghapusan telah dimulai. Ini biasanya memakan waktu 3-5 hari kerja. Email konfirmasi akan dikirim ke {user.email}.
                       </p>
                       <button onClick={() => setIsDelSuccess(false)} className="text-xs font-bold text-[#002587] hover:underline pt-4">
                         Kirim permintaan lain
                       </button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                       <div className="lg:col-span-2 space-y-8">
                          <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 space-y-6">
                             <div className="flex items-center gap-3 text-amber-700">
                                <AlertTriangle size={24} />
                                <span className="text-sm font-bold font-title">Pemberitahuan Penting</span>
                             </div>
                             <p className="text-sm text-amber-900/70 font-semibold leading-relaxed">
                               Menghapus akun Anda bersifat permanen dan tidak dapat dibatalkan. Semua riwayat, pengaturan, dan catatan akademik yang terkait dengan ID ini akan dihapus.
                             </p>
                          </div>
                          <div className="space-y-4 pt-4 px-2">
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#002587]" />
                                <span className="text-[11px] font-bold text-gray-400">ID Login Aktif</span>
                             </div>
                             <div className="text-sm font-bold text-gray-700 tracking-tight">{user.email}</div>
                          </div>
                       </div>

                       <div className="lg:col-span-3">
                          <form onSubmit={handleDeleteRequest} className="bg-white border border-gray-100 p-10 rounded-3xl shadow-xl shadow-gray-200/30 space-y-10">
                            <div className="space-y-4">
                              <label className="text-xs font-bold text-gray-500 ml-1">Alasan berhenti</label>
                              <textarea 
                                value={delReason}
                                onChange={(e) => setDelReason(e.target.value)}
                                placeholder="Beri tahu kami alasan Anda berhenti (Min. 10 karakter)"
                                className="w-full text-sm font-bold p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#002587] transition-all outline-none min-h-[160px] resize-none placeholder:text-gray-200"
                                required
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs font-bold text-gray-500 ml-1">Tanda tangan konfirmasi</label>
                              <input 
                                type="text"
                                value={delConfirm}
                                onChange={(e) => setDelConfirm(e.target.value)}
                                placeholder="Ketik 'HAPUS AKUN' dengan tepat"
                                className="w-full text-sm font-bold p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#002587] transition-all outline-none placeholder:text-gray-200"
                                required
                              />
                            </div>

                            {delError && (
                              <div className="p-5 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                                {delError}
                              </div>
                            )}

                            <button 
                              type="submit"
                              disabled={isDelLoading || delConfirm.toUpperCase() !== "HAPUS AKUN" || delReason.length < 10}
                              className="w-full py-5 bg-red-700 text-white text-xs font-bold rounded-2xl hover:bg-black transition-all disabled:bg-gray-100 disabled:text-gray-300 shadow-lg shadow-red-900/10"
                            >
                              {isDelLoading ? <Loader2 size={18} className="animate-spin" /> : "Verifikasi dan Hapus Akun"}
                            </button>
                          </form>
                       </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedTicketId && activeTicket && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTicketId(null)}
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-[110]"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 35, stiffness: 350 }}
                className="fixed top-0 right-0 bottom-0 w-full sm:w-[540px] md:w-[640px] z-[120] shadow-2xl"
              >
                <TicketDetails 
                  ticket={activeTicket} 
                  onClose={() => setSelectedTicketId(null)}
                  userId={user.id}
                  onReplyAdded={(tid, reply) => {
                    setTickets(prev => prev.map(t => t.id === tid ? { ...t, replies: [...(t.replies ?? []), reply] } : t));
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-10 py-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between text-gray-400 gap-4">
         <p className="text-[10px] font-bold font-title">
            Satu Teladan Support Hub &copy; {new Date().getFullYear()}
         </p>
         <div className="flex gap-8">
            <span className="text-[10px] font-bold hover:text-[#002587] cursor-pointer transition-colors">Infrastruktur Keamanan</span>
            <span className="text-[10px] font-bold hover:text-[#002587] cursor-pointer transition-colors">Privasi Data</span>
         </div>
      </footer>
    </div>
  );
}
