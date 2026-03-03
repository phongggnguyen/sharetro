import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "No Debt",
    description: "Ứng dụng chia tiền trọ công bằng, nhanh chóng",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={`${outfit.variable} antialiased font-sans min-h-screen bg-slate-50 text-slate-900 font-medium relative`}>
                {/* Main mobile constraint container */}
                <div className="max-w-md mx-auto min-h-screen relative bg-white border-x-2 border-slate-900 shadow-[8px_0_0_0_rgba(0,0,0,0.05)] sm:rounded-none">
                    {children}
                </div>
            </body>
        </html>
    );
}
