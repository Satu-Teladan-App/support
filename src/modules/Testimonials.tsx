"use client"

import { StaggerTestimonials } from "@/components/StaggerTestimonial"
import { motion } from "framer-motion"

export default function TestimonialsSection() {
  return (
    <section id="testimoni" className="relative py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.6em] mb-6">FEEDBACK</div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#002587] mb-8 uppercase leading-none">
            KATA MEREKA
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto uppercase tracking-[0.4em] font-bold opacity-70">
            CERITA DARI KELUARGA BESAR ALUMNI TELADAN.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <StaggerTestimonials />
        </div>
      </div>
    </section>
  )
}
