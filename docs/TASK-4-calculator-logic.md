# Bước 4: Logic Tính Toán Cấn Trừ Nợ (Debt Simplification)

## Mục tiêu
Xây dựng engine cốt lõi của ứng dụng (Thuật toán Greedy Algorithm) để tính toán "Ai nợ ai bao nhiêu tiền", dựa vào tất cả các khoản chi tiêu có trong cơ sở dữ liệu/state. Ưu tiên tối giản số lần chuyển khoản giữa các thành viên.

## Phân công
- **Agent**: `backend-specialist`
- **Skill**: `clean-code`, `testing-patterns`

## Đầu vào (INPUT)
- Danh sách `Expense` (các khoản chi, ai trả, số tiền bao nhiêu).
- Danh sách `Member` (A, B, C...).
- Quy tắc: Các khoản chi mặc định chia đều (`Split equally`) nếu không chỉ định rõ ràng.

## Công việc cụ thể
1. **Xác định Balance của từng người:**
   - Dệt qua mảng Expenses.
   - Tính tổng số tiền đã chi trả (Total Paid) `payerId`.
   - Tính tổng số tiền cần gánh (Total Owed) dự trên việc chia đều các `amount` cho số lượng Members.
   - `Balance = Paid - Owed`. (Ai > 0 là chủ nợ(Creditor), < 0 là con nợ(Debtor)).
2. **Greedy Algorithm (Tối giản nợ):**
   - Viết hàm `simplifyDebts(balances): Transaction[]` bên trong file `lib/calculator.ts`.
   - Vòng lặp: Lấy người nợ nhiều nhất (Min Balance) trả cho người cho vay nhiều nhất (Max Balance).
   - Tiếp tục đến khi không còn ai có Balance != 0.
   - Return một mảng các object: `{ from: string, to: string, amount: number }`.
3. **Unit Test thủ công (Manual Logging):**
   - Import dữ liệu Mock từ file `prompt.md` (A trả 35k, B trả 10k, C trả 186k. Tiền phòng 3252k chưa ai trả -> Balance = ...).
   - Đảm bảo đầu ra khớp với kế hoạch: A chuyển 1126k, B chuyển 1151k, C chuyển 975k.

## Đầu ra (OUTPUT)
- File logic toán học thuần tuý `lib/calculator.ts` không phụ thuộc React hay UI.
- Một test file (nếu rảnh) hoặc log console chứng minh kết quả chính xác 100%.

## Tiêu chí nghiệm thu (VERIFY)
- [ ] Chạy hàm `calculateSettlements(members, expenses)` với data mock trả về mảng khớp số liệu test case.
- [ ] Xử lý được các trường hợp "chia lẻ số thập phân" bằng Math.round để tránh lỗi dấu float (x.99999).
