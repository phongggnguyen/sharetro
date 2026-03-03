import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

/**
 * Tạo URL ảnh QR Code chuyển khoản từ VietQR.io
 * Docs: https://www.vietqr.io/danh-sach-api/
 */
export function generateVietQRUrl(
    bankId: string,
    accountNo: string,
    amount: number,
    message: string,
    accountName: string
): string {
    const encodedMsg = encodeURIComponent(message);
    const encodedName = encodeURIComponent(accountName);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodedMsg}&accountName=${encodedName}`;
}
