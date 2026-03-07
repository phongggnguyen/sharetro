# Kế hoạch Tối ưu SEO cho dự án No Debt

**Overview:** 
Dự án "No Debt" (ứng dụng chia tiền trọ/nhóm) cần được tối ưu SEO để cải thiện nhận diện thương hiệu trên máy tìm kiếm (đối với trang chủ) và đồng thời bảo mật dữ liệu các nhóm (ngăn chặn bot lập chỉ mục các trang chi tiết nhóm).

**Project Type:** WEB (Next.js 14 App Router)
**Primary Agent:** `frontend-specialist`

**Success Criteria:**
- Trang chủ có đầy đủ thẻ Meta nâng cao (OpenGraph, Twitter, Keywords chuẩn E-E-A-T).
- Cấu hình file `robots.txt` để chặn crawl các trang `/group/*`.
- Tạo file `sitemap.xml` hợp lệ chứa trang chủ.
- Tích hợp JSON-LD Schema (WebApplication) trên trang chủ.
- Đạt điểm SEO tối đa trên Lighthouse Audit.

**Tech Stack:**
- **Next.js Metadata API**: Tối ưu SEO tích hợp sẵn trên server.
- **Next.js `sitemap.ts` & `robots.ts`**: Tự động tạo file robots và sitemap chuẩn SEO.

**File Structure Changes:**
```text
src/app/
 ├── layout.tsx         # [MODIFY] Cập nhật metadataBase, OpenGraph, Twitter
 ├── page.tsx           # [MODIFY] Thêm JSON-LD Schema (WebApplication)
 ├── sitemap.ts         # [NEW] Tạo sitemap tĩnh cho trang chủ
 ├── robots.ts          # [NEW] Định cấu hình User-Agent chặn /group
 └── group/[id]/
      └── layout.tsx    # [NEW] Tối ưu thẻ OpenGraph mặc định khi chia sẻ link nhóm
```

**Task Breakdown:**

| Task ID | Name | Agent | Skills | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| 1 | Cấu hình Global Metadata | `frontend-specialist` | `seo-fundamentals` | P1 | None | Input: `layout.tsx` → Output: Thêm `metadataBase`, `openGraph` → Verify: Render HTML chứa thẻ tags |
| 2 | Cấu hình Robots & Sitemap | `frontend-specialist` | `seo-fundamentals` | P1 | None | Input: Tạo `robots.ts`, `sitemap.ts` → Output: File tĩnh sinh ra chặn `/group` → Verify: Truy cập `/robots.txt` hợp lệ |
| 3 | Ứng dụng JSON-LD Schema | `frontend-specialist` | `seo-fundamentals` | P2 | Task 1 | Input: `page.tsx` → Output: Thêm `<script type="application/ld+json">` → Verify: Đọc JSON-LD trong DOM |
| 4 | OpenGraph cho Link Share | `frontend-specialist` | `seo-fundamentals` | P2 | None | Input: Tạo `group/[id]/layout.tsx` → Output: Thẻ OG default "Xem nhóm chia tiền" → Verify: Thẻ OG hiển thị chính xác |

## ✅ PHASE X: Verification
- [ ] Chạy lệnh build kiểm tra lỗi: `npm run build`
- [ ] Chạy ứng dụng local: `npm run dev`
- [ ] Kiểm tra SEO Audit: `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000`
- [ ] Kiểm tra file `http://localhost:3000/robots.txt` hiển thị `Disallow: /group/`.
