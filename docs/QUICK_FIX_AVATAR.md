# 🔧 Quick Fix: Avatar Storage

## Vấn đề đã giải quyết

Lỗi 400 khi sử dụng Firebase Admin SDK do chưa cấu hình service account.

## ✅ Giải pháp

Sử dụng **Client-side Firestore** thay vì Server-side để đơn giản hơn và không cần service account.

## 📁 Files mới

### `src/lib/user-profile-client.ts`
Client-side functions để:
- ✅ Lấy user profile từ Firestore
- ✅ Lưu user profile
- ✅ Cập nhật avatar

## 🚀 Cách hoạt động

### 1. Upload Avatar
```typescript
// User chọn file
const file = e.target.files[0];

// Validate
const { valid, error } = validateImageFile(file);

// Upload to Firebase Storage
const { url, path } = await uploadUserAvatar(userId, file);

// Update Firebase Auth
await updateProfile(user, { photoURL: url });

// Save to Firestore (client-side)
await updateUserAvatarClient(userId, url, path);
```

### 2. Load Profile
```typescript
// Load from Firestore
const profile = await getUserProfileClient(userId);

// Fallback to localStorage if not found
if (!profile) {
  // Use localStorage data
}
```

### 3. Save Profile
```typescript
// Save to Firestore
await saveUserProfileClient(userId, {
  displayName,
  email,
  photoURL,
  phone,
  bio,
  location,
  occupation
});

// Also save to localStorage for backup
localStorage.setItem('userPhone', phone);
```

## 🔐 Security

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow write only for owner
      allow write: if request.auth != null 
                   && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/avatar/{filename} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow write only for owner
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## ✅ Ưu điểm

1. **Không cần Service Account**
   - Không cần FIREBASE_PRIVATE_KEY
   - Không cần FIREBASE_CLIENT_EMAIL
   - Đơn giản hơn để setup

2. **Real-time Updates**
   - Client-side có thể listen real-time
   - Faster updates

3. **Dễ debug**
   - Lỗi hiển thị trực tiếp trong browser console
   - Dễ test

## 📝 Cấu hình cần thiết

Chỉ cần các biến môi trường cơ bản:

```env
# Firebase Client (đã có)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Google AI
GOOGLE_API_KEY=...
```

## 🎯 Kết quả

- ✅ Upload avatar hoạt động
- ✅ Lưu vào Firebase Storage
- ✅ Đồng bộ với Firebase Auth
- ✅ Lưu metadata vào Firestore
- ✅ Hiển thị ở mọi nơi (header, profile, chat)
- ✅ Không có lỗi 400

## 🔄 Migration từ Server-side

Nếu sau này muốn dùng Server-side (Firebase Admin):

1. Tạo Service Account trong Firebase Console
2. Thêm credentials vào `.env`
3. Uncomment code trong `src/lib/firebase-admin.ts`
4. Thay `*Client` functions → server actions

## 📚 Files liên quan

```
src/lib/user-profile-client.ts       # Client-side operations
src/lib/storage.ts                    # Storage utilities
src/app/settings/page.tsx             # Settings page
src/components/user-profile-card.tsx  # Profile display
src/firebase/index.ts                 # Firebase init
```

---

**Status**: ✅ Working  
**Last Updated**: November 2025
