(async function() {
    console.clear();
    
    // ==========================================================================
    // CẤU HÌNH - Vui lòng điền thông tin của bạn vào đây
    // ==========================================================================
    
    // Tên người dùng được ưu tiên tuyệt đối (để trống "" nếu không cần)
    const PRIORITY_USER = "YOUR_PRIORITY_USERNAME"; 
    
    // Chỉ chấp nhận đáp án chứa các ký tự này (mặc định: A-F cho trắc nghiệm)
    const VALID_CHARS = /^[A-F]+$/i;
    
    // Thời gian chờ giữa mỗi request (milliseconds) - khuyến nghị 200-500ms
    const DELAY_MS = 200;
    
    // ==========================================================================
    // CODE XỬ LÝ - Không cần chỉnh sửa phần bên dưới
    // ==========================================================================

    console.log("🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG QUÉT ĐÁP ÁN THÔNG MINH...");
    console.log(`⭐ Chế độ ưu tiên: Người dùng '${PRIORITY_USER}'`);
    console.log("📊 Chế độ dự phòng: Đáp án được comment nhiều nhất");

    // 1. Quét giao diện để lấy link Media chứa bình luận
    const attachmentElements = document.querySelectorAll('.file--linked');
    let tasks = [];

    attachmentElements.forEach(element => {
        const anchor = element.querySelector('.u-anchorTarget');
        if (!anchor) return;
        
        const attachmentId = anchor.id.replace('attachment-', '');
        
        // Lấy link Media từ thuộc tính data (nơi chứa bình luận thực tế)
        const previewLink = element.querySelector('.file-preview');
        if (previewLink && previewLink.getAttribute('data-lb-sidebar-href')) {
            let mediaUrl = previewLink.getAttribute('data-lb-sidebar-href').split('?')[0];
            if (!mediaUrl.startsWith('http')) {
                mediaUrl = window.location.origin + mediaUrl;
            }
            tasks.push({ id: attachmentId, url: mediaUrl });
        }
    });

    console.log(`✅ Đã tìm thấy ${tasks.length} ảnh. Bắt đầu phân tích...`);

    let csvContent = `ID Ảnh\tLink Media\tĐáp án chốt\tNguồn (Lý do)\tChi tiết\n`;
    
    // Hàm làm sạch đáp án (Chỉ giữ lại ký tự hợp lệ)
    // Ví dụ: "Câu này là A nha" -> "A", "Đáp án BC" -> "BC"
    const extractAnswer = (text) => {
        if (!text) return null;
        // Xóa dấu chấm, phẩy, khoảng trắng thừa
        let clean = text.replace(/[^a-zA-Z]/g, '').toUpperCase(); 
        // Kiểm tra xem sau khi xóa rác, nó có phải là chuỗi hợp lệ không và độ dài hợp lý (1-5 ký tự)
        if (clean.length > 0 && clean.length <= 5 && VALID_CHARS.test(clean)) {
            return clean;
        }
        return null;
    };

    // 2. Duyệt qua từng ảnh
    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i];
        let finalAns = "";
        let reason = "";
        let detailLog = ""; // Ghi chú thêm cho CSV

        try {
            const response = await fetch(item.url);
            const htmlString = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            // Lấy tất cả comment
            const comments = doc.querySelectorAll('.comment-contentWrapper, .message-inner');
            
            let freqMap = {}; // Bảng đếm tần suất: { "A": 5, "B": 2 }
            let priorityAns = null;

            comments.forEach(comment => {
                const userEl = comment.querySelector('.username');
                const bodyEl = comment.querySelector('.bbWrapper, .comment-body');

                if (userEl && bodyEl) {
                    const userName = userEl.innerText.trim();
                    const rawText = bodyEl.innerText.trim();
                    const ans = extractAnswer(rawText);

                    if (ans) {
                        // 1. Kiểm tra user ưu tiên ngay lập tức
                        if (PRIORITY_USER && userName.toLowerCase() === PRIORITY_USER.toLowerCase()) {
                            priorityAns = ans;
                        }

                        // 2. Đếm số lượng cho mọi người (để dùng nếu không có user ưu tiên)
                        if (!freqMap[ans]) freqMap[ans] = 0;
                        freqMap[ans]++;
                    }
                }
            });

            // --- QUYẾT ĐỊNH ĐÁP ÁN ---
            if (priorityAns) {
                finalAns = priorityAns;
                reason = `Theo ${PRIORITY_USER}`;
                detailLog = `${PRIORITY_USER} chọn ${priorityAns}`;
            } else {
                // Tìm đáp án có lượt xuất hiện nhiều nhất
                let maxCount = 0;
                let bestKey = "Không có";
                
                for (const [key, count] of Object.entries(freqMap)) {
                    if (count > maxCount) {
                        maxCount = count;
                        bestKey = key;
                    }
                }

                if (maxCount > 0) {
                    finalAns = bestKey;
                    reason = `Top Vote (${maxCount} người chọn)`;
                    // Tạo string chi tiết: A(5), B(1)...
                    detailLog = Object.entries(freqMap).map(([k, v]) => `${k}(${v})`).join(', ');
                } else {
                    finalAns = "";
                    reason = "Chưa có đáp án";
                }
            }

            console.log(`[${i+1}/${tasks.length}] Ảnh ${item.id}: ${finalAns || "???"} -> ${reason}`);
            csvContent += `${item.id}\t${item.url}\t${finalAns}\t${reason}\t${detailLog}\n`;

        } catch (e) {
            console.error(`Lỗi tại ảnh ${item.id}`, e);
            csvContent += `${item.id}\t${item.url}\tLỖI\tLỗi truy cập\n`;
        }

        // Delay nhẹ để server không chặn
        await new Promise(r => setTimeout(r, DELAY_MS));
    }

    // 3. Xuất kết quả
    console.log("🏁 HOÀN THÀNH QUÉT DỮ LIỆU!");
    console.log("📋 --- COPY NỘI DUNG DƯỚI ĐÂY VÀO NOTEPAD RỒI LƯU THÀNH FILE .CSV ---");
    console.log(csvContent);

})();