"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense, Member } from "@/types";
import ExpenseList from "@/components/expenses/ExpenseList";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import SettlementView from "@/components/expenses/SettlementView";
import MemberList from "@/components/members/MemberList";
import MemberModal from "@/components/members/MemberModal";
import { Plus, ListOrdered, Calculator, Users, ArrowLeft, Copy, Check, History } from "lucide-react";
import { Logo } from "@/components/Logo";

type Tab = "expenses" | "settlement" | "members";

// LocalStorage helpers
const RECENT_KEY = "sharetien_recent_groups";

function addToRecent(group: { id: string; name: string }) {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        const existing: { id: string; name: string }[] = raw ? JSON.parse(raw) : [];
        const filtered = existing.filter((g) => g.id !== group.id);
        const updated = [group, ...filtered].slice(0, 10); // Lưu tối đa 10 nhóm
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch { }
}

export default function GroupPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.id as string;

    const group = useExpenseStore((state) => state.group);
    const members = useExpenseStore((state) => state.members);
    const expenses = useExpenseStore((state) => state.expenses);
    const fetchData = useExpenseStore((state) => state.fetchData);
    const isLoading = useExpenseStore((state) => state.isLoading);
    const error = useExpenseStore((state) => state.error);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("expenses");
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(groupId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (groupId) {
            fetchData(groupId);
        }
    }, [groupId, fetchData]);

    // Lưu nhóm vào lịch sử sau khi load thành công
    useEffect(() => {
        if (group) {
            addToRecent({ id: group.id, name: group.name });
        }
    }, [group]);

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

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
                <div className="font-black text-2xl uppercase tracking-widest animate-pulse border-4 border-slate-900 p-8 shadow-[8px_8px_0_0_rgba(15,23,42,1)] bg-white">
                    Đang tải...
                </div>
            </main>
        );
    }

    if (error || !group) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 flex-col gap-6 p-8">
                <div className="font-black text-xl uppercase tracking-widest border-4 border-red-600 p-8 shadow-[8px_8px_0_0_rgba(220,38,38,1)] bg-red-50 text-red-700 text-center">
                    Không tìm thấy nhóm này.<br />
                    <span className="text-sm font-bold normal-case tracking-normal mt-2 block text-red-500">
                        {error || "ID không hợp lệ hoặc nhóm đã bị xóa."}
                    </span>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 font-black uppercase tracking-widest border-2 border-slate-900 px-6 py-3 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all bg-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Về trang chủ
                </button>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-white text-slate-900 relative selection:bg-black selection:text-white">
            {/* Header */}
            <div className="w-full relative z-10 p-6 pb-4 border-b-4 border-slate-900 bg-white">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Tất cả nhóm
                </button>
                <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 flex items-center justify-center p-1 border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] shrink-0 w-12 h-12">
                            <Logo className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900 leading-none truncate max-w-[150px] sm:max-w-xs">{group.name}</h1>
                                <button
                                    onClick={handleCopyId}
                                    title="Copy ID nhóm"
                                    className={`shrink-0 flex items-center justify-center w-7 h-7 border-2 transition-all duration-150 ${copied
                                        ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-none translate-x-px translate-y-px"
                                        : "border-slate-900 bg-white text-slate-500 shadow-[2px_2px_0_0_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-px hover:translate-y-px hover:text-slate-900"
                                        }`}
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
                                {members.length} thành viên · {expenses.length} khoản chi
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push(`/group/${groupId}/history`)}
                        className="flex items-center justify-center w-10 h-10 border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] hover:translate-y-px hover:translate-x-px hover:shadow-none transition-all duration-150 shrink-0"
                        title="Lịch sử chốt sổ"
                    >
                        <History className="w-4 h-4" />
                    </button>
                </div>
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

            {/* FAB */}
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
