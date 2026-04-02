"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/images/hero1.jpg",
      title: "Satu teladan",
      subtitle: "Platform resmi keluarga besar SMA Negeri 1 Yogyakarta",
      desc: "Menghubungkan alumni lintas angkatan dalam satu ekosistem digital yang kuat, bermakna, dan saling memberdayakan.",
    },
    {
      image: "/images/hero2.jpg",
      title: "Jaringan alumni",
      subtitle: "Temukan teman seangkatan Anda",
      desc: "Akses direktori alumni terlengkap untuk memperluas jaringan profesional dan menjaga silaturahmi tetap terjaga.",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section id="hero" className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent" />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-4xl">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-blue-600/20 border border-blue-400/30 backdrop-blur-xl">
                <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                <span className="text-base font-bold text-white tracking-wide">Aplikasi resmi SMA 1 Yogyakarta</span>
            </div>
            
            <div className="space-y-8">
              <h1 className="text-6xl md:text-9xl font-bold text-white tracking-tight leading-[1.05]">
                {slides[currentSlide].title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-medium text-blue-100/90 tracking-wide">
                {slides[currentSlide].subtitle}
              </h2>
            </div>
            
            <p className="text-blue-100/70 text-lg md:text-2xl leading-relaxed max-w-2xl font-medium">
              {slides[currentSlide].desc}
            </p>

            <div className="flex flex-col gap-8 pt-8">
              <div className="flex flex-wrap gap-8">
                <a
                  href="https://apps.apple.com/app/satu-teladan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-12 py-6 bg-white text-blue-700 rounded-[28px] hover:bg-gray-100 transition-all font-bold text-base shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                >
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.satuteladan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-12 py-6 bg-transparent text-white border border-white/30 rounded-[28px] hover:bg-white/10 transition-all font-bold text-base backdrop-blur-md hover:-translate-y-1"
                >
                  Play Store
                </a>
              </div>
              
              <a
                href="https://www.termsfeed.com/live/adc486fe-8656-4769-aad9-85e0dbc4e3e5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-base font-medium transition-colors w-fit px-2"
              >
                Privacy policy
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-16 right-16 z-20 hidden lg:flex items-center gap-10">
        <div className="flex gap-3">
           {slides.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentSlide(idx)}
               className={`h-2 transition-all duration-500 rounded-full ${currentSlide === idx ? "w-16 bg-blue-500" : "w-8 bg-white/20 hover:bg-white/40"}`}
               aria-label={`Pindahkan ke slide ${idx + 1}`}
             />
           ))}
        </div>
        <div className="flex gap-4">
          <button onClick={prevSlide} className="w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-md hover:border-white/30" aria-label="Slide sebelumnya">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-md hover:border-white/30" aria-label="Slide berikutnya">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
