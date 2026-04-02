"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { submitDeletionRequest } from "@/lib/api/account-deletion";

export default function HapusAkunPage() {
  const { user, isLoading, setIsPortal, setActiveTab } = useAuth();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    setIsPortal(true);
    setActiveTab("account"); // Optional: set a different tab or keep it consistent
  }, [setIsPortal, setActiveTab]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login?redirect=/hapusakun");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#002587] opacity-20" size={32} strokeWidth={1.5} />
          <p className="text-[10px] font-bold text-gray-300">MEMUAT...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Mohon berikan alasan penghapusan akun.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitDeletionRequest({
        email: user.email || "",
        reason: reason,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim permintaan penghapusan akun.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm shadow-green-100">
             <ShieldCheck size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Permintaan Terkirim</h1>
            <p className="text-gray-500 leading-relaxed text-sm">
              Permintaan penghapusan akun Anda sedang diproses oleh tim admin Satu Teladan. 
              Mohon tunggu konfirmasi lebih lanjut melalui email.
            </p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-bold text-[#002587] uppercase tracking-[0.2em] border-b border-[#002587]/20 pb-1 hover:border-[#002587] transition-all"
          >
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans py-20 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#002587] transition-all uppercase tracking-widest group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Batal & Kembali
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden"
        >
          <div className="p-8 md:p-12 space-y-10">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm shadow-red-100 mb-8">
                <AlertTriangle size={32} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Penghapusan Akun</h1>
              <p className="text-gray-500 leading-relaxed text-sm">
                Kami sedih melihat Anda pergi. Harap perhatikan bahwa penghapusan akun akan menghilangkan seluruh data profil, 
                riwayat tiket, dan akses Anda ke aplikasi Satu Teladan secara permanen.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Alasan Penghapusan
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Mengapa Anda ingin menghapus akun Anda?"
                  className="w-full min-h-[160px] p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002587]/5 focus:border-[#002587]/20 transition-all resize-none font-medium placeholder:text-gray-300"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-medium animate-shake">
                  {error}
                </div>
              )}

              <div className="pt-2">
                {!confirmStep ? (
                  <button
                    type="button"
                    onClick={() => setConfirmStep(true)}
                    className="w-full py-5 bg-red-500 text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3"
                  >
                    MINTA PENGHAPUSAN AKUN
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest">
                      Konfirmasi: Apakah Anda benar-benar yakin?
                    </p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setConfirmStep(false)}
                        className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-2xl font-bold text-[11px] tracking-[0.2em] hover:bg-gray-200 transition-all"
                      >
                        TIDAK, BATAL
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "YA, HAPUS AKUN"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em]">
              Akun aktif: {user.email}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
