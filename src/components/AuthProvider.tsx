// src/components/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";

// Define a type for our user profile data
export type Profile = {
  id: string;
  role: string;
};

// Update the context type to include the profile
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profile and only then mark loading as false
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", session.user.id)
          .single();
        setProfile(userProfile as Profile | null);
      } else {
        // If there is no user, ensure profile is cleared
        setProfile(null);
      }

      setLoading(false);
    };

    init();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", session.user.id)
          .single();
        setProfile(userProfile as Profile | null);
      } else {
        // If the user logs out, clear their profile.
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    // Add the profile to the context provider's value
    <AuthContext.Provider value={{ user, session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useUser = () => {
  const { user } = useAuth();
  return user;
};

// A convenient hook to get just the user's profile
export const useProfile = () => {
  const { profile } = useAuth();
  return profile;
};
