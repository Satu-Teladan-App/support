"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { submitDeletionRequest } from "@/lib/api/account-deletion";
export default function HapusAkunPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Sync user email when loaded
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  const isFormValid =
    email.includes("@") &&
    confirmText.toUpperCase() === "HAPUS AKUN" &&
    reason.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Mohon lengkapi semua field dengan benar");
      return;
    }

    setIsLoading(true);

    try {
      await submitDeletionRequest({
        email,
        reason: reason.trim(),
      });

      // On success
      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col">
      <main className="flex-grow pt-8 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-white border border-gray-100 rounded-lg p-12 shadow-xl shadow-[#002587]/5"
              >
                <div className="w-20 h-20 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#002587] mb-4">
                  Permintaan Diterima
                </h1>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                  Permintaan penghapusan akun anda telah kami terima. Tim kami akan
                  memproses permintaan ini dalam waktu 3-5 hari kerja. Anda akan
                  menerima konfirmasi melalui email {email}.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[#002587] text-white font-bold rounded-lg hover:bg-[#001d6b] transition-all shadow-xl shadow-[#002587]/20"
                >
                  <ArrowLeft size={18} />
                  Kembali ke Beranda
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Warning Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 rounded-lg p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-red-100/50 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-red-900 mb-2">
                        Perhatian!
                      </h2>
                      <p className="text-red-700 leading-relaxed font-medium text-sm">
                        Penghapusan akun bersifat permanen dan tidak dapat dibatalkan.
                        Semua data anda termasuk riwayat aktivitas, preferensi, dan
                        informasi profil akan dihapus secara permanen dari sistem kami.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Main Form */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white border border-gray-100 rounded-lg p-10 shadow-xl shadow-[#002587]/5"
                >
                  {!user && !isAuthLoading ? (
                    <div className="text-center py-10">
                      <Loader2 className="w-12 h-12 text-[#002587] animate-spin mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-[#002587] mb-4">Login Diperlukan</h3>
                      <p className="text-gray-500 mb-8 font-medium">Anda harus masuk ke akun Satu Teladan terlebih dahulu.</p>
                      <Link 
                        href="/auth/login?redirect=/hapusakun"
                        className="inline-flex px-10 py-4 bg-[#002587] text-white rounded-lg font-bold hover:bg-[#001d6b] transition-all shadow-lg"
                      >
                        Login Sekarang
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <Trash2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#002587] mb-2 tracking-tight">Hapus Akun</h1>
                        <p className="text-gray-400 font-medium">Silakan lengkapi formulir di bawah ini</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest mb-4">Email Akun</label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 font-bold text-sm outline-none cursor-not-allowed"
                          />
                          <p className="text-[10px] font-medium text-gray-300 mt-3 italic tracking-wide">
                            Email dari akun yang sedang aktif digunakan.
                          </p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest mb-4">Alasan Penghapusan *</label>
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Jelaskan alasan anda (minimal 10 karakter)"
                            rows={4}
                            className="w-full px-5 py-4 bg-white border border-gray-100 focus:border-[#002587] rounded-lg text-gray-900 font-bold text-sm outline-none transition-all resize-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest mb-4">Konfirmasi Penghapusan</label>
                          <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Ketik 'HAPUS AKUN' untuk konfirmasi"
                            className="w-full px-5 py-4 bg-white border border-gray-100 focus:border-[#002587] rounded-lg text-gray-900 font-bold text-sm outline-none transition-all"
                            required
                          />
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-red-500 text-[10px] font-bold tracking-widest leading-relaxed">{error}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!isFormValid || isLoading}
                          className="w-full py-5 bg-red-600 text-white rounded-lg font-bold text-sm tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-500/10 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 size={18} />
                              Hapus Akun Saya
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
