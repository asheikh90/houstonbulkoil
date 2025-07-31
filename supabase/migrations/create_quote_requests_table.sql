/*
  # Create quote requests table

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key)
      - `name` (text, required) - Customer's full name
      - `company` (text, required) - Company name
      - `email` (text, required) - Contact email
      - `phone` (text, required) - Phone number
      - `product_type` (text, required) - Type of product requested
      - `quantity` (text, optional) - Estimated quantity needed
      - `message` (text, optional) - Additional message or current supplier quote
      - `created_at` (timestamptz) - When the request was submitted
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `quote_requests` table
    - Add policy for public insert (form submissions)
    - Add policy for authenticated users to read all data (admin access)

  3. Indexes
    - Index on created_at for sorting
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert quote requests (form submissions)
CREATE POLICY "Allow public to submit quote requests"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all quote requests (admin access)
CREATE POLICY "Allow authenticated users to read quote requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();