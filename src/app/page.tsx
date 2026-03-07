"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Plus, ArrowRight, Clock, Trash2 } from "lucide-react";
import { Logo } from "@/components/Logo";

const RECENT_KEY = "sharetien_recent_groups";

interface RecentGroup {
    id: string;
    name: string;
}

function getRecentGroups(): RecentGroup[] {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function removeFromRecent(id: string) {
    try {
        const existing = getRecentGroups();
        const updated = existing.filter((g) => g.id !== id);
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch { }
}

export default function HomePage() {
    const router = useRouter();
    const createGroup = useExpenseStore((state) => state.createGroup);

    const [groupName, setGroupName] = useState("");
    const [creatorName, setCreatorName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [recentGroups, setRecentGroups] = useState<RecentGroup[]>([]);
    const [joinId, setJoinId] = useState("");

    useEffect(() => {
        setRecentGroups(getRecentGroups());
    }, []);

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName.trim()) return;
        setIsCreating(true);
        const newGroup = await createGroup(groupName.trim(), creatorName.trim() || 'Admin');
        if (newGroup) {
            router.push(`/group/${newGroup.id}`);
        } else {
            alert("Tạo nhóm thất bại. Vui lòng kiểm tra kết nối Supabase.");
            setIsCreating(false);
        }
    };

    const handleJoinGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinId.trim()) return;
        router.push(`/group/${joinId.trim()}`);
    };

    const handleRemoveRecent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromRecent(id);
        setRecentGroups(getRecentGroups());
    };

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-black selection:text-white">
            {/* Hero Header */}
            <div className="w-full bg-slate-900 text-white p-8 pb-10 border-b-4 border-black">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white text-slate-900 overflow-hidden flex items-center justify-center p-1.5 border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] min-w-[3.5rem] min-h-[3.5rem] shrink-0 w-14 h-14">
                        <Logo className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-white/60 text-xs uppercase tracking-[0.3em]">No Debt</span>
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-white">
                    Chia tiền<br />
                    <span className="text-white/40">thật dễ.</span>
                </h1>
                <p className="mt-4 text-white/50 font-bold text-sm uppercase tracking-widest">
                    Tạo nhóm · Thêm chi phí · Chốt sổ
                </p>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-8">
                {/* Tạo nhóm mới */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-slate-900 inline-block" />
                        Tạo nhóm mới
                    </h2>
                    <form onSubmit={handleCreateGroup} className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="VD: Trọ Quận 7, Du lịch Đà Lạt..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="h-14 w-full bg-white border-2 border-slate-900 px-4 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all rounded-none"
                            disabled={isCreating}
                        />
                        <input
                            type="text"
                            placeholder="Tên của bạn (Người tạo nhóm)..."
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            className="h-14 w-full bg-white border-2 border-slate-900 px-4 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all rounded-none"
                            disabled={isCreating}
                        />
                        <button
                            type="submit"
                            disabled={isCreating || !groupName.trim()}
                            className="h-14 w-full bg-slate-900 text-white font-black uppercase tracking-widest text-sm border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,0.3)] hover:shadow-[6px_6px_0_0_rgba(15,23,42,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                        >
                            {isCreating ? (
                                <span className="animate-pulse">Đang tạo...</span>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Bắt đầu ngay
                                </>
                            )}
                        </button>
                    </form>
                </section>

                {/* Nhóm gần đây */}
                {recentGroups.length > 0 && (
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Nhóm gần đây
                        </h2>
                        <div className="flex flex-col gap-3">
                            {recentGroups.map((g) => (
                                <div
                                    key={g.id}
                                    onClick={() => router.push(`/group/${g.id}`)}
                                    className="bg-white border-2 border-slate-900 p-4 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(15,23,42,1)] transition-all cursor-pointer flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="bg-slate-900 text-white w-9 h-9 flex items-center justify-center font-black text-sm shrink-0 border-2 border-slate-900">
                                            {g.name[0].toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-black text-slate-900 uppercase tracking-tight truncate">{g.name}</p>
                                            <p className="text-xs text-slate-500 font-mono truncate">{g.id.slice(0, 12)}...</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={(e) => handleRemoveRecent(g.id, e)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <ArrowRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Vào nhóm bằng ID */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-slate-400 inline-block" />
                        Vào nhóm bằng ID
                    </h2>
                    <form onSubmit={handleJoinGroup} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Dán ID nhóm vào đây..."
                            value={joinId}
                            onChange={(e) => setJoinId(e.target.value)}
                            className="flex-1 h-12 bg-white border-2 border-slate-300 px-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium shadow-[3px_3px_0_0_rgba(15,23,42,0.2)] focus:outline-none focus:border-slate-900 focus:shadow-[3px_3px_0_0_rgba(15,23,42,0.8)] transition-all rounded-none"
                        />
                        <button
                            type="submit"
                            disabled={!joinId.trim()}
                            className="h-12 px-5 bg-white text-slate-900 font-black uppercase tracking-widest text-xs border-2 border-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] hover:bg-slate-900 hover:text-white active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ArrowRight className="w-4 h-4" />
                            Vào
                        </button>
                    </form>
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t-2 border-slate-100">
                <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                    No Debt · Swiss Minimalist Design
                </p>
            </div>

            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "No Debt",
                        "url": "https://nodebt.app",
                        "description": "Ứng dụng chia tiền phòng trọ, đi chơi nhóm công bằng, minh bạch và hoàn toàn miễn phí.",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "Any",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "VND"
                        }
                    })
                }}
            />
        </main>
    );
}
