-- Add URL column to bucket_items table
-- Run this in Supabase SQL Editor

ALTER TABLE bucket_items ADD COLUMN IF NOT EXISTS url TEXT;

-- Add index for URL searches (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_bucket_items_url ON bucket_items(url) WHERE url IS NOT NULL;
