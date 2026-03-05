"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, History as HistoryIcon, Calculator, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { NeoLoading } from "@/components/ui/NeoLoading";

interface SettlementRecord {
    id: string;
    group_id: string;
    period_date: string;
    period_name: string;
    from_member_id: string;
    from_member_name: string;
    to_member_id: string;
    to_member_name: string;
    amount: number;
    created_at: string;
}

export default function HistoryPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.id as string;
    const supabase = createClient();

    const [records, setRecords] = useState<SettlementRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data, error } = await supabase
                    .from('settlement_history')
                    .select('*')
                    .eq('group_id', groupId)
                    .order('period_date', { ascending: false });

                if (error) throw error;
                setRecords(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (groupId) fetchHistory();
    }, [groupId]);

    // Group by period_name (or fallback to period_date if period_name is somehow missing)
    const groupedRecords = records.reduce((acc, record) => {
        const key = record.period_name || (() => {
            const date = new Date(record.period_date);
            return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
        })();
        if (!acc[key]) acc[key] = [];
        acc[key].push(record);
        return acc;
    }, {} as Record<string, SettlementRecord[]>);

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-black selection:text-white">
            {/* Header */}
            <div className="w-full relative z-10 p-6 pb-6 border-b-4 border-slate-900 bg-white shadow-[0_4px_0_0_rgba(15,23,42,1)]">
                <button
                    onClick={() => router.push(`/group/${groupId}`)}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Quay lại nhóm
                </button>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-600 flex items-center justify-center p-2 border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] shrink-0 w-12 h-12">
                        <HistoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                            Lịch sử chốt sổ
                        </h1>
                        <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
                            Các kỳ đã thanh toán
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col gap-6">
                {isLoading ? (
                    <div className="py-12">
                        <NeoLoading text="MEOW MEOW MEOW..." />
                    </div>
                ) : error ? (
                    <div className="font-bold text-red-600 border-2 border-red-600 p-4 bg-red-50 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="uppercase tracking-widest text-xs mb-1">Lỗi tải dữ liệu</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                ) : Object.keys(groupedRecords).length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-300">
                        <Calculator className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">
                            Chưa có lịch sử chốt sổ
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedRecords).map(([periodName, periodRecords]) => (
                        <div key={periodName} className="flex flex-col gap-3">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <span className="w-4 h-1 bg-emerald-400 inline-block border border-slate-900"></span>
                                {periodName}
                            </h2>
                            <div className="bg-white border-2 border-slate-900 p-4 shadow-[4px_4px_0_0_rgba(15,23,42,1)] flex flex-col gap-3">
                                {periodRecords.map(record => (
                                    <div key={record.id} className="flex justify-between items-center py-2 border-b-2 border-dashed border-slate-200 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <span className="text-red-600 px-2 py-0.5 bg-red-50 border border-red-200">
                                                {record.from_member_name}
                                            </span>
                                            <ArrowRight className="w-3 h-3 text-slate-400" />
                                            <span className="text-emerald-600 px-2 py-0.5 bg-emerald-50 border border-emerald-200">
                                                {record.to_member_name}
                                            </span>
                                        </div>
                                        <span className="font-black text-slate-900">
                                            {record.amount.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
