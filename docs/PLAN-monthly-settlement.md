# Project Plan: Monthly Settlement

## 1. Overview
Tính năng "Chốt sổ theo kỳ" (Monthly Settlement) cho ứng dụng chia tiền No Debt.
- **Mục tiêu:** Tự động tổng kết và lưu lại công nợ vào ngày mùng 1 hàng tháng, sau đó reset chi phí của tất cả mọi người về 0 để bắt đầu chu kỳ mới.
- **Project Type:** WEB (Next.js 14 App Router)
- **Primary Agent:** `backend-specialist` (Thiết kế DB/Cronjob) phối hợp với `frontend-specialist` (Hiển thị UI Lịch sử chốt sổ).

## 2. Success Criteria
1. Tự động chạy chốt sổ vào 00:00 ngày đầu tiên của mỗi tháng.
2. Lưu trữ chính xác bảng danh sách nợ (ví dụ: A nợ B 50k, C nợ B 20k) của tháng cũ vào Supabase.
3. Reset được dữ liệu (hoặc tạo nhóm/kỳ mới ẩn danh) để số dư bắt đầu của tháng mới là 0.
4. UI hiển thị màn hình "Lịch sử chốt sổ" đơn giản, rõ ràng.

## 3. Tech Stack & Integration
- **Database:** Supabase (Cần thêm bảng `settlements_history`)
- **Backend/Cron:** Vercel Cron Jobs (hoặc Supabase Edge Functions / pg_cron) để trigger tự động vào ngày 1.
- **Frontend:** React Server Components để hiển thị lịch sử chốt sổ.

## 4. File Structure Impact (Dự kiến)
```text
/src
  /app/history/page.tsx          # Màn hình xem lịch sử chốt sổ các tháng
  /app/api/cron/settle/route.ts  # Endpoint chạy tự động bởi Vercel Cron
/lib
  /supabase/database.types.ts    # Cập nhật type cho bảng mới
```

## 5. Task Breakdown

### Phase 1: Database Setup & Cron API
- **Task 1: Thiết kế bảng `settlement_history` trên Supabase**
  - **Agent:** `database-architect`
  - **Inputs:** Yêu cầu lưu tổng kết tháng (member_id, amount_owed, owe_to_member_id, period_date).
  - **Outputs:** Lệnh SQL tạo bảng `settlement_history`, cập nhật Type Supabase.
  - **Verify:** Tạo bảng thành công, Insert thử 1 dòng dữ liệu hợp lệ.

- **Task 2: API Cronjob Chốt Sổ & Reset Dữ liệu**
  - **Agent:** `backend-specialist`
  - **Inputs:** Logic chốt sổ (tính toán nợ hiện tại `lib/calculator.ts` -> Lưu danh sách nợ vào `settlement_history` -> Cập nhật/Xóa danh sách `expenses` cũ để reset số dư).
  - **Outputs:** API Endpoint `/api/cron/settle` (Bảo mật bằng CRON_SECRET).
  - **Verify:** Fetch API thủ công -> Data được lưu vào DB History -> Chi phí hiện tại bị reset.

### Phase 2: Frontend & UI
- **Task 3: Cấu hình Vercel Cron (hoặc `pg_cron`)**
  - **Agent:** `backend-specialist`
  - **Inputs:** File `vercel.json`
  - **Outputs:** Cấu hình chuẩn `0 0 1 * *` (00:00 ngày 1 hàng tháng).
  - **Verify:** Push code lên Vercel và xem tab Cron Jobs nhận diện cấu hình.

- **Task 4: Xây dựng trang Lịch sử Chốt sổ (`/history`)**
  - **Agent:** `frontend-specialist`
  - **Inputs:** Data từ bảng `settlement_history`.
  - **Outputs:** Giao diện xem danh sách các tháng trước (vd: Tháng 2/2026) và chi tiết ai nợ ai trong tháng đó.
  - **Verify:** Trang load dữ liệu chính xác, UI đồng bộ với phong cách Neo-brutalism hiện tại.

## 6. Phase X: Verification Checklist
- [x] Lint: Chạy `npm run lint` pass.
- [x] Build: Chạy `npm run build` không lỗi.
- [x] Unit Test (Nếu có): API Calculator tính chính xác khoản nợ trước khi lưu lịch sử.
- [x] Manual Test: Gọi trực tiếp API qua Postman/Browser (truyền Secret Key) để xem DB có lưu đúng và reset đúng không.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Build: ✅ Success
- Schema: ✅ Created `settlement_history`
- Endpoints: ✅ Created `/api/cron/settle` and UI `/history`
- Date: 2026-03-04
