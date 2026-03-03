# Kế hoạch phát triển: Ứng dụng Chia tiền trọ (Expense Splitter App)

## 1. Overview
Web Application (áp dụng tiêu chuẩn Mobile-first design) giúp các nhóm bạn ở chung phòng trọ ghi chép lại các khoản chi tiêu và tự động tính toán, cấn trừ nợ cuối tháng một cách công bằng. 
Mục tiêu cốt lõi là tạo ra bảng tóm tắt "Settlement" (Ai cần chuyển cho ai bao nhiêu tiền) một cách tối ưu nhất thông qua thuật toán Debt Simplification.

## 2. Project Type
**WEB** (Nhưng tập trung mạnh vào Mobile UI/UX).

## 3. Success Criteria
- Ứng dụng hiển thị tốt trên Mobile (nút bấm dễ chạm, UI rõ ràng).
- Áp dụng thành công thuật toán Greedy để cấn trừ nợ, giảm thiểu tối đa số lượng giao dịch chuyển khoản.
- Pass bài test chuẩn: Phòng 3 người, chia tiền phòng (3252k) và các khoản lặt vặt, tính ra số tiền cần đóng chính xác cho từng người đến mức nghìn đồng.

## 4. Tech Stack
- **Frontend Framework:** Next.js (App Router) 
- **Styling:** Tailwind CSS + Shadcn UI.
- **State Management:** Zustand (phù hợp thay cho Context API vì ngắn gọn).
- **Database/Backend:** Mock Data / LocalStorage (cho phiên bản MVP).
- **Language:** TypeScript strict mode.

## 5. File Structure (Dự kiến Next.js)
```text
src/
├── app/
│   ├── page.tsx               # Màn hình chính (Dashboard / Settlement)
│   ├── expenses/              # Màn hình danh sách Expenses
│   └── add-expense/           # Màn hình thêm khoản chi
├── components/
│   ├── ui/                    # Shadcn UI (các thẻ, nút gốc)
│   ├── expenses/              # Components đặc thù: ExpenseList, SettlementCard
│   └── layout/                # Header, BottomNavigation (cho mobile)
├── lib/
│   ├── calculator.ts          # Chứa logic nội hàm Thuật toán cấn trừ nợ
│   └── utils.ts               # Các hàm utility (format tiền tệ, vietqr)
├── store/
│   └── useExpenseStore.ts     # Zustand chứa Mock Data & actions
└── types/
    └── index.ts               # Database Schema (Group, Member, Expense, ExpenseSplit)
```

## 6. Task Breakdown

### Bước 1: Setup Layout & Mock Data
- **Agent**: `frontend-specialist`
- **Skill**: `app-builder`, `frontend-design`
- **INPUT**: Không có (Khởi tạo project).
- **OUTPUT**: Project bộ khung Next.js, cài đặt Tailwind + Shadcn UI + Zustand. File `types/index.ts` và Mock data A, B, C. Layout chuẩn Mobile.
- **VERIFY**: Chạy được `npm run dev`, hiển thị UI khung trên mobile, Store lưu state hợp lệ.

### Bước 2: Trang danh sách Expense
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`, `clean-code`
- **INPUT**: Dữ liệu mẫu (Group, Members, Expenses) từ Zustand Store.
- **OUTPUT**: Màn hình Danh sách các khoản chi gồm Title, Amount, người đã trả (Payer).
- **VERIFY**: Hiển thị chính xác tổng số tiền của từng mục, định dạng VND rõ ràng.

### Bước 3: Form thêm khoản chi (Add Expense)
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`
- **INPUT**: Giao diện UI trắng.
- **OUTPUT**: UI Form cho phép nhập: Tên khoản chi, Số tiền, Người trả (Payer có thể ẩn/mặc định nợ chung), Split equally hoặc chia tuỳ chọn.
- **VERIFY**: Validation: Nếu có Split custom thì tổng các SplitAmount cộng lại phải bằng total amount. Cập nhật được vào trạng thái (Zustand).

### Bước 4: Logic Tính Toán (Debt Simplification)
- **Agent**: `backend-specialist` (Xử lý thuật toán/logic)
- **Skill**: `clean-code`, `testing-patterns`
- **INPUT**: Mảng Expense và Member.
- **OUTPUT**: File `lib/calculator.ts` chứa logic tính Balance cho từng cá nhân, phân loại Creditor/Debtor và vòng lặp cấn trừ (Greedy Algorithm). Trả về List các Transaction chuẩn: `{ from, to, amount }`.
- **VERIFY**: In ra terminal (hoặc console) step-by-step. Validate bằng tay hoặc qua Jest pass đúng 100% case đã nêu trong yêu cầu (A: 1126k, B: 1151k, C: 975k).

### Bước 5: Trang Chốt sổ (Settlement UI)
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`
- **INPUT**: Output mảng Transaction trả về từ toán tử `calculator.ts`.
- **OUTPUT**: Giao diện "Ai chuyển cho Ai". Có bao gồm nút hoặc link tạo QR code bằng VietQR tĩnh hoặc động.
- **VERIFY**: Nút bấm lớn trên Mobile dễ chạm, QR code sinh ra đúng các field: accountNo, bankId, amount và Nội dung chuyển (Mesage).

## 7. ✅ PHASE X: VERIFICATION (Checklist hoàn thành)
- [ ] Chạy lệnh `npm run lint && npx tsc --noEmit` thành công, Type-safe.
- [ ] Các Component hiển thị đạt chuẩn Touch target (dễ chạm bằng tay trên diện thoại).
- [ ] Logic tách rời rõ ràng: `calculator.ts` không phụ thuộc vào UI components.
- [ ] Chạy thuật toán test tay đúng 100% test case trong prompt (Tới phần nghìn VNĐ).
- [ ] Kiểm tra SEO / Web Vitals (nếu apply ra public).
