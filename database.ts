import { createClient } from "@supabase/supabase-js";

// Environment variables from .env or Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the User type (adjust this based on your DB)
export type User = {
  id: string;
  email: string;
  name: string;
  major: string;
  year: string;
};

// Auth helper functions
export const auth = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return data.user;
  },

  register: async (
    email: string,
    password: string,
    userData: { name: string; major: string; year: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw new Error(error.message);
    return data.user;
  },
};
