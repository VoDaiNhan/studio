# 👤 Hướng dẫn Cài đặt Tài khoản

## Tổng quan

Trang cài đặt cho phép người dùng quản lý thông tin cá nhân, bảo mật, và tùy chỉnh trải nghiệm sử dụng.

## 🎯 Tính năng

### 1. **Hồ sơ cá nhân** (Profile)

#### Thông tin cơ bản
- ✅ Ảnh đại diện
- ✅ Họ và tên
- ✅ Email (không thể chỉnh sửa)
- ✅ Số điện thoại
- ✅ Địa chỉ
- ✅ Nghề nghiệp
- ✅ Giới thiệu bản thân

#### Cách cập nhật
1. Truy cập `/settings`
2. Tab "Hồ sơ"
3. Chỉnh sửa thông tin
4. Click "Lưu thay đổi"

---

### 2. **Bảo mật** (Security)

#### Đổi mật khẩu
- Nhập mật khẩu hiện tại
- Nhập mật khẩu mới (≥ 6 ký tự)
- Xác nhận mật khẩu mới
- Click "Đổi mật khẩu"

#### Xác thực hai yếu tố (2FA)
- Tính năng đang phát triển
- Tăng cường bảo mật tài khoản

---

### 3. **Tùy chọn** (Preferences)

#### Ngôn ngữ
- 🇻🇳 Tiếng Việt
- 🇬🇧 English

#### Giao diện
- ☀️ Sáng (Light)
- 🌙 Tối (Dark)
- 🔄 Tự động (Auto)

#### Âm thanh
- Bật/tắt âm thanh thông báo
- Phát âm khi có tin nhắn mới

---

### 4. **Thông báo** (Notifications)

#### Kênh nhận thông báo
- 📧 Email thông báo
- 🔔 Thông báo đẩy (Push)

#### Loại thông báo
- ✅ Luật mới được cập nhật
- ✅ Câu trả lời được xác minh
- ✅ Tin nhắn mới
- ⚙️ Cập nhật hệ thống

---

## 🚀 Cách sử dụng

### Truy cập Settings

**Cách 1: Từ Sidebar**
```
1. Click "Tài khoản & Cài đặt" trong sidebar
2. Hoặc truy cập trực tiếp: /settings
```

**Cách 2: Từ Header**
```
1. Click vào avatar ở góc trên bên phải
2. Chọn "Settings" trong dropdown
```

### Cập nhật ảnh đại diện

```
1. Vào tab "Hồ sơ"
2. Click "Thay đổi ảnh đại diện"
3. Chọn file ảnh (JPG, PNG, GIF)
4. Tối đa 2MB
5. Click "Lưu thay đổi"
```

### Đổi mật khẩu

```
1. Vào tab "Bảo mật"
2. Nhập mật khẩu hiện tại
3. Nhập mật khẩu mới (≥ 6 ký tự)
4. Xác nhận mật khẩu mới
5. Click "Đổi mật khẩu"
```

### Thay đổi ngôn ngữ

```
1. Vào tab "Tùy chọn"
2. Chọn ngôn ngữ từ dropdown
3. Click "Lưu tùy chọn"
4. Trang sẽ tự động reload
```

### Bật/tắt thông báo

```
1. Vào tab "Thông báo"
2. Toggle switches theo ý muốn
3. Click "Lưu cài đặt"
```

---

## 📱 Trang Profile

### Truy cập Profile

```
URL: /profile
```

### Nội dung hiển thị

#### Thông tin cá nhân
- Avatar
- Tên
- Email
- Địa chỉ
- Nghề nghiệp
- Ngày tham gia
- Giới thiệu

#### Thống kê
- 📊 Tổng câu hỏi
- ⭐ Câu trả lời đã lưu
- ⏱️ Thời gian phản hồi TB
- 📈 Chủ đề phổ biến

#### Hoạt động gần đây
- Câu hỏi đã hỏi
- Câu trả lời đã lưu
- Timeline hoạt động

---

## 🎨 UI Components

### UserProfileCard

Component hiển thị thông tin user ngắn gọn:

```typescript
import { UserProfileCard } from '@/components/user-profile-card';

<UserProfileCard />
```

**Hiển thị:**
- Avatar
- Tên
- Badge xác minh
- Email
- Địa chỉ
- Nghề nghiệp
- Ngày tham gia
- Giới thiệu

---

## 🔧 Technical Details

### Data Storage

