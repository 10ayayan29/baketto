-- バケットリストにメモカラムを追加
ALTER TABLE buckets ADD COLUMN IF NOT EXISTS memo TEXT;
