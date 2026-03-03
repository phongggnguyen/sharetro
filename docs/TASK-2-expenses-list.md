# Bước 2: Trang danh sách Expense

## Mục tiêu
Xây dựng giao diện hiển thị danh sách các khoản chi tiêu (Expenses) đã được ghi nhận trong nhóm, lấy dữ liệu từ trạng thái tập trung (Zustand store).

## Phân công
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`, `clean-code`

## Đầu vào (INPUT)
- Project đã có sẵn cấu trúc Layout và Mock Data theo `TASK-1-setup.md`.
- File state `store/useExpenseStore.ts` chứa dữ liệu mẫu của các Expense (ví dụ: Tiền trọ, Mua gạo, Tiền nước).

## Công việc cụ thể
1. Đọc và lấy State danh sách `expenses` và `members` từ Zustand Store.
2. Xây dựng component `ExpenseList` tại `components/expenses/ExpenseList.tsx`:
   - Hiển thị từng khoản chi dưới dạng danh sách hoặc dạng thẻ (Cards - Shadcn UI).
   - Card hiển thị các trường:
     - `title`: Tên khoản chi (vd: "Tiền trọ").
     - `amount`: Số tiền (cần format tiền tệ VND).
     - `payerId`: Tên người đã trả tiền (Dựa vào `memberId` map ra `name`). Nếu là chi chung chưa ai trả, để mác "Nợ chung".
     - `createdAt`: Ngày tạo (Format ngày tháng).
3. Đặt component này ở Page chính `app/page.tsx` hoặc tạo trang con riêng biệt tùy layout Mobile.
4. Đảm bảo UI thân thiện, font chữ lớn, nút bấm rõ ràng (Touch Target phù hợp tiêu chuẩn trên điện thoại).

## Đầu ra (OUTPUT)
- Danh sách các khoản chi hiển thị đẹp mắt, đọc dữ liệu từ Store theo thời gian thực (Reactive).
- Không có lỗi type với mảng `Expense` trong TypeScript.

## Tiêu chí nghiệm thu (VERIFY)
- [ ] Trình duyệt chạy `localhost:3000` hiển thị danh sách khoản chi mẫu.
- [ ] Tên người trả (Payer) hiện tên "A/B/C" thay vì chuỗi ID khó hiểu.
- [ ] Số tiền được định dạng có dấu phẩy gọn gàng (vd: `3,252,000 đ`).
