# Hướng dẫn cài đặt xử lý PDF

## Cài đặt thư viện

Để chatbot có thể đọc và xử lý file PDF, cần cài đặt thư viện `pdf-parse`:

### Cách 1: Chạy script (Windows)
```bash
.\install-pdf-parser.bat
```

### Cách 2: Chạy lệnh npm
```bash
npm install pdf-parse
```

### Cách 3: Thêm vào package.json
Thêm dòng sau vào `dependencies` trong `package.json`:
```json
"pdf-parse": "^1.1.1"
```

Sau đó chạy:
```bash
npm install
```

## Khởi động lại server

Sau khi cài đặt xong, khởi động lại Next.js server:

```bash
npm run dev
```

## Kiểm tra

1. Vào trang **Quản lý Kiến thức**
2. Click **Thêm nguồn**
3. Chọn loại **File**
4. Upload file PDF
5. Hệ thống sẽ tự động trích xuất text từ PDF

## Lưu ý

- File PDF tối đa 10MB
- Chỉ hỗ trợ PDF có text (không phải PDF scan/ảnh)
- Nếu PDF là ảnh scan, cần OCR (có thể dùng Tesseract.js)

## Troubleshooting

### Lỗi: "PDF parser not installed"
- Chạy lại `npm install pdf-parse`
- Khởi động lại server

### Lỗi: "Cannot find module 'pdf-parse'"
- Xóa folder `node_modules`
- Chạy `npm install` lại
- Khởi động lại server

### PDF không có text
- PDF có thể là ảnh scan
- Cần sử dụng OCR để trích xuất text
- Hoặc chuyển đổi PDF sang text trước khi upload
