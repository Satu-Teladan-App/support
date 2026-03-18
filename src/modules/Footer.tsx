"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-50 overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#002587] mb-6 animate-fade-in">
              Satu Teladan
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-10 max-w-sm tracking-widest font-bold opacity-70">
              Aplikasi resmi keluarga besar SMA Negeri 1 Yogyakarta.
              Menghubungkan alumni, siswa, guru, dan orang tua dalam satu
              platform untuk membangun jaringan yang kuat dan bermakna.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="https://apps.apple.com/app/satu-teladan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#002587] text-white rounded-lg hover:bg-[#001d6b] transition-all text-[10px] font-bold tracking-[0.3em] shadow-lg shadow-[#002587]/20"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.satuteladan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#002587] border border-[#002587]/20 rounded-lg hover:bg-gray-50 transition-all text-[10px] font-bold tracking-[0.3em] shadow-md"
              >
                Play Store
              </a>
            </div>

            <div className="flex space-x-5">
              <a
                href="https://www.instagram.com/satuteladan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white border border-gray-100 hover:border-[#002587] text-gray-400 hover:text-[#002587] rounded-lg flex items-center justify-center transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/satuteladan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white border border-gray-100 hover:border-[#002587] text-gray-400 hover:text-[#002587] rounded-lg flex items-center justify-center transition-all shadow-sm"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[10px] font-bold text-gray-300 mb-10 tracking-[0.5em]">
              Tautan
            </h4>
            <ul className="space-y-5">
              <li>
                <a
                  href="#hero"
                  className="text-[10px] text-gray-400 hover:text-[#002587] transition-all font-bold tracking-[0.2em]"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#tentang"
                  className="text-[10px] text-gray-400 hover:text-[#002587] transition-all font-bold tracking-[0.2em]"
                >
                  Tentang Aplikasi
                </a>
              </li>
              <li>
                <a
                  href="#fitur"
                  className="text-[10px] text-gray-400 hover:text-[#002587] transition-all font-bold tracking-[0.2em]"
                >
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a
                  href="#testimoni"
                  className="text-[10px] text-gray-400 hover:text-[#002587] transition-all font-bold tracking-[0.2em]"
                >
                  Testimoni Alumni
                </a>
              </li>
              <li>
                <Link
                  href="/hapusakun"
                  className="text-[10px] text-red-400 hover:text-red-500 transition-all font-bold tracking-[0.2em]"
                >
                  Hapus Akun
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[10px] font-bold text-gray-300 mb-10 tracking-[0.5em]">
              Kontak
            </h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin
                  size={16}
                  className="text-[#002587] mt-0.5 flex-shrink-0"
                />
                <span className="text-[10px] text-gray-400 font-bold tracking-widest leading-loose">
                  Yogyakarta, Indonesia
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail size={16} className="text-[#002587] flex-shrink-0" />
                <a
                  href="mailto:katymentor@gmail.com"
                  className="text-[10px] text-gray-400 hover:text-[#002587] transition-all font-bold tracking-widest"
                >
                  katymentor@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-50 pt-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
        >
          <p className="text-[10px] font-bold text-gray-300 tracking-widest">
            © 2026 Satu Teladan. Hak Cipta Dilindungi.
          </p>

          <div className="flex space-x-8">
            <a
              href="#"
              className="text-[10px] font-bold text-gray-300 hover:text-[#002587] transition-all tracking-widest"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="text-[10px] font-bold text-gray-300 hover:text-[#002587] transition-all tracking-widest"
            >
              Syarat & Ketentuan
            </a>
          </div>
        </motion.div>

      </div>
    </footer>

  );
}
