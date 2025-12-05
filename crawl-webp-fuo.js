(function() {
    // 1. Cấu hình tên file dựa trên quy luật bạn cung cấp
    // Đường dẫn thư mục (Dựa trên hình ảnh bạn gửi trước đó là /attachments/)
    const baseUrl = '/attachments/'; 
    
    // Phần cố định của tên file
    const filePrefix = 'aig202c_-_sp_2025_-_fe_3755-webp.1961'; 
    
    // Khoảng chạy từ 11 đến 70
    const startNum = 11;
    const endNum = 70;

    console.log(`🚀 Bắt đầu tạo lệnh tải từ file đuôi ...${startNum} đến ...${endNum}`);

    let delayTime = 0;

    for (let i = startNum; i <= endNum; i++) {
        // Tạo url đầy đủ
        const fileName = filePrefix + i;
        const fullUrl = baseUrl + fileName;

        // Dùng setTimeout để tải lần lượt, tránh bị trình duyệt chặn vì tải quá ồ ạt
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = fullUrl;
            
            // Tự động thêm đuôi .webp vào tên file tải về để bạn xem được ngay trên máy
            link.download = fileName + ".webp"; 
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log(`⬇️ Đang tải: ...${i}`);
        }, delayTime);

        // Mỗi file cách nhau 300ms (0.3 giây)
        delayTime += 300; 
    }
})();