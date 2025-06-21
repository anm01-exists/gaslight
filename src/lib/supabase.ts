import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase environment variables not configured. Using demo mode.",
  );
  console.warn("To enable full functionality:");
  console.warn("1. Create a Supabase project at https://supabase.com");
  console.warn("2. Copy .env.example to .env");
  console.warn("3. Add your Supabase URL and anon key");
}

// Create a mock client for demo mode or real client if configured
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Demo mode flag
export const isDemoMode = !supabase;

// Database Types
export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  tags: string[];
  attachments?: number;
  urgency: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
  user_id: string;
  student_name: string;
  student_course: string;
  student_rating?: number;
  proposals_count?: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  course: string;
  year: number;
  college: string;
  phone?: string;
  rating: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceProvider {
  id: string;
  title: string;
  description: string;
  category: "repair" | "cleaning" | "food" | "transport";
  price_range: "budget" | "moderate" | "premium";
  location: string;
  contact_phone?: string;
  contact_email?: string;
  rating: number;
  total_bookings: number;
  availability: string[];
  tags: string[];
  user_id: string;
  provider_name: string;
  provider_experience?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  category: "notes" | "papers" | "videos" | "books";
  subject: string;
  course: string;
  semester?: string;
  file_url?: string;
  file_size?: string;
  download_count: number;
  rating: number;
  tags: string[];
  user_id: string;
  uploader_name: string;
  uploader_course?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: "text" | "file" | "assignment";
  assignment_id?: string;
  service_id?: string;
  read: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  service_id: string;
  user_id: string;
  booking_date: string;
  booking_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  total_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  assignment_id: string;
  proposer_id: string;
  proposal_amount: number;
  proposal_message: string;
  estimated_days?: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}
