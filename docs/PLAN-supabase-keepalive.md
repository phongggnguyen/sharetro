# Kế hoạch ngăn chặn Supabase Free Tier bị tạm khóa (Keep-Alive) [ĐÃ CHỐT]

Tài liệu này phác thảo kế hoạch chi tiết đã thống nhất để triển khai cơ chế tự động gửi truy vấn (ping) tới cơ sở dữ liệu Supabase nhằm giữ dự án luôn ở trạng thái hoạt động (active), tránh bị Supabase tự động tạm dừng (pause) sau 7 ngày không có hoạt động.

---

## 🎯 Mục tiêu
- Tạo một tác vụ tự động tương tác với cơ sở dữ liệu định kỳ (đọc dữ liệu tối thiểu).
- Đảm bảo cơ chế hoạt động ổn định, bảo mật và không tốn nhiều tài nguyên của gói dịch vụ miễn phí (Vercel & Supabase).

---

## ⚙️ Phương án thiết kế được lựa chọn

Dựa trên phản hồi từ người dùng, kế hoạch được chốt với các thông số cấu hình sau:

1. **Cơ chế kích hoạt định kỳ (Cron Job):**
   - **Lựa chọn:** Sử dụng **Vercel Cron Jobs** tích hợp trực tiếp trong codebase.
   - **Tần suất:** **5 ngày một lần (1/5 days)** lúc 00:00 UTC (Cron expression: `0 0 */5 * *`). Tần suất này đảm bảo Supabase luôn được kích hoạt trước thời hạn 7 ngày inactive, đồng thời giảm thiểu tối đa số lần kích hoạt trên Vercel.

2. **Cơ chế bảo mật API:**
   - **Lựa chọn:** Xác thực bằng token tĩnh thông qua biến môi trường **`CRON_SECRET`** do Vercel tự động cung cấp cho Cron Jobs.
   - **Xác thực:** API sẽ so khớp token nhận được từ header `Authorization: Bearer <CRON_SECRET>` của request với biến môi trường `CRON_SECRET` trên server. Request sẽ bị từ chối với mã lỗi `401 Unauthorized` nếu token không khớp hoặc thiếu.

3. **Cơ chế Ghi log:**
   - **Lựa chọn:** Chỉ ghi nhận kết quả và trạng thái ping thông qua **Console log** (Vercel deployment logs), không ghi vào bảng cơ sở dữ liệu để tránh làm phình dữ liệu và lãng phí dung lượng lưu trữ của Supabase.

---

## 🛠️ Chi tiết các thay đổi (Proposed Changes)

### 1. Tạo API Endpoint Keep-Alive

#### [NEW] [route.ts](file:///c:/Users/nchd3/OneDrive/Desktop/project-github/sharetien/src/app/api/cron/keep-alive/route.ts)
- **Nhiệm vụ:**
  - Lắng nghe request GET/POST gửi tới `/api/cron/keep-alive`.
  - Kiểm tra và xác thực header `Authorization: Bearer <CRON_SECRET>`.
  - Sử dụng client của `@supabase/supabase-js` để thực hiện một truy vấn SELECT đơn giản nhằm kích hoạt database:
    ```typescript
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.from('groups').select('id').limit(1);
    ```
  - In kết quả ra Console log (`console.log` / `console.error`).
  - Phản hồi mã trạng thái tương ứng (`200 OK` nếu ping thành công, `401 Unauthorized` nếu sai token, `500 Internal Server Error` nếu lỗi kết nối database).

### 2. Cấu hình Cron Job trên Vercel

#### [MODIFY] [vercel.json](file:///c:/Users/nchd3/OneDrive/Desktop/project-github/sharetien/vercel.json)
- **Nhiệm vụ:** Cấu hình đường dẫn API và đặt lịch biểu chạy 5 ngày một lần.
- **Nội dung cấu hình:**
  ```json
  {
    "crons": [
      {
        "path": "/api/cron/keep-alive",
        "schedule": "0 0 */5 * *"
      }
    ]
  }
  ```

---

## 🧪 Kế hoạch xác minh (Verification Plan)

### 1. Kiểm thử cục bộ (Local Testing)
- Chạy local dev server: `npm run dev`
- Gửi các request giả lập tới `http://localhost:3000/api/cron/keep-alive`:
  - **Trường hợp 1: Không có header Authorization** -> Kết quả mong đợi: Trả về lỗi `401 Unauthorized`.
  - **Trường hợp 2: Header Authorization chứa token sai** -> Kết quả mong đợi: Trả về lỗi `401 Unauthorized`.
  - **Trường hợp 3: Header Authorization chứa token đúng** (thiết lập `CRON_SECRET=test_secret` ở file `.env.local`) -> Kết quả mong đợi: Trả về `200 OK` và ghi nhận log kết nối thành công tới Supabase trong terminal.

### 2. Xác minh sau khi deploy (Vercel)
- Deploy nhánh chứa code mới lên Vercel.
- Đảm bảo biến môi trường `CRON_SECRET` đã được tự động kích hoạt trên Vercel (thông thường khi bật tính năng Cron Jobs trên dashboard Vercel, Vercel sẽ tự động inject biến môi trường `CRON_SECRET` này vào dự án của bạn).
- Truy cập Vercel Dashboard -> dự án -> tab **Settings** -> **Cron Jobs**. Xác nhận đường dẫn `/api/cron/keep-alive` hiển thị với lịch biểu chạy 5 ngày một lần.
- Bấm **Run** thủ công trên tab Cron Jobs để chạy kiểm tra tức thời. Theo dõi log xem có nhận được status code `200 OK` hay không.
