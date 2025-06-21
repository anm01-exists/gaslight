-- Complete database setup for all StudyHub features
-- Run this in your Supabase SQL Editor to enable all functionality

-- 1. Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'repair', 'cleaning', 'food', 'transport'
  price_range TEXT NOT NULL, -- 'budget', 'moderate', 'premium'
  location TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  rating DECIMAL DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  availability TEXT[] DEFAULT '{}', -- days of week
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  provider_name TEXT NOT NULL,
  provider_experience TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create study_resources table
CREATE TABLE IF NOT EXISTS study_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'notes', 'papers', 'videos', 'books'
  subject TEXT NOT NULL,
  course TEXT NOT NULL,
  semester TEXT,
  file_url TEXT,
  file_size TEXT,
  download_count INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  uploader_name TEXT NOT NULL,
  uploader_course TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'file', 'assignment'
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  service_id UUID REFERENCES service_providers(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create bookings table for services
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES service_providers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  total_amount DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create proposals table for assignments
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  proposer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  proposal_amount DECIMAL NOT NULL,
  proposal_message TEXT NOT NULL,
  estimated_days INTEGER,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security for all new tables
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for service_providers
CREATE POLICY "Enable read access for all users" ON service_providers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users based on user_id" ON service_providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON service_providers
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON service_providers
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Create RLS policies for study_resources
CREATE POLICY "Enable read access for all users" ON study_resources
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users based on user_id" ON study_resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON study_resources
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON study_resources
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create RLS policies for messages
CREATE POLICY "Enable read for sender and receiver" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Enable insert for authenticated users" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Enable update for receiver (marking as read)" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- 10. Create RLS policies for bookings
CREATE POLICY "Enable read for service owner and booker" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM service_providers WHERE id = service_id)
  );

CREATE POLICY "Enable insert for authenticated users" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for service owner and booker" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM service_providers WHERE id = service_id)
  );

-- 11. Create RLS policies for proposals
CREATE POLICY "Enable read for assignment owner and proposer" ON proposals
  FOR SELECT USING (
    auth.uid() = proposer_id OR 
    auth.uid() IN (SELECT user_id FROM assignments WHERE id = assignment_id)
  );

CREATE POLICY "Enable insert for authenticated users" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Enable update for assignment owner (accepting/rejecting)" ON proposals
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM assignments WHERE id = assignment_id)
  );

-- 12. Add triggers for updated_at columns
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_resources_updated_at BEFORE UPDATE ON study_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Insert sample data for demonstration

-- Sample service providers
INSERT INTO service_providers (title, description, category, price_range, location, contact_phone, rating, provider_name, provider_experience, verified, user_id, tags)
SELECT 
  'Quick Plumbing Solutions',
  'Expert plumbing services for hostels and apartments. Available 24/7 for emergency repairs.',
  'repair',
  'moderate',
  'Near Campus Gate 2',
  '+91-9876543210',
  4.5,
  'Rajesh Kumar',
  '5+ years experience',
  true,
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['plumbing', 'emergency', '24x7']
WHERE EXISTS (SELECT 1 FROM auth.users);

INSERT INTO service_providers (title, description, category, price_range, location, contact_phone, rating, provider_name, provider_experience, verified, user_id, tags)
SELECT 
  'Campus Cleaning Services',
  'Professional room and common area cleaning services. Weekly and monthly packages available.',
  'cleaning',
  'budget',
  'Hostel Block A',
  '+91-9876543211',
  4.2,
  'Priya Cleaning Co.',
  '3+ years experience',
  true,
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['cleaning', 'weekly', 'affordable']
WHERE EXISTS (SELECT 1 FROM auth.users);

-- Sample study resources
INSERT INTO study_resources (title, description, category, subject, course, semester, download_count, rating, uploader_name, uploader_course, verified, user_id, tags)
SELECT 
  'Data Structures Complete Notes',
  'Comprehensive notes covering all topics in Data Structures including arrays, linked lists, trees, and graphs.',
  'notes',
  'Computer Science',
  'B.Tech CSE',
  'Semester 3',
  245,
  4.7,
  'Student Contributor',
  'B.Tech CSE, Year 2',
  true,
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['data-structures', 'algorithms', 'semester-3']
WHERE EXISTS (SELECT 1 FROM auth.users);

INSERT INTO study_resources (title, description, category, subject, course, semester, download_count, rating, uploader_name, uploader_course, verified, user_id, tags)
SELECT 
  'Calculus Previous Year Papers',
  'Collection of previous year question papers for Calculus with solutions and marking scheme.',
  'papers',
  'Mathematics',
  'B.Tech',
  'Semester 1',
  189,
  4.4,
  'Student Contributor',
  'B.Tech, Year 3',
  true,
  (SELECT id FROM auth.users LIMIT 1),
  ARRAY['calculus', 'previous-papers', 'solutions']
WHERE EXISTS (SELECT 1 FROM auth.users);

-- ✅ Complete setup done! All features are now ready to use.
