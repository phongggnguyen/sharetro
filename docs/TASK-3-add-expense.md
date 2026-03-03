# Bước 3: Form thêm khoản chi (Add Expense Form)

## Mục tiêu
Tạo giao diện UI (dành cho Mobile-first) để người dùng có thể nhập các khoản chi phí mới một cách tiện lợi, đồng thời có thể áp dụng logic chia sẻ chi phí linh hoạt.

## Phân công
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`

## Đầu vào (INPUT)
- Dữ liệu `members` từ state tĩnh trong `useExpenseStore` (ví dụ: A, B, C).

## Công việc cụ thể
1. **Thiết kế UI Form (Add Expense):** 
   - Có thể dùng một Page riêng bật lên (`/add-expense`) hoặc một Sheet/Dialog (Modal) của Shadcn UI.
   - Các trường cần cung cấp:
     - Biểu mẫu nhập `title` (Tên khoản chi) (Input Text).
     - Biểu mẫu nhập `amount` (Số tiền) (Input Number - Gõ tới đâu phân cách chữ số tới đó).
     - Biểu mẫu `payerId`: Select box liệt kê những người đã chi khoản này. (Mặc định chọn người dùng hiện tại hoặc chọn "Nợ chung" nếu tiền phòng chi trả).
2. **Logic chia tiền (Split Logic):**
   - **Split equally:** Mặc định. Tự động chia số tiền làm đều cho mọi thành viên (phần dư làm tròn).
   - **Custom Split (Nâng cao cho sau này, chưa làm vội nếu thấy rắc rối):** Cho phép tích vào những ai sử dụng chi phí đó (vd không có thằng A thì không chia cho nó).
3. **Handle Submit:**
   - Kiểm tra `title` không rỗng và `amount` > 0.
   - Thêm khoản chi mới (Expense object) vào mảng danh sách `expenses` trong `useExpenseStore` của Zustand thông qua `addExpense()` action.

## Đầu ra (OUTPUT)
- UI biểu mẫu với nút "Thêm" bự dễ bấm trên màn hình điện thoại.
- Hàm dispatch từ form đẩy data thành công vào global state.

## Tiêu chí nghiệm thu (VERIFY)
- [ ] Mở form thêm mới hoạt động mượt không lỗi CSS.
- [ ] Nhập "Mua dầu ăn", "50000", chọn "A" trả tiền -> Nhấn Submit xong Form tự đóng (hoặc reset).
- [ ] Ra màn hình Danh sách thấy ngay dòng Expense vừa thêm (Test reactive UI).
