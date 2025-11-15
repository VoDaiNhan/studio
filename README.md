# AI Tra cứu Luật - Hệ thống Tra cứu Pháp Luật Thông minh

## 📋 Giới thiệu

**AI Tra cứu Luật** là một ứng dụng web hiện đại được xây dựng bằng Next.js, tích hợp AI để hỗ trợ tra cứu và tư vấn pháp luật Việt Nam. Hệ thống sử dụng Google Gemini AI để phân tích câu hỏi của người dùng và cung cấp câu trả lời chính xác dựa trên các văn bản pháp luật.

### ✨ Tính năng chính

- 🤖 **Chat AI thông minh**: Hỏi đáp tự nhiên về luật pháp với AI
- 📚 **Tra cứu văn bản pháp luật**: Tìm kiếm và tra cứu các văn bản pháp luật
- 💾 **Lịch sử trò chuyện**: Lưu trữ và xem lại các cuộc hội thoại
- 🔐 **Xác thực người dùng**: Đăng nhập/Đăng ký với Firebase Authentication
- 📱 **Responsive Design**: Giao diện thân thiện trên mọi thiết bị
- 🎨 **UI/UX hiện đại**: Sử dụng Tailwind CSS và Radix UI components

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 15.3.3** - React framework với App Router
- **React 18.3.1** - Thư viện UI
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Icon library

### Backend & AI
- **Firebase** - Authentication & Firestore Database
- **Google Genkit** - AI framework
- **Google Gemini AI** - Large Language Model
- **Zod** - Schema validation

### UI Components
- **shadcn/ui** - Re-usable components built with Radix UI
- **React Hook Form** - Form management
- **Recharts** - Data visualization

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm** hoặc **yarn** hoặc **pnpm**
- **Git**

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd nextn
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc và thêm các biến sau:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI Configuration
GOOGLE_API_KEY=your_google_gemini_api_key
```

#### Hướng dẫn lấy API Keys:

**Firebase:**
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **Project Settings** > **General** > **Your apps**
4. Chọn Web app và copy các thông tin config

**Google Gemini API:**
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Copy API key vào biến `GOOGLE_API_KEY`

### Bước 4: Cấu hình Firebase

#### 4.1. Firestore Database

1. Trong Firebase Console, vào **Firestore Database**
2. Tạo database mới (chọn chế độ production hoặc test)
3. Cập nhật Firestore Rules từ file `firestore.rules`:

```bash
# Deploy rules
firebase deploy --only firestore:rules
```

#### 4.2. Firebase Authentication

1. Vào **Authentication** > **Sign-in method**
2. Bật **Email/Password** authentication

### Bước 5: Chuẩn bị dữ liệu

Dữ liệu văn bản pháp luật được lưu trong thư mục `src/data/`. Đảm bảo các file JSON chứa dữ liệu pháp luật đã được chuẩn bị đúng format.

## 🚀 Chạy ứng dụng

### Development Mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:9002`

### Production Build

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm start
```

### Genkit Development (AI Testing)

```bash
# Chạy Genkit UI để test AI flows
npm run genkit:dev

# Hoặc với watch mode
npm run genkit:watch
```

## 📁 Cấu trúc thư mục

```
nextn/
├── src/
│   ├── ai/                      # AI flows và prompts
│   │   ├── flows/              # Genkit flows
│   │   └── prompts/            # AI prompts
│   ├── app/                    # Next.js App Router
│   │   ├── chat/              # Trang chat
│   │   ├── history/           # Lịch sử trò chuyện
│   │   ├── login/             # Đăng nhập
│   │   ├── signup/            # Đăng ký
│   │   └── lookup/            # Tra cứu văn bản
│   ├── components/            # React components
│   │   └── ui/               # shadcn/ui components
│   ├── data/                 # Dữ liệu pháp luật
│   ├── firebase/             # Firebase config
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── public/                   # Static files
├── .env                      # Environment variables
├── firestore.rules          # Firestore security rules
├── package.json             # Dependencies
└── README.md               # Documentation
```

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy dev server (port 9002)
npm run genkit:dev      # Chạy Genkit UI
npm run genkit:watch    # Chạy Genkit với watch mode

# Production
npm run build           # Build production
npm start              # Chạy production server

# Code Quality
npm run lint           # Chạy ESLint
npm run typecheck      # Kiểm tra TypeScript
```

## 🎯 Hướng dẫn sử dụng

### 1. Đăng ký tài khoản

- Truy cập `/signup`
- Nhập email và mật khẩu
- Xác nhận đăng ký

### 2. Đăng nhập

- Truy cập `/login`
- Nhập thông tin đăng nhập
- Hệ thống sẽ chuyển đến trang chat

### 3. Chat với AI

- Nhập câu hỏi về pháp luật vào ô chat
- AI sẽ phân tích và trả lời dựa trên văn bản pháp luật
- Câu trả lời bao gồm tóm tắt và nguồn tham khảo

### 4. Xem lịch sử

- Click vào "Lịch sử trò chuyện" trong sidebar
- Xem lại các cuộc hội thoại trước đó
- Click vào một cuộc hội thoại để tiếp tục chat

### 5. Tra cứu văn bản

- Vào mục "Văn bản Pháp Luật"
- Tìm kiếm văn bản theo từ khóa
- Xem chi tiết văn bản pháp luật

## 🔐 Bảo mật

- Sử dụng Firebase Authentication cho xác thực
- Firestore Security Rules để bảo vệ dữ liệu
- Environment variables cho API keys
- HTTPS trong production

## 🐛 Troubleshooting

### Lỗi Firebase

```bash
# Kiểm tra Firebase config
# Đảm bảo tất cả biến môi trường đã được set đúng
```

### Lỗi AI không hoạt động

```bash
# Kiểm tra GOOGLE_API_KEY
# Đảm bảo API key có quyền truy cập Gemini API
```

### Lỗi build

```bash
# Xóa cache và rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📝 License

Dự án này thuộc về **Viện Công nghệ Blockchain và Trí tuệ Nhân tạo ABAII**

## 👥 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

- **Hotline**: 19005001
- **Email**: support@tracuuluat.vn
- **Website**: [tracuuluat.vn](https://tracuuluat.vn)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Google Gemini](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
