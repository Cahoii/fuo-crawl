(function() {
    console.clear();
    
    // --- CẤU HÌNH (Bạn chỉ cần sửa 2 số này) ---
    const startID = 'startID'; // Số ID của ảnh đầu tiên
    const endID = 'endID';   // Số ID của ảnh cuối cùng
    // --------------------------------------------

    console.log(`🚀 Đang tìm kiếm các file từ ID .${startID} đến .${endID} trên giao diện...`);

    // Lấy tất cả các thẻ A chứa link attachment
    const allLinks = document.querySelectorAll('a[href*="attachments"]');
    let count = 0;
    let delay = 0;

    for (let id = startID; id <= endID; id++) {
        let found = false;

        // Tìm link nào chứa mã ID này (ví dụ chứa .196111)
        for (let link of allLinks) {
            if (link.href.includes(`.${id}`) || link.href.includes(`/${id}`)) {
                found = true;
                
                // Tạo độ trễ để tránh bị trình duyệt chặn tải hàng loạt
                setTimeout(() => {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = link.href;
                    
                    // Xử lý lấy tên file gốc từ URL để lưu cho đúng (giữ nguyên q1, q2... hoặc aig...)
                    // URL thường dạng: .../attachments/ten-file-goc.123456/
                    let fileName = link.href.split('attachments/')[1].replace('/', ''); 
                    if (!fileName.endsWith('.webp')) fileName += '.webp'; // Đảm bảo đuôi file

                    downloadLink.download = fileName;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    console.log(`⬇️ [${id}] Đang tải: ${fileName}`);
                }, delay);

                delay += 400; // Mỗi file cách nhau 0.4 giây
                count++;
                break; // Tìm thấy rồi thì dừng vòng lặp link, chuyển sang ID tiếp theo
            }
        }

        if (!found) {
            console.warn(`⚠️ Không tìm thấy ảnh có ID .${id} trên màn hình (Có thể bạn chưa cuộn tới đó?)`);
        }
    }

    if (count > 0) {
        console.log(`✅ Đã lên lịch tải ${count} file. Hãy giữ tab mở cho đến khi tải xong!`);
    } else {
        console.log("❌ Không tìm thấy file nào. Hãy kiểm tra lại Start ID / End ID hoặc cuộn hết trang web.");
    }
})();