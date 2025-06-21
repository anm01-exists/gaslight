# StudyHub Deployment Guide

This guide will help you deploy your StudyHub platform with a working database and authentication.

## Prerequisites

1. Node.js 18+ installed
2. A Supabase account (free tier available)
3. A deployment platform account (Vercel, Netlify, etc.)

## Step 1: Set Up Supabase Database

1. **Create a Supabase Project:**

   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new organization and project
   - Choose a region close to your users

2. **Get Your API Keys:**

   - Go to Settings → API in your Supabase dashboard
   - Copy the Project URL and anon/public key
   - Save these for later

3. **Set Up Database Tables:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the SQL code from `.env.example` (the commented SQL section)
   - Run the SQL to create tables and security policies

## Step 2: Configure Environment Variables

1. **Create Environment File:**

   ```bash
   cp .env.example .env
   ```

2. **Fill in Your Supabase Credentials:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Test Locally

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Development Server:**

   ```bash
   npm run dev
   ```

3. **Test Features:**
   - Sign up for a new account
   - Post a test assignment
   - Browse assignments
   - Filter and search functionality

## Step 4: Deploy to Production

### Option A: Deploy to Vercel

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to your Vercel dashboard
   - Select your project → Settings → Environment Variables
   - Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option B: Deploy to Netlify

1. **Build the Project:**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository
   - Set environment variables in Site Settings → Environment Variables

## Step 5: Configure Authentication

1. **Set Up Auth Providers (Optional):**

   - Go to Authentication → Settings in Supabase
   - Configure Google, GitHub, or other providers if desired

2. **Configure Site URL:**
   - In Supabase Authentication → Settings
   - Add your production URL to "Site URL"
   - Add your domain to "Redirect URLs"

## Step 6: Enable Email Confirmation

1. **SMTP Setup (Recommended for Production):**

   - Go to Authentication → Settings → SMTP Settings
   - Configure with your email provider (Gmail, SendGrid, etc.)

2. **Update Email Templates:**
   - Customize email templates in Authentication → Templates

## Features Ready for Production

✅ **Working Features:**

- User registration and login
- Assignment posting with real database storage
- Assignment browsing with filtering and search
- Responsive design
- Real-time data updates

🚧 **Coming Soon:**

- Service providers marketplace
- Study resources sharing
- Dashboard analytics
- Messaging system
- Payment integration

## Database Schema

The platform uses these main tables:

- **profiles**: User information and stats
- **assignments**: Assignment postings with categories, budgets, deadlines
- **RLS Policies**: Row Level Security for data protection

## Security Features

- Row Level Security (RLS) enabled
- User authentication via Supabase Auth
- Secure API keys management
- Input validation and sanitization

## Monitoring and Analytics

1. **Supabase Dashboard:**

   - Monitor database usage
   - View authentication metrics
   - Check API performance

2. **Application Monitoring:**
   - Set up error tracking (Sentry recommended)
   - Monitor page performance
   - Track user engagement

## Support

For issues:

1. Check Supabase documentation
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase dashboard for API errors

Your StudyHub platform is now ready for real users! 🎓
