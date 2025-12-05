# FuOverflow Auto-Crawler Toolset

Bộ công cụ JavaScript đơn giản chạy trực tiếp trên Console trình duyệt (DevTools) để tự động hóa việc tải tài liệu và thu thập dữ liệu thảo luận từ diễn đàn FuOverflow (XenForo).

## 📂 Danh sách File

Dự án bao gồm 2 script chính:

1.  **`crawl-webp-fuo.js`**:

    - **Chức năng:** Tự động tạo link và tải hàng loạt file ảnh (định dạng `.webp`) từ thư mục `attachments` về máy tính.
    - **Cơ chế:** Duyệt theo quy luật ID tăng dần của file đính kèm.

2.  **`crawl-user-cmt-fuo.js`**:

    - **Chức năng:** Quét danh sách ảnh trong bài viết, tự động tìm link "Media" tương ứng, truy cập ngầm và trích xuất bình luận của một người dùng cụ thể (Ví dụ: đáp án của `yeu.minh.em`).
    - **Kết quả:** Xuất ra dữ liệu dạng bảng CSV để copy vào Excel.

---

## 🚀 Hướng dẫn sử dụng

### 1\. Tải ảnh hàng loạt (`crawl-webp-fuo.js`)

Script này dùng để tải toàn bộ ảnh đề thi về máy khi bạn biết quy luật tên file nhưng trang web dùng Lazy Load hoặc không hiện hết ảnh.

**Cách dùng:**

1.  Mở trang web FuOverflow bất kỳ (để giữ session đăng nhập).
2.  Nhấn `F12` (hoặc chuột phải -\> Inspect) để mở **DevTools**.
3.  Chọn tab **Console**.
4.  Dán nội dung file `crawl-webp-fuo.js` vào.
5.  _(Tùy chọn)_ Sửa các biến cấu hình nếu ID ảnh thay đổi:
    ```javascript
    const filePrefix = "aig202c_-_sp_2025_-_fe_3755-webp.1961"; // Phần đầu tên file
    const startNum = 11; // Số bắt đầu (VD: ...11)
    const endNum = 70; // Số kết thúc (VD: ...70)
    ```
6.  Nhấn **Enter**.
7.  **Lưu ý:** Trình duyệt sẽ hiện thông báo _"fuoverflow.com wants to download multiple files"_. Hãy chọn **Allow (Cho phép)**.

### 2\. Thu thập bình luận/đáp án (`crawl-user-cmt-fuo.js`)

Script này dùng để lấy đáp án từ người dùng uy tín (nhiều vote) mà không cần click xem từng ảnh.

**Cách dùng:**

1.  Truy cập vào **Link bài viết (Thread)** chứa danh sách các file đính kèm (Ví dụ: trang hiển thị danh sách 60 ảnh thumbnail).
2.  Mở tab **Console** trong DevTools (`F12`).
3.  Dán nội dung file `crawl-user-cmt-fuo.js` vào.
4.  _(Tùy chọn)_ Đổi tên người dùng muốn tìm:
    ```javascript
    const targetUser = "yeu.minh.em"; // Tên người dùng cần lọc comment
    ```
5.  Nhấn **Enter** và chờ script chạy (khoảng 30s - 1 phút tùy số lượng ảnh).
6.  Kết quả sẽ hiện ra ở cuối Console. Copy toàn bộ đoạn text từ sau dòng `--- COPY NỘI DUNG DƯỚI ĐÂY VÀO EXCEL ---` và dán vào file Excel.

---

## ⚠️ Lưu ý quan trọng

1.  **Quyền truy cập:** Bạn phải đăng nhập vào FuOverflow trước khi chạy script, vì server yêu cầu quyền thành viên để xem attachment/media.
2.  **Độ trễ (Delay):** Trong code đã thiết lập `setTimeout` (khoảng 300ms - 500ms) giữa các lần gọi. **Không nên xóa hoặc giảm thời gian này** quá thấp để tránh bị server chặn IP (Rate limiting) hoặc làm treo trình duyệt.
3.  **Cấu trúc URL:** Script được viết dựa trên cấu trúc URL hiện tại của FuOverflow (tháng 02/2025). Nếu admin web thay đổi đường dẫn (ví dụ từ `/attachments/` sang `/files/`), bạn cần cập nhật lại biến `baseUrl`.

## 🛠 Yêu cầu hệ thống

- Trình duyệt: Google Chrome, Microsoft Edge, hoặc Firefox (Hỗ trợ Developer Tools).
- Môi trường: Đã đăng nhập tài khoản FuOverflow.

---

_Dự án cá nhân phục vụ mục đích học tập và lưu trữ tài liệu ôn thi._
