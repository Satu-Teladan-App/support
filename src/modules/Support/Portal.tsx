"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Search,
  Ticket,
  ArrowRight,
  LifeBuoy,
  Clock,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import {
  fetchUserTickets,
  createTicket,
  addTicketReply,
  fetchForumPosts,
  TicketItem,
  TicketReply,
  ForumPost,
  TicketPriority,
} from "@/lib/api/support";

// ─── Ticket card with expandable reply thread ──────────────────────────────

function TicketCard({
  ticket,
  userId,
  onReplyAdded,
}: {
  ticket: TicketItem;
  userId: string;
  onReplyAdded: (ticketId: string, reply: TicketReply) => void;
}) {
  const [expanded, setExpanded] = useState(false);
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

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      {/* Row */}
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {ticket.status === "pending" && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded uppercase tracking-widest">
                Pending
              </span>
            )}
            {ticket.status === "open" && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase tracking-widest">
                Open
              </span>
            )}
            {ticket.status === "closed" && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[9px] font-bold rounded uppercase tracking-widest">
                Closed
              </span>
            )}
            {(ticket.replies?.length ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#002587]">
                <MessageSquare size={10} />
                {ticket.replies!.length} balasan
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
            {expanded ? (
              <ChevronUp size={14} className="text-gray-400" />
            ) : (
              <ChevronDown size={14} className="text-gray-400" />
            )}
          </div>
        </div>
        <h3 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">
          {ticket.subject}
        </h3>
        <p className="text-[10px] text-gray-400 line-clamp-2">
          {ticket.message}
        </p>
      </button>

      {/* Expanded reply thread */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {/* Thread */}
          {(ticket.replies ?? []).length > 0 && (
            <div className="space-y-2">
              {(ticket.replies ?? []).map((reply) => (
                <div
                  key={reply.id}
                  className={`flex gap-2 ${reply.is_admin_reply ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      reply.is_admin_reply
                        ? "bg-[#002587] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {reply.is_admin_reply ? (
                      <ShieldCheck size={12} />
                    ) : (
                      <UserIcon size={12} />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                      reply.is_admin_reply
                        ? "bg-[#002587] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{reply.message}</p>
                    <p
                      className={`text-[9px] mt-1 ${
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

          {/* Follow-up reply input (only if not closed) */}
          {ticket.status !== "closed" && (
            <div className="flex gap-2 items-end pt-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tambahkan pesan lanjutan..."
                className="flex-1 text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg resize-none focus:bg-white focus:border-[#002587] outline-none transition-all min-h-16"
              />
              <button
                onClick={handleReply}
                disabled={isSending || !replyText.trim()}
                className="flex items-center gap-1 px-3 py-2 bg-[#002587] text-white text-xs font-bold rounded-lg hover:bg-[#001d6b] disabled:opacity-50 transition-all self-end"
              >
                {isSending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                Kirim
              </button>
            </div>
          )}
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
  const { activeTab, setIsPortal } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [forumLoading, setForumLoading] = useState(true);

  useEffect(() => {
    setIsPortal(true);
    return () => setIsPortal(false);
  }, [setIsPortal]);

  const fetchTicketsData = async () => {
    if (!user?.id) return;
    const data = await fetchUserTickets(user.id);
    setTickets(data);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !user?.id) return;

    setIsSubmitting(true);
    try {
      const data = await createTicket(user.id, newQuestion, priority);
      if (data) {
        setNewQuestion("");
        setPriority("normal");
        setTickets((prev) => [data, ...prev]);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyAdded = (ticketId: string, reply: TicketReply) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, replies: [...(t.replies ?? []), reply] }
          : t,
      ),
    );
  };

  const fetchForumPostsData = async () => {
    setForumLoading(true);
    const data = await fetchForumPosts();
    setForumPosts(data);
    setForumLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchTicketsData();
    fetchForumPostsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans mt-20">
      <main className="pb-20 container mx-auto px-6 max-w-6xl">
        <AnimatePresence mode="wait">
          {activeTab === "support" ? (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-12"
            >
              {/* Support Hero */}
              <section className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#002587] mb-6 tracking-tight">
                  Bantuan Layanan Support
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                  Keluarga besar Satu Teladan hadir untuk saling membantu.
                  Temukan solusi atau ajukan pertanyaan langsung kepada tim
                  kami.
                </p>
                <div className="mt-10 max-w-xl mx-auto relative group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#002587] transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Cari solusi atau panduan..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:border-[#002587] outline-none transition-all shadow-sm"
                  />
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - New Ticket */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <MessageSquare className="text-[#002587]" size={22} />
                      Ajukan Pertanyaan Baru
                    </h2>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Apa yang bisa kami bantu hari ini?"
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:border-[#002587] outline-none transition-all min-h-36 resize-none"
                      />
                      {/* Priority selector */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          Prioritas:
                        </span>
                        {(
                          [
                            "low",
                            "normal",
                            "high",
                            "urgent",
                          ] as TicketPriority[]
                        ).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded border transition-all ${
                              priority === p
                                ? "bg-[#002587] text-white border-[#002587]"
                                : "bg-white text-gray-500 border-gray-200 hover:border-[#002587] hover:text-[#002587]"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !newQuestion.trim()}
                        className="w-full sm:w-auto px-8 py-4 bg-[#002587] text-white rounded-lg font-bold hover:bg-[#001d6b] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                        Kirim Pertanyaan
                      </button>
                    </form>
                  </div>

                  {/* Knowledge Base Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Panduan Alumni",
                        desc: "Cara verifikasi data alumni dan akses fitur komunitas.",
                      },
                      {
                        title: "Akses Forum",
                        desc: "Etos kerja dan aturan dalam berdiskusi di forum Satu Teladan.",
                      },
                    ].map((kb, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-100 rounded-lg p-6 hover:border-[#002587] transition-all cursor-pointer group shadow-sm"
                      >
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#002587]">
                          {kb.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{kb.desc}</p>
                        <span className="text-[10px] font-bold text-[#002587] flex items-center gap-2 uppercase tracking-widest">
                          Baca Selengkapnya
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Active Tickets */}
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                    <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Ticket size={18} className="text-[#002587]" />
                      Tiket Aktif Anda
                    </h2>

                    {tickets.length > 0 ? (
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            userId={user.id}
                            onReplyAdded={handleReplyAdded}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <LifeBuoy className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs text-gray-400">
                          Belum ada tiket bantuan aktif
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#002587] rounded-lg p-6 text-white shadow-lg shadow-[#002587]/20">
                    <h3 className="font-bold mb-2">Butuh Bantuan Cepat?</h3>
                    <p className="text-xs text-white/70 mb-6">
                      Hubungi admin kami melalui WhatsApp untuk respon yang
                      lebih instan.
                    </p>
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#002587] rounded-lg text-xs font-bold hover:bg-gray-50 transition-all"
                    >
                      Hubungi Admin
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="forum"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-12"
            >
              {/* Forum Hero */}
              <section className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#002587] mb-6 tracking-tight">
                  Forum Alumni & Siswa
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
                  Berdiskusi, berbagi pengalaman, dan membangun jaringan antar
                  alumni Satu Teladan.
                </p>
              </section>

              {/* Forum Content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Categories */}
                <div className="lg:col-span-1 border-r border-gray-100 pr-8">
                  <div className="mt-12 p-6 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertCircle size={20} className="text-amber-600 mb-4" />
                    <h3 className="text-xs font-bold text-amber-900 mb-2 uppercase tracking-wide">
                      Aturan Forum
                    </h3>
                    <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                      Jaga kesopanan, hindari SARA dan politik praktis dalam
                      setiap diskusi.
                    </p>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      Postingan Terbaru
                    </h2>
                    <button className="px-6 py-3 bg-[#002587] text-white rounded-lg text-sm font-bold hover:bg-[#001d6b] transition-all flex items-center gap-2 shadow-lg shadow-[#002587]/10">
                      <Plus size={18} /> Buat Diskusi
                    </button>
                  </div>

                  {forumLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
                      <Loader2 className="animate-spin mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Memuat Diskusi...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {forumPosts.length > 0 ? (
                        forumPosts.map((post) => (
                          <div
                            key={post.id}
                            className="group bg-white border border-gray-100 rounded-lg p-6 hover:border-[#002587] transition-all cursor-pointer shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                                {post.author_alumni?.avatar ? (
                                  <Image
                                    src={post.author_alumni.avatar}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserIcon size={20} />
                                )}
                              </div>
                              <div className="grow">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-[#002587]">
                                    {post.author_alumni?.name ||
                                      post.author_name ||
                                      "Alumni One"}
                                  </span>
                                  {post.author_alumni?.batch && (
                                    <>
                                      <span className="text-[10px] text-gray-300">
                                        •
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        Angkatan {post.author_alumni.batch}
                                      </span>
                                    </>
                                  )}
                                  <span className="text-[10px] text-gray-300">
                                    •
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    {new Date(
                                      post.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#002587] transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-medium">
                                  {post.content}
                                </p>
                                <div className="flex items-center gap-6">
                                  <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <MessageSquare size={12} />
                                    {post.replies_count || 0} Balasan
                                  </span>
                                  <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Clock size={12} />
                                    5m lalu
                                  </span>
                                </div>
                              </div>
                              <button className="text-gray-300 hover:text-gray-900 transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                          <h3 className="font-bold text-gray-900 mb-1">
                            Belum Ada Diskusi
                          </h3>
                          <p className="text-xs text-gray-400">
                            Jadilah yang pertama untuk memulai percakapan.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-8 flex justify-center">
                    <button className="px-10 py-4 border border-gray-100 text-[#002587] rounded-lg text-xs font-bold hover:bg-gray-50 transition-all uppercase tracking-widest">
                      Lihat Diskusi Lainnya
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
