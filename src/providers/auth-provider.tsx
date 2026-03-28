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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPortal: boolean;
  setIsPortal: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("support");
  const [isPortal, setIsPortal] = useState(false);
  const router = useRouter();

  // Always use the singleton — never call getSupabaseBrowserClient() inside render
  const supabase = getSupabaseBrowserClient();

  const fetchProfile = async () => {
    const prof = await fetchUserProfile();
    setProfile(prof);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // Immediately stop loading once we know if we have a user or not
        setIsLoading(false);
        
        if (currentUser) {
          // Profile can load in the background
          fetchProfile().catch(err => console.error("Profile fetch error:", err));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Stop loading immediately
      setIsLoading(false);
      
      if (session?.user) {
        fetchProfile().catch(err => console.error("Auth state change profile error:", err));
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
