export interface Group {
    id: string;
    name: string;
    createdAt: string;
}

export interface Member {
    id: string;
    groupId: string;
    name: string;
    bankId?: string;    // VD: "VCB", "MBB", "TCB"
    accountNo?: string; // Số tài khoản ngân hàng (mock)
}


export interface Expense {
    id: string;
    groupId: string;
    title: string;
    amount: number;
    payerId: string | null; // null = Nợ chung (chưa ai trả)
    createdAt: string;
}

export interface ExpenseSplit {
    expenseId: string;
    memberId: string;
    owedAmount: number;
}
