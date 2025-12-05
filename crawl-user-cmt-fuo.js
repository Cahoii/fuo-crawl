(async function() {
    console.clear();
    const targetUser = "yeu.minh.em"; // Tên người dùng cần tìm
    console.log(`🚀 ĐANG QUÉT TRANG ĐỂ TÌM LINK BÌNH LUẬN CỦA: ${targetUser}...`);

    // 1. Lấy danh sách tất cả các file đính kèm trên trang hiện tại
    const attachmentElements = document.querySelectorAll('.file--linked');
    
    let tasks = [];

    // 2. Lọc và lấy link Media chuẩn từ giao diện
    attachmentElements.forEach(element => {
        // Lấy ID ảnh từ thẻ a (ví dụ: attachment-196111)
        const anchor = element.querySelector('.u-anchorTarget');
        if (!anchor) return;
        
        const attachmentId = anchor.id.replace('attachment-', '');
        
        // Chỉ xử lý các ảnh trong khoảng 196111 -> 196170 (như bạn yêu cầu trước đó)
        // Hoặc bỏ điều kiện if này nếu muốn quét hết tất cả ảnh trong bài
        if (attachmentId >= 196111 && attachmentId <= 196170) {
            
            // Lấy link Media chứa bình luận (nằm trong thuộc tính data-lb-sidebar-href)
            const previewLink = element.querySelector('.file-preview');
            if (previewLink && previewLink.getAttribute('data-lb-sidebar-href')) {
                // Link gốc dạng: /media/abc.94002/?lightbox=1 -> Cần cắt bỏ phần ?lightbox=1
                let mediaUrl = previewLink.getAttribute('data-lb-sidebar-href').split('?')[0];
                // Thêm domain nếu thiếu
                if (!mediaUrl.startsWith('http')) {
                    mediaUrl = window.location.origin + mediaUrl;
                }

                tasks.push({
                    id: attachmentId,
                    url: mediaUrl
                });
            }
        }
    });

    console.log(`✅ Tìm thấy ${tasks.length} ảnh cần quét. Bắt đầu truy cập từng link Media...`);

    let csvContent = `ID Ảnh\tLink Media (Chứa bình luận)\tBình luận của ${targetUser}\n`;
    let foundCount = 0;

    // Hàm làm sạch text
    const cleanText = (text) => text.replace(/[\n\r]+/g, ' ').trim();

    // 3. Truy cập từng link Media để lấy bình luận
    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i];
        
        try {
            const response = await fetch(item.url);
            const htmlString = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            // --- TÌM NGƯỜI DÙNG ---
            const comments = doc.querySelectorAll('.comment-contentWrapper, .message-inner');
            let userComment = "";

            comments.forEach(comment => {
                const usernameEl = comment.querySelector('.username');
                if (usernameEl && usernameEl.innerText.trim().toLowerCase() === targetUser.toLowerCase()) {
                    const bodyEl = comment.querySelector('.bbWrapper, .comment-body');
                    if (bodyEl) {
                        if (userComment !== "") userComment += " | ";
                        userComment += cleanText(bodyEl.innerText);
                    }
                }
            });

            if (userComment !== "") {
                foundCount++;
            } else {
                userComment = "(Không có bình luận)";
            }

            console.log(`Running [${i+1}/${tasks.length}] Ảnh ${item.id} -> ${userComment}`);
            csvContent += `${item.id}\t${item.url}\t${userComment}\n`;

        } catch (e) {
            console.error(`Lỗi tại ảnh ${item.id}`, e);
            csvContent += `${item.id}\t${item.url}\tLỖI TRUY CẬP\n`;
        }

        // Nghỉ 0.5s để tránh bị chặn
        await new Promise(r => setTimeout(r, 500));
    }

    // 4. Xuất kết quả
    console.log(`\n🏁 HOÀN THÀNH! Tìm thấy ${foundCount} bình luận của ${targetUser}.`);
    console.log("📋 COPY NỘI DUNG DƯỚI ĐÂY VÀO EXCEL:");
    console.log(csvContent);

})();