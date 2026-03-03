"use client";

import { useState, useEffect } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense } from "@/types";
import ExpenseList from "@/components/expenses/ExpenseList";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import SettlementView from "@/components/expenses/SettlementView";
import MemberList from "@/components/members/MemberList";
import MemberModal from "@/components/members/MemberModal";
import { Plus, ListOrdered, Calculator, Users } from "lucide-react";
import { Member } from "@/types";

type Tab = "expenses" | "settlement" | "members";

export default function Home() {
    const group = useExpenseStore((state) => state.group);
    const members = useExpenseStore((state) => state.members);
    const expenses = useExpenseStore((state) => state.expenses);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("expenses");
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [editingMember, setEditingMember] = useState<Member | null>(null);

    const fetchData = useExpenseStore((state) => state.fetchData);
    const isLoading = useExpenseStore((state) => state.isLoading);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsAddModalOpen(true);
    };

    const handleEditMember = (member: Member) => {
        setEditingMember(member);
        setIsMemberModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingExpense(null);
    };

    const handleCloseMemberModal = () => {
        setIsMemberModalOpen(false);
        setEditingMember(null);
    };

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
                <div className="font-black text-2xl uppercase tracking-widest animate-pulse border-4 border-slate-900 p-8 shadow-[8px_8px_0_0_rgba(15,23,42,1)] bg-white">
                    Đang tải dữ liệu...
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-white text-slate-900 relative selection:bg-black selection:text-white">
            {/* Header */}
            <div className="w-full relative z-10 p-6 pb-4 border-b-4 border-slate-900 bg-white">
                <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">{group?.name || "Nhóm trọ"}</h1>
                <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
                    {members.length} thành viên · {expenses.length} khoản chi
                </p>
                <div className="flex gap-2 mt-5 flex-wrap">
                    {members.map(m => (
                        <span key={m.id} className="bg-slate-100 border-2 border-slate-900 px-3 py-1 font-bold text-xs uppercase tracking-wider text-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
                            {m.name}
                        </span>
                    ))}
                </div>

                {/* Tab Bar */}
                <div className="flex mt-8 gap-3">
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-black transition-all duration-200 border-2 border-slate-900 ${activeTab === "expenses"
                            ? "bg-slate-900 text-white shadow-[4px_4px_0_0_rgba(15,23,42,0.2)]"
                            : "bg-white text-slate-900 hover:bg-slate-100 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)]"
                            }`}
                    >
                        <ListOrdered className="w-4 h-4" />
                        Chi tiêu
                    </button>
                    <button
                        onClick={() => setActiveTab("settlement")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-black transition-all duration-200 border-2 border-slate-900 ${activeTab === "settlement"
                            ? "bg-slate-900 text-white shadow-[4px_4px_0_0_rgba(15,23,42,0.2)]"
                            : "bg-white text-slate-900 hover:bg-slate-100 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)]"
                            }`}
                    >
                        <Calculator className="w-4 h-4" />
                        Chốt sổ
                    </button>
                    <button
                        onClick={() => setActiveTab("members")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-black transition-all duration-200 border-2 border-slate-900 ${activeTab === "members"
                            ? "bg-slate-900 text-white shadow-[4px_4px_0_0_rgba(15,23,42,0.2)]"
                            : "bg-white text-slate-900 hover:bg-slate-100 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)]"
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        T.Viên
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full px-4 pt-5 pb-28">
                {activeTab === "expenses" && (
                    <ExpenseList onEdit={handleEdit} />
                )}
                {activeTab === "settlement" && (
                    <SettlementView />
                )}
                {activeTab === "members" && (
                    <MemberList onEdit={handleEditMember} />
                )}
            </div>

            {/* Modals */}
            <AddExpenseModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                expenseToEdit={editingExpense || undefined}
            />

            <MemberModal
                isOpen={isMemberModalOpen}
                onClose={handleCloseMemberModal}
                memberToEdit={editingMember || undefined}
            />

            {/* FAB - Hiển thị tùy theo tab */}
            <div className="fixed bottom-8 w-full max-w-md px-6 flex justify-end pointer-events-none z-40">
                {activeTab === "expenses" && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black text-white p-5 pointer-events-auto border-2 border-black shadow-[6px_6px_0_0_rgba(15,23,42,0.1)] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,0.1)] active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center font-black"
                    >
                        <Plus className="w-8 h-8" />
                    </button>
                )}
                {activeTab === "members" && (
                    <button
                        onClick={() => setIsMemberModalOpen(true)}
                        className="bg-black text-white p-5 pointer-events-auto border-2 border-black shadow-[6px_6px_0_0_rgba(15,23,42,0.1)] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,0.1)] active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center font-black"
                    >
                        <Plus className="w-8 h-8" />
                    </button>
                )}
            </div>
        </main>
    );
}
