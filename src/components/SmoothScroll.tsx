"use client"

import type * as React from "react"
import { useRef } from "react"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { Smartphone, Users, Bell, Search } from "lucide-react"

interface SmoothScrollHeroProps {
  scrollHeight?: number
  desktopImage: string
  mobileImage: string
  initialClipPercentage?: number
  finalClipPercentage?: number
}

const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  scrollHeight = 1875,
  desktopImage,
  mobileImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Clip path animation - image fully reveals by 70% scroll progress
  const clipStart = useTransform(scrollYProgress, [0, 0.7], [initialClipPercentage, 0])
  const clipEnd = useTransform(scrollYProgress, [0, 0.7], [finalClipPercentage, 100])
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`

  // Background size animation - completes when image is fully revealed
  const backgroundSize = useTransform(scrollYProgress, [0, 0.7], ["170%", "100%"])

  // Scale animation - completes when image is fully revealed
  const scale = useTransform(scrollYProgress, [0, 0.7], [1.2, 1])

  // CTA overlay animations - appears earlier and completes by 50%
  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])

  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}px` }} className="relative w-full">
      <motion.div
        className="sticky top-0 h-screen w-full bg-black overflow-hidden"
        style={{
          clipPath,
          willChange: "transform",
        }}
      >
        {/* Desktop background */}
        <motion.div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${desktopImage})`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale,
          }}
        />
        {/* Mobile background */}
        <motion.div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${mobileImage})`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale,
          }}
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/60" />

        {/* CTA Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{
            opacity: ctaOpacity,
            y: ctaY,
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            {/* Main CTA Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 uppercase leading-none text-white">
              DOWNLOAD
              <br />
              <span className="text-[#002587] drop-shadow-[0_0_10px_rgba(0,37,135,0.3)]">
                SATU TELADAN APP
              </span>
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-12 max-w-2xl mx-auto uppercase tracking-[0.4em] font-bold opacity-80">
              BERGABUNGLAH DENGAN KELUARGA BESAR TELADAN YANG SUDAH TERHUBUNG.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
              <div className="text-center group">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-[#002587]/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-[#002587]/30 transition-all group-hover:bg-[#002587] group-hover:scale-110 shadow-lg shadow-[#002587]/10">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">10K+</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">DOWNLOADS</div>
              </div>

              <div className="text-center group">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-[#002587]/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-[#002587]/30 transition-all group-hover:bg-[#002587] group-hover:scale-110 shadow-lg shadow-[#002587]/10">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">5K+</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">ACTIVE USERS</div>
              </div>

              <div className="text-center group">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-[#002587]/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-[#002587]/30 transition-all group-hover:bg-[#002587] group-hover:scale-110 shadow-lg shadow-[#002587]/10">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">100+</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">EVENTS</div>
              </div>

              <div className="text-center group">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-[#002587]/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-[#002587]/30 transition-all group-hover:bg-[#002587] group-hover:scale-110 shadow-lg shadow-[#002587]/10">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">50+</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">BATCHES</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="https://apps.apple.com/app/satu-teladan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-[#002587] rounded-lg hover:bg-gray-100 transition-all font-bold uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-white/10"
              >
                APP STORE
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.satuteladan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-12 py-6 bg-transparent text-white border-2 border-white/20 rounded-lg hover:bg-white/10 transition-all font-bold uppercase text-[11px] tracking-[0.4em]"
              >
                PLAY STORE
              </a>
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 max-w-xl mx-auto">
              <p className="text-[11px] text-gray-400 mb-6 font-bold tracking-[0.4rem] uppercase opacity-60">OFFICIALLY TRUSTED</p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">SAFE & PRIVATE</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">iOS & ANDROID</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">4.8 RATING</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">100% FREE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SmoothScrollHero
