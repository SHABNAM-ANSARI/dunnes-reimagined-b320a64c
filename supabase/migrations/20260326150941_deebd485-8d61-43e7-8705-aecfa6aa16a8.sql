
-- Teachers table
CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  class_assigned text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read teachers" ON public.teachers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Only admins can insert teachers" ON public.teachers FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR is_hardcoded_admin());
CREATE POLICY "Only admins can update teachers" ON public.teachers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR is_hardcoded_admin());
CREATE POLICY "Only admins can delete teachers" ON public.teachers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') OR is_hardcoded_admin());

-- Announcement type enum
CREATE TYPE public.announcement_type AS ENUM ('daily', 'subject_update', 'general');

-- Announcements table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_mobile text NOT NULL,
  teacher_name text NOT NULL DEFAULT '',
  title text NOT NULL,
  content text NOT NULL,
  type announcement_type NOT NULL DEFAULT 'daily',
  class_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read announcements" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert announcements" ON public.announcements FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Attendance table
CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present',
  marked_by text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read attendance" ON public.attendance FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert attendance" ON public.attendance FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update attendance" ON public.attendance FOR UPDATE TO anon, authenticated USING (true);
