"use client";

import { useState } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { calculateSettlements, MemberBalance, Transaction } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRModal from "@/components/expenses/QRModal";
import SettleModal from "@/components/expenses/SettleModal";
import { Member } from "@/types";
import { useEffect } from "react";

export default function SettlementView() {
    const members = useExpenseStore((state) => state.members);
    const expenses = useExpenseStore((state) => state.expenses);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminToken, setAdminToken] = useState("");

    const groupId = useExpenseStore((state) => state.group?.id);

    useEffect(() => {
        if (typeof window !== "undefined" && groupId) {
            try {
                const rawKeys = localStorage.getItem("sharetien_admin_keys");
                if (rawKeys) {
                    const keys = JSON.parse(rawKeys);
                    if (keys[groupId]) {
                        setIsAdmin(true);
                        setAdminToken(keys[groupId]);
                    }
                }
            } catch (e) { }
        }
    }, [groupId]);

    const { balances, transactions } = calculateSettlements(members, expenses);
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const fairShare = members.length > 0 ? Math.round(totalAmount / members.length) : 0;

    const getMember = (id: string): Member | undefined =>
        members.find((m) => m.id === id);

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Chốt sổ Header */}
            {isAdmin && expenses.length > 0 && (
                <div className="bg-emerald-50 border-4 border-emerald-600 p-6 shadow-[8px_8px_0_0_rgba(5,150,105,1)] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-black text-xl text-emerald-900 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <span className="w-3 h-3 bg-emerald-900" />
                            Sẵn sàng chốt sổ
                        </h3>
                        <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Bạn là quản trị viên của nhóm này.</p>
                    </div>
                    <Button
                        onClick={() => setIsSettleModalOpen(true)}
                        className="rounded-none h-14 px-8 text-base font-black uppercase tracking-widest border-2 border-emerald-900 shadow-[4px_4px_0_0_rgba(6,78,59,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all bg-emerald-500 hover:bg-emerald-400 text-emerald-950"
                    >
                        Chốt sổ ngay
                    </Button>
                </div>
            )}

            {/* Tổng quát */}
            <div className="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] relative">
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                    <span className="w-3 h-3 bg-slate-900" />
                    Tổng quát
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-100 border-2 border-slate-900 p-4 shadow-[4px_4px_0_0_rgba(15,23,42,0.2)]">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tổng chi tiêu</p>
                        <p className="font-black text-2xl text-slate-900">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="bg-slate-100 border-2 border-slate-900 p-4 shadow-[4px_4px_0_0_rgba(15,23,42,0.2)]">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mỗi người chịu</p>
                        <p className="font-black text-2xl text-slate-900">{formatCurrency(fairShare)}</p>
                    </div>
                </div>
            </div>

            {/* Bảng Balance */}
            <div className="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] relative">
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                    <span className="w-3 h-3 bg-slate-900" />
                    Số dư từng người
                </h3>
                <div className="flex flex-col gap-2">
                    {balances.map((b: MemberBalance) => (
                        <div
                            key={b.memberId}
                            className="flex items-center justify-between py-3 border-b-2 border-slate-100 last:border-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center font-black text-white text-lg border-2 border-slate-900">
                                    {b.name[0]}
                                </div>
                                <span className="font-bold text-slate-900 text-lg uppercase">{b.name}</span>
                            </div>
                            <span
                                className={`font-black text-xl px-3 py-1 border-2 border-slate-900 ${b.balance >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
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
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                    Kế hoạch thanh toán
                </h3>
                {transactions.length === 0 ? (
                    <div className="bg-green-50 border-4 border-green-600 p-8 flex flex-col items-center gap-3 text-center text-green-800 shadow-[8px_8px_0_0_rgba(22,163,74,1)]">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                        <p className="font-black text-xl uppercase tracking-wider">Mọi người đã hoà nhau!</p>
                        <p className="text-sm font-bold uppercase tracking-widest text-green-700">Không cần chuyển khoản thêm.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {transactions.map((tx: Transaction, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_rgba(15,23,42,1)] transition-all"
                            >
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 bg-red-100 border-2 border-red-600 flex items-center justify-center font-black text-red-600 text-lg shrink-0">
                                            {tx.fromName[0]}
                                        </div>
                                        <span className="font-bold text-slate-900 text-lg uppercase truncate">{tx.fromName}</span>
                                    </div>
                                    <div className="bg-slate-100 p-2 border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
                                        <ArrowRight className="w-5 h-5 text-slate-900 shrink-0" />
                                    </div>
                                    <div className="flex items-center gap-3 flex-1 justify-end">
                                        <span className="font-bold text-slate-900 text-lg uppercase truncate text-right">{tx.toName}</span>
                                        <div className="w-10 h-10 bg-green-100 border-2 border-green-600 flex items-center justify-center font-black text-green-600 text-lg shrink-0">
                                            {tx.toName[0]}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-slate-50 p-4 border-2 border-slate-900">
                                    <span className="text-2xl font-black text-red-600 tracking-tighter">
                                        {formatCurrency(tx.amount)}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => setSelectedTx(tx)}
                                        className="gap-2 rounded-none h-12 px-6 text-sm font-black uppercase tracking-widest bg-blue-600 hover:bg-slate-900 text-white border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                                    >
                                        <QrCode className="w-5 h-5" />
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

            {/* Settle Modal */}
            <SettleModal
                isOpen={isSettleModalOpen}
                onClose={() => setIsSettleModalOpen(false)}
                isAdmin={isAdmin}
                adminToken={adminToken}
            />
        </div>
    );
}
