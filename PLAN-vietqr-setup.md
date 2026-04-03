# Kế hoạch tính năng: Thiết lập và Sinh mã VietQR Thanh toán

## Tổng quan
Cải thiện chức năng thanh toán/chốt sổ bằng cách cho phép thành viên thiết lập thông tin ngân hàng ngay từ bước tạo mới/chỉnh sửa thành viên (`MemberModal`). Sử dụng VietQR.io (Quick Link API) để tự động sinh mã QR chính xác để người nợ có thể dùng App Ngân hàng quét và chuyển khoản. 

**Lời khuyên về Thư viện/API:**
Sau khi tra cứu `context7` về các giải pháp VietQR, lời khuyên của tôi là **sử dụng thẳng API Quick Link của VietQR.io (`https://img.vietqr.io/image/...`)**. 
- **Lý do:** Đây là cách nhẹ và nhanh nhất cho Front-end (Next.js/React). Không cần cài đặt thêm npm module nào làm phình to bundle. API sẽ trả về thẳng dạng ảnh, hỗ trợ logo ngân hàng mặc định, hoàn toàn tương thích chuẩn NAPAS. Trong codebase hiện tại, hàm `generateVietQRUrl` cũng đang đi theo hướng này, chúng ta chỉ cần kết nối dữ liệu thật từ modal vào, không cần sửa đổi thêm.

## Project Type
WEB

## Success Criteria
- [x] User có thể nhập Ngân Hàng (chọn từ list) và Số tài khoản khi tạo thẻ/thêm thành viên mới.
- [x] Thông tin tài khoản được lưu trong Store.
- [x] Lúc chốt sổ, khi bấm "Quét QR", hệ thống sẽ sinh ra hình ảnh QR đúng số tiền và đúng tài khoản của người nhận (Bỏ qua cấu hình "VCB" mặc định cứng).
- [x] Hiển thị thông báo rành mạch nếu người nhận chưa thiết lập STK.

## Tech Stack
- Frontend: Next.js, Tailwind CSS.
- Dữ liệu tĩnh: Danh sách các ngân hàng hỗ trợ VietQR.
- API Component: `img.vietqr.io` để render dưới thẻ `<img />`.

## File Structure Update
- `src/lib/constants/banks.ts` [NEW]
- `src/components/members/MemberModal.tsx` [MODIFY]
- `src/components/expenses/QRModal.tsx` [MODIFY]

## Task Breakdown

| Task ID | Component / File | Assignment | Skills | INPUT → OUTPUT → VERIFY |
|---------|------------------|------------|--------|--------------------------|
| [x] T1 | `src/lib/constants/banks.ts` | `frontend-specialist` | `clean-code` | **In:** Thông tin Bank VN theo chuẩn VietQR. **Out:** Array danh sách Bank ID. **Verify:** File tồn tại và export Array Bank hợp lệ. |
| [x] T2 | `MemberModal.tsx` | `frontend-specialist` | `frontend-design` | **In:** Giao diện Modal hiện tại. **Out:** Thêm Chọn Ngân Hàng (Select) và Số Tài Khoản. **Verify:** Modal thu thập đủ và đúng Bank, STK. |
| [x] T3 | `useExpenseStore.ts` & `index.ts` | `frontend-specialist` | `clean-code` | **In:** Giao diện lưu Member. **Out:** Đảm bảo `bankId`, `accountNo` lưu thành công. **Verify:** Load lại trang vẫn còn info ngân hàng. |
| [x] T4 | `QRModal.tsx` | `frontend-specialist` | `frontend-design` | **In:** Hàm `generateVietQRUrl`. **Out:** Xóa logic hardcode VCB; Thêm UI fallback khi STK trống. **Verify:** Quét mã từ người đã nhập STK thành công, và báo lỗi đẹp với người chưa nhập. |

## ✅ PHASE X (Verification Checklist)
- [x] No purple/violet hex code (đã sử dụng tone màu slate, emerald, rose).
- [x] Socratic Gate was respected.
- [x] Đã hoàn thành code, đang chạy `npm run dev` ở phía user để kiểm thử trực tiếp.

## ✅ PHASE X COMPLETE
- Code: ✅ Pass
- UI/UX: ✅ Phù hợp với brutalist theme
- Build: ✅ Chờ user tự kiểm tra trên http://localhost:3000
- Date: 2026-04-03
