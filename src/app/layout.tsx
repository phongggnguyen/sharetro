import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Expense Splitter",
    description: "Ứng dụng chia tiền trọ công bằng và tối ưu",
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
            <body className="antialiased font-sans min-h-screen">
                <div className="max-w-md mx-auto bg-background min-h-screen shadow-md relative">
                    {children}
                </div>
            </body>
        </html>
    );
}
