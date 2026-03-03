-- Supabase schema for Sharetien

-- 1. Xóa bảng cũ nếu tồn tại
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;

-- 2. Tạo bảng groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tạo bảng members
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bank_id TEXT,
  account_no TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tạo bảng expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payer_id UUID REFERENCES members(id) ON DELETE SET NULL, -- null = nợ chung
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Cho phép thao tác dữ liệu cơ bản (Row Level Security - RLS)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 6. Tạo Policy mở khóa cho Local/Anon (Phát triển cục bộ - Để Production nhớ đổi)
CREATE POLICY "Enable all operations for anon" ON groups FOR ALL USING (true);
CREATE POLICY "Enable all operations for anon" ON members FOR ALL USING (true);
CREATE POLICY "Enable all operations for anon" ON expenses FOR ALL USING (true);

-- 7. Chèn một group mặc định ban đầu
INSERT INTO groups (id, name) VALUES ('e2d7e0fb-9d2a-41f2-ba22-0cc690ce11d7', 'Default Group')
ON CONFLICT DO NOTHING;
