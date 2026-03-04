# 💸 Sharetien - Chia Tiền Trọ Thật Dễ

**Sharetien** là một ứng dụng web (Mobile-first) được thiết kế theo phong cách **Swiss Neo-Brutalism**, giúp các nhóm bạn ở chung hoặc đi du lịch ghi chép chi tiêu và tự động tính toán cấn trừ nợ một cách công bằng nhất.

![Sharetien Banner](https://raw.githubusercontent.com/phongggnguyen/sharetro/main/main/public/banner.png) *(Hình ảnh minh họa)*

---

## 🚀 Tính Năng Cốt Lõi

-   **📱 Hỗ Trợ PWA**: Cài đặt ứng dụng trực tiếp lên màn hình chính điện thoại. Hỗ trợ offline cơ bản (truy cập dữ liệu từ bộ nhớ đệm).
-   **📅 Chốt Sổ Theo Kỳ (Monthly Settlement)**:
    -   Tự động chốt nợ vào ngày 1 hàng tháng.
    -   Lưu trữ lịch sử chốt sổ chi tiết từng kỳ.
    -   Bắt đầu kỳ mới với số dư reset về 0.
-   **Tạo & Tham Gia Nhóm**: Tạo nhóm nhanh chóng và chia sẻ ID để bạn bè cùng tham gia.
-   **Quản Lý Thành Viên**: Thêm thành viên kèm thông tin ngân hàng để nhận tiền.
-   **Ghi Chép Chi Tiêu**: Nhập khoản chi, số tiền và người đã trả.
-   **Thuật Toán Tối Ưu**: Tự động tính toán số dư (Balance) và đưa ra kế hoạch chuyển khoản tối giản nhất (Greedy Algorithm).
-   **Thanh Toán Quick QR**: Tích hợp công nghệ **VietQR** giúp tạo mã QR chuyển khoản động (kèm số tiền và nội dung) chỉ bằng một cú chạm.
-   **Lịch Sử Truy Cập**: Tự động lưu các nhóm bạn đã truy cập vào bộ nhớ trình duyệt.

---

## 🛠 Tech Stack

Hệ thống được xây dựng trên nền tảng công nghệ hiện đại nhất 2024-2025:

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router).
-   **Database / Backend**: [Supabase](https://supabase.com/) (Postgres + RLS).
-   **Automation**: **Vercel Cron Jobs** (Dành cho việc chốt sổ định kỳ).
-   **PWA**: Service Workers + Web Manifest.
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/).
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/).
-   **Design Style**: **Neo-Brutalism** (Đậm nét, tương phản cao, Shadow cứng).
-   **Infrastructure**: Vercel.

---

## 📦 Cài Đặt & Chạy Local

### 1. Clone repository
```bash
git clone https://github.com/phongggnguyen/sharetro.git
cd sharetro
```

### 2. Cài đặt dependency
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` ở thư mục gốc và điền thông tin Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (Dành cho Cron API)
CRON_SECRET=your_vercel_cron_secret (Bảo mật cho endpoint chốt sổ)
```

### 4. Setup Database
Chạy file SQL script `docs/supabase-schema.sql` trong SQL Editor của Supabase để tạo bảng (`groups`, `members`, `expenses`, `settlement_history`) và cấu hình RLS.

### 5. Setup Cron Job (Dành cho Production)
Để kích hoạt tính năng tự động chốt sổ, hãy cấu hình Cron Job trong Vercel trỏ tới endpoint `/api/cron/settle`.

### 6. Chạy ứng dụng
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.

---

## 📂 Cấu Trúc Thư Mục

```text
src/
├── app/            # Next.js App Router (Pages, Layout, API)
│   └── api/cron/   # Logic chốt sổ định kỳ
├── components/     # UI Components (PWA, Expenses, Members, etc.)
├── lib/            # Business Logic & Utility (calculator.ts)
├── store/          # Zustand State Management
├── types/          # TypeScript Interfaces
└── utils/          # Supabase Client & Server utilities
public/             # Assets, Manifest & Service Worker
docs/               # Tài liệu & Database Schema tổng hợp
```

---

## 🎨 Ngôn Ngữ Thiết Kế: Neo-Brutalism & "Mèo Tính Tiền"

Ứng dụng lấy cảm hứng từ phong cách Neo-Brutalism kết hợp với linh vật **"Mèo tính tiền"** (Cashier Cat) sang trọng:
-   **Icon**: Hình ảnh mèo đeo kính tập trung tính bill trên nền đen nhám.
-   **UI**: Border dày (2px - 4px), Shadow cứng, màu sắc rực rỡ mang tính tương phản cao.
-   **UX**: Tối ưu cho trải nghiệm chạm trên điện thoại, nhanh chóng và mượt mà.

---

## 🤝 Đóng Góp

Mọi ý tưởng đóng góp hoặc báo lỗi, vui lòng tạo **Issue** hoặc gửi **Pull Request**. Cảm ơn các bạn!

---
