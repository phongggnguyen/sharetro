-- Tạo bảng lưu trữ lịch sử chốt sổ hàng tháng
CREATE TABLE IF NOT EXISTS public.settlement_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL, -- Tham chiếu tới bảng groups
    period_date DATE NOT NULL,
    from_member_id UUID NOT NULL,
    from_member_name TEXT NOT NULL,
    to_member_id UUID NOT NULL,
    to_member_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS
ALTER TABLE public.settlement_history ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép đọc tất cả (có thể điều chỉnh chặt hơn theo user auth nếu cần)
CREATE POLICY "Enable read access for all users" ON public.settlement_history
    FOR SELECT USING (true);

-- Tạo policy cho phép insert (bởi API cronjob)
CREATE POLICY "Enable insert access for all users" ON public.settlement_history
    FOR INSERT WITH CHECK (true);
