"use client";

import { useEffect, useState, Suspense } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import SupportPortal from "@/modules/Support/Portal";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Mail, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Reuse login logic for the "Locked" state of the landing page
function LoginForm({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else if (data.user) {
      setIsSuccess(true);
      setTimeout(() => onLoginSuccess(data.user), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gray-900 rounded-none flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Lock className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight uppercase">MASUK PORTAL</h1>
          <p className="text-gray-400 font-medium text-sm border-t border-gray-100 pt-3 inline-block uppercase tracking-widest">Satu Teladan Support & Forum</p>
          <div className="mt-6 block px-4 py-2 bg-amber-50 border border-amber-100 rounded-none text-[9px] font-bold text-amber-700 uppercase tracking-[0.2em]">
            GUNAKAN AKUN APLIKASI SATU TELADAN
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-10 rounded-none shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">EMAIL SEKOLAH / PRIBADI</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-white border-b border-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium uppercase text-xs tracking-wider placeholder:text-gray-200"
                  placeholder="ANDA@EMAIL.COM"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-12 py-4 bg-white border-b border-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium text-xs tracking-wider placeholder:text-gray-200"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-gray-900 text-white rounded-none font-bold text-[11px] tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 uppercase cursor-pointer"
            >
              {isLoading ? <Loader2 className="animate-spin size-4" /> : "MASUK SEKARANG"}
              <ArrowRight size={16} />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300"><span className="bg-white px-6">Atau</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-4 border border-gray-100 text-gray-900 rounded-none font-bold text-[10px] tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 uppercase cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              GOOGLE LOGIN
            </button>
          </form>
        </div>

        <p className="text-center mt-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
          Belum punya akun? <Link href="/auth/register" className="text-gray-900 border-b border-gray-900 pb-0.5 ml-2 hover:text-gray-400 transition-colors">Daftar Akun Baru</Link>
        </p>
      </motion.div>
    </div>
  );
}

import { useAuth } from "@/providers/auth-provider";

export default function RootPage() {
  const { user, isLoading, setActiveTab } = useAuth();

  useEffect(() => {
    setActiveTab("support");
  }, [setActiveTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-900" size={32} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {user ? (
        <motion.div
           key="portal"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
        >
          <SupportPortal user={user} />
        </motion.div>
      ) : (
        <motion.div
           key="login"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
        >
          <LoginForm onLoginSuccess={() => {}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
