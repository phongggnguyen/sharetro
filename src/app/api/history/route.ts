import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { groupId, periodName, adminToken } = body;

        if (!groupId || !periodName || !adminToken) {
            return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Kiểm tra quyền (admin_token)
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('admin_token')
            .eq('id', groupId)
            .single();

        if (groupError || !group) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy nhóm' }, { status: 404 });
        }

        if (group.admin_token !== adminToken) {
            return NextResponse.json({ success: false, error: 'Không có quyền thực hiện. Chỉ quản trị viên mới được phép xoá lịch sử.' }, { status: 403 });
        }

        // Thực hiện xóa lịch sử của period_name
        const { error: deleteError } = await supabase
            .from('settlement_history')
            .delete()
            .eq('group_id', groupId)
            .eq('period_name', periodName);

        if (deleteError) {
            console.error(`Failed to delete settlement history for group ${groupId}, period ${periodName}:`, deleteError);
            throw new Error('Lỗi khi xoá lịch sử chốt sổ trên cơ sở dữ liệu');
        }

        return NextResponse.json({
            success: true,
            message: `Đã xoá lịch sử chốt sổ kỳ: ${periodName}`
        });

    } catch (error: any) {
        console.error('History DELETE API error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
