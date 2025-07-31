/*
  # Fix RLS Policies for Quote Requests

  This migration ensures that anonymous users can insert quote requests
  and fixes any potential RLS issues.

  1. Security Updates
    - Drop existing policies if they exist
    - Create new policy allowing anonymous inserts
    - Ensure table permissions are correct

  2. CORS Configuration
    - Verify table is accessible from web applications
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to submit quote requests" ON quote_requests;
DROP POLICY IF EXISTS "Allow authenticated users to read quote requests" ON quote_requests;

-- Ensure RLS is enabled
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for anonymous inserts
CREATE POLICY "Enable insert for anonymous users" ON quote_requests
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow authenticated users to read all data (for admin access)
CREATE POLICY "Enable read for authenticated users" ON quote_requests
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Grant necessary permissions
GRANT INSERT ON quote_requests TO anon;
GRANT SELECT ON quote_requests TO authenticated;