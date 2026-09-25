"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Plus, ArrowRight, Clock, Trash2, Home, Loader2, Link2 } from "lucide-react";
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
        const input = joinId.trim();
        if (!input) return;

        try {
            // Nếu người dùng dán toàn bộ URL (vd: https://sharetien.../group/e2d7e?admin=...)
            if (input.startsWith("http://") || input.startsWith("https://")) {
                const url = new URL(input);
                if (url.pathname.startsWith("/group/")) {
                    router.push(`${url.pathname}${url.search}`);
                    return;
                }
            }
            
            // Nếu người dùng dán đường dẫn tương đối
            if (input.startsWith("/group/")) {
                router.push(input);
                return;
            }
        } catch (error) {
            console.error("Lỗi parse URL:", error);
        }

        // Mặc định: Coi như người dùng dán ID (VD: e2d7e0fb...)
        router.push(`/group/${input}`);
    };

    const handleRemoveRecent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromRecent(id);
        setRecentGroups(getRecentGroups());
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#141f2e] text-slate-900 selection:bg-black selection:text-white overflow-hidden">
            {/* Hero Header */}
            <div className="relative w-full text-white px-6 pt-10 pb-12 overflow-hidden shrink-0">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[120%] bg-gradient-to-bl from-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="bg-white text-slate-900 rounded-[14px] overflow-hidden flex items-center justify-center w-12 h-12 shrink-0 p-2">
                            <Logo className="w-full h-full object-contain" />
                        </div>
                        <div className="h-6 w-[2px] bg-slate-600 rounded-full" />
                        <span className="font-bold text-white text-[13px] uppercase tracking-[0.2em]">No Debt</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="z-10">
                            <h1 className="text-[2.75rem] font-black uppercase tracking-tight leading-[1.05] text-white mb-3">
                                CHIA TIỀN<br />
                                <span className="text-slate-300">THẬT DỄ</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em]">
                                TẠO NHÓM · THÊM CHI PHÍ · CHỐT SỔ
                            </p>
                        </div>

                        {/* Illustration */}
                        <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center -mr-2 opacity-95">
                            {/* Sparks */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                                {/* Left sparks */}
                                <path d="M 10 58 L 2 61" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 16 45 L 8 39" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                                {/* Right sparks */}
                                <path d="M 85 45 L 92 38" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 88 55 L 96 53" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                                {/* Top left motion lines */}
                                <path d="M 38 32 Q 48 30 58 30" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
                                <path d="M 32 40 Q 32 30 42 26" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </svg>
                            
                            {/* Document Base */}
                            <div className="absolute right-7 top-6 w-14 h-[72px] rounded-[10px] border-[2.5px] border-[#64748b] bg-[#141f2e] flex flex-col p-2.5 gap-1.5 rotate-[-8deg]">
                                <div className="w-8 h-1 bg-[#64748b] rounded-full" />
                                <div className="w-5 h-1 bg-[#64748b] rounded-full" />
                                <div className="w-7 h-1 bg-[#64748b] rounded-full" />
                                <div className="mt-auto font-black text-[#64748b] text-xl leading-none mb-0.5">$</div>
                            </div>
                            
                            {/* Group Circle */}
                            <div className="absolute right-1 bottom-4 w-[46px] h-[46px] rounded-full border-[2.5px] border-[#64748b] bg-[#141f2e] flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] p-6 pt-8 flex flex-col gap-8 relative z-20">
                {/* Tạo nhóm mới */}
                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-800 mb-4 flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                        Tạo nhóm mới
                    </h2>
                    <form onSubmit={handleCreateGroup} className="flex flex-col gap-3">
                        {/* Input: Tên nhóm */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Home className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="VD: Trọ Quận 7, Du lịch Đà Lạt..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="h-14 w-full bg-white border-2 border-slate-900 pl-11 pr-4 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all rounded-none"
                                disabled={isCreating}
                            />
                        </div>
                        {/* Input: Tên người tạo */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                {/* Cat face icon */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Left ear */}
                                    <path d="M4 6 L4 2 L8 5" />
                                    {/* Right ear */}
                                    <path d="M20 6 L20 2 L16 5" />
                                    {/* Head circle */}
                                    <circle cx="12" cy="12" r="8" />
                                    {/* Left eye */}
                                    <circle cx="9.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
                                    {/* Right eye */}
                                    <circle cx="14.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
                                    {/* Nose */}
                                    <path d="M11.5 14 L12 13.5 L12.5 14" />
                                    {/* Mouth */}
                                    <path d="M11.5 14 Q12 15 12.5 14" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Tên của bạn (Người tạo nhóm)..."
                                value={creatorName}
                                onChange={(e) => setCreatorName(e.target.value)}
                                className="h-14 w-full bg-white border-2 border-slate-900 pl-11 pr-4 text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium shadow-[4px_4px_0_0_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all rounded-none"
                                disabled={isCreating}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isCreating || !groupName.trim()}
                            className="h-14 w-full bg-slate-900 text-white font-black uppercase tracking-widest text-sm border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,0.3)] hover:shadow-[6px_6px_0_0_rgba(15,23,42,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang tạo...</span>
                                </>
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

                {/* Vào nhóm bằng ID / Link */}
                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-800 mb-4 flex items-center gap-3">
                        <Link2 className="w-4 h-4 text-slate-700" />
                        Vào nhóm bằng ID / Link
                    </h2>
                    <form onSubmit={handleJoinGroup} className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Link2 className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Dán ID hoặc Link nhóm vào đây..."
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                                className="h-12 w-full bg-white border-2 border-slate-300 pl-10 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium shadow-[3px_3px_0_0_rgba(15,23,42,0.2)] focus:outline-none focus:border-slate-900 focus:shadow-[3px_3px_0_0_rgba(15,23,42,0.8)] transition-all rounded-none"
                            />
                        </div>
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
                {/* Footer */}
                <div className="pt-2 pb-2 border-t border-slate-100 mt-auto">
                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        No Debt · Swiss Minimalist Design
                    </p>
                </div>
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
