import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    return handlePing(request);
}

export async function POST(request: Request) {
    return handlePing(request);
}

async function handlePing(request: Request) {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Nếu biến môi trường CRON_SECRET được định nghĩa, bắt buộc phải xác thực token
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.warn('[Keep-Alive] Yêu cầu bị từ chối: Token không hợp lệ hoặc bị thiếu.');
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Khởi tạo Supabase client trực tiếp bằng URL và Anon Key
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const startTime = Date.now();
        // Thực hiện câu SELECT đơn giản lên bảng groups để kích hoạt DB hoạt động
        const { data, error } = await supabase.from('groups').select('id').limit(1);
        const duration = Date.now() - startTime;

        if (error) {
            console.error('[Keep-Alive] Lỗi khi truy vấn cơ sở dữ liệu Supabase:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        console.log(`[Keep-Alive] Gửi ping thành công tới database. Thời gian phản hồi: ${duration}ms. Số lượng dòng lấy được: ${data?.length || 0}`);
        
        return NextResponse.json({
            success: true,
            message: 'Database keep-alive ping successful',
            timestamp: new Date().toISOString(),
            durationMs: duration
        });
    } catch (err: any) {
        console.error('[Keep-Alive] Lỗi không mong muốn xảy ra trong quá trình ping:', err);
        return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
