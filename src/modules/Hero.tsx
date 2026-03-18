"use client"

import { Menu, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const slides = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SMA_Negeri_1_Yogyakarta%2C_2024.jpg/1280px-SMA_Negeri_1_Yogyakarta%2C_2024.jpg",
      alt: "APLIKASI SATU TELADAN",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SMA_Negeri_1_Yogyakarta%2C_2024.jpg/1280px-SMA_Negeri_1_Yogyakarta%2C_2024.jpg",
      alt: "KOMUNITAS ALUMNI TELADAN",
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SMA_Negeri_1_Yogyakarta%2C_2024.jpg/1280px-SMA_Negeri_1_Yogyakarta%2C_2024.jpg",
      alt: "JARINGAN TELADAN",
    },
  ]

  const navItems = [
    { name: "BERANDA", href: "#hero", isExternal: false },
    { name: "TENTANG", href: "#tentang", isExternal: false },
    { name: "FITUR", href: "#fitur", isExternal: false },
    { name: "TESTIMONI", href: "#testimoni", isExternal: false },
    { name: "DOWNLOAD", href: "#download", isExternal: false },
    { name: "HAPUS AKUN", href: "/hapusakun", isExternal: true },
  ]

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div id="hero" className="relative h-screen w-full overflow-hidden bg-black font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${slides[currentSlide].image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <nav className="relative z-20 flex items-center justify-between p-8 max-w-7xl mx-auto">
        <div className="flex flex-col">
          <span className="text-white font-bold text-xl tracking-tighter leading-none animate-fade-in">Satu Teladan</span>
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] mt-1">Lembaga Alumni</span>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            item.isExternal ? (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 transition-colors duration-300 text-[10px] font-bold tracking-[0.15em]"
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-gray-300 transition-colors duration-300 text-[10px] font-bold tracking-[0.15em] cursor-pointer"
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
              </button>
            )
          ))}
        </div>

        <button
          className="md:hidden text-white hover:text-gray-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="absolute inset-0 bg-black/95 z-30 md:hidden flex items-center justify-center">
          <div className="flex flex-col items-center space-y-10">
            {navItems.map((item) => (
              item.isExternal ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white text-xl font-bold tracking-[0.2em] hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white text-xl font-bold tracking-[0.2em] hover:text-gray-300 transition-colors"
                >
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
                </button>
              )
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center text-white max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none animate-shimmer">
            Satu Teladan App
          </h1>

          <p className="text-lg md:text-xl font-medium tracking-[0.1em] mb-12 text-gray-300 max-w-2xl mx-auto opacity-90">
            Membangun Jaringan Keluarga Besar SMA Negeri 1 Yogyakarta yang Lebih Kuat dan Bermakna
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://apps.apple.com/app/satu-teladan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-10 py-5 bg-[#002587] text-white rounded-lg hover:bg-[#001d6b] transition-all group shadow-xl shadow-[#002587]/20 border border-white/10"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] font-bold tracking-widest opacity-70">Get it on</div>
                <div className="text-lg font-bold tracking-tighter leading-none">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.satuteladan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-10 py-5 bg-white text-[#002587] rounded-lg hover:bg-gray-50 transition-all group shadow-xl border border-gray-100"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] font-bold tracking-widest opacity-70">Get it on</div>
                <div className="text-lg font-bold tracking-tighter leading-none">Play Store</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-6">
          <button
            onClick={prevSlide}
            className="text-white hover:text-gray-400 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-12 h-1 transition-all duration-300 ${
                  currentSlide === index ? "bg-white" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="text-white hover:text-gray-400 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  )
}
