import { Expense, Member } from "@/types";

export interface Transaction {
    from: string; // memberId của người cần trả
    fromName: string;
    to: string; // memberId của người cần nhận
    toName: string;
    amount: number;
}

export interface MemberBalance {
    memberId: string;
    name: string;
    totalPaid: number;
    totalOwed: number;
    balance: number; // Dương = chủ nợ, Âm = con nợ
}

/**
 * Bước 1: Tính Balance (Số dư) của từng thành viên
 * Balance = Tổng đã trả - Tổng phải gánh (chia đều)
 */
export function calculateBalances(
    members: Member[],
    expenses: Expense[]
): MemberBalance[] {
    const balanceMap = new Map<string, MemberBalance>();

    // Khởi tạo balance cho từng member
    for (const member of members) {
        balanceMap.set(member.id, {
            memberId: member.id,
            name: member.name,
            totalPaid: 0,
            totalOwed: 0,
            balance: 0,
        });
    }

    // Tính toán từng khoản chi
    for (const expense of expenses) {
        const splitAmount = Math.round(expense.amount / members.length);
        const remainder = expense.amount - splitAmount * members.length;

        // Tính phần mỗi người phải gánh (chia đều)
        members.forEach((member, index) => {
            const mb = balanceMap.get(member.id)!;
            // Người đầu tiên gánh phần dư (nếu có)
            mb.totalOwed += index === 0 ? splitAmount + remainder : splitAmount;
        });

        // Cộng tiền cho người đã trả
        if (expense.payerId) {
            const payer = balanceMap.get(expense.payerId);
            if (payer) {
                payer.totalPaid += expense.amount;
            }
        }
    }

    // Tính Balance cuối cùng
    for (const [, mb] of balanceMap) {
        mb.balance = mb.totalPaid - mb.totalOwed;
    }

    const result = Array.from(balanceMap.values());

    // Debug logging (in ra console để dễ kiểm tra)
    console.log("=== BALANCE CALCULATION ===");
    result.forEach((mb) => {
        console.log(
            `${mb.name}: Đã trả ${mb.totalPaid.toLocaleString("vi-VN")}đ | Phải gánh ${mb.totalOwed.toLocaleString("vi-VN")}đ | Balance ${mb.balance.toLocaleString("vi-VN")}đ`
        );
    });

    return result;
}

/**
 * Bước 2: Greedy Algorithm - Tối giản số giao dịch cấn trừ nợ
 * Người nợ nhiều nhất (min balance) → trả cho người cho vay nhiều nhất (max balance)
 */
export function simplifyDebts(balances: MemberBalance[]): Transaction[] {
    const transactions: Transaction[] = [];

    // Clone và lọc ra những người có balance != 0
    const debtors = balances
        .filter((b) => b.balance < -0.5)
        .map((b) => ({ ...b }))
        .sort((a, b) => a.balance - b.balance); // Từ nợ nhiều nhất → ít nhất

    const creditors = balances
        .filter((b) => b.balance > 0.5)
        .map((b) => ({ ...b }))
        .sort((a, b) => b.balance - a.balance); // Từ cho vay nhiều nhất → ít nhất

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
        const roundedAmount = Math.round(amount);

        if (roundedAmount > 0) {
            transactions.push({
                from: debtor.memberId,
                fromName: debtor.name,
                to: creditor.memberId,
                toName: creditor.name,
                amount: roundedAmount,
            });
        }

        debtor.balance += amount;
        creditor.balance -= amount;

        if (Math.abs(debtor.balance) < 0.5) i++;
        if (Math.abs(creditor.balance) < 0.5) j++;
    }

    console.log("=== SETTLEMENT PLAN ===");
    transactions.forEach((t) => {
        console.log(
            `${t.fromName} → ${t.toName}: ${t.amount.toLocaleString("vi-VN")}đ`
        );
    });

    return transactions;
}

/**
 * Hàm chính: Nhận vào members + expenses, trả về kế hoạch thanh toán
 */
export function calculateSettlements(
    members: Member[],
    expenses: Expense[]
): { balances: MemberBalance[]; transactions: Transaction[] } {
    if (members.length === 0 || expenses.length === 0) {
        return { balances: [], transactions: [] };
    }

    const balances = calculateBalances(members, expenses);
    const transactions = simplifyDebts(balances);

    return { balances, transactions };
}
