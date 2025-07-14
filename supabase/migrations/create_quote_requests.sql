/*
  # Create quote requests table

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key)
      - `name` (text, required) - Customer's full name
      - `company` (text, required) - Company name
      - `email` (text, required) - Contact email address
      - `phone` (text, required) - Phone number
      - `product_type` (text, required) - Type of product requested
      - `quantity` (text, optional) - Estimated quantity needed
      - `message` (text, optional) - Additional message or current supplier quote
      - `created_at` (timestamptz, default now()) - Timestamp of request

  2. Security
    - Enable RLS on `quote_requests` table
    - Add policy for authenticated users to insert their own data
    - Add policy for service role to read all data (for admin access)

  3. Indexes
    - Index on created_at for efficient sorting
    - Index on email for lookups
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  product_type text NOT NULL,
  quantity text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS quote_requests_email_idx ON quote_requests(email);

-- Allow anonymous users to insert quote requests (for public form submissions)
CREATE POLICY "Allow anonymous quote submissions"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role to read all quote requests (for admin access)
CREATE POLICY "Service role can read all quotes"
  ON quote_requests
  FOR SELECT
  TO service_role
  USING (true);

-- Allow authenticated users to read their own quote requests
CREATE POLICY "Users can read own quote requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);