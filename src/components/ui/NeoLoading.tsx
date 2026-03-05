import { Logo } from "@/components/Logo";

export function NeoLoading({ text = "Đang tải dữ liệu..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 gap-8">
            <div className="relative group">
                <div className="animate-bounce z-10 relative">
                    <div className="bg-white border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] w-24 h-24 p-2 flex items-center justify-center">
                        <Logo className="w-full h-full object-contain" />
                    </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-[100%] opacity-20 animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
            </div>

            <div className="font-black text-xl uppercase tracking-widest text-slate-900 animate-pulse text-center">
                {text}
            </div>
        </div>
    );
}
