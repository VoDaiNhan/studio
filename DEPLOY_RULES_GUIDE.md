# 🚀 Hướng dẫn Deploy Firebase Rules

## 📋 Các file đã tạo

```
✅ firestore.rules          # Firestore Security Rules
✅ storage.rules            # Storage Security Rules  
✅ firebase.json            # Firebase config
✅ firestore.indexes.json   # Firestore indexes
✅ deploy-rules.bat         # Deploy script (Windows)
```

---

## 🔧 Cách 1: Deploy tự động (Khuyến nghị)

### Bước 1: Cài đặt Firebase CLI

```bash
npm install -g firebase-tools
```

### Bước 2: Chạy script deploy

**Windows:**
```bash
deploy-rules.bat
```

**Mac/Linux:**
```bash
chmod +x deploy-rules.sh
./deploy-rules.sh
```

Hoặc chạy trực tiếp:
```bash
firebase login
firebase deploy --only firestore:rules,storage --project studio-3896797610-76c8c
```

---

## 🔧 Cách 2: Deploy thủ công từ Firebase Console

### Firestore Rules

1. Vào: https://console.firebase.google.com/project/studio-3896797610-76c8c/firestore/rules

2. Copy nội dung từ file `firestore.rules` và paste vào

3. Click **"Publish"**

### Storage Rules

1. Vào: https://console.firebase.google.com/project/studio-3896797610-76c8c/storage/rules

2. Copy nội dung từ file `storage.rules` và paste vào

3. Click **"Publish"**

---

## 📝 Nội dung Rules

### Firestore Rules

```javascript
✅ Users có thể đọc profile của nhau
✅ Users chỉ có thể sửa profile của mình
✅ Users chỉ có thể đọc/ghi conversations của mình
✅ Authenticated users có thể đọc knowledge sources
```

### Storage Rules

```javascript
✅ Users có thể xem avatar của nhau
✅ Users chỉ có thể upload avatar cho mình
✅ Avatar max 2MB, chỉ chấp nhận images
✅ Documents max 10MB
```

---

## ✅ Kiểm tra sau khi deploy

### Test Firestore

```javascript
// Trong browser console
const { firestore } = initializeFirebase();
const userDoc = doc(firestore, 'users', 'YOUR_USER_ID');
await setDoc(userDoc, { test: 'data' });
// Nếu thành công → Rules đã hoạt động!
```

### Test Storage

```javascript
// Upload avatar trong Settings page
// Nếu upload thành công → Rules đã hoạt động!
```

---

## 🐛 Troubleshooting

### Lỗi: "Firebase CLI not found"

**Giải pháp:**
```bash
npm install -g firebase-tools
```

### Lỗi: "Permission denied"

**Giải pháp:**
```bash
firebase login
# Đăng nhập với account có quyền admin
```

### Lỗi: "Project not found"

**Giải pháp:**
```bash
# Kiểm tra project ID
firebase projects:list

# Hoặc init lại
firebase init
```

### Lỗi: "Missing or insufficient permissions" (sau khi deploy)

**Nguyên nhân:** Rules chưa được deploy đúng

**Giải pháp:**
1. Kiểm tra lại trong Firebase Console
2. Deploy lại: `firebase deploy --only firestore:rules,storage`
3. Đợi 1-2 phút để rules có hiệu lực

---

## 🔐 Security Best Practices

### ✅ Nên làm:
- Luôn require authentication
- Validate data types và sizes
- Limit read/write permissions
- Use user ID để phân quyền

### ❌ Không nên:
- Không dùng `allow read, write: if true;` trong production
- Không cho phép anonymous users
- Không skip validation

---

## 📊 Monitoring

### Xem logs

```bash
firebase functions:log --project studio-3896797610-76c8c
```

### Xem usage

```
Firebase Console → Usage and billing
```

---

## 🔄 Update Rules

Khi cần update rules:

1. Sửa file `firestore.rules` hoặc `storage.rules`
2. Chạy lại deploy script
3. Hoặc: `firebase deploy --only firestore:rules,storage`

---

## 📚 Resources

- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

**Status**: ✅ Ready to deploy  
**Project**: studio-3896797610-76c8c  
**Last Updated**: November 2025
