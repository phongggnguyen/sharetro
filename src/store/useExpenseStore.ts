import { create } from 'zustand';
import { Group, Member, Expense } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface ExpenseState {
    group: Group | null;
    members: Member[];
    expenses: Expense[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchData: () => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
    updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt'>>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    addMember: (member: Omit<Member, 'id'>) => Promise<void>;
    updateMember: (id: string, member: Partial<Omit<Member, 'id'>>) => Promise<void>;
    deleteMember: (id: string) => Promise<{ success: boolean; message?: string }>;
}

const supabase = createClient();

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

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    group: null,
    members: [],
    expenses: [],
    isLoading: true,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Lấy Group đầu tiên (mặc định)
            const { data: groups, error: groupErr } = await supabase.from('groups').select('*').limit(1);
            if (groupErr) throw groupErr;
            const currentGroup = groups && groups.length > 0 ? {
                id: groups[0].id,
                name: groups[0].name,
                createdAt: groups[0].created_at
            } : null;

            if (currentGroup) {
                const [membersRes, expensesRes] = await Promise.all([
                    supabase.from('members').select('*').eq('group_id', currentGroup.id).order('created_at', { ascending: true }),
                    supabase.from('expenses').select('*').eq('group_id', currentGroup.id).order('created_at', { ascending: false })
                ]);

                if (membersRes.error) throw membersRes.error;
                if (expensesRes.error) throw expensesRes.error;

                set({
                    group: currentGroup,
                    members: membersRes.data.map(mapMember),
                    expenses: expensesRes.data.map(mapExpense),
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    addExpense: async (expenseData) => {
        try {
            const { data, error } = await supabase.from('expenses').insert({
                group_id: expenseData.groupId,
                title: expenseData.title,
                amount: expenseData.amount,
                payer_id: expenseData.payerId
            }).select().single();

            if (error) throw error;

            set((state) => ({
                expenses: [mapExpense(data), ...state.expenses]
            }));
        } catch (error) {
            console.error(error);
        }
    },

    updateExpense: async (id, expenseData) => {
        try {
            const updatePayload: any = {};
            if (expenseData.title !== undefined) updatePayload.title = expenseData.title;
            if (expenseData.amount !== undefined) updatePayload.amount = expenseData.amount;
            if (expenseData.payerId !== undefined) updatePayload.payer_id = expenseData.payerId;

            const { data, error } = await supabase.from('expenses').update(updatePayload).eq('id', id).select().single();
            if (error) throw error;

            set((state) => ({
                expenses: state.expenses.map((e) => e.id === id ? mapExpense(data) : e)
            }));
        } catch (error) {
            console.error(error);
        }
    },

    deleteExpense: async (id) => {
        try {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;

            set((state) => ({
                expenses: state.expenses.filter((e) => e.id !== id)
            }));
        } catch (error) {
            console.error(error);
        }
    },

    addMember: async (memberData) => {
        try {
            const { data, error } = await supabase.from('members').insert({
                group_id: memberData.groupId,
                name: memberData.name,
                bank_id: memberData.bankId,
                account_no: memberData.accountNo
            }).select().single();

            if (error) throw error;

            set((state) => ({
                members: [...state.members, mapMember(data)]
            }));
        } catch (error) {
            console.error(error);
        }
    },

    updateMember: async (id, memberData) => {
        try {
            const updatePayload: any = {};
            if (memberData.name !== undefined) updatePayload.name = memberData.name;
            if (memberData.bankId !== undefined) updatePayload.bank_id = memberData.bankId;
            if (memberData.accountNo !== undefined) updatePayload.account_no = memberData.accountNo;

            const { data, error } = await supabase.from('members').update(updatePayload).eq('id', id).select().single();
            if (error) throw error;

            set((state) => ({
                members: state.members.map((m) => m.id === id ? mapMember(data) : m)
            }));
        } catch (error) {
            console.error(error);
        }
    },

    deleteMember: async (id) => {
        const state = get();
        const isRelated = state.expenses.some((e) => e.payerId === id);

        if (isRelated) {
            return {
                success: false,
                message: "Không thể xóa thành viên này vì họ đã tham gia chi tiêu."
            };
        }

        try {
            const { error } = await supabase.from('members').delete().eq('id', id);
            if (error) throw error;

            set((state) => ({
                members: state.members.filter((m) => m.id !== id)
            }));
            return { success: true };
        } catch (error: any) {
            console.error(error);
            return { success: false, message: error.message };
        }
    },
}));
