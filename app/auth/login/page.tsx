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

  const handleGoogleLogin = async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) {
        setError("Gagal login dengan Google: " + error.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login dengan Google");
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
            Login Berhasil!
          </h1>
          <p className="text-gray-400 font-bold text-[10px] tracking-widest mb-10">
            Mengalihkan ke halaman tujuan...
          </p>
          <Loader2 className="w-6 h-6 text-[#002587] animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-lg p-10 shadow-xl shadow-[#002587]/5"
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#002587] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#002587]/20">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#002587] mb-2 tracking-tight">Login Auth</h1>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest leading-loose">Akses Akun Satu Teladan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4">Email Address</label>
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

              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4">Password</label>
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
                <div className="flex justify-between items-center mt-3">
                  <p className="text-[9px] font-bold text-gray-300 tracking-widest">Minimal 6 karakter</p>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[9px] font-bold text-[#002587] tracking-widest hover:text-[#001d6b] transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-500 text-[10px] font-bold tracking-widest line-clamp-2 uppercase leading-relaxed">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full py-5 bg-[#002587] text-white rounded-lg font-bold text-[11px] tracking-[0.3em] hover:bg-[#001d6b] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-[#002587]/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Login Sekarang"
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-50"></div>
                </div>
                <div className="relative flex justify-center text-[9px] font-bold tracking-[0.3em] text-gray-300">
                  <span className="px-6 bg-white">Atau masuk dengan</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-4 border border-gray-100 text-gray-500 rounded-lg font-bold text-[10px] tracking-[0.3em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google Account
              </button>

              <div className="text-center mt-10">
                <p className="text-[10px] font-bold text-gray-400 tracking-widest leading-loose">
                  Belum punya akun?{" "}
                  <Link
                    href="/auth/register"
                    className="text-[#002587] border-b border-[#002587] pb-0.5 ml-2 hover:text-[#001d6b] transition-all"
                  >
                    Daftar Sekarang
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          <footer className="text-center mt-16">
            <p className="text-gray-300 text-[9px] font-bold tracking-[0.3em] leading-relaxed">
              Butuh bantuan? Hubungi{" "}
              <a
                href="mailto:katymentor@gmail.com"
                className="text-[#002587] border-b border-[#002587] hover:text-[#001d6b] transition-all"
              >
                Our Support Team
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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
