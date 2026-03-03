"use client";

import { useExpenseStore } from "@/store/useExpenseStore";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ExpenseList() {
    const expenses = useExpenseStore((state) => state.expenses);
    const members = useExpenseStore((state) => state.members);

    const getPayerName = (payerId: string | null) => {
        if (!payerId) return "Nợ chung";
        const member = members.find((m) => m.id === payerId);
        return member ? member.name : "Không rõ";
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
        <div className="flex flex-col gap-3 w-full">
            <h2 className="text-xl font-bold mb-2 px-1">Danh sách khoản chi</h2>
            {expenses.length === 0 ? (
                <p className="text-center text-muted-foreground p-8 bg-muted/20 rounded-xl border border-dashed">
                    Chưa có khoản chi nào
                </p>
            ) : (
                expenses.map((expense) => (
                    <Card key={expense.id} className="overflow-hidden border-border transition-all active:scale-[0.98]">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2.5 rounded-full text-primary mt-0.5">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base leading-tight">
                                        {expense.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                                        <User className="w-3.5 h-3.5" />
                                        <span>Chi bởi: {getPayerName(expense.payerId)}</span>
                                        <span className="opacity-50">•</span>
                                        <span>{formatDate(expense.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="font-bold text-base whitespace-nowrap text-right">
                                {formatCurrency(expense.amount)}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
