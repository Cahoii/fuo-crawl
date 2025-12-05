# 🔍 FUO Crawl Scripts

Bộ công cụ JavaScript hỗ trợ crawl và phân tích dữ liệu từ diễn đàn sử dụng XenForo.

## 📦 Danh sách Scripts

### 1️⃣ crawl-webp-fuo.js

Tự động tải hàng loạt ảnh .webp từ danh sách attachments trên trang.

**✨ Tính năng:**

- Tự động tìm và tải file theo khoảng ID
- Tự động đặt tên file đúng với tên gốc
- Delay tự động để tránh bị chặn
- Hiển thị tiến trình chi tiết

**🚀 Cách sử dụng:**

1. Mở trang web có chứa danh sách ảnh cần tải
2. **Quan trọng:** Cuộn trang xuống để load hết tất cả ảnh trong khoảng ID cần tải
3. Nhấn `F12` để mở Developer Console
4. Chỉnh sửa 2 biến trong code:
   ```javascript
   const startID = 196111; // ID ảnh đầu tiên (thay số của bạn)
   const endID = 196170; // ID ảnh cuối cùng (thay số của bạn)
   ```
5. Copy toàn bộ code và paste vào Console
6. Nhấn `Enter`
7. Giữ tab mở cho đến khi tải xong

**📝 Ví dụ:**

```javascript
// Tải tất cả ảnh từ ID 100 đến 150
const startID = 100;
const endID = 150;
```

**⚠️ Lưu ý:**

- Phải cuộn trang để load hết ảnh trước khi chạy script
- Nếu thấy cảnh báo "Không tìm thấy ID", có thể bạn chưa cuộn đến vị trí đó
- File sẽ tải với tên gốc từ server (ví dụ: `aig202c_-_sp_2025_-_fe_3755-webp.196111.webp`)

---

### 2️⃣ crawl-user-cmt-fuo.js

Quét và phân tích bình luận để tìm đáp án thông minh với 2 chế độ:

- **Chế độ 1 (Ưu tiên):** Lấy đáp án từ user được chỉ định
- **Chế độ 2 (Dự phòng):** Lấy đáp án được vote nhiều nhất

**✨ Tính năng:**

- Quét tự động tất cả ảnh trên trang
- Phân tích bình luận và trích xuất đáp án (A, B, C, D, E, F)
- Ưu tiên đáp án từ user tin cậy
- Thống kê số vote cho mỗi đáp án
- Xuất kết quả dạng CSV

**🚀 Cách sử dụng:**

1. Mở trang có danh sách ảnh/bài tập
2. Nhấn `F12` để mở Developer Console
3. Chỉnh sửa các biến cấu hình:
   ```javascript
   const PRIORITY_USER = "username123"; // Tên user ưu tiên (hoặc "" nếu không cần)
   const VALID_CHARS = /^[A-F]+$/i; // Chỉ chấp nhận A-F (có thể đổi thành /^[A-D]+$/i cho 4 đáp án)
   const DELAY_MS = 200; // Delay giữa mỗi request (ms)
   ```
4. Copy toàn bộ code và paste vào Console
5. Nhấn `Enter` và chờ script chạy xong
6. Copy output từ Console
7. Paste vào Excel/Google Sheets (dữ liệu đã định dạng sẵn dạng bảng)

**📊 Kết quả xuất ra:**

| ID Ảnh | Link Media  | Đáp án chốt | Nguồn (Lý do)           | Chi tiết           |
| ------ | ----------- | ----------- | ----------------------- | ------------------ |
| 196111 | https://... | A           | Theo username123        | username123 chọn A |
| 196112 | https://... | B           | Top Vote (5 người chọn) | A(2), B(5), C(1)   |
| 196113 | https://... |             | Chưa có đáp án          |                    |

**📝 Ví dụ cấu hình:**

```javascript
// Ví dụ 1: Ưu tiên đáp án từ user "Misa"
const PRIORITY_USER = "Misa";

// Ví dụ 2: Không ưu tiên ai, chỉ lấy vote cao nhất
const PRIORITY_USER = "";

// Ví dụ 3: Chỉ chấp nhận đáp án A, B, C, D (bỏ E, F)
const VALID_CHARS = /^[A-D]+$/i;
```

**🎯 Logic xử lý:**

1. Nếu `PRIORITY_USER` có comment → Lấy đáp án của họ
2. Nếu không → Lấy đáp án được comment nhiều nhất
3. Nếu không có comment nào → Báo "Chưa có đáp án"

---

## 🛠️ Yêu cầu kỹ thuật

- ✅ Trình duyệt hiện đại: Chrome, Firefox, Edge (hỗ trợ ES6+)
- ✅ Website sử dụng XenForo hoặc có cấu trúc DOM tương tự
- ✅ Quyền truy cập Developer Console (F12)

## ⚠️ Lưu ý quan trọng

- 🔒 **Chỉ sử dụng cho mục đích cá nhân và học tập**
- 📜 Tuân thủ Terms of Service của website
- 🚫 Không spam request quá nhanh (script đã có delay mặc định)
- 🤖 Kiểm tra `robots.txt` trước khi sử dụng
- ⚖️ Tác giả không chịu trách nhiệm về việc sử dụng sai mục đích

## 🐛 Troubleshooting

**Q: Script báo "Không tìm thấy file"?**  
A: Hãy cuộn trang web để load hết ảnh trước khi chạy script.

**Q: Tải file bị chặn bởi trình duyệt?**  
A: Vào Settings → Downloads → Cho phép tải nhiều file cùng lúc.

**Q: Kết quả CSV bị lỗi font khi mở Excel?**  
A: Sử dụng Google Sheets hoặc import với encoding UTF-8.

**Q: Script chạy nhưng không có kết quả?**  
A: Kiểm tra cấu trúc HTML của trang có khớp với selector không (`.file--linked`, `.username`, `.bbWrapper`).

## 📝 License

MIT License - Tự do sử dụng và chỉnh sửa cho mục đích cá nhân.

## 🤝 Đóng góp

Pull requests và issues luôn được chào đón! Vui lòng:

1. Mở issue để thảo luận thay đổi lớn
2. Fork repo và tạo branch mới
3. Submit PR với mô tả rõ ràng

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.

---

**⚠️ Disclaimer:** Các script này được phát triển cho mục đích giáo dục và nghiên cứu. Người dùng tự chịu trách nhiệm đảm bảo việc sử dụng tuân thủ luật pháp và chính sách của website đích.
