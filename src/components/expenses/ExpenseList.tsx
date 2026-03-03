"use client";

import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, User, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ExpenseListProps {
    onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ onEdit }: ExpenseListProps) {
    const expenses = useExpenseStore((state) => state.expenses);
    const members = useExpenseStore((state) => state.members);
    const deleteExpense = useExpenseStore((state) => state.deleteExpense);

    const getPayerName = (payerId: string | null) => {
        if (!payerId) return "Nợ chung";
        const member = members.find((m) => m.id === payerId);
        return member ? member.name : "Không rõ";
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa khoản chi "${title}" không?`)) {
            deleteExpense(id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl font-black px-1 uppercase tracking-tight text-slate-900 border-b-2 border-slate-900 pb-2">Danh sách khoản chi</h2>
            {expenses.length === 0 ? (
                <p className="text-center font-bold text-slate-500 p-8 bg-slate-100 border-2 border-dashed border-slate-300">
                    Chưa có khoản chi nào
                </p>
            ) : (
                expenses.map((expense) => (
                    <Card key={expense.id} className="overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] rounded-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)] transition-all bg-white relative">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-600 p-3 text-white shadow-[2px_2px_0_0_rgba(15,23,42,1)] border-2 border-slate-900">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="font-black text-xl tracking-tight text-slate-900 uppercase">
                                        {expense.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 font-bold tracking-wider">
                                        <User className="w-3.5 h-3.5 text-slate-900" />
                                        <span>Chi bởi: <span className="text-blue-600">{getPayerName(expense.payerId)}</span></span>
                                        <span className="opacity-40">•</span>
                                        <span>{formatDate(expense.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 min-w-fit">
                                <div className="font-black text-xl whitespace-nowrap text-right text-slate-900">
                                    {formatCurrency(expense.amount)}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white rounded-none transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(expense);
                                        }}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-slate-900 border-2 border-slate-900 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-none transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(expense.id, expense.title);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
