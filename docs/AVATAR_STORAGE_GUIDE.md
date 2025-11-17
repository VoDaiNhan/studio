# 📸 Hướng dẫn Lưu trữ Avatar

## Tổng quan

Hệ thống lưu trữ avatar cho phép mỗi tài khoản có ảnh đại diện riêng, được lưu trữ an toàn trên Firebase Storage và đồng bộ với Firestore.

## 🎯 Tính năng

### 1. **Upload Avatar**
- ✅ Upload ảnh từ máy tính
- ✅ Xem trước ảnh ngay lập tức
- ✅ Validate file (type, size)
- ✅ Lưu vào Firebase Storage
- ✅ Đồng bộ với Firebase Auth
- ✅ Lưu metadata vào Firestore

### 2. **Quản lý Avatar**
- ✅ Mỗi user có folder riêng
- ✅ Tự động xóa ảnh cũ khi upload mới
- ✅ URL công khai để hiển thị
- ✅ Backup path trong Firestore

### 3. **Bảo mật**
- ✅ Chỉ user đăng nhập mới upload được
- ✅ Mỗi user chỉ truy cập folder của mình
- ✅ Validate file type và size
- ✅ Firebase Security Rules

---

## 🚀 Cách sử dụng

### Upload Avatar

1. **Vào trang Settings**
   ```
   /settings → Tab "Hồ sơ"
   ```

2. **Click "Thay đổi ảnh đại diện"**
   - Chọn file ảnh từ máy tính
   - Chấp nhận: JPG, PNG, GIF, WEBP
   - Tối đa: 2MB

3. **Xem trước và xác nhận**
   - Ảnh hiển thị ngay lập tức
   - Click "Lưu thay đổi"

4. **Avatar được cập nhật**
   - Hiển thị ở header
   - Hiển thị ở profile
   - Hiển thị ở chat messages

---

## 🔧 Technical Details

### Storage Structure

```
Firebase Storage:
└── users/
    └── {userId}/
        └── avatar/
            └── avatar_1234567890.jpg
```

### Firestore Structure

```typescript
users/{userId}
{
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;        // Public URL
  avatarPath: string;      // Storage path
  phone?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  createdAt: string;
  updatedAt: string;
}
```

### File Validation

```typescript
// Allowed types
const validTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

// Max size: 2MB
const maxSize = 2 * 1024 * 1024;
```

---

## 📝 API Functions

### Upload Avatar

```typescript
import { uploadUserAvatar } from '@/lib/storage';

const { url, path } = await uploadUserAvatar(userId, file);
// url: Public download URL
// path: Storage path for deletion
```

### Delete Avatar

```typescript
import { deleteUserAvatar } from '@/lib/storage';

await deleteUserAvatar(path);
```

### Validate File

```typescript
import { validateImageFile } from '@/lib/storage';

const { valid, error } = validateImageFile(file);
if (!valid) {
  console.error(error);
}
```

### Save Profile

```typescript
import { saveUserProfile } from '@/app/actions/user-profile';

await saveUserProfile(userId, {
  photoURL: url,
  avatarPath: path,
  displayName: 'John Doe',
  // ... other fields
});
```

### Get Profile

```typescript
import { getUserProfile } from '@/app/actions/user-profile';

const profile = await getUserProfile(userId);
console.log(profile.photoURL);
```

---

## 🔐 Firebase Security Rules

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars
    match /users/{userId}/avatar/{filename} {
      // Allow read for all authenticated users
      allow read: if request.auth != null;
      
      // Allow write only for the owner
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024  // 2MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow write only for the owner
      allow write: if request.auth != null 
                   && request.auth.uid == userId;
    }
  }
}
```

---

## 🎨 UI Components

### Avatar Display

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar className="h-12 w-12">
  <AvatarImage src={user?.photoURL || undefined} />
  <AvatarFallback>
    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
  </AvatarFallback>
</Avatar>
```

### Upload Button

```typescript
<Input
  id="photo-upload"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handlePhotoUpload}
/>
<Label htmlFor="photo-upload" className="cursor-pointer">
  Thay đổi ảnh đại diện
</Label>
```

---

## 📊 Data Flow

```
1. User selects image
   ↓
2. Validate file (type, size)
   ↓
3. Show preview (base64)
   ↓
4. Upload to Firebase Storage
   ↓
5. Get public URL
   ↓
6. Update Firebase Auth profile
   ↓
7. Save to Firestore
   ↓
8. Update UI
```

---

## 🐛 Troubleshooting

### Upload thất bại

**Nguyên nhân:**
- File quá lớn (> 2MB)
- Format không hỗ trợ
- Không có quyền
- Lỗi network

**Giải pháp:**
```bash
1. Resize ảnh < 2MB
2. Convert sang JPG/PNG
3. Kiểm tra đăng nhập
4. Thử lại với kết nối tốt hơn
```

### Avatar không hiển thị

**Nguyên nhân:**
- URL không hợp lệ
- Chưa đồng bộ
- Cache browser

**Giải pháp:**
```bash
1. Refresh trang (Ctrl + F5)
2. Kiểm tra Firestore data
3. Xóa cache browser
4. Upload lại ảnh
```

### Lỗi permission

**Nguyên nhân:**
- Firebase Rules chưa đúng
- User chưa đăng nhập
- UID không khớp

**Giải pháp:**
```bash
1. Kiểm tra Firebase Rules
2. Đăng nhập lại
3. Verify user.uid
```

---

## 🔄 Migration Guide

### Từ localStorage sang Firestore

```typescript
// Old way (localStorage)
localStorage.setItem('userPhone', phone);

// New way (Firestore)
await saveUserProfile(userId, {
  phone,
  bio,
  location,
  occupation
});
```

### Migrate existing users

```typescript
// Run once to migrate
async function migrateUserData(userId: string) {
  const phone = localStorage.getItem('userPhone');
  const bio = localStorage.getItem('userBio');
  const location = localStorage.getItem('userLocation');
  const occupation = localStorage.getItem('userOccupation');
  
  await saveUserProfile(userId, {
    phone: phone || '',
    bio: bio || '',
    location: location || '',
    occupation: occupation || ''
  });
}
```

---

## 📈 Performance

### Optimization Tips

1. **Image Compression**
   ```typescript
   // Use image compression library
   import imageCompression from 'browser-image-compression';
   
   const compressed = await imageCompression(file, {
     maxSizeMB: 1,
     maxWidthOrHeight: 500
   });
   ```

2. **Lazy Loading**
   ```typescript
   <img 
     src={photoURL} 
     loading="lazy"
     alt="Avatar"
   />
   ```

3. **Caching**
   ```typescript
   // Browser caches images automatically
   // Use CDN for better performance
   ```

---

## 📚 Related Files

```
src/lib/storage.ts                    # Storage utilities
src/app/actions/user-profile.ts       # Profile actions
src/app/settings/page.tsx             # Settings page
src/firebase/index.ts                 # Firebase init
src/components/user-profile-card.tsx  # Profile display
```

---

## ✅ Checklist

- [x] Firebase Storage initialized
- [x] Upload function implemented
- [x] Validation added
- [x] Firestore integration
- [x] UI components updated
- [x] Error handling
- [x] Security rules
- [x] Documentation

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintained by**: ABAII Development Team
