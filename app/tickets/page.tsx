"use client";

import { useEffect } from "react";
import SupportPortal from "@/modules/Support/Portal";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { AnimatePresence, motion } from "framer-motion";

export default function TicketsPage() {
  const { user, isLoading, setActiveTab, setIsPortal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setActiveTab("support");
    setIsPortal(true);
  }, [setActiveTab, setIsPortal]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#002587] opacity-20" size={32} strokeWidth={1.5} />
          <p className="text-[10px] font-bold text-gray-300">VERIFIKASI AUTENTIKASI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
         key="portal"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
      >
        <SupportPortal user={user} />
      </motion.div>
    </AnimatePresence>
  );
}
