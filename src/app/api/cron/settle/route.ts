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

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        // Kiểm tra CRON_SECRET để đảm bảo bảo mật (bỏ qua nếu gọi từ localhost để test dễ hơn)
        if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Lấy tất cả các nhóm
        const { data: groups, error: groupsError } = await supabase.from('groups').select('id');

        if (groupsError) throw groupsError;

        let processedGroups = 0;

        for (const group of groups || []) {
            // Lấy members và expenses của nhóm hiện tại
            const [membersRes, expensesRes] = await Promise.all([
                supabase.from('members').select('*').eq('group_id', group.id),
                supabase.from('expenses').select('*').eq('group_id', group.id)
            ]);

            if (membersRes.error) throw membersRes.error;
            if (expensesRes.error) throw expensesRes.error;

            const membersData = membersRes.data || [];
            const expensesData = expensesRes.data || [];

            // Nếu không có expense nào, bỏ qua nhóm này
            if (membersData.length === 0 || expensesData.length === 0) continue;

            // Tính toán nợ nần
            const typedMembers = membersData.map(mapMember);
            const typedExpenses = expensesData.map(mapExpense);

            const { transactions } = calculateSettlements(typedMembers, typedExpenses);

            // Cập nhật lịch sử
            const periodDate = new Date().toISOString().split('T')[0]; // Ngày chốt: YYYY-MM-DD

            const records = transactions.map(t => ({
                group_id: group.id,
                period_date: periodDate,
                from_member_id: t.from,
                from_member_name: t.fromName,
                to_member_id: t.to,
                to_member_name: t.toName,
                amount: t.amount
            }));

            // Nếu có giao dịch nợ, lưu vào history
            if (records.length > 0) {
                const { error: insertError } = await supabase.from('settlement_history').insert(records);
                if (insertError) {
                    console.error(`Failed to insert settlement history for group ${group.id}:`, insertError);
                    continue; // Skip deleting expenses if history insertion fails
                }
            }

            // Xóa toàn bộ expenses cũ của nhóm này để bắt đầu con số 0
            const { error: deleteError } = await supabase.from('expenses').delete().eq('group_id', group.id);
            if (deleteError) {
                console.error(`Failed to clear expenses for group ${group.id}:`, deleteError);
            } else {
                processedGroups++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Settlement completed for ${processedGroups} group(s).`,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
