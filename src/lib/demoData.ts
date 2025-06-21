// Demo data and functions for when Supabase is not configured
import type { Assignment, Profile } from "./supabase";

// Demo assignments data
const demoAssignments: Assignment[] = [
  {
    id: "demo-1",
    title: "React.js Dashboard Development",
    description:
      "Need help building a responsive admin dashboard using React.js, TypeScript, and Tailwind CSS. Should include charts, data tables, and user management.",
    category: "programming",
    budget: 2500,
    deadline: "2024-02-15",
    tags: ["React", "TypeScript", "Tailwind", "Dashboard"],
    attachments: 3,
    urgency: "high",
    created_at: "2024-01-08T10:00:00Z",
    updated_at: "2024-01-08T10:00:00Z",
    user_id: "demo-user-1",
    student_name: "Arjun Patel",
    student_course: "B.Tech CSE, Year 3",
    student_rating: 4.8,
    proposals_count: 8,
  },
  {
    id: "demo-2",
    title: "Data Structures & Algorithms Assignment",
    description:
      "Looking for help with implementing binary trees, hash tables, and graph algorithms in C++. Need well-commented code and explanation.",
    category: "programming",
    budget: 1500,
    deadline: "2024-02-12",
    tags: ["C++", "Data Structures", "Algorithms"],
    attachments: 2,
    urgency: "medium",
    created_at: "2024-01-08T05:00:00Z",
    updated_at: "2024-01-08T05:00:00Z",
    user_id: "demo-user-2",
    student_name: "Sneha Sharma",
    student_course: "MCA, Year 2",
    student_rating: 4.9,
    proposals_count: 12,
  },
  {
    id: "demo-3",
    title: "Financial Market Analysis Report",
    description:
      "Need comprehensive analysis of Indian stock market trends for the last quarter. Should include charts, graphs, and investment recommendations.",
    category: "business",
    budget: 3000,
    deadline: "2024-02-18",
    tags: ["Finance", "Market Analysis", "Research"],
    attachments: 1,
    urgency: "low",
    created_at: "2024-01-07T15:00:00Z",
    updated_at: "2024-01-07T15:00:00Z",
    user_id: "demo-user-3",
    student_name: "Rohit Kumar",
    student_course: "MBA Finance, Year 2",
    student_rating: 4.7,
    proposals_count: 5,
  },
];

// Demo service functions
export const demoService = {
  // Get all assignments
  getAssignments: () => {
    return Promise.resolve({ data: demoAssignments, error: null });
  },

  // Create assignment (demo mode)
  createAssignment: (assignmentData: Partial<Assignment>) => {
    const newAssignment: Assignment = {
      id: `demo-${Date.now()}`,
      title: assignmentData.title || "",
      description: assignmentData.description || "",
      category: assignmentData.category || "",
      budget: assignmentData.budget || 0,
      deadline: assignmentData.deadline || "",
      tags: assignmentData.tags || [],
      attachments: 0,
      urgency: assignmentData.urgency || "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "demo-user",
      student_name: "Demo User",
      student_course: "Demo Course",
      student_rating: 5.0,
      proposals_count: 0,
    };

    // Add to demo data
    demoAssignments.unshift(newAssignment);
    return Promise.resolve({ data: newAssignment, error: null });
  },

  // Auth functions (demo mode)
  auth: {
    signUp: () => {
      return Promise.resolve({
        data: {
          user: {
            id: "demo-user",
            email: "demo@example.com",
          },
        },
        error: null,
      });
    },

    signInWithPassword: () => {
      return Promise.resolve({
        data: {
          user: {
            id: "demo-user",
            email: "demo@example.com",
          },
        },
        error: null,
      });
    },

    signOut: () => {
      return Promise.resolve({ error: null });
    },

    getSession: () => {
      return Promise.resolve({
        data: {
          session: null,
        },
      });
    },

    onAuthStateChange: () => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
  },
};
