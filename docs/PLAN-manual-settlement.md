# Project Plan: Manual Settlement (Chốt sổ thủ công)

## 1. Overview
Thay đổi cơ chế "Chốt sổ theo kỳ" từ tự động sang thủ công cho ứng dụng chia tiền No Debt.
- **Mục tiêu:** Cho phép người tạo nhóm chủ động bấm nút "Chốt sổ" bất cứ lúc nào, đồng thời đặt tên cho chu kỳ chốt sổ đó (Ví dụ: "Chuyến đi Đà Lạt", "Tháng 3/2026") để dễ dàng tra cứu trong lịch sử.
- **Project Type:** WEB (Next.js 14 App Router)
- **Primary Agent:** `backend-specialist` (Thiết kế Schema mới, tạo API chốt sổ) phối hợp với `frontend-specialist` (Thêm nút chức năng, Form nhập tên chu kỳ).

## 2. Success Criteria
1. Nút "Chốt sổ" chỉ hiển thị cho người tạo nhóm (xác định qua `admin_token` lưu ở localStorage).
2. Khi bấm chốt sổ, xuất hiện một modal/dialog yêu cầu nhập "Tên kỳ chốt sổ" (bắt buộc).
3. Sau khi xác nhận, toàn bộ công nợ được tính toán và lưu vào lịch sử với tên vừa nhập.
4. Mọi khoản chi tiêu (`expenses`) của nhóm bị xóa để bắt đầu con số 0.
5. Trang Lịch sử (`/history`) thay vì gom nhóm theo tháng tự động thì nay sẽ hiển thị theo "Tên kỳ chốt sổ" thay vì "Tháng X/Y".
6. API Cronjob tự động chốt sổ cũ cần được gỡ bỏ khỏi dự án và cấu hình.

## 3. Tech Stack & Integration
- **Database (Supabase):**
  - Bảng `groups`: Cần thêm trường `admin_token` (UUID, tự động generate) để làm khóa bảo mật định danh người tạo nhóm.
  - Bảng `settlement_history`: Cần thêm trường `period_name` (TEXT) để lưu tên do người dùng nhập.
- **Backend:** Thêm API Endpoint mới `/api/settle` xử lý tác vụ chốt. API này bắt buộc nhận `admin_token` từ Client để đối chiếu với DB, bảo mật quá trình chốt sổ. Xóa API tự động cũ.
- **Frontend / State Management:** 
  - Khởi tạo group xong -> lấy `admin_token` lưu vào `localStorage` (Ví dụ: `sharetien_admin_keys: { [groupId]: adminToken }`).
  - Kiểm tra nếu `groupId` hiện tại có trong `sharetien_admin_keys` thì mới render nút "Chốt sổ".

```text
/src
  /app/group/[id]/page.tsx           # Thêm nút "Chốt sổ" và Dialog nhập tên 
  /app/group/[id]/history/page.tsx   # Cập nhật hiển thị theo "Tên chu kỳ" thay vì theo tháng
  /app/api/settle/route.ts           # [NEW] API xử lý chốt sổ thủ công
  /app/api/cron/settle/route.ts      # [DELETE] Xóa cronjob cũ
/lib
  /supabase/database.types.ts        # Cập nhật Type mới
/docs
  /supabase-schema.sql               # Cập nhật Schema
/vercel.json                         # Xóa cấu hình cronjob
```

## 5. Task Breakdown

### Phase 1: Database & Backend Updates
- **Task 1: Cập nhật Schema trên Supabase**
  - **Agent:** `database-architect`
  - **Inputs:** Yêu cầu thêm cột `period_name` vào bảng `settlement_history` và cột `admin_token` vào bảng `groups` (mặc định `gen_random_uuid()`).
  - **Outputs:** Các lệnh SQL `ALTER TABLE`. Cập nhật file `docs/supabase-schema.sql`.

- **Task 2: API Chốt sổ thủ công**
  - **Agent:** `backend-specialist`
  - **Inputs:** Nhận request POST gồm `groupId`, `periodName` và `adminToken`. B1: Kiểm tra `adminToken` khớp với DB của group. B2: Tính toán nợ nần. B3: Insert record (với `period_name`). B4: Xóa expenses cũ.
  - **Outputs:** File API Route mới và xóa `/api/cron/settle/route.ts`. 

- **Task 3: Lưu trữ Admin Token Frontend**
  - **Agent:** `frontend-specialist`
  - **Inputs:** Cập nhật `src/store/useExpenseStore.ts` (hàm `createGroup`).
  - **Outputs:** Khi tạo nhóm thành công, lấy `admin_token` lưu vào localStorage.

### Phase 2: Frontend Implementation
- **Task 4: UI Nút Chốt Sổ phân quyền**
  - **Agent:** `frontend-specialist`
  - **Inputs:** Trang `/group/[id]/page.tsx`.
  - **Outputs:** Đọc localStorage xem có quyền Admin không -> Hiển thị nút "Chốt sổ kỳ này". Khi bấm mở Dialog/Modal yêu cầu nhập chuỗi văn bản (Tên kỳ). Xử lý gọi API ở Task 2 truyền kèm token và làm mới trang (refresh data) khi gọi API.

- **Task 5: Giao diện Lịch sử nâng cấp**
  - **Agent:** `frontend-specialist`
  - **Inputs:** Lấy dữ liệu history có kèm `period_name`.
  - **Outputs:** Thay vì gộp nhóm theo `Tháng/Năm`, giao diện sẽ hiển thị Card mang tên `period_name` (ví dụ: thẻ "Đi ăn lẩu tuần trước"), bên trong chứa chi tiết ai trả ai.

## 6. Phase X: Verification Checklist
- [ ] Schema: Bảng `settlement_history` có `period_name`, `groups` có `admin_token`.
- [ ] Backend: API `/api/settle` từ chối nếu không truyền hoặc sai `admin_token`.
- [ ] Frontend: Người dùng tạo nhóm nhìn thấy nút "Chốt sổ". Trình duyệt khác/người khác (không có token) không nhìn thấy nút này.
- [ ] Lỗi Regression: Chức năng thêm Expense vẫn hoạt động bình thường trên nhóm trống (sau chốt sổ).
