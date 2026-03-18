"use client";

import { useAuth } from "@/providers/auth-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/modules/Footer";
import { usePathname } from "next/navigation";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, isPortal, activeTab, setActiveTab } = useAuth();
  const pathname = usePathname();
  
  // Conditionally hide navbar/footer on certain pages if needed
  const isAuthPage = pathname?.startsWith('/auth/');
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <Navbar 
          user={user} 
          profile={profile} 
          onSignOut={signOut} 
          isPortal={isPortal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <main className={`flex-grow ${!isAuthPage ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
