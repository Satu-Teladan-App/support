"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-white border-t border-gray-50 overflow-hidden">
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
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-blue-700 mb-8">
              Satu Teladan
            </h3>
            <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-sm font-medium">
              Aplikasi resmi keluarga besar SMA Negeri 1 Yogyakarta.
              Menghubungkan alumni, siswa, guru, dan orang tua dalam satu
              platform untuk membangun jaringan yang kuat dan bermakna.
            </p>

            <div className="flex flex-wrap gap-5 mb-10">
              <a
                href="https://apps.apple.com/app/satu-teladan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-base font-bold shadow-lg shadow-blue-500/10"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.satuteladan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 border border-blue-100 rounded-xl hover:bg-gray-50 transition-all text-base font-bold shadow-sm"
              >
                Play Store
              </a>
            </div>

            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/satuteladan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white border border-gray-100 hover:border-blue-600 text-gray-400 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://www.facebook.com/satuteladan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white border border-gray-100 hover:border-blue-600 text-gray-400 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm"
                aria-label="Facebook"
              >
                <Facebook size={22} />
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
            <h4 className="text-base font-bold text-gray-900 mb-8 tracking-wide">
              Tautan penting
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#hero"
                  className="text-base text-gray-500 hover:text-blue-600 transition-all font-medium"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#tentang"
                  className="text-base text-gray-500 hover:text-blue-600 transition-all font-medium"
                >
                  Tentang aplikasi
                </a>
              </li>
              <li>
                <a
                  href="#fitur"
                  className="text-base text-gray-500 hover:text-blue-600 transition-all font-medium"
                >
                  Fitur unggulan
                </a>
              </li>
              <li>
                <a
                  href="#testimoni"
                  className="text-base text-gray-500 hover:text-blue-600 transition-all font-medium"
                >
                  Testimoni alumni
                </a>
              </li>
              <li>
                <Link
                  href="/hapusakun"
                  className="text-base text-red-500 hover:text-red-600 transition-all font-bold"
                >
                  Hapus akun
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
            <h4 className="text-base font-bold text-gray-900 mb-8 tracking-wide">
              Hubungi kami
            </h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin
                  size={20}
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                />
                <span className="text-base text-gray-500 font-medium leading-relaxed">
                  Yogyakarta, Indonesia
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail size={20} className="text-blue-600 flex-shrink-0" />
                <a
                  href="mailto:katymentor@gmail.com"
                  className="text-base text-gray-500 hover:text-blue-600 transition-all font-medium"
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
          className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
        >
          <p className="text-base font-medium text-gray-400">
            © 2026 Satu Teladan. Hak cipta dilindungi.
          </p>

          <div className="flex space-x-10">
            <Link
              href="/privacy"
              className="text-base font-bold text-gray-400 hover:text-blue-600 transition-all"
            >
              Kebijakan privasi
            </Link>
            <Link
              href="/tos"
              className="text-base font-bold text-gray-400 hover:text-blue-600 transition-all"
            >
              Syarat & ketentuan
            </Link>
          </div>
        </motion.div>

      </div>
    </footer>

  );
}
