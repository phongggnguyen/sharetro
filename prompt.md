# YÊU CẦU HỆ THỐNG: ỨNG DỤNG CHIA TIỀN TRỌ (EXPENSE SPLITTER APP)

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
Xây dựng một Web Application (Mobile-first design) giúp các nhóm bạn ở chung phòng trọ ghi chép lại các khoản chi tiêu và tự động tính toán, cấn trừ nợ cuối tháng.
Mục tiêu cốt lõi: Trả lời câu hỏi "Cuối tháng, ai cần chuyển khoản cho ai và số tiền là bao nhiêu để mọi người chi trả công bằng?".

## 2. VÍ DỤ VỀ BUSINESS LOGIC (TEST CASE CHUẨN)
Hệ thống phải pass được bài toán thực tế sau:
- Phòng có 3 người: A, B, C.
- Tiền trọ tháng: 3252k (Chia đều 3 người). Chưa ai trả tiền này, đây là nợ chung.
- Tiền chi lặt vặt (A trả gạo 35k, B trả nước 10k, C trả đồ dùng 186k). Mặc định các khoản vặt này dùng chung nên chia đều 3 người.
- **Tính toán Fair Share (Mức chịu chung):** (3252 + 35 + 10 + 186) / 3 = 1161k/người.
- **Kết quả mong đợi (Settlement Plan):**
  + A nợ 1161k, đã trả 35k -> A cần đóng 1126k.
  + B nợ 1161k, đã trả 10k -> B cần đóng 1151k.
  + C nợ 1161k, đã trả 186k -> C cần đóng 975k.
  + Tổng quỹ thu được: 1126 + 1151 + 975 = 3252k (Vừa đủ tiền đóng tiền trọ cho chủ nhà).

## 3. TECH STACK (CÔNG NGHỆ SỬ DỤNG)
- **Frontend Framework:** Next.js (App Router) hoặc ReactJS (Vite).
- **Styling:** Tailwind CSS + Shadcn UI (cho UI Components).
- **State Management:** Zustand hoặc React Context API.
- **Database/Backend:** Supabase hoặc Firebase (hoặc Mock Data LocalStorage cho phiên bản MVP đầu tiên).

## 4. DATABASE SCHEMA (CẤU TRÚC DỮ LIỆU)
Viết code dựa trên cấu trúc Typescript Interface sau:

```typescript
// Bảng Nhóm
interface Group {
  id: string;
  name: string; // VD: "Trọ Quận 7"
  createdAt: string;
}

// Bảng Thành viên
interface Member {
  id: string;
  groupId: string;
  name: string; // VD: "A", "B", "C"
}

// Bảng Khoản chi
interface Expense {
  id: string;
  groupId: string;
  title: string; // VD: "Mua gạo", "Tiền trọ"
  amount: number; // Tổng tiền
  payerId: string | null; // ID người trả tiền (Nếu null, nghĩa là chưa ai trả - nợ chung như Tiền trọ)
  createdAt: string;
}

// Bảng Chi tiết chia tiền (Nối Expense và Member)
interface ExpenseSplit {
  expenseId: string;
  memberId: string;
  owedAmount: number; // Số tiền member này phải chịu trong khoản expense đó
}5. THUẬT TOÁN CẤN TRỪ NỢ (DEBT SIMPLIFICATION ALGORITHM)
Đây là thuật toán quan trọng nhất, AI cần viết một Utility function chạy qua các bước sau:
Tính Balance cho từng người: Balance = Total_Paid - Total_Owed.
Phân loại thành viên thành mảng Creditors (Balance > 0) và Debtors (Balance < 0).
Chạy vòng lặp (Greedy Algorithm) để người nợ lớn nhất trả cho người cần nhận lớn nhất, nhằm tối thiểu hoá số lượng giao dịch chuyển khoản.
Output trả về là một mảng: [{ from: "A", to: "C", amount: 1126 }, { from: "B", to: "C", amount: 1151 }]
6. PHẠM VI TÍNH NĂNG (MVP FEATURES TO BUILD)
AI hãy xây dựng theo trình tự từng bước dưới đây (chỉ làm bước tiếp theo khi tôi xác nhận bước trước đã xong):
Bước 1: Setup Layout & Mock Data: Tạo bộ khung UI Mobile-friendly và dữ liệu cứng (Mock data) của A, B, C và các khoản chi.
Bước 2: Trang danh sách Expense: Xây dựng danh sách hiển thị các khoản chi (Title, Amount, Payer).
Bước 3: Form thêm khoản chi (Add Expense): UI nhập số tiền, chọn ai đã trả (Payer), và chọn những ai sử dụng (Split equally or custom).
Bước 4: Logic Tính Toán: Viết file calculator.ts áp dụng Thuật toán mục 5 vào Mock Data.
Bước 5: Trang Chốt sổ (Settlement UI): Hiển thị màn hình báo cáo kết quả: Ai chuyển tiền cho ai. Tích hợp link tạo mã QR động (ví dụ: dùng API vietqr.io).
7. QUY TẮC VIẾT CODE CHO AI (CODING CONVENTIONS)
Ưu tiên tính Modular: Tách riêng phần UI và phần Business Logic.
Giao diện thân thiện với máy tính và điện thoại di động (Mobile-first), các nút bấm phải lớn, dễ chạm.
Sử dụng TypeScript strict mode. Xử lý lỗi cẩn thận (VD: Tổng tiền chia ra phải bằng tổng amount của Expense).
Luôn in ra console hoặc giao diện từng bước tính toán (Balance arrays) để dễ debug