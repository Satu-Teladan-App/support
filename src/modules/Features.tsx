"use client";

import { motion } from "framer-motion";
import { Users, FileText, Bell, Globe, Heart, Shield } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Direktori alumni",
      description: "Terhubung kembali dengan teman seangkatan dan kembangkan jaringan profesional alumni SMA Negeri 1 Yogyakarta.",
    },
    {
      icon: FileText,
      title: "Portal pengaduan",
      description: "Tim bantuan hukum dan dukungan sosial resmi yang siap membantu seluruh anggota keluarga besar alumni Teladan.",
    },
    {
      icon: Bell,
      title: "Berita & pengumuman",
      description: "Dapatkan info terbaru seputar kegiatan reuni, pencapaian sekolah, dan pengumuman resmi organisasi alumni.",
    },
    {
      icon: Globe,
      title: "Peta komunitas",
      description: "Temukan lokasi dan komunitas alumni Teladan yang tersebar di seluruh penjuru wilayah Indonesia hingga mancanegara.",
    },
    {
      icon: Shield,
      title: "Privasi terjaga",
      description: "Data Anda dilindungi oleh sistem keamanan tinggi yang menjamin kerahasiaan informasi profil setiap anggota.",
    },
  ];

  return (
    <section id="fitur" className="py-32 bg-white relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24 text-center"
        >
          <div className="text-base font-bold text-blue-600 mb-6 font-sans tracking-wide">Mengapa Satu Teladan?</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Fitur utama <br /> 
            <span className="text-blue-700">dalam satu genggaman</span>
          </h2>
          <p className="text-gray-500 text-lg md:text-2xl font-medium max-w-3xl mx-auto mt-10 leading-relaxed font-sans">
            Solusi digital lengkap untuk meningkatkan keterlibatan dan pemberdayaan alumni SMA Negeri 1 Yogyakarta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-colors duration-500">
                  <Icon className="text-blue-600 group-hover:text-white transition-colors duration-500" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
