"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useRouter } from "next/navigation";

interface SettleModalProps {
    isOpen: boolean;
    onClose: () => void;
    isAdmin: boolean;
    adminToken: string;
}

export default function SettleModal({ isOpen, onClose, isAdmin, adminToken }: SettleModalProps) {
    const groupId = useExpenseStore((state) => state.group?.id);
    const fetchData = useExpenseStore((state) => state.fetchData);
    const router = useRouter();

    const [periodName, setPeriodName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setPeriodName("");
            setIsSubmitting(false);
        }
    }, [isOpen]);

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

    if (!isOpen || !isAdmin) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!periodName.trim() || !groupId) {
            alert("Vui lòng nhập Tên kỳ chốt sổ.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/settle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    groupId,
                    periodName: periodName.trim(),
                    adminToken
                })
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.error || "Rất tiếc! Đã xảy ra lỗi khi chốt sổ.");
                setIsSubmitting(false);
                return;
            }

            // Chốt sổ thành công
            alert(data.message || "Chốt sổ thành công!");

            // Reload lại data của nhóm
            await fetchData(groupId);
            router.refresh();
            onClose();

        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối. Vui lòng thử lại sau.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/80 transition-all sm:items-center sm:justify-center p-4">
            <div
                className="bg-white border-4 border-slate-900 w-full sm:max-w-md shadow-[12px_12px_0_0_rgba(15,23,42,1)] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-6 border-b-4 border-slate-900 bg-emerald-400">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <Calculator className="w-6 h-6 border-2 border-slate-900 bg-white shadow-[2px_2px_0_0_rgba(15,23,42,1)] p-0.5" />
                        Chốt sổ kỳ này
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting} className="rounded-none h-10 w-10 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 border-2 border-slate-900 text-slate-900 transition-colors">
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto bg-slate-50">
                    <div className="bg-amber-100 border-2 border-amber-500 p-4 text-amber-900 font-bold text-sm shadow-[4px_4px_0_0_rgba(245,158,11,1)]">
                        Lưu ý: Hành động này sẽ tính toán công nợ hiện tại, lưu vào lịch sử giao dịch và XÓA toàn bộ chi tiêu của nhóm để bắt đầu chu kỳ mới (bắt đầu lại từ 0).
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-900">Tên kỳ chốt sổ</label>
                        <Input
                            placeholder="VD: Tháng 3/2026, Đi Đà Lạt..."
                            value={periodName}
                            onChange={(e) => setPeriodName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="h-14 bg-white border-2 border-slate-900 rounded-none shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium uppercase"
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} size="lg" className="w-full mt-4 font-black uppercase tracking-widest text-lg h-16 rounded-none shadow-[6px_6px_0_0_rgba(15,23,42,1)] hover:shadow-[8px_8px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 border-2 border-slate-900 active:translate-y-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận chốt sổ"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
