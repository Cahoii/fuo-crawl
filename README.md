# FUO Crawl Scripts

Bộ công cụ crawl dữ liệu cho diễn đàn sử dụng XenForo.

## 📋 Danh sách Scripts

### 1. crawl-webp-fuo.js

Tải hàng loạt file ảnh .webp theo quy luật đánh số.

**Cách sử dụng:**

1. Mở Developer Console (F12) trên trang web
2. Chỉnh sửa các biến trong phần CẤU HÌNH:
   - `baseUrl`: Đường dẫn thư mục (VD: '/attachments/')
   - `filePrefix`: Tên file không bao gồm số (VD: 'image*2024*')
   - `startNum`, `endNum`: Số bắt đầu và kết thúc
3. Copy toàn bộ code và paste vào Console
4. Nhấn Enter

### 2. crawl-user-cmt-fuo.js

Quét và xuất bình luận của một user cụ thể trên các ảnh.

**Cách sử dụng:**

1. Mở trang có chứa danh sách ảnh
2. Mở Developer Console (F12)
3. Chỉnh sửa các biến trong phần CẤU HÌNH:
   - `targetUser`: Tên username cần tìm
   - `startAttachmentId`, `endAttachmentId`: Khoảng ID ảnh cần quét
4. Copy toàn bộ code và paste vào Console
5. Nhấn Enter và chờ kết quả

## ⚠️ Lưu ý

- Chỉ sử dụng cho mục đích cá nhân và học tập
- Tuân thủ Terms of Service của website
- Không spam request quá nhanh (đã có delay mặc định)

## 📝 License

MIT License
