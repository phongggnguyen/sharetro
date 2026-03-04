"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "pwa_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Nếu user đã dismiss trước đó thì không hiện nữa
        if (localStorage.getItem(DISMISS_KEY)) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setVisible(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, "1");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 text-white border-2 border-white shadow-[6px_6px_0_0_rgba(255,255,255,0.2)] p-4 flex items-center gap-3">
                {/* Icon */}
                <div className="bg-white text-slate-900 w-10 h-10 flex items-center justify-center shrink-0 border-2 border-slate-900">
                    <Download className="w-5 h-5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm uppercase tracking-tight">
                        Cài App
                    </p>
                    <p className="text-xs text-white/60 font-medium">
                        Thêm No Debt vào màn hình chính
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleInstall}
                        className="bg-white text-slate-900 font-black text-xs uppercase tracking-widest px-3 py-2 border-2 border-white hover:bg-slate-100 active:scale-95 transition-all"
                    >
                        Cài
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="text-white/50 hover:text-white p-1 transition-colors"
                        aria-label="Đóng"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
