-- Migration generated from MCP operation
-- Operation: mcp_supabase_apply_migration
-- Purpose: Create submissions table for form data storage

-- Create submissions table for form data
CREATE TABLE public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    form_type TEXT DEFAULT 'general',
    data JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for submissions table
CREATE POLICY "Users can view their own submissions"
  ON public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions"
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own submissions"
  ON public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions"
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow service role full access"
  ON public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions"
  FOR ALL
  TO service_role
  USING (true);

-- Add comments for documentation
COMMENT ON TABLE public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions" IS 'Table for storing form submissions and user data';
COMMENT ON COLUMN public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions".user_id IS 'User ID for RLS policies and data ownership';
COMMENT ON COLUMN public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions".form_type IS 'Type of form submission (contact, feedback, registration, etc.)';
COMMENT ON COLUMN public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions".data IS 'JSON data containing form fields and values';
COMMENT ON COLUMN public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions".status IS 'Submission status (pending, processed, approved, rejected)';

-- Insert sample submission data (idempotent)
INSERT INTO public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions" (user_id, form_type, data, status)
SELECT 
    '58ec3cec-9bce-44e7-980d-27352226a600'::uuid,
    'contact',
    '{"name": "Sample User", "email": "user@example.com", "message": "This is a test submission"}'::jsonb,
    'pending'
WHERE NOT EXISTS (
    SELECT 1 FROM public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions" 
    WHERE user_id = '58ec3cec-9bce-44e7-980d-27352226a600'::uuid 
    AND form_type = 'contact'
);

-- End of migration