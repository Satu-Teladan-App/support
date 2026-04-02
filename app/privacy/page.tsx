"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Server, RefreshCcw, UserX } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Data yang kami kumpulkan",
      icon: <Eye size={24} className="text-blue-600" />,
      content: [
        "Identitas pribadi dasar: Nama lengkap, email, nomor telepon, dan angkatan alumni.",
        "Data profesional: Pekerjaan saat ini, instansi, dan riwayat pendidikan.",
        "Data interaksi: Riwayat pengaduan yang dikirim melalui portal dukungan.",
        "Informasi perangkat: Model perangkat, sistem operasi, dan alamat IP untuk keamanan akun.",
      ],
    },
    {
      title: "Bagaimana kami menggunakan data Anda",
      icon: <RefreshCcw size={24} className="text-blue-600" />,
      content: [
        "Verifikasi identitas alumni untuk menjaga integritas komunitas Satu Teladan.",
        "Pengiriman notifikasi penting terkait kegiatan reuni, sekolah, dan organisasi.",
        "Pemrosesan dan tindak lanjut laporan pada portal pengaduan alumni.",
        "Analisis internal untuk meningkatkan performa dan fitur aplikasi."
      ],
    },
    {
      title: "Keamanan dan penyimpanan data",
      icon: <Lock size={24} className="text-blue-600" />,
      content: [
        "Data Anda disimpan pada database terenkripsi menggunakan infrastruktur Supabase yang aman.",
        "Komunikasi antara aplikasi dan server dilindungi oleh protokol enkripsi SSL/TLS.",
        "Akses ke data sensitif dibatasi hanya untuk administrator resmi yang telah diverifikasi.",
        "Data akan disimpan selama Anda masih terdaftar sebagai anggota keluarga besar Satu Teladan."
      ],
    },
    {
      title: "Hak akses dan penghapusan",
      icon: <UserX size={24} className="text-blue-600" />,
      content: [
        "Anda memiliki hak penuh untuk memperbarui profil melalui menu pengaturan di aplikasi.",
        "Penghapusan akun secara permanen dapat dilakukan melalui fitur 'Hapus Akun'.",
        "Setelah permohonan hapus akun, seluruh data identitas Anda akan dihapus secara permanen dalam 30 hari.",
        "Konten atau laporan yang bersifat administratif akan dianonimkan namun tetap disimpan untuk arsip hukum."
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 py-16 md:py-24 bg-gray-50/50 relative">
        <div className="absolute inset-0 bg-grid-subtle opacity-5 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 text-base font-bold text-gray-500 hover:text-blue-600 transition-all mb-12 group"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" />
            Kembali ke beranda
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-base font-bold text-blue-600 tracking-wide mb-4">Pusat privasi</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
              Kerahasiaan data <br /> 
              <span className="text-blue-700">adalah janji kami</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Kami berkomitmen untuk melindungi informasi pribadi Anda dengan standar keamanan kelas dunia selama Anda menjadi bagian dari Satu Teladan.
            </p>
            <div className="mt-10 pt-8 border-t border-gray-200">
               <p className="text-gray-400 text-base font-bold italic">Terakhir diperbarui: 2 April 2026</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-32 max-w-5xl">
        <div className="space-y-24">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-12"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                  {section.title}
                </h2>
              </div>
              <div className="md:col-span-2">
                <ul className="space-y-6">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-40 p-12 md:p-20 bg-blue-600 rounded-[64px] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Pertanyaan terkait data Anda?
            </h2>
            <p className="text-blue-100/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Tim Data Privacy kami siap menjawab setiap kekhawatiran Anda mengenai penggunaan data pribadi di platform ini.
            </p>
            <div className="pt-6">
              <a
                href="mailto:katymentor@gmail.com"
                className="inline-flex items-center px-12 py-6 bg-white text-blue-600 text-base font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-2xl shadow-blue-900/20"
              >
                Hubungi Petugas Data
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
