# Cải thiện: Lịch sử chốt đơn, sắp xếp chu kỳ mới lên đầu

## Overview
- **Yêu cầu:** Sắp xếp trang "Lịch sử chốt sổ" từ trên xuống, chu kỳ nào mới nhất sẽ nằm trên đỉnh.
- **Lý do:** Hiện tại dù câu truy vấn Supabase có `.order('period_date', { ascending: false })`, nhưng khi dùng `Object.keys()` hay `Object.entries()` cho Object `groupedRecords` trong JavaScript sẽ không bảo đảm đúng thứ tự giảm dần đối với các nhóm chu kỳ.
- **Giải pháp đề xuất:** Nhóm `records` vào một mảng (Array of Groups) hoặc sắp xếp lại mảng `Object.entries()` dựa trên giá trị `period_date` của record đầu tiên trong mỗi nhóm.

## Project Type
WEB

## Success Criteria
- [ ] Truy cập `group/[id]/history`, người dùng thấy chu kỳ gần nhất hiển thị đầu tiên.
- [ ] Các chu kỳ cũ hơn hiển thị theo thứ tự giảm dần (ví dụ: Tháng 3/2026 -> Tháng 2/2026 -> Tháng 1/2026).
- [ ] Lõi Logic UI `page.tsx` không làm ảnh hưởng đến performance render.

## Tech Stack
- Frontend: Web (Next.js, React)

## File Structure
- `src/app/group/[id]/history/page.tsx` (Chỉ cần chỉnh sửa file này).

## Task Breakdown

### Task 1: Refactor phần nhóm dữ liệu (`groupedRecords`)
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`, `react-best-practices`
- **Priority:** P1
- **INPUT:** Danh sách `records` từ Supabase.
- **OUTPUT:** Mảng các object đại diện cho từng Nhóm Chu kỳ, cấu trúc ví dụ `[{ periodName: string, dateForSort: string, records: [] }, ...]`, và gọi hàm `.sort()` để giáng dần theo ngày.
- **VERIFY:** Xác nhận mảng trả về được sắp xếp đúng, trên giao diện map mảng này thay cho `Object.entries()`.

## Phase X: Verification
- [ ] Lint & Type Check: `npm run lint && npx tsc --noEmit`
- [ ] Test Render: Phải thấy chu kỳ mới nhất bốc lên đầu.
- [ ] Check console không lỗi React keys.
