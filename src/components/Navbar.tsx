"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: any;
  profile?: any;
  onSignOut?: () => void;
  isPortal?: boolean;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Navbar({
  user,
  profile,
  onSignOut,
  isPortal = false,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";


  const navItems = [
    { name: "Beranda", href: "#hero", isExternal: false },
    { name: "Tentang", href: "#tentang", isExternal: false },
    { name: "Fitur", href: "#fitur", isExternal: false },
    { name: "Testimoni", href: "#testimoni", isExternal: false },
    { name: "Kontak", href: "#footer", isExternal: false },
    { name: "Pengaduan", href: "/tickets", isExternal: true },
    { name: "Hapus Akun", href: "/hapusakun", isExternal: true },
  ];

  const scrollToSection = (href: string) => {
    if (!isLandingPage) {
      window.location.href = `/${href}`;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className="fixed top-0 w-full z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4"
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex flex-col group gap-0.5">
            <span className="text-2xl font-bold tracking-tight leading-none font-title transition-colors text-gray-900 group-hover:text-blue-600">
              Satu Teladan
            </span>
            <span className="text-base font-semibold text-gray-400">
              {isPortal ? "Pusat bantuan" : "Lembaga alumni"}
            </span>
          </Link>

          {/* Desktop Links (always visible for consistency) */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              item.isExternal ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-bold transition-colors text-gray-500 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-base font-bold transition-colors cursor-pointer text-gray-500 hover:text-blue-600"
                >
                  {item.name}
                </button>
              )
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="hidden sm:flex items-center gap-4">
               <div className="flex items-center gap-4 px-4 py-2 bg-gray-50/50 backdrop-blur rounded-2xl border border-gray-100 group cursor-default">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight text-gray-900">
                      {profile?.name}
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                       {profile?.batch ? `Angkatan ${profile.batch}` : "Anggota"}
                    </span>
                  </div>
                </div>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
                    title="Keluar"
                  >
                    <LogOut size={20} />
                  </button>
                )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center">
              <Link
                href="/auth/login"
                className="px-8 py-3.5 rounded-2xl text-base font-bold transition-all shadow-lg bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10"
              >
                Masuk
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-3 transition-colors text-gray-900 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-6 py-10 flex flex-col gap-8">
              {navItems.map((item) => (
                item.isExternal ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-bold text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-lg font-bold text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </button>
                )
              ))}
              {!user && (
                <Link
                  href="/auth/login"
                  className="mt-4 px-8 py-5 bg-blue-600 text-white text-center rounded-2xl text-base font-bold shadow-xl shadow-blue-500/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk ke akun
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
