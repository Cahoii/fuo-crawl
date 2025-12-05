(function() {
    // ==========================================================================
    // CẤU HÌNH - Vui lòng điền thông tin của bạn vào đây
    // ==========================================================================
    
    // Đường dẫn thư mục chứa file trên website (ví dụ: '/attachments/' hoặc '/media/')
    const baseUrl = '/attachments/'; 
    
    // Phần cố định của tên file (không bao gồm số và đuôi .webp)
    // Ví dụ: 'aig202c_-_sp_2025_-_fe_3755-webp.1961'
    const filePrefix = 'YOUR_FILE_PREFIX_HERE'; 
    
    // Số bắt đầu và kết thúc (file sẽ tải từ filePrefix11 đến filePrefix70)
    const startNum = 'startNum';
    const endNum = 'endNum';

    // Khoảng cách giữa mỗi lần tải (milliseconds) - khuyến nghị 300-500ms
    const delayBetweenDownloads = 300;

    // ==========================================================================
    // CODE XỬ LÝ - Không cần chỉnh sửa phần bên dưới
    // ==========================================================================

    console.log(`🚀 Bắt đầu tạo lệnh tải từ file đuôi ...${startNum} đến ...${endNum}`);

    let delayTime = 0;

    for (let i = startNum; i <= endNum; i++) {
        const fileName = filePrefix + i;
        const fullUrl = baseUrl + fileName;

        setTimeout(() => {
            const link = document.createElement('a');
            link.href = fullUrl;
            link.download = fileName + ".webp"; 
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log(`⬇️ Đang tải: ...${i}`);
        }, delayTime);

        delayTime += delayBetweenDownloads; 
    }
})();