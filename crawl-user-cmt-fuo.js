(async function() {
    console.clear();
    
    // ==========================================================================
    // CẤU HÌNH - Vui lòng điền thông tin của bạn vào đây
    // ==========================================================================
    
    // Tên người dùng cần tìm bình luận (ví dụ: "username123")
    const targetUser = "YOUR_USERNAME_HERE"; 
    
    // Khoảng ID ảnh cần quét (ví dụ: từ 196111 đến 196170)
    const startAttachmentId = 'startAttachmentId';
    const endAttachmentId = 'endAttachmentId';
    
    // Thời gian chờ giữa mỗi request (milliseconds) - khuyến nghị 500-1000ms
    const delayBetweenRequests = 500;

    // ==========================================================================
    // CODE XỬ LÝ - Không cần chỉnh sửa phần bên dưới
    // ==========================================================================

    console.log(`🚀 ĐANG QUÉT TRANG ĐỂ TÌM LINK BÌNH LUẬN CỦA: ${targetUser}...`);

    const attachmentElements = document.querySelectorAll('.file--linked');
    let tasks = [];

    attachmentElements.forEach(element => {
        const anchor = element.querySelector('.u-anchorTarget');
        if (!anchor) return;
        
        const attachmentId = anchor.id.replace('attachment-', '');
        
        // Chỉ xử lý các ảnh trong khoảng đã cấu hình
        if (attachmentId >= startAttachmentId && attachmentId <= endAttachmentId) {
            const previewLink = element.querySelector('.file-preview');
            if (previewLink && previewLink.getAttribute('data-lb-sidebar-href')) {
                let mediaUrl = previewLink.getAttribute('data-lb-sidebar-href').split('?')[0];
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

    const cleanText = (text) => text.replace(/[\n\r]+/g, ' ').trim();

    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i];
        
        try {
            const response = await fetch(item.url);
            const htmlString = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

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

        await new Promise(r => setTimeout(r, delayBetweenRequests));
    }

    console.log(`\n🏁 HOÀN THÀNH! Tìm thấy ${foundCount} bình luận của ${targetUser}.`);
    console.log("📋 COPY NỘI DUNG DƯỚI ĐÂY VÀO EXCEL:");
    console.log(csvContent);

})();