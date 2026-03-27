"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { fetchUserProfile } from "@/lib/api/profile";
import { signOut as authSignOut } from "@/lib/supabase/auth"; // Renamed alias to avoid collision
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  activeTab: "support" | "forum";
  setActiveTab: (tab: "support" | "forum") => void;
  isPortal: boolean;
  setIsPortal: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"support" | "forum">("support");
  const [isPortal, setIsPortal] = useState(false);
  const router = useRouter();

  // Always use the singleton — never call getSupabaseBrowserClient() inside render
  const supabase = getSupabaseBrowserClient();

  const fetchProfile = async () => {
    const prof = await fetchUserProfile();
    setProfile(prof);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile();
      }
      setIsLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile();
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    try {
      await authSignOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsPortal(false);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signOut,
        activeTab,
        setActiveTab,
        isPortal,
        setIsPortal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
