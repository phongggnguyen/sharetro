# Project Plan: Limit Settlement History to 12 Periods

## 🎯 Mục tiêu (Goal)
Yêu cầu hệ thống chỉ lưu trữ tối đa **12 chu kỳ (kỳ chốt sổ)** gần nhất trong bảng `settlement_history` cho mỗi nhóm.
Nếu một nhóm tiến hành chốt sổ chu kỳ thứ 13, hệ thống sẽ tự động tìm và xóa toàn bộ dữ liệu của chu kỳ cũ nhất (chu kỳ thứ 1).

## 🕵️ Phân tích Context
- Bảng database: `settlement_history`
- Các trường quan trọng: `group_id`, `period_name`, `period_date`, `created_at`.
- API thực hiện chốt sổ: `src/app/api/settle/route.ts`
- Việc xóa chu kỳ cũ cần được thực hiện ngầm (background/side-effect) ngay sau khi chốt sổ thành công một chu kỳ mới để đảm bảo dữ liệu luôn gọn nhẹ.

## 🛠 Cách tiếp cận (Implementation Strategy)
**Sửa đổi API `/api/settle/route.ts`:**
1. **Thực hiện chốt sổ bình thường:** Vẫn insert các record nợ nần của kỳ hiện tại vào bảng `settlement_history`.
2. **Kiểm tra số lượng chu kỳ:** Truy vấn nhóm các `period_name` (hoặc `period_date`) duy nhất thuộc `group_id` này, sắp xếp theo thời gian mới nhất đến cũ nhất.
3. **Xóa chu kỳ dư thừa:** 
   - Đếm số lượng chu kỳ. Nếu số lượng `> 12`.
   - Cắt mảng (slice) để lấy danh sách các chu kỳ từ thứ 13 trở đi (các chu kỳ cũ nhất).
   - Thực hiện lệnh `DELETE` trên bảng `settlement_history` với điều kiện `group_id = ID` và `period_name IN (danh_sach_chu_ky_cu)`.

## 📋 Task Breakdown (Các bước thực hiện)

### Giai đoạn 1: Cập nhật Backend API (`src/app/api/settle/route.ts`)
- [ ] Mở file `src/app/api/settle/route.ts`.
- [ ] Thêm logic truy vấn tập hợp (Aggregation) để lấy danh sách các chu kỳ đã chốt của nhóm, sắp xếp giảm dần theo thời gian (`created_at` hoặc `period_date`).
- [ ] Trích xuất các chu kỳ vượt quá giới hạn 12.
- [ ] Viết vòng lặp hoặc query `in` để xóa các dòng trong `settlement_history` trùng với các chu kỳ cũ đó.
- [ ] Xử lý lỗi (Error handling) cho tác vụ xóa để không làm sập tiến trình chốt sổ chính nếu chẳng may việc xóa dọn dẹp bị lỗi.

### Giai đoạn 2: Verify (Kiểm thử)
- [ ] (Manual Test) Tạo liên tục 13 chu kỳ chốt sổ giả lập cho một nhóm.
- [ ] Kiểm tra lịch sử chốt sổ xem có đúng chỉ hiển thị 12 chu kỳ và chu kỳ đầu tiên đã biến mất không.
- [ ] Kiểm tra Supabase Dashboard xem các rows của chu kỳ cũ có thực sự bị xóa khỏi bảng `settlement_history` không.

## 🤖 Agent Assignments
- **`backend-specialist`**: Phụ trách viết logic truy vấn SQL/Supabase để lấy danh sách chu kỳ duy nhất và thực hiện lệnh `delete`.
- **`project-planner`**: Theo dõi tiến độ hoàn thành. 

---
👉 **Next steps:** Chạy lệnh `/create thực hiện` để bắt tay vào viết code theo plan này.
