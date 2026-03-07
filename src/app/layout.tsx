import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { PwaInstallBanner } from "@/components/PwaInstallBanner";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sharetien.vercel.app"),
    title: {
        default: "No Debt - Chia tiền trọ, nhóm dễ dàng",
        template: "%s | No Debt",
    },
    description: "Ứng dụng chia tiền phòng trọ, đi chơi nhóm công bằng, minh bạch và hoàn toàn miễn phí.",
    keywords: ["chia tiền", "tiền trọ", "split bill", "no debt", "chia tiền nhóm", "quản lý chi tiêu", "chia tiền đi chơi", "ứng dụng chia tiền"],
    authors: [{ name: "No Debt Team" }],
    creator: "No Debt",
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "/",
        siteName: "No Debt",
        title: "No Debt - Chia tiền trọ, nhóm dễ dàng",
        description: "Ứng dụng chia tiền phòng trọ, đi chơi nhóm công bằng, minh bạch và hoàn toàn miễn phí.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "No Debt - App chia tiền nhóm",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "No Debt - Chia tiền trọ, nhóm dễ dàng",
        description: "Ứng dụng chia tiền phòng trọ, đi chơi nhóm công bằng, minh bạch và hoàn toàn miễn phí.",
        images: ["/og-image.jpg"],
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "No Debt",
    },
    icons: {
        icon: "/icons/icon.svg",
        apple: "/icons/icon.svg",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0f172a",
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
                {/* PWA Support */}
                <PwaRegister />
                <PwaInstallBanner />
            </body>
        </html>
    );
}
