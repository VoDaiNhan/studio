# 📦 Dependencies - Danh sách Thư viện

## Tổng quan

Dự án sử dụng **Node.js** và **npm** để quản lý dependencies. Tất cả các thư viện được liệt kê trong file `package.json`.

---

## Core Dependencies

### Framework & Runtime

| Package | Version | Mô tả |
|---------|---------|-------|
| `next` | 15.3.3 | React framework với App Router, Server Components |
| `react` | 18.3.1 | Thư viện UI chính |
| `react-dom` | 18.3.1 | React DOM renderer |
| `typescript` | ^5 | Type-safe JavaScript |

### AI & Backend

| Package | Version | Mô tả |
|---------|---------|-------|
| `genkit` | 1.14.1 | Google AI framework |
| `@genkit-ai/googleai` | 1.14.1 | Google AI integration |
| `@genkit-ai/next` | 1.14.1 | Genkit Next.js adapter |
| `zod` | 3.24.2 | Schema validation |

### Firebase

| Package | Version | Mô tả |
|---------|---------|-------|
| `firebase` | 11.10.0 | Firebase client SDK |
| `firebase-admin` | 13.6.0 | Firebase Admin SDK (server-side) |

### UI Components & Styling

| Package | Version | Mô tả |
|---------|---------|-------|
| `tailwindcss` | 3.4.1 | Utility-first CSS framework |
| `tailwindcss-animate` | 1.0.7 | Animation utilities |
| `tailwind-merge` | 3.0.1 | Merge Tailwind classes |
| `class-variance-authority` | 0.7.1 | Component variants |
| `clsx` | 2.1.1 | Conditional classnames |
| `lucide-react` | 0.475.0 | Icon library |

### Radix UI Components

| Package | Version | Mô tả |
|---------|---------|-------|
| `@radix-ui/react-avatar` | 1.1.3 | Avatar component |
| `@radix-ui/react-button` | - | Button component |
| `@radix-ui/react-dialog` | 1.1.6 | Modal/Dialog |
| `@radix-ui/react-dropdown-menu` | 2.1.6 | Dropdown menu |
| `@radix-ui/react-label` | 2.1.2 | Form label |
| `@radix-ui/react-scroll-area` | 1.2.3 | Scrollable area |
| `@radix-ui/react-separator` | 1.1.2 | Divider/Separator |
| `@radix-ui/react-toast` | 1.2.6 | Toast notifications |
| `@radix-ui/react-tabs` | 1.1.3 | Tab component |
| `@radix-ui/react-select` | 2.1.6 | Select dropdown |
| `@radix-ui/react-checkbox` | 1.1.4 | Checkbox |
| `@radix-ui/react-switch` | 1.1.3 | Toggle switch |
| `@radix-ui/react-slider` | 1.2.3 | Slider input |
| `@radix-ui/react-progress` | 1.1.2 | Progress bar |
| `@radix-ui/react-accordion` | 1.2.3 | Accordion |
| `@radix-ui/react-collapsible` | 1.1.11 | Collapsible content |
| `@radix-ui/react-popover` | 1.1.6 | Popover |
| `@radix-ui/react-tooltip` | 1.1.8 | Tooltip |
| `@radix-ui/react-alert-dialog` | 1.1.6 | Alert dialog |
| `@radix-ui/react-menubar` | 1.1.6 | Menu bar |
| `@radix-ui/react-radio-group` | 1.2.3 | Radio group |

### Form Management

| Package | Version | Mô tả |
|---------|---------|-------|
| `react-hook-form` | 7.54.2 | Form state management |
| `@hookform/resolvers` | 4.1.3 | Form validation resolvers |

### Data Visualization

| Package | Version | Mô tả |
|---------|---------|-------|
| `recharts` | 2.15.1 | Chart library |
| `embla-carousel-react` | 8.6.0 | Carousel component |

### Utilities

| Package | Version | Mô tả |
|---------|---------|-------|
| `date-fns` | 3.6.0 | Date manipulation |
| `dotenv` | 16.5.0 | Environment variables |
| `react-day-picker` | 8.10.1 | Date picker |

