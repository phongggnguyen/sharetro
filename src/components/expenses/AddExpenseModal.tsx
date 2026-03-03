"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenseStore } from "@/store/useExpenseStore";

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
    const members = useExpenseStore((state) => state.members);
    const addExpense = useExpenseStore((state) => state.addExpense);
    const groupId = useExpenseStore((state) => state.group?.id || "g-1");

    const [title, setTitle] = useState("");
    const [amountStr, setAmountStr] = useState("");
    const [payerId, setPayerId] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "");
        if (!val) {
            setAmountStr("");
            return;
        }
        const formatted = new Intl.NumberFormat("vi-VN").format(parseInt(val, 10));
        setAmountStr(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(amountStr.replace(/\D/g, ""), 10);
        if (!title.trim() || isNaN(amount) || amount <= 0) {
            alert("Vui lòng nhập đầy đủ Tên khoản chi và Số tiền hợp lệ.");
            return;
        }

        addExpense({
            groupId,
            title: title.trim(),
            amount,
            payerId: payerId === "" ? null : payerId,
        });

        setTitle("");
        setAmountStr("");
        setPayerId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all sm:items-center sm:justify-center">
            <div
                className="bg-background w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-10 fade-in duration-200 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Thêm Khoản Chi</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 bg-muted/50 hover:bg-muted">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-6 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Tên khoản chi</label>
                        <Input
                            placeholder="VD: Mua gạo, tiền nước..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Số tiền (VNĐ)</label>
                        <Input
                            inputMode="numeric"
                            placeholder="0"
                            value={amountStr}
                            onChange={handleAmountChange}
                            required
                            className="h-12 text-lg font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Người trả tiền</label>
                        <select
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                        >
                            <option value="">Nợ chung (Chưa ai trả)</option>
                            {members.map(m => (
                                <option key={m.id} value={m.id}>{m.name} đã đi chợ/trả tiền</option>
                            ))}
                        </select>
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-2 font-bold text-base h-14 rounded-xl shadow-lg shadow-primary/20">
                        Thêm Ngay
                    </Button>
                </form>
            </div>
        </div>
    );
}
