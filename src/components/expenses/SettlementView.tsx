"use client";

import { useState } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { calculateSettlements, MemberBalance, Transaction } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRModal from "@/components/expenses/QRModal";
import { Member } from "@/types";

export default function SettlementView() {
    const members = useExpenseStore((state) => state.members);
    const expenses = useExpenseStore((state) => state.expenses);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    const { balances, transactions } = calculateSettlements(members, expenses);
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const fairShare = members.length > 0 ? Math.round(totalAmount / members.length) : 0;

    const getMember = (id: string): Member | undefined =>
        members.find((m) => m.id === id);

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Tổng quát */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Tổng quát
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                        <p className="font-black text-base mt-0.5">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground">Mỗi người chịu</p>
                        <p className="font-black text-base mt-0.5">{formatCurrency(fairShare)}</p>
                    </div>
                </div>
            </div>

            {/* Bảng Balance */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Số dư từng người
                </h3>
                <div className="flex flex-col gap-2">
                    {balances.map((b: MemberBalance) => (
                        <div
                            key={b.memberId}
                            className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                    {b.name[0]}
                                </div>
                                <span className="font-medium">{b.name}</span>
                            </div>
                            <span
                                className={`font-bold text-sm ${b.balance >= 0 ? "text-emerald-600" : "text-destructive"}`}
                            >
                                {b.balance >= 0 ? "+" : ""}
                                {formatCurrency(b.balance)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kế hoạch chuyển khoản */}
            <div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Kế hoạch thanh toán
                </h3>
                {transactions.length === 0 ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col items-center gap-2 text-center text-emerald-700">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        <p className="font-bold">Mọi người đã hoà nhau!</p>
                        <p className="text-sm text-emerald-600/80">Không cần chuyển khoản thêm.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {transactions.map((tx: Transaction, idx: number) => (
                            <div
                                key={idx}
                                className="bg-card border border-border rounded-2xl p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center font-bold text-destructive text-sm">
                                            {tx.fromName[0]}
                                        </div>
                                        <span className="font-semibold">{tx.fromName}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <div className="flex items-center gap-2 flex-1 justify-end">
                                        <span className="font-semibold">{tx.toName}</span>
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm">
                                            {tx.toName[0]}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-black text-destructive">
                                        {formatCurrency(tx.amount)}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => setSelectedTx(tx)}
                                        className="gap-1.5 rounded-full h-8 text-xs"
                                    >
                                        <QrCode className="w-3.5 h-3.5" />
                                        Quét QR
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Modal */}
            {selectedTx && (
                <QRModal
                    transaction={selectedTx}
                    toMember={getMember(selectedTx.to)}
                    onClose={() => setSelectedTx(null)}
                />
            )}
        </div>
    );
}
