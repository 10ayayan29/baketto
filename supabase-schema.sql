-- Bucket List App Database Schema
-- このスクリプトをSupabaseのSQL Editorで実行してください

-- bucketsテーブル
CREATE TABLE buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_buckets_created_at ON buckets(created_at DESC);

-- 自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- bucketsテーブルのupdated_at自動更新トリガー
CREATE TRIGGER update_buckets_updated_at BEFORE UPDATE ON buckets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- membersテーブル
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id UUID REFERENCES buckets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bucket_id, name)
);

CREATE INDEX idx_members_bucket_id ON members(bucket_id);

-- bucket_itemsテーブル
CREATE TABLE bucket_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id UUID REFERENCES buckets(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  memo TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_bucket_items_bucket_id ON bucket_items(bucket_id);
CREATE INDEX idx_bucket_items_is_completed ON bucket_items(is_completed);
CREATE INDEX idx_bucket_items_display_order ON bucket_items(display_order);

-- bucket_itemsテーブルのupdated_at自動更新トリガー
CREATE TRIGGER update_bucket_items_updated_at BEFORE UPDATE ON bucket_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 完了時刻自動設定トリガー関数
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        NEW.completed_at = NOW();
    ELSIF NEW.is_completed = FALSE THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- bucket_itemsテーブルの完了時刻自動設定トリガー
CREATE TRIGGER set_bucket_items_completed_at BEFORE UPDATE ON bucket_items
FOR EACH ROW EXECUTE FUNCTION set_completed_at();

-- RLS設定（全許可）
ALTER TABLE buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for buckets" ON buckets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for members" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for bucket_items" ON bucket_items FOR ALL USING (true) WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE buckets;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE bucket_items;
