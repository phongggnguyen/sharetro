# Kế hoạch Bổ sung Tên Người Tạo gán quyền chốt sổ

## 1. Yêu cầu (Context Check)
Người dùng yêu cầu bổ sung ô nhập "Tên người tạo" khi tạo nhóm mới. Người tạo này sẽ được cấp quyền chốt sổ (thông qua cơ chế admin token hiện hành) và là người duy nhất nhìn thấy nút chức năng chốt sổ.

## 2. Socratic Gate (Câu hỏi cần làm rõ)
Trước khi triển khai, cần xác nhận các yếu tố sau:
1. **Quản lý thành viên**: Tên người tạo nhập vào có được hệ thống tự động lưu thành 1 "Thành viên" đầu tiên của nhóm không?
2. **Hiển thị giao diện**: Giao diện chi tiết nhóm có cần hiển thị dòng chữ "Người tạo: [Tên]" ở phần header không?
3. **Mối liên hệ Admin**: Việc check quyền chốt sổ vẫn tiếp tục sử dụng `admin_token` được lưu ẩn dưới `localStorage` của trình duyệt người tạo, hay bạn muốn đổi sang cơ chế đăng nhập/nhập mật khẩu? (khuyến nghị giữ nguyên token localStorage cho tiện lợi).

## 3. Đề xuất Thay đổi (Proposed Changes)

**A. Giao diện trang chủ (`src/app/page.tsx`)**
- Thêm `Input` yêu cầu nhập "Tên của bạn (Người tạo nhóm)".
- Cập nhật luồng logic nút "Bắt đầu ngay" để truyền cả `groupName` và `creatorName`.

**B. Logic Store (`src/store/useExpenseStore.ts`)**
- Hàm `createGroup`: Sửa API hoặc fetch flow để đồng thời tạo Group, sau đó tự động tạo luôn 1 record Member với `name` là tên người tạo.
- Hoặc nâng cấp API Backend để xử lý transaction tạo Group + tạo Member cùng lúc.

**C. Database (`docs/supabase-schema.sql`)**
- (Tuỳ chọn) Thêm thông tin `creator_id` hoặc `creator_name` vào bảng `groups` nếu muốn hiển thị rõ ràng trên UI.

**D. Giao diện chốt sổ (`SettlementView.tsx`)**
- Không cần sửa nhiều vì đã có logic check `isAdmin` từ trước. Nếu muốn có thể hiển thị thêm câu báo: "Bạn là quản trị viên ([Tên người tạo])".

## 4. Phase X: Verification
- [ ] Manual test: Nhập tên lúc tạo nhóm -> Kiểm tra Database xem Member có được sinh ra chưa.
- [ ] Kiểm tra quyền: Nút chốt sổ chỉ Admin mới được thấy.
