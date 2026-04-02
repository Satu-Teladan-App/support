"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Scale, Users, ShieldAlert, BadgeCheck, Coins, HelpCircle } from "lucide-react";

export default function TermsOfService() {
  const sections = [
    {
      title: "Ketentuan umum",
      icon: <Scale size={24} className="text-blue-600" />,
      content: [
        "Satu Teladan adalah platform resmi yang dioperasikan oleh Lembaga Alumni SMA Negeri 1 Yogyakarta.",
        "Dengan menggunakan aplikasi, Anda menyatakan telah membaca dan menyetujui seluruh ketentuan ini.",
        "Kami berhak mengubah atau memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.",
        "Penggunaan berkelanjutan setelah perubahan berarti Anda menerima ketentuan yang telah diperbarui."
      ],
    },
    {
      title: "Kelayakan pengguna dan verifikasi",
      icon: <Users size={24} className="text-blue-600" />,
      content: [
        "Aplikasi ini hanya ditujukan untuk alumni, siswa, guru, dan staf resmi SMA Negeri 1 Yogyakarta.",
        "Setiap pendaftaran akun akan melalui proses verifikasi manual oleh tim administrator.",
        "Anda wajib memberikan data yang akurat dan asli. Pemalsuan identitas akan berakibat pada pemblokiran permanen.",
        "Satu akun hanya boleh digunakan oleh satu individu pemegang identitas resmi."
      ],
    },
    {
      title: "Kode etik dan penggunaan yang dilarang",
      icon: <ShieldAlert size={24} className="text-blue-600" />,
      content: [
        "Dilarang menyebarkan konten bermuatan SARA, pornografi, kebencian, atau perundungan (bullying).",
        "Dilarang melakukan spamming, penipuan, atau aktivitas ilegal lainnya yang merugikan sesama alumni.",
        "Dilarang melakukan upaya peretasan atau mengganggu integritas sistem aplikasi.",
        "Kami berhak melakukan 'Blacklist' terhadap pengguna yang melanggar kode etik secara berulang."
      ],
    },
    {
      title: "Sistem poin dan kontribusi",
      icon: <Coins size={24} className="text-blue-600" />,
      content: [
        "Poin aktivitas diberikan berdasarkan partisipasi Anda dalam komunitas (reunian, donasi, update profil).",
        "Poin tidak memiliki nilai moneter nyata dan tidak dapat diuangkan.",
        "Penyalahgunaan sistem poin melalui bot atau eksploitasi bug akan mengakibatkan poin hangus.",
        "Segala bentuk donasi yang dilakukan melalui aplikasi adalah sukarela dan non-refundable."
      ],
    },
    {
      title: "Batasan tanggung jawab",
      icon: <BadgeCheck size={24} className="text-blue-600" />,
      content: [
        "Lembaga Alumni tidak bertanggung jawab atas kerugian yang timbul dari interaksi antar pengguna di luar aplikasi.",
        "Kami tidak menjamin aplikasi akan selalu bebas dari gangguan teknis atau error sistem.",
        "Segala konten yang dibagikan oleh pengguna adalah tanggung jawab penuh masing-masing individu.",
        "Ketentuan ini diatur oleh dan tunduk pada hukum Republik Indonesia."
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
            <div className="text-base font-bold text-blue-600 tracking-wide mb-4">Ketentuan layanan</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
              Aturan main di <br /> 
              <span className="text-blue-700">komunitas teladan</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl">
              Pahami hak dan kewajiban Anda sebagai bagian dari ekosistem digital resmi SMA Negeri 1 Yogyakarta.
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

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-40 p-12 md:p-20 bg-gray-900 rounded-[64px] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Butuh penjelasan lebih lanjut?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Tim administrator kami siap membantu menjelaskan setiap poin ketentuan layanan untuk kenyamanan Anda.
            </p>
            <div className="pt-6">
              <a
                href="mailto:katymentor@gmail.com"
                className="inline-flex items-center px-12 py-6 bg-white text-gray-900 text-base font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl shadow-black/20"
              >
                Tanya admin
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
