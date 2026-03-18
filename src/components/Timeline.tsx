"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface TimelineEntry {
  id: number
  image: string
  alt: string
  title: string
  description: string
  layout: "left" | "right"
}

interface TimelineProps {
  entries: TimelineEntry[]
  className?: string
}

export function Timeline({ entries, className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 transform -translate-x-1/2 hidden md:block" />

      {entries.map((entry, index) => (
        <TimelineItem key={entry.id} entry={entry} index={index} scrollProgress={scrollYProgress} />
      ))}
    </div>
  )
}

interface TimelineItemProps {
  entry: TimelineEntry
  index: number
  scrollProgress: any
}

function TimelineItem({ entry, index, scrollProgress }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start center", "end center"],
  })

  const opacity = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95])

  const isLeft = entry.layout === "left"

  return (
    <motion.div ref={itemRef} style={{ opacity, scale }} className="relative mb-24 md:mb-40">
      {/* Timeline Dot */}
      <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#002587] rounded-lg transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block shadow-lg shadow-[#002587]/20 border-4 border-white" />

      <div className="container mx-auto px-6">
        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-center", {
            "md:text-right": isLeft,
          })}
        >
          {/* Image */}
          <div
            className={cn("relative", {
              "md:order-2": isLeft,
              "md:order-1": !isLeft,
            })}
          >
            <div className="sticky top-20">
              <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-gray-50 border border-gray-100 shadow-2xl shadow-black/5 group">
                <img
                  src={entry.image || "/placeholder.svg"}
                  alt={entry.alt}
                  className="w-full h-full object-cover transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#002587]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn("relative", {
              "md:order-1": isLeft,
              "md:order-2": !isLeft,
            })}
          >
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.6em] mb-4">MOMENT 0{index + 1}</div>
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#002587] uppercase leading-tight mb-8">
                  {entry.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-400 uppercase tracking-[0.4em] font-bold opacity-70">{entry.description}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
