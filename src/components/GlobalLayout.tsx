"use client";

import { useAuth } from "@/providers/auth-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/modules/Footer";
import { usePathname } from "next/navigation";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, isPortal, activeTab, setActiveTab } = useAuth();
  const pathname = usePathname();
  
  // Conditionally hide navbar/footer on certain pages if needed
  const isAuthPage = pathname?.startsWith("/auth/");
  const hideNavbar = isAuthPage;
  const hideFooter = isAuthPage;
  
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && (
        <Navbar 
          user={user} 
          profile={profile} 
          onSignOut={signOut} 
          isPortal={isPortal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <main className={`flex-grow ${!hideNavbar ? "pt-20" : ""}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
