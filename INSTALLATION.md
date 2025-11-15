# 📖 Hướng dẫn Cài đặt Chi tiết

## Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt môi trường](#cài-đặt-môi-trường)
3. [Cấu hình Firebase](#cấu-hình-firebase)
4. [Cấu hình Google AI](#cấu-hình-google-ai)
5. [Chạy ứng dụng](#chạy-ứng-dụng)
6. [Deploy lên Production](#deploy-lên-production)
7. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)

---

## Yêu cầu hệ thống

### Phần mềm cần thiết

- **Node.js**: Phiên bản 18.x trở lên
  - Download: https://nodejs.org/
  - Kiểm tra: `node --version`

- **npm**: Đi kèm với Node.js
  - Kiểm tra: `npm --version`

- **Git**: Để clone repository
  - Download: https://git-scm.com/
  - Kiểm tra: `git --version`

### Tài khoản cần thiết

- **Firebase Account**: https://firebase.google.com/
- **Google Cloud Account**: https://console.cloud.google.com/
- **Google AI Studio**: https://makersuite.google.com/

---

## Cài đặt môi trường

### Bước 1: Clone Repository

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd nextn
```

### Bước 2: Cài đặt Dependencies

```bash
# Sử dụng npm
npm install

# Hoặc yarn
yarn install

# Hoặc pnpm (nhanh hơn)
pnpm install
```

**Lưu ý**: Quá trình cài đặt có thể mất 5-10 phút tùy vào tốc độ mạng.

### Bước 3: Tạo file Environment Variables

```bash
# Tạo file .env từ template
cp .env.example .env

# Hoặc tạo file mới
touch .env
```

---

## Cấu hình Firebase

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** hoặc **"Thêm dự án"**
3. Nhập tên project: `ai-tra-cuu-luat`
4. Tắt Google Analytics (không bắt buộc)
5. Click **"Create project"**

### Bước 2: Thêm Web App

1. Trong Firebase Console, click icon **Web** (`</>`)
2. Nhập nickname: `AI Tra cuu Luat Web`
3. **Không** check "Firebase Hosting"
4. Click **"Register app"**
5. Copy các thông tin config hiển thị

### Bước 3: Cấu hình Authentication

1. Trong sidebar, chọn **"Authentication"**
2. Click **"Get started"**
3. Chọn tab **"Sign-in method"**
4. Enable **"Email/Password"**:
   - Click vào "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### Bước 4: Tạo Firestore Database

1. Trong sidebar, chọn **"Firestore Database"**
2. Click **"Create database"**
3. Chọn location: `asia-southeast1` (Singapore)
4. Chọn **"Start in production mode"**
5. Click **"Enable"**

### Bước 5: Cấu hình Firestore Rules

1. Trong Firestore Database, chọn tab **"Rules"**
2. Copy nội dung từ file `firestore.rules` trong project
3. Paste vào editor
4. Click **"Publish"**

**Nội dung firestore.rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Conversations subcollection
      match /conversations/{conversationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public documents (if any)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Bước 6: Lấy Firebase Config

1. Vào **Project Settings** (icon bánh răng)
2. Scroll xuống phần **"Your apps"**
3. Copy các giá trị sau vào file `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Cấu hình Google AI

### Bước 1: Tạo Google AI API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng Google Account
3. Click **"Create API Key"**
4. Chọn project (hoặc tạo mới)
5. Copy API key

### Bước 2: Thêm vào Environment Variables

```env
GOOGLE_API_KEY=AIzaSyADW1SakIAr3RbBMSRh2zqGBk_px6aI0Fc
```

### Bước 3: Enable Gemini API

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project
3. Vào **"APIs & Services"** > **"Library"**
4. Tìm **"Generative Language API"**
5. Click **"Enable"**

---

## Chạy ứng dụng

### Development Mode

```bash
# Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:9002**

### Kiểm tra các tính năng

1. **Đăng ký tài khoản**:
   - Truy cập: http://localhost:9002/signup
   - Nhập email và mật khẩu
   - Click "Đăng ký"

2. **Đăng nhập**:
   - Truy cập: http://localhost:9002/login
   - Nhập thông tin đăng nhập
   - Click "Đăng nhập"

3. **Chat với AI**:
   - Sau khi đăng nhập, bạn sẽ được chuyển đến trang chat
   - Nhập câu hỏi: "Vượt đèn đỏ bị phạt bao nhiêu?"
   - Đợi AI trả lời

4. **Xem lịch sử**:
   - Click "Lịch sử trò chuyện" trong sidebar
   - Xem các cuộc hội thoại đã lưu

### Test AI Flows với Genkit

```bash
# Chạy Genkit UI
npm run genkit:dev
```

Genkit UI sẽ mở tại: **http://localhost:4000**

Tại đây bạn có thể:
- Test các AI flows
- Xem logs
- Debug prompts

---

## Deploy lên Production

### Option 1: Vercel (Khuyến nghị)

1. **Cài đặt Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Thêm Environment Variables**:
   - Vào Vercel Dashboard
   - Chọn project
   - Settings > Environment Variables
   - Thêm tất cả biến từ file `.env`

### Option 2: Firebase Hosting

1. **Cài đặt Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Login Firebase**:
```bash
firebase login
```

3. **Init Firebase**:
```bash
firebase init hosting
```

4. **Build và Deploy**:
```bash
npm run build
firebase deploy
```

### Option 3: Docker

1. **Tạo Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build Docker Image**:
```bash
docker build -t ai-tra-cuu-luat .
```

3. **Run Container**:
```bash
docker run -p 3000:3000 --env-file .env ai-tra-cuu-luat
```

---

## Xử lý lỗi thường gặp

### Lỗi 1: Firebase Configuration Error

**Triệu chứng**:
```
Firebase: Error (auth/invalid-api-key)
```

**Giải pháp**:
- Kiểm tra lại `NEXT_PUBLIC_FIREBASE_API_KEY` trong `.env`
- Đảm bảo không có khoảng trắng thừa
- Restart dev server: `npm run dev`

### Lỗi 2: Firestore Permission Denied

**Triệu chứng**:
```
FirebaseError: Missing or insufficient permissions
```

**Giải pháp**:
- Kiểm tra Firestore Rules
- Đảm bảo user đã đăng nhập
- Kiểm tra userId trong request

### Lỗi 3: Google AI API Error

**Triệu chứng**:
```
Error: API key not valid
```

**Giải pháp**:
- Kiểm tra `GOOGLE_API_KEY` trong `.env`
- Đảm bảo Generative Language API đã được enable
- Kiểm tra quota API

### Lỗi 4: Port Already in Use

**Triệu chứng**:
```
Error: Port 9002 is already in use
```

**Giải pháp**:
```bash
# Windows
netstat -ano | findstr :9002
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:9002 | xargs kill -9
```

### Lỗi 5: Module Not Found

**Triệu chứng**:
```
Error: Cannot find module 'xyz'
```

**Giải pháp**:
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Lỗi 6: Build Error

**Triệu chứng**:
```
Error: Build failed
```

**Giải pháp**:
```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build
```

---

## Kiểm tra cài đặt thành công

Chạy các lệnh sau để kiểm tra:

```bash
# 1. Kiểm tra Node.js
node --version
# Expected: v18.x.x hoặc cao hơn

# 2. Kiểm tra npm
npm --version
# Expected: 9.x.x hoặc cao hơn

# 3. Kiểm tra dependencies
npm list --depth=0
# Không có lỗi UNMET DEPENDENCY

# 4. Kiểm tra TypeScript
npm run typecheck
# Không có lỗi type

# 5. Kiểm tra build
npm run build
# Build thành công

# 6. Chạy dev server
npm run dev
# Server chạy tại http://localhost:9002
```

---

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt:

- **Email**: support@tracuuluat.vn
- **Hotline**: 19005001
- **GitHub Issues**: [Tạo issue mới](https://github.com/your-repo/issues)

---

**Chúc bạn cài đặt thành công! 🎉**
