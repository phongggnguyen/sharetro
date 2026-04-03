export interface Bank {
    id: string; // The ID used for VietQR API (often acronym)
    name: string; // Full or display name
}

export const VIETQR_BANKS: Bank[] = [
    { id: "VCB", name: "Vietcombank (VCB)" },
    { id: "MB", name: "MBBank (MB)" },
    { id: "TCB", name: "Techcombank (TCB)" },
    { id: "CTG", name: "VietinBank (CTG)" },
    { id: "BIDV", name: "BIDV" },
    { id: "AGRIBANK", name: "Agribank" },
    { id: "ACB", name: "ACB" },
    { id: "VPB", name: "VPBank (VPB)" },
    { id: "TPB", name: "TPBank (TPB)" },
    { id: "STB", name: "Sacombank (STB)" },
    { id: "HDB", name: "HDBank (HDB)" },
    { id: "VIB", name: "VIB" },
    { id: "SHB", name: "SHB" },
    { id: "EIB", name: "Eximbank (EIB)" },
    { id: "MSB", name: "MSB" },
    { id: "SCB", name: "SCB" },
    { id: "OJB", name: "Oceanbank (OJB)" },
    { id: "LPB", name: "LPBank (LPB)" },
    { id: "SEAB", name: "SeABank (SEAB)" },
    { id: "OCB", name: "OCB" },
    { id: "KLB", name: "Kienlongbank (KLB)" },
    { id: "NAB", name: "NamABank (NAB)" },
    { id: "VAB", name: "VietABank (VAB)" },
    { id: "BVB", name: "BaoVietBank (BVB)" },
    { id: "PGB", name: "PGBank (PGB)" },
    { id: "VRB", name: "VRB" },
    { id: "WVN", name: "Woori Bank" },
    { id: "SHINHAN", name: "Shinhan Bank" },
];
