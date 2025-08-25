-- Update submissions table to allow anonymous submissions
-- Remove the NOT NULL constraint from user_id to allow anonymous submissions

ALTER TABLE public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions" 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow anonymous submissions
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions";

-- Create new policy that allows anonymous inserts
CREATE POLICY "Allow anonymous submissions"
  ON public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions"
  FOR INSERT
  WITH CHECK (true);

-- Keep the select policy for authenticated users only
CREATE POLICY "Users can view their own submissions"
  ON public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions"
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Add comment
COMMENT ON COLUMN public."bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions".user_id IS 'User ID for authenticated submissions, can be null for anonymous submissions';