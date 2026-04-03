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
    const bankId = toMember?.bankId;
    const accountNo = toMember?.accountNo;
    const message = `${transaction.fromName} chuyen tien cho ${transaction.toName}`;

    const hasBankInfo = Boolean(bankId && accountNo);

    // Only generate url if we have bank info
    const qrUrl = hasBankInfo
        ? generateVietQRUrl(bankId!, accountNo!, transaction.amount, message, transaction.toName)
        : "";

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

                <div className="p-4 flex flex-col items-center gap-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Số tiền cần chuyển</p>
                        <p className="text-3xl font-black text-rose-600 tracking-tighter mt-1">
                            {formatCurrency(transaction.amount)}
                        </p>
                    </div>

                    {!hasBankInfo ? (
                        <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-8 w-full max-w-[280px] mx-auto flex flex-col items-center justify-center text-center gap-3">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                                <X className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="font-bold text-slate-700">Chưa có thông tin</p>
                            <p className="text-sm text-slate-500">
                                Người nhận chưa thiết lập Ngân hàng và Số tài khoản. Vui lòng cập nhật thông tin thành viên.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-muted/30 rounded-xl p-3 w-full max-w-[280px] mx-auto border-4 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
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

                            <div className="text-center text-sm text-slate-700 bg-emerald-50 border-2 border-emerald-600 rounded-lg p-3 w-full max-w-[280px]">
                                <p className="font-black text-emerald-900 uppercase">
                                    {toMember?.name}
                                </p>
                                <p className="font-bold text-emerald-700 mt-1">
                                    {bankId} - {accountNo}
                                </p>
                                <p className="mt-2 text-xs italic text-emerald-600 bg-emerald-100/50 p-2 rounded">
                                    Nội dung: {message}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
