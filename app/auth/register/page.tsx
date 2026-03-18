"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid =
    email.includes("@") && password.length >= 6 && confirmPassword === password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      if (password !== confirmPassword) {
        setError("Password tidak cocok");
      } else {
        setError("Mohon isi semua field dengan benar");
      }
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Email sudah terdaftar. Silakan login.");
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setIsSuccess(true);
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center border border-gray-100 p-12 bg-white rounded-lg shadow-2xl shadow-[#002587]/5"
        >
          <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#002587] mb-4 tracking-tight">
            Registrasi Berhasil!
          </h1>
          <p className="text-sm text-gray-400 font-bold tracking-widest leading-loose mb-10 opacity-70">
            Kami telah mengirimkan email verifikasi ke <strong className="text-[#002587]">{email}</strong>.
            Silakan cek inbox anda untuk mengaktifkan akun.
          </p>
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full py-5 bg-[#002587] text-white font-bold rounded-lg hover:bg-[#001d6b] transition-all tracking-[0.2em] text-[11px] shadow-xl shadow-[#002587]/20"
            >
              Kembali ke Login
            </Link>
            <Link
              href="/"
              className="block text-[10px] text-gray-400 hover:text-[#002587] font-bold tracking-widest transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-50 px-8 py-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tighter text-[#002587]"
          >
            Satu Teladan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#002587] transition-all text-[10px] font-bold tracking-widest"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-lg p-10 shadow-xl shadow-[#002587]/5"
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#002587] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#002587]/20">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#002587] mb-2 tracking-tight">Akun Baru</h1>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest leading-loose">Buat Akun Satu Teladan Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-8 pr-4 py-4 bg-white border-b border-gray-100 focus:border-[#002587] transition-all outline-none text-gray-900 font-bold text-xs tracking-wider placeholder:text-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-12 py-4 bg-white border-b border-gray-100 focus:border-[#002587] transition-all outline-none text-gray-900 font-bold text-xs tracking-wider placeholder:text-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#002587] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4"
                >
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-12 py-4 bg-white border-b border-gray-100 focus:border-[#002587] transition-all outline-none text-gray-900 font-bold text-xs tracking-wider placeholder:text-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#002587] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[9px] font-bold text-red-500 tracking-widest mt-3">
                    Password tidak cocok
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-500 text-[10px] font-bold tracking-widest line-clamp-2 uppercase leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full py-5 bg-[#002587] text-white rounded-lg font-bold text-[11px] tracking-[0.3em] hover:bg-[#001d6b] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-[#002587]/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Daftar Sekarang"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-10">
                <p className="text-[10px] font-bold text-gray-400 tracking-widest leading-loose">
                  Sudah punya akun?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#002587] border-b border-[#002587] pb-0.5 ml-2 hover:text-[#001d6b] transition-all"
                  >
                    Masuk Sekarang
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Help Text */}
          <footer className="text-center mt-12">
            <p className="text-gray-300 text-[9px] font-bold tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
              Dengan mendaftar, anda menyetujui{" "}
              <Link href="/terms" className="text-[#002587] hover:text-[#001d6b] transition-all">
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-[#002587] hover:text-[#001d6b] transition-all">
                Kebijakan Privasi
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
