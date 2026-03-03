"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { generateVietQRUrl, formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/calculator";
import { Member } from "@/types";

interface QRModalProps {
    transaction: Transaction;
    toMember: Member | undefined;
    onClose: () => void;
}

export default function QRModal({ transaction, toMember, onClose }: QRModalProps) {
    const bankId = toMember?.bankId || "VCB";
    const accountNo = toMember?.accountNo || "1234567890";
    const message = `${transaction.fromName} chuyen tien cho ${transaction.toName}`;

    const qrUrl = generateVietQRUrl(
        bankId,
        accountNo,
        transaction.amount,
        message,
        transaction.toName
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-background w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="font-bold text-base">Mã QR Chuyển khoản</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {transaction.fromName} → {transaction.toName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-muted/70 hover:bg-muted rounded-full p-2 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 flex flex-col items-center gap-3">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Số tiền cần chuyển</p>
                        <p className="text-2xl font-black text-destructive">
                            {formatCurrency(transaction.amount)}
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-3 w-full max-w-[280px] mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={qrUrl}
                            alt={`QR Code chuyển ${formatCurrency(transaction.amount)} cho ${transaction.toName}`}
                            className="w-full rounded-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove("hidden");
                            }}
                        />
                        <div className="hidden text-center py-8 text-sm text-muted-foreground">
                            <p>Không tải được QR</p>
                            <p className="text-xs mt-1">Kiểm tra lại thông tin ngân hàng</p>
                        </div>
                    </div>

                    <div className="text-center text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 w-full">
                        <p className="font-medium">{toMember?.name} | {bankId} - {accountNo}</p>
                        <p className="mt-0.5 italic">Nội dung: {message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
