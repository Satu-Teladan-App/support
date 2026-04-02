"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LegalAndContactSection() {
  const legalLinks = [
    {
      title: "Terms of service",
      icon: FileText,
      href: "/tos",
      desc: "Learn about your rights and obligations while using the Satu Teladan platform.",
    },
    {
      title: "Privacy policy",
      icon: ShieldCheck,
      href: "https://www.termsfeed.com/live/adc486fe-8656-4769-aad9-85e0dbc4e3e5",
      desc: "We prioritize the security and confidentiality of your personal data.",
    },
  ];

  const contactItems = [
    {
      icon: Mail,
      label: "Email resmi",
      value: "katymentor@gmail.com",
      href: "mailto:katymentor@gmail.com",
    },
    {
      icon: Phone,
      label: "Layanan bantuan",
      value: "+62 812 3456 7890",
      href: "tel:+6281234567890",
    },
    {
      icon: MapPin,
      label: "Lokasi",
      value: "Yogyakarta, Indonesia",
      href: "#",
    },
  ];

  return (
    <section id="kontak" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="space-y-6">
              <div className="text-base font-bold text-blue-600 tracking-wide font-sans">Hubungi kami</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Pertanyaan terkait <br /> 
                <span className="text-blue-700">layanan & keamanan?</span>
              </h2>
              <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-md">
                Tim admin dan legal kami siap membantu Anda memberikan informasi lebih lanjut mengenai aplikasi.
              </p>
            </div>

            <div className="grid gap-8">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-8 p-10 rounded-[40px] border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="text-blue-600 group-hover:text-white transition-colors duration-300" size={24} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-400 mb-1 tracking-wide">{item.label}</div>
                      <div className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.value}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Legal Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-blue-700 rounded-[64px] p-16 md:p-20 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-blue-900/20"
          >
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-[100px]" />
             <div className="relative z-10 space-y-16">
               <div className="space-y-6">
                 <h3 className="text-4xl font-bold text-white tracking-tight">Aspek hukum</h3>
                 <p className="text-blue-100/70 text-xl leading-relaxed font-medium">
                   Kepatuhan dan transparansi data adalah prioritas utama kami dalam melayani Keluarga Besar SMA 1 Yogyakarta.
                 </p>
               </div>

               <div className="grid gap-8">
                 {legalLinks.map((link, idx) => {
                   const Icon = link.icon;
                   return (
                    <Link
                       key={idx}
                       href={link.href}
                       className="group block p-10 bg-white/5 border border-white/10 rounded-[48px] hover:bg-white hover:border-white transition-all duration-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
                              <Icon className="text-white group-hover:text-blue-600 transition-colors duration-500" size={28} />
                           </div>
                           <div className="space-y-3">
                             <h4 className="text-2xl font-bold text-white group-hover:text-gray-900 transition-colors">{link.title}</h4>
                             <p className="text-blue-100/60 text-base group-hover:text-gray-500 transition-colors font-medium">{link.desc}</p>
                           </div>
                        </div>
                        <ArrowRight className="text-white/40 group-hover:text-blue-600 transition-all group-hover:translate-x-3" size={32} />
                      </div>
                    </Link>
                   );
                 })}
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
