"use client";

import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, Heart, Globe } from "lucide-react";

export default function AboutSection() {
  const missionItems = [
    {
      icon: UserCheck,
      title: "Verifikasi keanggotaan",
      desc: "Setiap alumni melalui proses verifikasi angkatan guna menjaga keamanan komunitas.",
    },
    {
      icon: ShieldCheck,
      title: "Dukungan hukum",
      desc: "Layanan pengaduan dan bantuan hukum terintegrasi dari alumni untuk alumni.",
    },
    {
      icon: Globe,
      title: "Jaringan global",
      desc: "Terhubung dengan komunitas alumni di seluruh pelosok negeri hingga mancanegara.",
    },
  ];

  return (
    <section id="tentang" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 font-sans">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="text-base font-bold text-blue-600 font-sans tracking-wide">Misi & visi kami</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Membangun komunitas digital <br /> 
                <span className="text-blue-700">yang lebih solid</span>
              </h2>
              <div className="space-y-6 text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                <p>
                  Satu Teladan adalah jembatan penghubung yang mengapresiasi ribuan alumni SMA Negeri 1 Yogyakarta lintas generasi. Platform ini dirancang untuk menciptakan ekosistem yang saling memberdayakan dan bermanfaat bagi kemajuan almamater kita bersama.
                </p>
                <p>
                  Dengan teknologi, kami mengintegrasikan berbagai layanan, dari direktori hingga pusat pengaduan dalam satu aplikasi mobile yang aman dan modern.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              {missionItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="space-y-4 group">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center p-4 group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="text-blue-600 group-hover:text-white transition-colors duration-300" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{item.title}</h3>
                    <p className="text-gray-500 text-base leading-relaxed tracking-wide">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative lg:mt-24"
          >
            <div className="aspect-square rounded-[60px] bg-blue-50/50 backdrop-blur-sm overflow-hidden border border-blue-100/50 p-4">
              <img 
                 src="/images/satuteladan.jpg" 
                 alt="Alumni SMA 1 Yogyakarta" 
                 className="w-full h-full object-cover rounded-[50px] shadow-2xl transition-transform hover:scale-105 duration-1000 grayscale hover:grayscale-0"
              />
            </div>
            {/* Stats Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-12 rounded-[48px] shadow-2xl border border-gray-100 max-w-[320px]">
              <div className="text-6xl font-bold text-blue-700 mb-3 tracking-tighter">50K+</div>
              <div className="text-base font-bold text-gray-500 tracking-wide leading-relaxed italic">Alumni Teladan aktif bergabung sekarang</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
