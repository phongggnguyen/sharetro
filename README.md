# 💸 Sharetien - Chia Tiền Trọ Thật Dễ

**Sharetien** là một ứng dụng web (Mobile-first) được thiết kế theo phong cách **Swiss Neo-Brutalism**, giúp các nhóm bạn ở chung hoặc đi du lịch ghi chép chi tiêu và tự động tính toán cấn trừ nợ một cách công bằng nhất.

![Sharetien Banner](https://raw.githubusercontent.com/phongggnguyen/sharetro/main/public/banner.png) *(Hình ảnh minh họa)*

---

## 🚀 Tính Năng Cốt Lõi

- **Tạo & Tham Gia Nhóm**: Tạo nhóm nhanh chóng và chia sẻ ID để bạn bè cùng tham gia.
- **Quản Lý Thành Viên**: Thêm thành viên kèm thông tin ngân hàng để nhận tiền.
- **Ghi Chép Chi Tiêu**: Nhập khoản chi, số tiền và người đã trả.
- **Thuật Toán Tối Ưu**: Tự động tính toán số dư (Balance) và đưa ra kế hoạch chuyển khoản tối giản nhất (Greedy Algorithm).
- **Thanh Toán Quick QR**: Tích hợp công nghệ **VietQR** giúp tạo mã QR chuyển khoản động (kèm số tiền và nội dung) chỉ bằng một cú chạm.
- **Lịch Sử Gần Đây**: Tự động lưu các nhóm bạn đã truy cập vào bộ nhớ trình duyệt.

---

## 🛠 Tech Stack

Hệ thống được xây dựng trên nền tảng công nghệ hiện đại nhất 2024-2025:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components).
- **Database / Backend**: [Supabase](https://supabase.com/) (Postgres + RLS).
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/).
- **Design Style**: **Neo-Brutalism** (Đậm nét, tương phản cao, Shadow cứng).
- **Infrastructure**: Vercel.

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
```

### 4. Setup Database
Chạy file SQL script `docs/supabase-schema.sql` trong SQL Editor của Supabase để tạo bảng và cấu hình RLS.

### 5. Chạy ứng dụng
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.

---

## 📂 Cấu Trúc Thư Mục

```text
src/
├── app/            # Next.js App Router (Pages & Layout)
├── components/     # UI Components (uicomponents, expenses, members, etc.)
├── lib/            # Business Logic & Utility (calculator.ts, utils.ts)
├── store/          # Zustand State Management
├── types/          # TypeScript Interfaces
└── utils/          # Supabase Client & Server utilities
docs/               # Tài liệu & Database Schema
```

---

## 🎨 Ngôn Ngữ Thiết Kế: Neo-Brutalism

Ứng dụng sử dụng phong cách thiết kế hiện đại với:
- Border dày (2px - 4px) màu đen.
- Shadow cứng (Box-shadow không blur).
- Màu sắc rực rỡ (Blue, Emerald, Red) trên nền Slate/White.
- Typography mạnh mẽ (Black/Bold uppercase).

---

## 🤝 Đóng Góp

Mọi ý tưởng đóng góp hoặc báo lỗi, vui lòng tạo **Issue** hoặc gửi **Pull Request**. Cảm ơn các bạn!

---
