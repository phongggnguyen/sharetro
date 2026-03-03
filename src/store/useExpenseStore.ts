import { create } from 'zustand';
import { Group, Member, Expense } from '@/types';

interface ExpenseState {
    group: Group | null;
    members: Member[];
    expenses: Expense[];
    // Actions
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
    updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void;
    deleteExpense: (id: string) => void;
    addMember: (member: Omit<Member, 'id'>) => void;
    updateMember: (id: string, member: Partial<Omit<Member, 'id'>>) => void;
    deleteMember: (id: string) => { success: boolean; message?: string };
}

// Giả lập Mock Data cho MVP
const MOCK_GROUP_ID = "g-1";

const mockMembers: Member[] = [
    { id: "m-1", groupId: MOCK_GROUP_ID, name: "A" },
    { id: "m-2", groupId: MOCK_GROUP_ID, name: "B" },
    { id: "m-3", groupId: MOCK_GROUP_ID, name: "C" },
];

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    group: {
        id: MOCK_GROUP_ID,
        name: "Trọ Quận 7",
        createdAt: new Date().toISOString(),
    },
    members: mockMembers,
    expenses: [
        {
            id: "e-1",
            groupId: MOCK_GROUP_ID,
            title: "Tiền phòng",
            amount: 3252000,
            payerId: null, // Nợ chung
            createdAt: new Date().toISOString(),
        },
        {
            id: "e-2",
            groupId: MOCK_GROUP_ID,
            title: "Gạo",
            amount: 35000,
            payerId: "m-1", // A trả
            createdAt: new Date().toISOString(),
        },
        {
            id: "e-3",
            groupId: MOCK_GROUP_ID,
            title: "Tiền nước",
            amount: 10000,
            payerId: "m-2", // B trả
            createdAt: new Date().toISOString(),
        },
        {
            id: "e-4",
            groupId: MOCK_GROUP_ID,
            title: "Đồ dùng",
            amount: 186000,
            payerId: "m-3", // C trả
            createdAt: new Date().toISOString(),
        },
    ],
    addExpense: (expenseData) =>
        set((state) => ({
            expenses: [
                ...state.expenses,
                {
                    ...expenseData,
                    id: `e-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                },
            ],
        })),
    updateExpense: (id, expenseData) =>
        set((state) => ({
            expenses: state.expenses.map((e) =>
                e.id === id ? { ...e, ...expenseData } : e
            ),
        })),
    deleteExpense: (id) =>
        set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
        })),
    addMember: (memberData) =>
        set((state) => ({
            members: [
                ...state.members,
                {
                    ...memberData,
                    id: `m-${Date.now()}`,
                },
            ],
        })),
    updateMember: (id, memberData) =>
        set((state) => ({
            members: state.members.map((m) =>
                m.id === id ? { ...m, ...memberData } : m
            ),
        })),
    deleteMember: (id) => {
        const state = get();
        // Kiểm tra xem thành viên có liên quan đến khoản chi nào không
        const isRelated = state.expenses.some(
            (e) => e.payerId === id
        );

        if (isRelated) {
            return {
                success: false,
                message: "Không thể xóa thành viên này vì họ đã tham gia chi tiêu."
            };
        }

        set((state) => ({
            members: state.members.filter((m) => m.id !== id),
        }));

        return { success: true };
    },
}));
