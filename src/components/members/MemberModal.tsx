"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Member } from "@/types";

interface MemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    memberToEdit?: Member;
}

export default function MemberModal({ isOpen, onClose, memberToEdit }: MemberModalProps) {
    const addMember = useExpenseStore((state) => state.addMember);
    const updateMember = useExpenseStore((state) => state.updateMember);
    const groupId = useExpenseStore((state) => state.group?.id || "g-1");

    const [name, setName] = useState("");
    const [bankId, setBankId] = useState("");
    const [accountNo, setAccountNo] = useState("");

    useEffect(() => {
        if (memberToEdit) {
            setName(memberToEdit.name);
            setBankId(memberToEdit.bankId || "");
            setAccountNo(memberToEdit.accountNo || "");
        } else {
            setName("");
            setBankId("");
            setAccountNo("");
        }
    }, [memberToEdit, isOpen]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Vui lòng nhập tên thành viên.");
            return;
        }

        const memberData = {
            groupId,
            name: name.trim(),
            bankId: bankId.trim() || undefined,
            accountNo: accountNo.trim() || undefined,
        };

        if (memberToEdit) {
            updateMember(memberToEdit.id, memberData);
        } else {
            addMember(memberData);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all sm:items-center sm:justify-center">
            <div
                className="bg-background w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-10 fade-in duration-200 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {memberToEdit ? "Sửa Thành Viên" : "Thêm Thành Viên"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 bg-muted/50 hover:bg-muted">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-6 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Tên thành viên</label>
                        <Input
                            placeholder="VD: Nguyễn Văn A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Mã ngân hàng (Tùy chọn)</label>
                        <Input
                            placeholder="VD: VCB, MB, TCB..."
                            value={bankId}
                            onChange={(e) => setBankId(e.target.value)}
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Số tài khoản (Tùy chọn)</label>
                        <Input
                            placeholder="Nhập số tài khoản"
                            value={accountNo}
                            onChange={(e) => setAccountNo(e.target.value)}
                            className="h-12"
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-2 font-bold text-base h-14 rounded-xl shadow-lg shadow-primary/20">
                        {memberToEdit ? "Cập nhật" : "Lưu Thành Viên"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
