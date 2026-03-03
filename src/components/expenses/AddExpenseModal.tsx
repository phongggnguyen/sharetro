"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense } from "@/types";

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseToEdit?: Expense;
}

export default function AddExpenseModal({ isOpen, onClose, expenseToEdit }: AddExpenseModalProps) {
    const members = useExpenseStore((state) => state.members);
    const addExpense = useExpenseStore((state) => state.addExpense);
    const updateExpense = useExpenseStore((state) => state.updateExpense);
    const groupId = useExpenseStore((state) => state.group?.id || "g-1");

    const [title, setTitle] = useState("");
    const [amountStr, setAmountStr] = useState("");
    const [payerId, setPayerId] = useState<string>("");

    useEffect(() => {
        if (expenseToEdit) {
            setTitle(expenseToEdit.title);
            setAmountStr(new Intl.NumberFormat("vi-VN").format(expenseToEdit.amount));
            setPayerId(expenseToEdit.payerId || "");
        } else {
            setTitle("");
            setAmountStr("");
            setPayerId("");
        }
    }, [expenseToEdit, isOpen]);

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

        if (expenseToEdit) {
            updateExpense(expenseToEdit.id, {
                title: title.trim(),
                amount,
                payerId: payerId === "" ? null : payerId,
            });
        } else {
            addExpense({
                groupId,
                title: title.trim(),
                amount,
                payerId: payerId === "" ? null : payerId,
            });
        }

        setTitle("");
        setAmountStr("");
        setPayerId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/80 transition-all sm:items-center sm:justify-center p-4">
            <div
                className="bg-white border-4 border-slate-900 w-full sm:max-w-md shadow-[12px_12px_0_0_rgba(15,23,42,1)] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-6 border-b-4 border-slate-900 bg-white">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {expenseToEdit ? "Sửa Khoản Chi" : "Thêm Khoản Chi"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none h-10 w-10 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 border-2 border-slate-900 text-slate-900 transition-colors">
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto bg-slate-50">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-900">Tên khoản chi</label>
                        <Input
                            placeholder="VD: Mua gạo, tiền nước..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="h-14 bg-white border-2 border-slate-900 rounded-none shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-900">Số tiền (VNĐ)</label>
                        <Input
                            inputMode="numeric"
                            placeholder="0"
                            value={amountStr}
                            onChange={handleAmountChange}
                            required
                            className="h-16 text-2xl font-black text-blue-600 bg-white border-2 border-slate-900 rounded-none shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all placeholder:text-slate-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-900">Người trả tiền</label>
                        <div className="relative">
                            <select
                                className="flex h-14 w-full rounded-none border-2 border-slate-900 bg-white px-4 py-2 text-base font-bold text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus-visible:outline-none focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all appearance-none uppercase"
                                value={payerId}
                                onChange={(e) => setPayerId(e.target.value)}
                            >
                                <option value="" className="font-bold text-slate-900">Chưa ai trả (Nợ chung)</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id} className="font-bold text-slate-900">{m.name} đã đi chợ/trả tiền</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-900">
                                <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-4 font-black uppercase tracking-widest text-lg h-16 rounded-none shadow-[6px_6px_0_0_rgba(15,23,42,1)] hover:shadow-[8px_8px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 border-2 border-slate-900 active:translate-y-1 bg-blue-600 hover:bg-blue-500 text-white transition-all">
                        {expenseToEdit ? "Cập Nhật Khoản Chi" : "Thêm Ngay Khoản Chi"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
