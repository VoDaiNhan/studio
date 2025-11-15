# ⚡ Quick Start Guide

Hướng dẫn nhanh để chạy dự án trong 5 phút!

---

## 🚀 Cài đặt nhanh

### 1. Clone & Install (2 phút)

```bash
# Clone repository
git clone <repository-url>
cd nextn

# Cài đặt dependencies
npm install
```

### 2. Cấu hình Environment (2 phút)

```bash
# Copy file .env.example
cp .env.example .env
```

**Mở file `.env` và điền:**

```env
# Firebase (bắt buộc)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google AI (bắt buộc)
GOOGLE_API_KEY=AIzaSyADW1...
```

**Lấy API Keys:**
- Firebase: https://console.firebase.google.com/ → Project Settings
- Google AI: https://makersuite.google.com/app/apikey

### 3. Chạy ứng dụng (1 phút)

```bash
npm run dev
```

Mở trình duyệt: **http://localhost:9002**

---

## ✅ Checklist

- [ ] Node.js >= 18.x đã cài đặt
- [ ] Dependencies đã install (`npm install`)
- [ ] File `.env` đã tạo và điền đầy đủ
- [ ] Firebase project đã tạo
- [ ] Google AI API key đã có
- [ ] Dev server đang chạy

---

## 🎯 Test nhanh

### 1. Đăng ký tài khoản

```
URL: http://localhost:9002/signup
Email: test@example.com
Password: 123456
```

### 2. Đăng nhập

```
URL: http://localhost:9002/login
Email: test@example.com
Password: 123456
```

### 3. Chat với AI

```
Câu hỏi: "Vượt đèn đỏ bị phạt bao nhiêu?"
```

---

## 🐛 Lỗi thường gặp

### Port đã được sử dụng

```bash
# Đổi port trong package.json
"dev": "next dev --turbopack -p 3000"
```

### Firebase error

```bash
# Kiểm tra lại .env
# Đảm bảo không có khoảng trắng thừa
# Restart: npm run dev
```

### Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tài liệu đầy đủ

- [README.md](./README.md) - Tổng quan dự án
- [INSTALLATION.md](./INSTALLATION.md) - Hướng dẫn chi tiết
- [DEPENDENCIES.md](./DEPENDENCIES.md) - Danh sách thư viện

---

## 💡 Tips

```bash
# Xem logs chi tiết
npm run dev -- --verbose

# Build production
npm run build

# Test AI flows
npm run genkit:dev
```

---

**Chúc bạn thành công! 🎉**

Nếu gặp vấn đề: support@tracuuluat.vn
