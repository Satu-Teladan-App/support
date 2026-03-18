"use client";

import { useAuth } from "@/providers/auth-provider";
import SupportPortal from "@/modules/Support/Portal";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function DiskusiPage() {
  const { user, isLoading, setActiveTab } = useAuth();

  useEffect(() => {
    setActiveTab('forum');
  }, [setActiveTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-900" size={32} />
      </div>
    );
  }

  if (!user) {
    // Redirect to home if not logged in, where login form is shown
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
    return null;
  }

  return <SupportPortal user={user} />;
}
