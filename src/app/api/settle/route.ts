import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateSettlements } from '@/lib/calculator';
import { Member, Expense } from '@/types';

export const dynamic = 'force-dynamic';

const mapMember = (data: any): Member => ({
    id: data.id,
    groupId: data.group_id,
    name: data.name,
    bankId: data.bank_id,
    accountNo: data.account_no,
});

const mapExpense = (data: any): Expense => ({
    id: data.id,
    groupId: data.group_id,
    title: data.title,
    amount: data.amount,
    payerId: data.payer_id,
    createdAt: data.created_at,
});

export async function POST(request: Request) {
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

        // 1. Kiểm tra Admin Token hợp lệ
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('id, admin_token')
            .eq('id', groupId)
            .single();

        if (groupError || !group) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy nhóm' }, { status: 404 });
        }

        if (group.admin_token !== adminToken) {
            return NextResponse.json({ success: false, error: 'Không có quyền thực hiện. Chỉ người tạo nhóm mới được phép chốt sổ.' }, { status: 403 });
        }

        // 2. Lấy members và expenses
        const [membersRes, expensesRes] = await Promise.all([
            supabase.from('members').select('*').eq('group_id', groupId),
            supabase.from('expenses').select('*').eq('group_id', groupId)
        ]);

        if (membersRes.error) throw membersRes.error;
        if (expensesRes.error) throw expensesRes.error;

        const membersData = membersRes.data || [];
        const expensesData = expensesRes.data || [];

        if (membersData.length === 0 || expensesData.length === 0) {
            return NextResponse.json({ success: false, error: 'Không có chi tiêu nào để chốt sổ' }, { status: 400 });
        }

        // 3. Tính toán nợ nần
        const typedMembers = membersData.map(mapMember);
        const typedExpenses = expensesData.map(mapExpense);

        const { transactions } = calculateSettlements(typedMembers, typedExpenses);

        // 4. Cập nhật lịch sử
        const periodDate = new Date().toISOString().split('T')[0];

        const records = transactions.map(t => ({
            group_id: groupId,
            period_date: periodDate,
            period_name: periodName,
            from_member_id: t.from,
            from_member_name: t.fromName,
            to_member_id: t.to,
            to_member_name: t.toName,
            amount: t.amount
        }));

        if (records.length > 0) {
            const { error: insertError } = await supabase.from('settlement_history').insert(records);
            if (insertError) {
                console.error(`Failed to insert settlement history for group ${groupId}:`, insertError);
                throw new Error('Lỗi khi lưu lịch sử chốt sổ');
            }
        }

        // 5. Xóa chi tiêu cũ
        const { error: deleteError } = await supabase.from('expenses').delete().eq('group_id', groupId);
        if (deleteError) {
            console.error(`Failed to clear expenses for group ${groupId}:`, deleteError);
            throw new Error('Lỗi khi xóa danh sách chi tiêu');
        }

        // 6. Xóa chu kỳ cũ nếu vượt quá 12 chu kỳ (Background task)
        try {
            // Lấy danh sách các chu kỳ (period_name) duy nhất của nhóm, xếp mới nhất lên đầu
            const { data: periodsData, error: periodsError } = await supabase
                .from('settlement_history')
                .select('period_name, created_at')
                .eq('group_id', groupId)
                .order('created_at', { ascending: false });

            if (!periodsError && periodsData) {
                // Tạo Set để lấy các period_name unique (vì 1 period có nhiều records)
                const uniquePeriods = Array.from(new Set(periodsData.map((p: any) => p.period_name)));

                if (uniquePeriods.length > 12) {
                    // Lấy danh sách các chu kỳ cần xóa (từ vị trí 12 trở đi)
                    const periodsToDelete = uniquePeriods.slice(12);

                    const { error: cleanupError } = await supabase
                        .from('settlement_history')
                        .delete()
                        .eq('group_id', groupId)
                        .in('period_name', periodsToDelete);

                    if (cleanupError) {
                        console.error(`Failed to cleanup old periods for group ${groupId}:`, cleanupError);
                    } else {
                        console.log(`Successfully cleaned up ${periodsToDelete.length} old periods for group ${groupId}`);
                    }
                }
            }
        } catch (cleanupEx) {
            console.error('Exception during old periods cleanup:', cleanupEx);
            // Không throw error ở đây để không làm gián đoạn response thành công của chốt sổ
        }

        return NextResponse.json({
            success: true,
            message: `Đã chốt sổ thành công kỳ: ${periodName}`,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Settle API error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
