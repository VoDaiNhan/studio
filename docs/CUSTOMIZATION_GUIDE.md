# 🎨 Hướng dẫn Tùy chỉnh Giao diện

## Tổng quan

Hệ thống cho phép admin tùy chỉnh giao diện chatbot và áp dụng cho toàn bộ ứng dụng, bao gồm cả trang người dùng.

## ✨ Tính năng tùy chỉnh

### 1. **Thông tin chung**

#### Tên hiển thị
- Tên chatbot hiển thị cho người dùng
- Mặc định: "Trợ lý Luật Giao thông"
- Hiển thị ở: Header, Chat page, Welcome message

#### Lời chào
- Tin nhắn đầu tiên khi người dùng vào chat
- Mặc định: "Chào bạn! Tôi có thể giúp gì cho bạn về Luật Giao thông?"
- Hiển thị ở: Chat page (khi chưa có tin nhắn)

#### Persona AI
- **Chuyên gia**: Giọng văn chuyên nghiệp, chính xác
- **Thân thiện**: Giọng văn gần gũi, dễ hiểu
- **Chuyên nghiệp**: Cân bằng giữa chuyên môn và thân thiện

---

### 2. **Màu sắc**

#### Màu chính (Primary Color)
- Màu chủ đạo của ứng dụng
- Mặc định: `#2563EB` (Blue)
- Áp dụng cho:
  - Nút gửi tin nhắn
  - Avatar bot
  - Tin nhắn người dùng
  - Icons và highlights

#### Màu nhấn (Accent Color)
- Màu phụ để làm nổi bật
- Mặc định: `#FBBF24` (Yellow)
- Áp dụng cho:
  - Nút microphone
  - Hover effects
  - Secondary buttons

#### Màu nền (Background Color)
- Màu nền tổng thể
- Mặc định: `#F3F4F6` (Light Gray)
- Áp dụng cho:
  - Background của app
  - Cards và containers

---

### 3. **Logo & Biểu tượng**

#### Logo
- Logo chính của ứng dụng
- Hiển thị ở: Header, Sidebar
- Format: PNG, JPG, SVG
- Kích thước đề xuất: 200x200px

#### Biểu tượng Chatbot
- Avatar của bot trong chat
- Hiển thị ở: Chat messages
- Format: PNG, JPG
- Kích thước đề xuất: 100x100px

---

## 🚀 Cách sử dụng

### Bước 1: Truy cập Dashboard Admin

1. Đăng nhập với tài khoản admin
2. Vào `/dashboard`
3. Click tab **"Giao diện"**

### Bước 2: Tùy chỉnh thông tin

```
1. Nhập "Tên hiển thị"
2. Nhập "Lời chào"
3. Chọn "Persona của AI"
```

### Bước 3: Chọn màu sắc

```
1. Click vào ô màu "Màu chính"
2. Chọn màu từ color picker
3. Lặp lại cho "Màu nhấn" và "Màu nền"
```

### Bước 4: Upload logo (Tùy chọn)

```
1. Click "Chọn tệp" ở mục Logo
2. Chọn file ảnh từ máy tính
3. Lặp lại cho "Biểu tượng Chatbot"
```

### Bước 5: Lưu thay đổi

```
1. Click nút "Lưu Giao diện"
2. Đợi thông báo thành công
3. Refresh trang để xem thay đổi
```

---

## 📱 Áp dụng cho trang người dùng

### Tự động áp dụng

Khi admin lưu cấu hình, các thay đổi sẽ **tự động áp dụng** cho:

✅ **Trang Chat** (`/chat`)
- Màu sắc buttons
- Avatar bot
- Welcome message
- Display name

✅ **Header & Sidebar**
- Logo tùy chỉnh
- Màu icons

✅ **Toàn bộ ứng dụng**
- CSS variables được cập nhật
- Theme colors

### Cách hoạt động

```typescript
// 1. Load config khi trang chat mount
useEffect(() => {
  const config = await getAppearanceConfig();
  setConfig(config);
  
  // 2. Apply CSS variables
  document.documentElement.style.setProperty('--primary-color', config.primaryColor);
  document.documentElement.style.setProperty('--accent-color', config.accentColor);
  document.documentElement.style.setProperty('--background-color', config.backgroundColor);
}, []);

// 3. Use config in components
<Button style={{ backgroundColor: config.primaryColor }}>
  Send
</Button>
```