---

## Dev Dependencies

| Package | Version | Mô tả |
|---------|---------|-------|
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` | ^18 | React type definitions |
| `@types/react-dom` | ^18 | React DOM type definitions |
| `genkit-cli` | 1.14.1 | Genkit CLI tools |
| `postcss` | ^8 | CSS processor |
| `tailwindcss` | 3.4.1 | Tailwind CSS |
| `typescript` | ^5 | TypeScript compiler |

---

## Cài đặt Dependencies

### Cài đặt tất cả

```bash
npm install
```

### Cài đặt production dependencies only

```bash
npm install --production
```

### Cài đặt một package cụ thể

```bash
npm install <package-name>
```

### Update dependencies

```bash
# Kiểm tra outdated packages
npm outdated

# Update tất cả
npm update

# Update một package cụ thể
npm update <package-name>
```

---

## Chi tiết các nhóm Dependencies

### 1. Framework Core (Next.js + React)

**Tại sao chọn Next.js 15?**
- App Router mới với Server Components
- Tối ưu performance tự động
- Built-in Image optimization
- API Routes
- TypeScript support tốt

**Cấu hình quan trọng:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "NODE_ENV=production next build",
    "start": "next start"
  }
}
```

### 2. AI & Machine Learning

**Google Genkit:**
- Framework AI của Google
- Tích hợp dễ dàng với Gemini
- Built-in tracing và monitoring
- Type-safe prompts

**Sử dụng:**
```typescript
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ai = genkit({
  plugins: [googleAI()],
});
```

### 3. Firebase

**Firebase Client SDK:**
- Authentication
- Firestore Database
- Storage (nếu cần)

**Firebase Admin SDK:**
- Server-side operations
- Admin privileges
- Batch operations

**Cấu hình:**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```

### 4. UI Components (Radix UI)

**Tại sao chọn Radix UI?**
- Accessible by default (WCAG compliant)
- Unstyled - tùy chỉnh dễ dàng
- Composable components
- TypeScript support

**shadcn/ui:**
- Built on top of Radix UI
- Copy-paste components
- Customizable với Tailwind

### 5. Styling (Tailwind CSS)

**Plugins:**
- `tailwindcss-animate`: Animation utilities
- `@tailwindcss/typography`: Typography styles

**Cấu hình:**
```javascript
// tailwind.config.ts
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom theme
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 6. Form Management

**React Hook Form:**
- Performance tốt (uncontrolled components)
- Validation dễ dàng với Zod
- TypeScript support

**Ví dụ:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

---

## Package Size Analysis

### Largest Dependencies

1. **next**: ~50MB (framework core)
2. **firebase**: ~15MB (full SDK)
3. **@radix-ui/***: ~10MB (all components)
4. **recharts**: ~5MB (charts)
5. **tailwindcss**: ~3MB (CSS framework)

### Optimization Tips

```bash
# Analyze bundle size
npm run build
# Check .next/analyze/

# Use dynamic imports
const Component = dynamic(() => import('./Component'));

# Tree-shaking
# Next.js tự động tree-shake unused code
```

---

## Security & Updates

### Kiểm tra vulnerabilities

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (có thể breaking)
npm audit fix --force
```

### Update strategy

1. **Minor updates**: Mỗi tuần
2. **Major updates**: Mỗi tháng (test kỹ)
3. **Security patches**: Ngay lập tức

### Dependabot

Thêm `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## Troubleshooting

### Lỗi peer dependencies

```bash
npm install --legacy-peer-deps
```

### Lỗi cache

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Lỗi version conflict

```bash
# Xem dependency tree
npm list <package-name>

# Force resolution (package.json)
{
  "overrides": {
    "package-name": "version"
  }
}
```

---

## Tài liệu tham khảo

- [npm Documentation](https://docs.npmjs.com/)
- [Next.js Dependencies](https://nextjs.org/docs/getting-started/installation)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase SDK](https://firebase.google.com/docs/web/setup)

---

**Cập nhật lần cuối**: November 2024
