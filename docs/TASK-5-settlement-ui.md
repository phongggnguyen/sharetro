# Bước 5: Trang Chốt sổ (Settlement UI)

## Mục tiêu
Hiển thị báo cáo cuối cùng cho người dùng dưới dạng thẻ (cards) dễ đọc. Cung cấp tiện ích quét mã QR hoặc ấn link chuyển khoản trực tiếp dựa trên kết quả thuật toán.

## Phân công
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`

## Đầu vào (INPUT)
- Mảng kết quả `Transaction[]` trả về từ module `calculator.ts` (ở Bước 4).

## Công việc cụ thể
1. **Giao diện SettlementCard:**
   - Thiết kế dạng danh sách: "A cần trả cho B - 1.150.000đ".
   - Làm nổi bật số tiền cần trả (chữ to, đỏ hoặc xanh tùy context).
2. **Tích hợp API VietQR:**
   - Tạo file `lib/utils.ts` thêm một hàm `generateVietQRUrl(bankId, accountNo, amount, message)`.
   - API Endpoint tĩnh (rất dễ xài): `https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-compact2.jpg?amount=<AMOUNT>&addInfo=<MESSAGE>&accountName=<NAME>`.
   - Để làm được việc này, trong Model `Member` của `types/index.ts` có thể xem xét khai báo sẵn (mock) các field bank rỗng.
3. Hiển thị UI: Khi bấm vào "Thanh toán", bật ra Modal chứa hình ảnh QR Code tương ứng với số tiền đó.

## Đầu ra (OUTPUT)
- Tab "Chốt Sổ" đẹp mắt.
- Báo cáo rõ ràng rành mạch ai trả ai.

## Tiêu chí nghiệm thu (VERIFY)
- [ ] Logic lấy đúng mảng của thuật toán và build UI động.
- [ ] Link ảnh VietQR hiển thị chính xác (đúng số tiền và nội dung chuyển khoản cấn trừ nợ).
- [ ] Các Component responsive chuẩn thiết bị kích cỡ nhỏ (Mobile).
