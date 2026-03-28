"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = email.includes("@") && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Mohon isi email dan password dengan benar");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email atau password salah");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Email belum diverifikasi. Silakan cek email Anda.");
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
        setIsSuccess(true);
        // Small delay to show success state
        setTimeout(() => {
          router.push(redirectTo);
        }, 500);
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
          <h1 className="text-2xl font-bold text-[#002587] mb-4 tracking-tight font-title">
            Masuk Berhasil!
          </h1>
          <p className="text-gray-400 font-bold text-[10px] mb-10">
            Mengalihkan ke halaman tujuan...
          </p>
          <Loader2 className="w-6 h-6 text-[#002587] animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <nav className="border-b border-gray-50 px-8 py-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tighter text-[#002587] font-title"
          >
            Satu Teladan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#002587] transition-all text-[10px] font-bold"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24 flex-1 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-3xl p-10 shadow-xl shadow-[#002587]/5"
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#002587] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#002587]/20">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#002587] mb-2 font-title tracking-tight">Login Auth</h1>
              <p className="text-xs font-semibold text-gray-400">Masuk dengan Akun di Aplikasi Satu Teladan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-4">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-8 pr-4 py-4 bg-white border-b border-gray-100 focus:border-[#002587] transition-all outline-none text-gray-900 font-bold text-xs placeholder:text-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-4">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-12 py-4 bg-white border-b border-gray-100 focus:border-[#002587] transition-all outline-none text-gray-900 font-bold text-xs placeholder:text-gray-200"
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
                <div className="flex justify-between items-center mt-3">
                  <p className="text-[9px] font-bold text-gray-300">Minimal 6 karakter</p>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[9px] font-bold text-[#002587] hover:text-[#001d6b] transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-500 text-[10px] font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full py-5 bg-[#002587] text-white rounded-2xl font-bold text-xs hover:bg-[#001d6b] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Masuk Sekarang"
                )}
              </button>

              <div className="text-center mt-10">
                <p className="text-[10px] font-bold text-gray-400">
                  Belum memiliki akun?{" "}
                  <Link
                    href="https://satuteladan.com/auth/register"
                    className="text-[#002587] border-b border-[#002587] pb-0.5 ml-2 hover:text-[#001d6b] transition-all"
                  >
                    Daftar di Aplikasi
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          <footer className="text-center mt-16">
            <p className="text-gray-300 text-[9px] font-bold leading-relaxed">
              Butuh bantuan? Hubungi{" "}
              <a
                href="mailto:halo@satuteladan.com"
                className="text-[#002587] border-b border-[#002587] hover:text-[#001d6b] transition-all"
              >
                Tim Dukungan Kami
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#002587]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
