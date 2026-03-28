"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: any;
  profile?: any;
  onSignOut?: () => void;
  isPortal?: boolean;
}

export default function Navbar({
  user,
  profile,
  onSignOut,
  isPortal = false,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-[100] shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col group">
            <span className="text-xl font-bold tracking-tight text-gray-900 leading-none font-title transition-colors group-hover:text-[#002587]">
              Satu Teladan
            </span>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
              {isPortal ? "Pusat Bantuan" : "Portal Anggota"}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 group cursor-default">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={14} className="text-gray-400" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[11px] font-bold text-gray-900 tracking-tight">
                    {profile?.name}
                  </span>
                  <span className="text-[9px] font-medium text-gray-400">
                    {profile?.batch ? `Angkatan ${profile.batch}` : "Anggota"}
                  </span>
                </div>
              </div>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="w-10 h-10 flex items-center justify-center bg-[#002587] text-white rounded-xl hover:bg-[#001d6b] transition-all shadow-md shadow-blue-900/10"
                  title="Keluar"
                >
                  <LogOut size={16} />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/auth/login"
                className="px-6 py-2.5 bg-[#002587] text-white rounded-xl text-xs font-bold hover:bg-[#001d6b] transition-all shadow-lg shadow-blue-900/10"
              >
                Masuk
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