---

## 🎨 Ví dụ cấu hình

### Theme 1: Professional Blue
```json
{
  "displayName": "Trợ lý Luật Chuyên nghiệp",
  "welcomeMessage": "Xin chào! Tôi sẵn sàng hỗ trợ bạn về các vấn đề pháp lý.",
  "aiPersona": "professional",
  "primaryColor": "#2563EB",
  "accentColor": "#10B981",
  "backgroundColor": "#F9FAFB"
}
```

### Theme 2: Friendly Green
```json
{
  "displayName": "Bạn Luật Thân thiện",
  "welcomeMessage": "Chào bạn! Mình có thể giúp gì cho bạn hôm nay?",
  "aiPersona": "friendly",
  "primaryColor": "#10B981",
  "accentColor": "#FBBF24",
  "backgroundColor": "#F0FDF4"
}
```

### Theme 3: Expert Red
```json
{
  "displayName": "Chuyên gia Luật",
  "welcomeMessage": "Chào mừng! Tôi là chuyên gia tư vấn pháp luật.",
  "aiPersona": "expert",
  "primaryColor": "#DC2626",
  "accentColor": "#F59E0B",
  "backgroundColor": "#FEF2F2"
}
```

---

## 🔧 Technical Details

### File cấu hình

```
src/data/appearance-config.json
```

### Schema

```typescript
interface AppearanceConfig {
  displayName: string;
  welcomeMessage: string;
  aiPersona: 'expert' | 'friendly' | 'professional';
  primaryColor: string; // Hex color #RRGGBB
  accentColor: string;
  backgroundColor: string;
}
```

### API Actions

```typescript
// Get config
const config = await getAppearanceConfig();

// Update config
await updateAppearanceConfig({
  displayName: "New Name",
  primaryColor: "#FF0000",
  // ...
});
```

### CSS Variables

```css
:root {
  --primary-color: #2563EB;
  --accent-color: #FBBF24;
  --background-color: #F3F4F6;
}
```

---

## 🎯 Best Practices

### Chọn màu sắc

1. **Contrast**: Đảm bảo màu text và background có độ tương phản tốt
2. **Consistency**: Sử dụng màu nhất quán trong toàn bộ app
3. **Accessibility**: Tuân thủ WCAG guidelines (contrast ratio ≥ 4.5:1)

### Logo & Icons

1. **Format**: Ưu tiên SVG hoặc PNG với background trong suốt
2. **Size**: Không quá lớn (< 500KB)
3. **Quality**: Độ phân giải cao cho retina displays

### Testing

1. Test trên nhiều devices (mobile, tablet, desktop)
2. Test với nhiều browsers (Chrome, Firefox, Safari)
3. Test accessibility với screen readers

---

## 🐛 Troubleshooting

### Màu không áp dụng

**Nguyên nhân:**
- Cache browser
- CSS variables chưa load

**Giải pháp:**
```bash
# Clear cache
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Hard refresh
Ctrl + F5
```

### Logo không hiển thị

**Nguyên nhân:**
- File quá lớn
- Format không hỗ trợ
- Path không đúng

**Giải pháp:**
- Resize image < 500KB
- Convert to PNG/JPG
- Check file path

### Config không lưu

**Nguyên nhân:**
- Validation error
- File permission
- Server error

**Giải pháp:**
- Check console logs
- Verify file permissions
- Check server logs

---

## 📚 Resources

- [Color Picker Tool](https://htmlcolorcodes.com/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Image Optimizer](https://tinypng.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Basic customization (colors, text)
- ✅ Logo upload support
- ✅ Auto-apply to user pages
- ✅ CSS variables integration

### Version 1.1.0 (Planned)
- [ ] Font customization
- [ ] Advanced theme presets
- [ ] Dark mode support
- [ ] Custom CSS injection

---

**Last Updated**: November 2025  
**Maintained by**: ABAII Development Team