#### Firebase Auth
```typescript
// User basic info
user.displayName
user.email
user.photoURL
user.emailVerified
user.metadata.creationTime
```

#### LocalStorage
```typescript
// Additional user info
localStorage.setItem('userPhone', phone);
localStorage.setItem('userBio', bio);
localStorage.setItem('userLocation', location);
localStorage.setItem('userOccupation', occupation);

// Preferences
localStorage.setItem('language', 'vi');
localStorage.setItem('theme', 'light');
localStorage.setItem('emailNotifications', 'true');
localStorage.setItem('pushNotifications', 'true');
localStorage.setItem('soundEnabled', 'true');
```

### API Actions

#### Update Profile
```typescript
import { updateProfile } from 'firebase/auth';

await updateProfile(user, {
  displayName: 'New Name',
  photoURL: 'https://...',
});
```

#### Update Password
```typescript
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

// Re-authenticate
const credential = EmailAuthProvider.credential(email, currentPassword);
await reauthenticateWithCredential(user, credential);

// Update password
await updatePassword(user, newPassword);
```

### Routes

```
/settings       - Trang cài đặt
/profile        - Trang profile
```

---

## 📊 User Stats

### Metrics Tracked

```typescript
interface UserStats {
  totalQueries: number;        // Tổng câu hỏi
  totalBookmarks: number;      // Câu trả lời đã lưu
  avgResponseTime: number;     // Thời gian phản hồi TB
  mostUsedTopic: string;       // Chủ đề phổ biến nhất
}
```

### Data Source

```typescript
// From Firestore
const conversationsRef = collection(firestore, 'users', userId, 'conversations');
const q = query(conversationsRef, orderBy('timestamp', 'desc'));
const snapshot = await getDocs(q);
```

---

## 🎯 Best Practices

### Security

1. **Mật khẩu mạnh**
   - Ít nhất 6 ký tự
   - Kết hợp chữ, số, ký tự đặc biệt
   - Không dùng thông tin cá nhân

2. **Xác minh email**
   - Xác minh email sau khi đăng ký
   - Tăng độ tin cậy tài khoản

3. **Bảo mật thông tin**
   - Không chia sẻ mật khẩu
   - Đăng xuất khi dùng máy chung

### Privacy

1. **Thông tin cá nhân**
   - Chỉ cung cấp thông tin cần thiết
   - Kiểm tra quyền riêng tư

2. **Ảnh đại diện**
   - Sử dụng ảnh phù hợp
   - Không upload ảnh nhạy cảm

### UX

1. **Cập nhật thường xuyên**
   - Giữ thông tin luôn chính xác
   - Cập nhật khi có thay đổi

2. **Tùy chỉnh trải nghiệm**
   - Chọn ngôn ngữ phù hợp
   - Bật/tắt thông báo theo nhu cầu

---

## 🐛 Troubleshooting

### Không thể cập nhật profile

**Nguyên nhân:**
- Không có quyền
- Lỗi network
- Session hết hạn

**Giải pháp:**
```bash
1. Đăng xuất và đăng nhập lại
2. Kiểm tra kết nối internet
3. Clear cache và thử lại
```

### Đổi mật khẩu thất bại

**Nguyên nhân:**
- Mật khẩu hiện tại sai
- Mật khẩu mới quá yếu
- Session hết hạn

**Giải pháp:**
```bash
1. Kiểm tra lại mật khẩu hiện tại
2. Đảm bảo mật khẩu mới ≥ 6 ký tự
3. Đăng nhập lại nếu cần
```

### Ảnh không upload được

**Nguyên nhân:**
- File quá lớn (> 2MB)
- Format không hỗ trợ
- Lỗi network

**Giải pháp:**
```bash
1. Resize ảnh < 2MB
2. Convert sang JPG/PNG
3. Thử lại với kết nối tốt hơn
```

---

## 📚 Related Pages

- [Customization Guide](./CUSTOMIZATION_GUIDE.md)
- [Analytics Feature](./ANALYTICS_FEATURE.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

---

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Profile management
- ✅ Password change
- ✅ Preferences settings
- ✅ Notification settings
- ✅ User profile page
- ✅ User stats display

### Version 1.1.0 (Planned)
- [ ] 2FA authentication
- [ ] Social login integration
- [ ] Advanced privacy settings
- [ ] Export user data
- [ ] Delete account option

---

**Last Updated**: November 2025  
**Maintained by**: ABAII Development Team
