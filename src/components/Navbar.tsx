"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: any;
  profile?: any;
  activeTab?: "support" | "forum";
  setActiveTab?: (tab: "support" | "forum") => void;
  onSignOut?: () => void;
  isPortal?: boolean;
}

export default function Navbar({
  user,
  profile,
  activeTab,
  setActiveTab,
  onSignOut,
  isPortal = false,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-[#002587] leading-none">
              Satu Teladan
            </span>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1 text-center">
              {isPortal ? "Support Portal" : "Official App"}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
            <Link
              href="/"
              className={cn(
                "px-8 py-3 text-[10px] font-bold tracking-widest transition-all",
                activeTab === "support"
                  ? "bg-[#002587] text-white"
                  : "text-gray-400 hover:text-[#002587]",
              )}
            >
              Support Hub
            </Link>
            <Link
              href="/diskusi"
              className={cn(
                "px-8 py-3 text-[10px] font-bold tracking-widest transition-all border-l border-gray-100",
                activeTab === "forum"
                  ? "bg-[#002587] text-white"
                  : "text-gray-400 hover:text-[#002587]",
              )}
            >
              Forum Diskusi
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 group cursor-default">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-white shadow-sm transition-transform group-hover:scale-105">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={18} className="text-gray-500" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[10px] font-bold text-[#002587] truncate max-w-[120px] tracking-tight">
                    {profile?.name}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest">
                    {profile?.batch ? `Angkatan ${profile.batch}` : "User"}
                  </span>
                </div>
              </div>

              <Link
                href="/hapusakun"
                className="px-4 gap-2 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-md shadow-red-500/10"
                title="Hapus Akun"
              >
                <Trash2 size={20} />
                <p className=" text-[10px] font-bold whitespace-nowrap">
                  Hapus Akun
                </p>
              </Link>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="w-12 h-12 flex items-center justify-center bg-[#002587] text-white rounded-lg hover:bg-[#001d6b] transition-all shadow-md shadow-[#002587]/10"
                  title="Keluar"
                >
                  <LogOut size={20} />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/hapusakun"
                className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-red-500 transition-colors"
              >
                Hapus Akun
              </Link>
              <Link
                href="/auth/login"
                className="px-10 py-4 bg-[#002587] text-white rounded-lg text-[10px] font-bold tracking-widest hover:bg-[#001d6b] transition-all shadow-lg shadow-[#002587]/20"
              >
                Masuk ke Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
