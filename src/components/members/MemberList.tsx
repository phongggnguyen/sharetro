"use client";

import { useExpenseStore } from "@/store/useExpenseStore";
import { Member } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { User, Pencil, Trash2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberListProps {
    onEdit: (member: Member) => void;
}

export default function MemberList({ onEdit }: MemberListProps) {
    const members = useExpenseStore((state) => state.members);
    const deleteMember = useExpenseStore((state) => state.deleteMember);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}" không?`)) {
            const result = await deleteMember(id);
            if (!result.success) {
                alert(result.message);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl font-black px-1 uppercase tracking-tight text-slate-900 border-b-2 border-slate-900 pb-2">Danh sách thành viên</h2>
            {members.length === 0 ? (
                <p className="text-center font-bold text-slate-500 p-8 bg-slate-100 border-2 border-dashed border-slate-300">
                    Chưa có thành viên nào
                </p>
            ) : (
                members.map((member) => (
                    <Card key={member.id} className="overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] rounded-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)] transition-all bg-white">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-900 p-3 text-white shadow-[2px_2px_0_0_rgba(15,23,42,0.3)]">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="font-black text-xl tracking-tight text-slate-900 uppercase">
                                        {member.name}
                                    </h3>
                                    {(member.bankId || member.accountNo) && (
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 font-bold tracking-wider">
                                            <Landmark className="w-3.5 h-3.5 text-slate-900" />
                                            <span>
                                                {member.bankId}{member.bankId && member.accountNo ? " - " : ""}{member.accountNo}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white rounded-none transition-colors"
                                    onClick={() => onEdit(member)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-slate-900 border-2 border-slate-900 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-none transition-colors"
                                    onClick={() => handleDelete(member.id, member.name)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
