import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isDemoMode } from "@/lib/supabase";
import { demoService } from "@/lib/demoData";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    course: string,
    year: number,
    college: string,
  ) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - no real auth
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    course: string,
    year: number,
    college: string,
  ) => {
    if (isDemoMode) {
      alert(
        "⚠️ Demo Mode: In production, this would create a real account. Please configure Supabase for full functionality.",
      );
      return demoService.auth.signUp();
    }

    try {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error);
        throw new Error(error.message || "Failed to create account");
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase!
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              course,
              year,
              college,
              rating: 0,
              total_earnings: 0,
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw new Error(
            "Account created but profile setup failed. Please try logging in.",
          );
        }
      }

      return data;
    } catch (error: any) {
      console.error("Signup process error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      alert(
        "⚠️ Demo Mode: In production, this would authenticate with real credentials. Please configure Supabase for full functionality.",
      );
      return demoService.auth.signInWithPassword();
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);

        // Provide user-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Email or password is incorrect. Please check your credentials or sign up for a new account.",
          );
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Please check your email and click the confirmation link before signing in.",
          );
        } else {
          throw new Error(error.message || "Failed to sign in");
        }
      }

      return data;
    } catch (error: any) {
      console.error("Sign in process error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      return demoService.auth.signOut();
    }

    const { error } = await supabase!.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
