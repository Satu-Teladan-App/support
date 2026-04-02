"use client"

import { motion } from "framer-motion"

export default function CTASection() {
  return (
    <section id="download" className="relative py-40 border-t border-gray-100 bg-[#002587] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto"
        >
          <div className="text-base font-bold text-blue-200 tracking-wide mb-8">Siap bergabung?</div>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tight mb-10 text-white leading-none">
            Satu Teladan
          </h2>

          <p className="text-xl md:text-2xl text-blue-100 mb-20 max-w-2xl mx-auto font-medium leading-relaxed">
            Mulailah perjalanan Anda kembali bersama keluarga besar alumni SMA Negeri 1 Yogyakarta hari ini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a
              href="https://apps.apple.com/app/satu-teladan"
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 py-6 bg-white text-blue-700 rounded-3xl font-bold text-base hover:bg-gray-100 transition-all shadow-2xl shadow-black/30"
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.satuteladan"
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 py-6 bg-transparent text-white border border-white/30 rounded-3xl font-bold text-base hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Play Store
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-40 pt-24 border-t border-white/20 font-sans">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tighter">50K+</div>
              <div className="text-base font-bold text-blue-200 tracking-wide leading-loose">Alumni aktif</div>
            </div>
            <div className="text-center md:border-l md:border-white/20">
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tighter">120+</div>
              <div className="text-base font-bold text-blue-200 tracking-wide leading-loose">Komunitas lokal</div>
            </div>
            <div className="text-center md:border-l md:border-white/20">
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tighter">100%</div>
              <div className="text-base font-bold text-blue-200 tracking-wide leading-loose">Keamanan data</div>
            </div>
            <div className="text-center md:border-l md:border-white/20">
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tighter">10K+</div>
              <div className="text-base font-bold text-blue-200 tracking-wide leading-loose">Bantuan hukum</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
