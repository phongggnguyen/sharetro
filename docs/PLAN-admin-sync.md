# Kế hoạch: Đồng bộ quyền Admin qua URL

## Tổng quan
Hiện tại, quyền Admin (khả năng "Chốt sổ") trong Sharetien được lưu trữ trong `localStorage` của trình duyệt thông qua `admin_token`. Khi người dùng chuyển từ máy tính sang thiết bị di động (ứng dụng PWA), họ sẽ bị mất quyền này. Kế hoạch này phác thảo việc triển khai tính năng chia sẻ ID nhóm kèm hoặc không kèm theo mã Admin qua URL, từ đó cho phép việc quản trị liền mạch giữa các thiết bị.

## Loại dự án
WEB (Next.js App Router)

## Tiêu chí thành công
1. Trên trang Chi tiết Nhóm, khu vực nút "Copy ID" sẽ được cập nhật.
2. Đối với thành viên thông thường: Chỉ hiển thị một nút "Sao chép Link".
3. Đối với người dùng có quyền Admin: Sẽ hiển thị hai nút:
   - "Sao chép Link Thành viên" (URL tiêu chuẩn: `.../group/[id]`)
   - "Sao chép Link Quản trị" (URL Admin: `.../group/[id]?admin=[token]`)
4. Khi bất kỳ người dùng nào mở URL Quản trị, ứng dụng sẽ tự động nhận diện tham số `admin` trên đường dẫn, lưu mã token này vào `localStorage`, và cấp ngay quyền Admin cho nhóm đó mà không cần tải lại trang.

## Tech Stack
- Next.js 14 (App Router)
- React Hooks (`useSearchParams`, `useEffect`, `useState`)
- Tailwind CSS & Lucide React (cho Giao diện UI)
- Zustand (Quản lý trạng thái)

## Cấu trúc File
- `src/app/group/[id]/page.tsx`: Xử lý giao diện cho các nút Sao chép và trích xuất tham số URL.
- `src/store/useExpenseStore.ts`: (Có thể) Kiểm tra các tương tác với logic local storage nếu cần.

## Chi tiết Công việc

### TASK 1: Trích xuất mã Admin Token từ URL
- **Agent**: `frontend-specialist`
- **Kỹ năng (Skills)**: `react-best-practices`, `clean-code`
- **Mức độ ưu tiên**: P1
- **INPUT**: `src/app/group/[id]/page.tsx`
- **OUTPUT**: Thêm logic để đọc `?admin=xxx` từ URL khi component được mount (khởi tạo). Nếu có, lưu nó vào `sharetien_admin_keys` trong `localStorage` và kích hoạt việc render/fetch lại dữ liệu để cập nhật giao diện Admin. Xóa tham số truy vấn (query param) trên URL sau khi lưu để đảm bảo tính gọn gàng và bảo mật.
- **VERIFY**: Mở `localhost:3000/group/test-id?admin=test-token`. Kiểm tra `localStorage` xem token đã được lưu chưa.

### TASK 2: Cập nhật giao diện nút Sao chép Link cho Admin
- **Agent**: `frontend-specialist`
- **Kỹ năng (Skills)**: `frontend-design`, `tailwind-patterns`
- **Mức độ ưu tiên**: P2
- **INPUT**: `src/app/group/[id]/page.tsx`
- **OUTPUT**: Sửa đổi phần header. Kiểm tra xem người dùng hiện tại có phải là Admin không (có token trong localStorage).
  - Nếu KHÔNG phải admin: Hiển thị một nút "Sao chép ID/Link" đơn giản.
  - Nếu LÀ ADMIN: Hiển thị một Dropdown hoặc hai nút bấm riêng biệt: "Mời thành viên" (Link Thành viên) và "Link Quản trị" (Link Admin). Sử dụng các biểu tượng Lucide (VD: `Users`, `Shield`) để phân biệt.
- **VERIFY**: Tạo một nhóm mới. Xác minh rằng có hai tùy chọn sao chép xuất hiện. Sao chép link Quản trị, mở tab ẩn danh, dán link và xác minh rằng quyền Admin được cấp ngay lập tức.

## Giai đoạn X: Kiểm tra (Verification)
- [ ] Chạy kiểm tra Code Linting (`npm run lint`)
- [ ] Không sử dụng mã màu tím (purple/violet hex codes) trong giao diện mới (Quy tắc thiết kế)
- [ ] Bố cục đáp ứng tốt trên di động (Mobile responsive) cho các nút bấm mới
- [ ] Vượt qua kiểm tra E2E thủ công/Playwright đối với luồng đồng bộ quyền Admin.
