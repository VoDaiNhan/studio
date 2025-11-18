# Hướng dẫn Cấu hình Chatbot

## Truy cập trang cấu hình

Có 2 cách để truy cập trang cấu hình chatbot:

### Cách 1: Qua Sidebar (Khuyến nghị)
1. Đăng nhập với tài khoản admin
2. Vào Dashboard
3. Click vào **"Cấu hình Chatbot"** trong sidebar bên trái
4. URL: `/dashboard/chatbot`

### Cách 2: Truy cập trực tiếp
- Mở trình duyệt và vào: `http://localhost:3000/dashboard/chatbot`

## Các Tab cấu hình

### 1. Tab "Giao diện" 🎨
Tùy chỉnh giao diện và cảm nhận của chatbot:

- **Tên hiển thị**: Tên chatbot hiển thị cho người dùng
- **Lời chào**: Tin nhắn chào mừng đầu tiên
- **Màu chính**: Màu chủ đạo của chatbot (Primary Color)
- **Màu phụ**: Màu nhấn mạnh (Accent Color)
- **Màu nền**: Màu nền giao diện (Background Color)
- **Phong cách AI**: Chọn giữa Chuyên gia / Thân thiện / Chuyên nghiệp

### 2. Tab "Hành vi" ⚙️
Cấu hình cách chatbot xử lý và trả lời:

**Phản hồi:**
- **Độ dài câu trả lời tối đa**: Số token tối đa (1 token ≈ 4 ký tự)
- **Mức độ sáng tạo (Temperature)**: 0 = Chính xác, 1 = Sáng tạo
- **Phong cách trả lời**: Ngắn gọn / Chi tiết / Toàn diện
- **Trích dẫn nguồn**: Luôn luôn / Khi có sẵn / Không bao giờ
- **Tin nhắn dự phòng**: Tin nhắn khi không tìm thấy câu trả lời

**Giới hạn & Bảo mật:**
- **Giới hạn số câu hỏi/phút**: Rate limiting
- **Độ dài câu hỏi tối đa**: Số ký tự tối đa
- **Lọc nội dung**: Nghiêm ngặt / Trung bình / Thoải mái

### 3. Tab "AI Model" 🤖
Cấu hình model AI và tối ưu hóa:

**Chọn Model:**
- **Nhà cung cấp AI**: Google AI / OpenAI / Cả hai
- **Google AI Model**: 
  - Gemini 2.5 Flash (Khuyến nghị - nhanh, chính xác)
  - Gemini 2.0 Flash
  - Gemini 2.5 Pro (Mạnh nhất)
  - Gemini 1.5 Flash/Pro
- **OpenAI Model**:
  - GPT-4o Mini (Khuyến nghị - cân bằng)
  - GPT-4o
  - GPT-4 Turbo
  - GPT-3.5 Turbo

**API Keys:**
- **Google API Key**: Cấu hình key cho Google AI
- **OpenAI API Key**: Cấu hình key cho OpenAI

**Tối ưu hóa:**
- **Bật cache kết quả**: Giảm chi phí và tăng tốc độ
- **Thời gian cache**: Thời gian lưu cache (phút)
- **Số tài liệu tối đa**: Số tài liệu gửi cho AI (1-5)

### 4. Tab "Lịch sử" 📜
Xem lịch sử các thay đổi cấu hình:

- Thời gian thay đổi
- Người thực hiện
- Nội dung thay đổi

## Lưu cấu hình

Sau khi thay đổi bất kỳ cài đặt nào:
1. Click nút **"Lưu thay đổi"** ở cuối trang
2. Đợi thông báo "Thành công"
3. Cấu hình mới sẽ được áp dụng ngay lập tức

## Lưu ý quan trọng

⚠️ **Chỉ admin mới có quyền truy cập trang này**
- Email admin: `nhan1545a@gmail.com`

⚠️ **Thay đổi API key**
- Cần khởi động lại server sau khi thay đổi API key
- Để trống nếu không muốn thay đổi

⚠️ **Khuyến nghị cấu hình**
- **Model**: Gemini 2.5 Flash (nhanh, rẻ, chính xác)
- **Temperature**: 0.3 (cho luật pháp)
- **Cache**: Bật (giảm chi phí)
- **Số tài liệu**: 3 (cân bằng giữa chất lượng và tốc độ)

## Troubleshooting

### Không thấy trang cấu hình
- Kiểm tra đã đăng nhập với tài khoản admin chưa
- Xóa cache trình duyệt và refresh

### Thay đổi không có hiệu lực
- Đảm bảo đã click "Lưu thay đổi"
- Kiểm tra console có lỗi không
- Thử refresh trang

### Lỗi khi lưu
- Kiểm tra kết nối internet
- Xem console log để biết chi tiết lỗi
- Thử lại sau vài giây
