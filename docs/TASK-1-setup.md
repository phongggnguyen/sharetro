# Bước 1: Setup Layout & Mock Data

## Mục tiêu
Thiết lập bộ khung dự án ban đầu với đầy đủ cấu trúc thư mục, các thư viện cần thiết và dữ liệu mẫu (mock data) để chuẩn bị cho các bước phát triển giao diện tiếp theo.

## Phân công
- **Agent**: `frontend-specialist`
- **Skill**: `app-builder`, `frontend-design`

## Đầu vào (INPUT)
- Chưa có code hiện tại (Bắt đầu khởi tạo từ đầu).
- Yêu cầu cấu trúc thư mục cơ bản cho Next.js App Router.

## Công việc cụ thể
1. Khởi tạo project Next.js bằng lệnh `npx create-next-app@latest .`
2. Cài đặt các thư viện lõi:
   - Tailwind CSS (đã đi kèm khi tạo project Next.js).
   - Shadcn UI: Chạy lệnh khởi tạo và thêm các component cơ bản như Button, Card, Input.
   - Zustand: `npm install zustand`
   - Lucide React (Icons): `npm install lucide-react`
3. Định nghĩa File Database Schema `types/index.ts` dựa trên yêu cầu từ `prompt.md`.
4. Viết `store/useExpenseStore.ts` sử dụng Zustand:
   - Chứa Mock Data của 3 thành viên: A, B, C.
   - Chứa logic state (dù trống ban đầu, có mock data).
5. Setup file layout chính `app/layout.tsx` chuẩn Mobile-first (có thẻ meta scale viewport chuẩn).

## Đầu ra (OUTPUT)
- Project có bộ khung thư mục chuẩn Next.js như trong `doc/PLAN-expense-splitter.md`.
- Các file config Tailwind, Shadcn UI hoàn tất.
- Có thư mục `types` và `store` đi kèm với Zustand chứa danh sách thành viên A, B, C.

## Tiêu chí nghiệm thu (VERIFY)
- [ ] Lệnh `npm run dev` chạy không lỗi.
- [ ] Hiển thị được một dòng Hello World nằm giữa màn hình để check Tailwind hoạt động.
- [ ] Typescript không báo warning ở file `types/index.ts`.
