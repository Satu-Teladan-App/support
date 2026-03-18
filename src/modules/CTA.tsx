"use client"

import { LiquidButton } from "@/components/LiquidGlass"
import { motion } from "framer-motion"
import { MapPin, Users, Calendar, Trophy } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative py-40 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto"
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-[#002587] leading-none animate-fade-in">
            Satu Teladan
          </h2>

          <p className="text-sm md:text-base text-gray-400 mb-16 max-w-2xl mx-auto tracking-[0.2em] font-bold leading-relaxed opacity-70">
            Membangun Jaringan Keluarga Besar SMA Negeri 1 Yogyakarta yang Lebih Kuat dan Bermakna.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
            <a
              href="https://apps.apple.com/app/satu-teladan"
              target="_blank"
              rel="noopener noreferrer"
              className="px-14 py-6 bg-[#002587] text-white rounded-lg font-bold text-[11px] tracking-[0.2em] hover:bg-[#001d6b] transition-all shadow-xl shadow-[#002587]/20 border border-transparent"
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.satuteladan"
              target="_blank"
              rel="noopener noreferrer"
              className="px-14 py-6 bg-white text-[#002587] rounded-lg font-bold text-[11px] tracking-[0.2em] hover:bg-gray-50 transition-all border border-[#002587]/20 shadow-lg"
            >
              Play Store
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 pt-24 border-t border-gray-50">
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-[#002587] mb-3 tracking-tighter relative inline-block">50K+</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1 opacity-60">Total Alumni</div>
            </div>
            <div className="text-center px-4 border-l border-gray-50">
              <div className="text-4xl md:text-5xl font-bold text-[#002587] mb-3 tracking-tighter relative inline-block">120+</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1 opacity-60">Komunitas</div>
            </div>
            <div className="text-center px-4 border-l border-gray-50">
              <div className="text-4xl md:text-5xl font-bold text-[#002587] mb-3 tracking-tighter relative inline-block">365</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1 opacity-60">Akses Penuh</div>
            </div>
            <div className="text-center px-4 border-l border-gray-50">
              <div className="text-4xl md:text-5xl font-bold text-[#002587] mb-3 tracking-tighter relative inline-block">10K+</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1 opacity-60">Support Ticket</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
