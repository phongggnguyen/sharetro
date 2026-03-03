import { create } from 'zustand';
import { Group, Member, Expense } from '@/types';

interface ExpenseState {
    group: Group | null;
    members: Member[];
    expenses: Expense[];
    // Actions
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

// Giả lập Mock Data cho MVP
const MOCK_GROUP_ID = "g-1";

const mockMembers: Member[] = [
    { id: "m-1", groupId: MOCK_GROUP_ID, name: "A" },
    { id: "m-2", groupId: MOCK_GROUP_ID, name: "B" },
    { id: "m-3", groupId: MOCK_GROUP_ID, name: "C" },
];

export const useExpenseStore = create<ExpenseState>((set) => ({
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
}));
