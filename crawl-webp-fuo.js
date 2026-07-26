(async function() {
    console.clear();

    // --- CẤU HÌNH ---
    const zipName = 'anh_tai_ve.zip'; // Tên file zip xuất ra
    // -----------------

    // 1. Load thư viện JSZip nếu chưa có
    if (typeof JSZip === 'undefined') {
        console.log('📦 Đang tải thư viện JSZip...');
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 2. Lấy tất cả link attachment trên trang, loại trùng
    const allLinks = Array.from(document.querySelectorAll('a[href*="attachments"]'));
    const uniqueHrefs = [...new Set(allLinks.map(l => l.href))];

    console.log(`🔍 Tìm thấy ${uniqueHrefs.length} file trên trang.`);

    if (uniqueHrefs.length === 0) {
        console.log('❌ Không tìm thấy file nào. Hãy cuộn hết trang để load hết ảnh rồi chạy lại.');
        return;
    }

    const zip = new JSZip();
    let count = 0;

    for (const href of uniqueHrefs) {
        let fileName = href.split('attachments/')[1]?.replace('/', '');
        if (!fileName) continue;
        if (!fileName.includes('.webp') && !/\.[a-zA-Z0-9]{2,4}$/.test(fileName)) {
            fileName += '.webp'; // fallback nếu không có đuôi file
        }

        try {
            const res = await fetch(href);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            zip.file(fileName, blob);
            count++;
            console.log(`✅ [${count}/${uniqueHrefs.length}] Đã thêm: ${fileName}`);
        } catch (err) {
            console.error(`❌ Lỗi khi tải ${fileName}:`, err);
        }
    }

    if (count === 0) {
        console.log('❌ Không có file nào được thêm vào zip.');
        return;
    }

    console.log(`📦 Đang nén ${count} file thành ${zipName}...`);
    const content = await zip.generateAsync({ type: 'blob' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = zipName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log(`✅ Xong! Đã tải xuống ${zipName} chứa ${count} file.`);
})();
