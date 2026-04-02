"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SQRT_5000 = Math.sqrt(5000)

// Testimonials data for Satu Teladan app users
const testimonials = [
  {
    tempId: 0,
    testimonial:
      "Aplikasi Satu Teladan memudahkan saya terhubung dengan teman-teman angkatan yang sudah tersebar di berbagai kota. Reuni jadi lebih mudah dikoordinasikan!",
    by: "Andi Wijaya, Alumni 2010",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AndiWijaya&backgroundColor=3b82f6&textColor=ffffff",
  },
  {
    tempId: 1,
    testimonial:
      "Lewat fitur direktori, saya menemukan senior yang bekerja di bidang yang sama. Sekarang beliau jadi mentor karir saya. Terima kasih Satu Teladan!",
    by: "Maya Sari, Alumni 2015",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MayaSari&backgroundColor=10b981&textColor=ffffff",
  },
  {
    tempId: 2,
    testimonial:
      "Sebagai orang tua siswa, aplikasi ini sangat membantu untuk mengetahui informasi kegiatan sekolah dan event alumni yang bisa diikuti anak saya.",
    by: "Budi Santoso, Orang Tua Siswa",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=8b5cf6&textColor=ffffff",
  },
  {
    tempId: 3,
    testimonial:
      "Notifikasi event dan berita sangat update. Tidak pernah ketinggalan info penting tentang Teladan lagi sejak pakai aplikasi ini.",
    by: "Dewi Lestari, Alumni 2008",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DewiLestari&backgroundColor=ef4444&textColor=ffffff",
  },
  {
    tempId: 4,
    testimonial:
      "Desain aplikasinya simpel tapi powerful. Mudah digunakan untuk semua kalangan, dari alumni senior hingga siswa aktif.",
    by: "Reza Pratama, Alumni 2018",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RezaPratama&backgroundColor=f59e0b&textColor=ffffff",
  },
  {
    tempId: 5,
    testimonial:
      "Fitur pencarian alumni berdasarkan profesi sangat membantu untuk networking profesional. Sudah dapat beberapa klien dari sini!",
    by: "Sinta Dewi, Alumni 2012",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SintaDewi&backgroundColor=6366f1&textColor=ffffff",
  },
  {
    tempId: 6,
    testimonial:
      "Komunitas di aplikasi ini sangat aktif dan positif. Senang bisa berbagi pengalaman dan tips dengan sesama keluarga besar Teladan.",
    by: "Fajar Nugroho, Alumni 2005",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=FajarNugroho&backgroundColor=ec4899&textColor=ffffff",
  },
  {
    tempId: 7,
    testimonial:
      "Sebagai siswa kelas 12, aplikasi ini membantu saya menemukan kakak alumni yang kuliah di kampus impian. Bisa konsultasi langsung!",
    by: "Anisa Rahman, Siswa Kelas XII",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AnisaRahman&backgroundColor=06b6d4&textColor=ffffff",
  },
  {
    tempId: 8,
    testimonial:
      "Galeri foto kenangan di aplikasi bikin nostalgia. Seru lihat foto-foto kegiatan dari berbagai angkatan!",
    by: "Hendra Kusuma, Alumni 1998",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=HendraKusuma&backgroundColor=f97316&textColor=ffffff",
  },
  {
    tempId: 9,
    testimonial:
      "Aplikasi wajib untuk semua keluarga besar Teladan. Memperkuat ikatan persaudaraan lintas generasi.",
    by: "Ratna Sari, Alumni 2002",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RatnaSari&backgroundColor=84cc16&textColor=ffffff",
  },
  {
    tempId: 10,
    testimonial:
      "Dulu susah cari kontak teman lama, sekarang tinggal buka aplikasi. Praktis banget!",
    by: "Agus Hermawan, Alumni 1995",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AgusHermawan&backgroundColor=a855f7&textColor=ffffff",
  },
  {
    tempId: 11,
    testimonial:
      "Fitur event reminder sangat membantu. Tidak pernah lupa jadwal reuni atau acara penting lainnya.",
    by: "Bambang Supriyadi, Alumni 2000",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=BambangSupriyadi&backgroundColor=059669&textColor=ffffff",
  },
  {
    tempId: 12,
    testimonial:
      "Proud to be part of Teladan community! Aplikasi ini jadi jembatan untuk terus berkontribusi untuk almamater.",
    by: "Nina Kartika, Alumni 2016",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=NinaKartika&backgroundColor=0ea5e9&textColor=ffffff",
  },
  {
    tempId: 13,
    testimonial:
      "Keamanan data terjaga dengan baik. Nyaman menggunakan aplikasi ini untuk berkomunikasi dengan sesama alumni.",
    by: "Wahyu Pratomo, Alumni 1990",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=WahyuPratomo&backgroundColor=dc2626&textColor=ffffff",
  },
  {
    tempId: 14,
    testimonial:
      "5 bintang! Aplikasi yang mempererat tali silaturahmi keluarga besar SMA Negeri 1 Yogyakarta.",
    by: "Sri Mulyani, Alumni 1988",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SriMulyani&backgroundColor=7c3aed&textColor=ffffff",
  },
]

interface TestimonialCardProps {
  position: number
  testimonial: (typeof testimonials)[0]
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-10 transition-all duration-700 ease-in-out rounded-lg shadow-2xl",
        isCenter
          ? "z-10 bg-[#002587] text-white border-[#002587] shadow-[#002587]/20 scale-100"
          : "z-0 bg-white text-gray-400 border-gray-100 hover:border-[#002587]/20 hover:text-gray-600 scale-90",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.4) * position}px)
          translateY(${isCenter ? -80 : position % 2 ? 20 : -20}px)
          rotate(${isCenter ? 0 : position % 2 ? 3 : -3}deg)
        `,
      }}
    >
      <div className="relative">
        <img
          src={testimonial.imgSrc || "/placeholder.svg"}
          alt={`${testimonial.by.split(",")[0]}`}
          className="mb-8 h-16 w-16 rounded-lg bg-gray-100 object-cover object-top shadow-lg grayscale group-hover:grayscale-0 transition-all"
        />
        <div className={cn("absolute -top-4 -left-4 w-8 h-8 rounded-lg flex items-center justify-center font-black text-2xl opacity-20", isCenter ? "text-white" : "text-[#002587]")}>"</div>
      </div>
      <h3 className={cn("text-xl md:text-2xl font-bold leading-tight tracking-tight", isCenter ? "text-white" : "text-blue-900")}>
        {testimonial.testimonial}
      </h3>
      <p
        className={cn(
          "absolute bottom-10 left-10 right-10 text-base font-bold tracking-wide transition-colors",
          isCenter ? "text-white/70" : "text-gray-400",
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  )
}

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(400)
  const [testimonialsList, setTestimonialsList] = useState(testimonials)

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)")
      setCardSize(matches ? 400 : 320)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ height: 650 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2 ? index - (testimonialsList.length + 1) / 2 : index - testimonialsList.length / 2
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        )
      })}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-16 w-16 items-center justify-center transition-all rounded-lg shadow-xl",
            "bg-white border border-gray-100 text-[#002587] hover:bg-[#002587] hover:text-white",
          )}
          aria-label="Testimoni sebelumnya"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-16 w-16 items-center justify-center transition-all rounded-lg shadow-xl",
            "bg-white border border-gray-100 text-[#002587] hover:bg-[#002587] hover:text-white",
          )}
          aria-label="Testimoni berikutnya"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
