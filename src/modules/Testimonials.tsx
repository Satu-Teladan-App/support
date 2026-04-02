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
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <div className="text-base font-bold text-blue-600 mb-6 font-sans tracking-wide">Testimonial alumni</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Cerita jaringan <br /> 
            <span className="text-blue-700">keluarga besar teladan</span>
          </h2>
          <p className="text-gray-500 text-lg md:text-2xl font-medium max-w-3xl mx-auto mt-10 leading-relaxed font-sans">
            Dengarkan pengalaman langsung dari alumni lintas angkatan yang telah merasakan manfaat nyata dari platform Satu Teladan.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <StaggerTestimonials />
        </div>
      </div>
    </section>
  )
}
