
-- Create site_settings table for admin-editable content
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for chatbot + frontend)
CREATE POLICY "Anyone can read site_settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Only admins can insert site_settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR is_hardcoded_admin());

-- Only admins can update
CREATE POLICY "Only admins can update site_settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR is_hardcoded_admin());

-- Only admins can delete
CREATE POLICY "Only admins can delete site_settings"
ON public.site_settings
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR is_hardcoded_admin());

-- Auto-update timestamp
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('school_address', 'DUNNE''S INSTITUTE, Admiralty House, Wodehouse Road, Colaba, Mumbai - 05'),
  ('contact_phone_1', '+91 7020981168'),
  ('contact_phone_2', '+91 8527665593'),
  ('contact_email', 'dunnesschool@gmail.com'),
  ('announcement_ticker', 'Welcome to Dunne''s Institute – Admissions Open for 2026-27!'),
  ('principal_name', 'Mrs. Kiran Singh'),
  ('education_advisor', 'Mr. Shahbehram Khushrushahi'),
  ('school_fees_info', 'Please contact the school office for detailed fee structure.');
