"use client";

import HeroSection from "@/modules/Hero";
import AboutSection from "@/modules/About";
import FeaturesSection from "@/modules/Features";
import TestimonialsSection from "@/modules/Testimonials";
import LegalAndContactSection from "@/modules/LegalAndContact";
import CTASection from "@/modules/CTA";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <LegalAndContactSection />
      <CTASection />
    </div>
  );
}
