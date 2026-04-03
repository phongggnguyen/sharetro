# English 🌍

# 💸 Sharetien - Expense Splitter App

**Sharetien** is a mobile-first web application designed with a **Swiss Neo-Brutalism** visual style. It helps groups of friends living together or traveling track shared expenses and automatically calculates the fairest and simplest settlement plan to clear their debts.

![Sharetien Banner](https://raw.githubusercontent.com/phongggnguyen/sharetro/main/main/public/banner.png) *(Illustrative image)*

---

## 🚀 Core Features

- **📱 PWA Support**: Install the app directly on your phone's home screen. Basic offline support with cached data access.
- **📅 Monthly Settlement**:
  - Automatically settle debits/credits on the 1st of every month.
  - Keep a detailed settlement history for each cycle.
  - Start a new settlement cycle with zeroed balances.
- **Create & Join Groups**: Quickly create a group and share the ID/link with friends.
- **Member Management**: Add group members along with their bank account details to receive money.
- **Expense Tracking**: Easily log expenses, the total amount, and who paid for it.
- **Optimized Settlement Algorithm**: Automatically compute balances and generate the simplest money transfer plan to clear debts (using a Greedy Algorithm).
- **Quick QR Code Payments**: Integrated with **VietQR**, allowing members to set up their own bank details (Bank & Account No). Dynamic QR codes are generated during the settlement process with the exact amount and memo for instant transfers.
- **Access History**: Automatically saves recently accessed groups in the browser storage for quick retrieval.

---

## 🛠 Tech Stack

Built on modern 2024-2025 web technologies:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router).
- **Database / Backend**: [Supabase](https://supabase.com/) (Postgres + Row Level Security).
- **Automation**: **Vercel Cron Jobs** (For periodic monthly settlements).
- **PWA**: Service Workers + Web Manifest.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/).
- **Design Style**: **Neo-Brutalism** (Bold typography, high contrast, hard shadows).
- **Infrastructure**: Vercel.

---

## 📦 Local Setup & Installation

### 1. Clone repository
```bash
git clone https://github.com/phongggnguyen/sharetro.git
cd sharetro
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create a `.env.local` file in the root directory and fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Execute the SQL script in `docs/supabase-schema.sql` via the Supabase SQL Editor to set up tables (`groups`, `members`, `expenses`, `settlement_history`) and configure Row Level Security (RLS).

### 5. Cron Job Setup (Production)
To enable the automated monthly settlement feature, configure a Cron Job in Vercel to ping the `/api/cron/settle` endpoint regularly.

### 6. Run the application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Directory Structure

```text
src/
├── app/            # Next.js App Router (Pages, Layout, API)
│   └── api/cron/   # Periodic settlement logic
├── components/     # UI Components (PWA, Expenses, Members, etc.)
├── lib/            # Business Logic & Utility (calculator.ts)
├── store/          # Zustand State Management
├── types/          # TypeScript Interfaces
└── utils/          # Supabase Client & Server utilities
public/             # Assets, Manifest & Service Worker
docs/               # Documentation & Database Schema
```

---

## 🎨 Design Language: Neo-Brutalism & "Cashier Cat"

The app is inspired by Neo-Brutalism paired with a playful **"Cashier Cat"** mascot:
- **Icon**: A focused cat wearing glasses billing receipts against a matte black background.
- **UI**: Thick borders (2px - 4px), hard shadows, and vibrant contrasting colors.
- **UX**: Optimized for touch interactions on mobile devices, ensuring a fast and smooth experience.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the **Issues** page.

---
---

<br>
<br>

# Tiếng Việt 🇻🇳

# 💸 Sharetien - Chia Tiền Trọ Thật Dễ

**Sharetien** là một ứng dụng web (Mobile-first) được thiết kế theo phong cách **Swiss Neo-Brutalism**, giúp các nhóm bạn ở chung hoặc đi du lịch ghi chép chi tiêu và tự động tính toán cấn trừ nợ một cách công bằng và tối giản nhất.

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
-   **Thanh Toán Quick QR**: Tích hợp công nghệ **VietQR**, cho phép thành viên tự thiết lập thông tin ngân hàng (Ngân hàng & STK). Mã QR chuyển khoản động được tạo tự động trong phần chốt sổ với chính xác số tiền và nội dung để chuyển khoản ngay lập tức.
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
