"use client";

import { useState } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import ExpenseList from "@/components/expenses/ExpenseList";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import SettlementView from "@/components/expenses/SettlementView";
import { Plus, ListOrdered, Calculator } from "lucide-react";

type Tab = "expenses" | "settlement";

export default function Home() {
    const group = useExpenseStore((state) => state.group);
    const members = useExpenseStore((state) => state.members);
    const expenses = useExpenseStore((state) => state.expenses);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("expenses");

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <main className="flex min-h-screen flex-col bg-muted/10 relative">
            {/* Header */}
            <div className="w-full bg-primary text-primary-foreground p-5 pb-0 rounded-b-3xl shadow-md">
                <h1 className="text-xl font-bold tracking-tight">{group?.name || "Nhóm trọ"}</h1>
                <p className="text-primary-foreground/70 text-xs mt-0.5">
                    {members.length} thành viên · {expenses.length} khoản chi
                </p>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                    {members.map(m => (
                        <span key={m.id} className="bg-background/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {m.name}
                        </span>
                    ))}
                </div>

                {/* Tab Bar */}
                <div className="flex mt-4 -mx-5">
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "expenses"
                                ? "border-primary-foreground text-primary-foreground"
                                : "border-transparent text-primary-foreground/50"
                            }`}
                    >
                        <ListOrdered className="w-4 h-4" />
                        Chi tiêu
                    </button>
                    <button
                        onClick={() => setActiveTab("settlement")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "settlement"
                                ? "border-primary-foreground text-primary-foreground"
                                : "border-transparent text-primary-foreground/50"
                            }`}
                    >
                        <Calculator className="w-4 h-4" />
                        Chốt sổ
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full px-4 pt-5 pb-28">
                {activeTab === "expenses" ? <ExpenseList /> : <SettlementView />}
            </div>

            {/* Modals */}
            <AddExpenseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* FAB - Chỉ hiện ở tab Chi tiêu */}
            {activeTab === "expenses" && (
                <div className="fixed bottom-6 w-full max-w-md px-6 flex justify-end pointer-events-none z-40">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg shadow-primary/30 pointer-events-auto hover:bg-primary/90 transition-transform active:scale-95"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            )}
        </main>
    );
}
