# 📊 Tính năng Advanced Analytics Dashboard

## Tổng quan

Hệ thống phân tích nâng cao (Advanced Analytics) cung cấp insights chi tiết về hoạt động của chatbot tra cứu luật, giúp người dùng và quản trị viên theo dõi hiệu suất, xu hướng và đưa ra quyết định dựa trên dữ liệu.

## 🎯 Tính năng chính

### 1. **Dashboard Tổng quan**
- **KPI Cards**: Hiển thị các chỉ số quan trọng
  - Tổng số câu hỏi
  - Số người dùng hoạt động
  - Thời gian phản hồi trung bình
  - Tỷ lệ tăng trưởng

### 2. **Biểu đồ Phân tích**

#### 📈 Xu hướng theo thời gian
- Line chart hiển thị số lượng câu hỏi theo ngày
- Area chart cho xu hướng tổng thể
- Hỗ trợ filter theo khoảng thời gian (7 ngày, 30 ngày, 90 ngày)

#### 🥧 Phân tích chủ đề
- Pie chart phân bố câu hỏi theo lĩnh vực pháp luật
- Bar chart ranking các chủ đề phổ biến
- Tự động phát hiện keywords: giao thông, lao động, hợp đồng, hình sự, dân sự, v.v.

#### ⏰ Giờ cao điểm
- Bar chart hiển thị phân bố câu hỏi theo giờ trong ngày
- Giúp tối ưu hóa tài nguyên server

### 3. **Real-time Analytics** ⚡
- Cập nhật metrics trực tiếp mỗi 5 giây
- Hiển thị:
  - Câu hỏi/phút
  - Người dùng online
  - Thời gian phản hồi hiện tại
  - Tỷ lệ thành công
- Badge "Live" với animation pulse

### 4. **So sánh theo thời gian** 📊
- So sánh metrics với kỳ trước (tuần/tháng/quý)
- Hiển thị % thay đổi với màu sắc trực quan
- Badges với arrow indicators (tăng/giảm)

### 5. **Top Questions** 🔝
- Danh sách câu hỏi được hỏi nhiều nhất
- Hiển thị số lần được hỏi
- Rating trung bình cho mỗi câu hỏi

### 6. **Insights & Recommendations** 💡
- Phân tích xu hướng tự động
- Đề xuất cải thiện
- Cảnh báo các vấn đề cần chú ý
- Gợi ý tính năng mới

### 7. **Export Reports** 📥
- Xuất báo cáo ra nhiều định dạng:
  - **CSV**: Dễ dàng import vào Excel
  - **JSON**: Cho developers và API integration
  - **PDF**: Báo cáo chuyên nghiệp
- Dialog UI thân thiện
- Progress indicator khi export

## 🚀 Cách sử dụng

### Truy cập Analytics Dashboard

1. **Đăng nhập** vào hệ thống
2. Click vào **"Phân tích & Thống kê"** trong sidebar
3. Hoặc truy cập trực tiếp: `/analytics`

### Xem các tab khác nhau

```
- Tổng quan: Overview metrics và charts
- Chủ đề: Phân tích theo lĩnh vực pháp luật
- Xu hướng: Real-time data và comparisons
```

### Xuất báo cáo

1. Click nút **"Xuất báo cáo"** ở góc trên bên phải
2. Chọn định dạng file (CSV/JSON/PDF)
3. Click **"Xuất báo cáo"**
4. File sẽ được tải xuống tự động

### Filter theo thời gian

- Sử dụng dropdown để chọn khoảng thời gian
- Các tùy chọn: 7 ngày, 30 ngày, 90 ngày
- Data sẽ tự động cập nhật

## 📁 Cấu trúc Files

```
src/
├── app/
│   ├── analytics/
│   │   └── page.tsx              # Main analytics page
│   └── admin/
│       └── analytics/
│           └── page.tsx          # Admin analytics (advanced)
├── components/
│   ├── analytics-export.tsx      # Export functionality
│   ├── realtime-analytics.tsx    # Real-time metrics
│   └── analytics-comparison.tsx  # Time comparison
└── docs/
    └── ANALYTICS_FEATURE.md      # This file
```

## 🔧 Technical Details

### Data Sources

Analytics data được lấy từ:
- **Firestore**: `users/{userId}/conversations` collection
- Real-time updates qua Firestore listeners
- Cached data để tối ưu performance

### Metrics Calculation

```typescript
// Total queries
const totalQueries = conversations.length;

// Success rate
const successRate = (verifiedCount / totalQueries) * 100;

// Topic extraction
const keywords = ['giao thông', 'hợp đồng', 'lao động', ...];
// Auto-detect from user queries

// Time-based grouping
const queriesOverTime = groupByDate(conversations);
```

### Charts Library

Sử dụng **Recharts** cho visualization:
- LineChart: Xu hướng theo thời gian
- BarChart: So sánh categories
- PieChart: Phân bố tỷ lệ
- AreaChart: Filled line charts

## 🎨 UI Components

### Cards
- KPI cards với border-left colored
- Hover effects
- Responsive grid layout

### Charts
- Responsive containers
- Custom tooltips
- Legend với colors
- Grid lines cho dễ đọc

### Badges
- Color-coded theo status
- Animated pulse cho live data
- Arrow indicators cho trends

## 📊 Admin Analytics

Trang admin (`/admin/analytics`) cung cấp thêm:
- Multi-user analytics
- Advanced filtering
- Performance metrics
- System health monitoring
- Detailed insights

## 🔐 Security & Permissions

- Chỉ user đã đăng nhập mới xem được analytics
- Admin analytics yêu cầu admin role
- Data được filter theo userId
- Firestore security rules áp dụng

## 🚀 Future Enhancements

### Planned Features
- [ ] Custom date range picker
- [ ] Email scheduled reports
- [ ] Advanced filters (by topic, user, etc.)
- [ ] Predictive analytics với ML
- [ ] A/B testing insights
- [ ] User journey mapping
- [ ] Heatmaps
- [ ] Funnel analysis

### Performance Optimizations
- [ ] Data caching với Redis
- [ ] Lazy loading cho charts
- [ ] Virtual scrolling cho large datasets
- [ ] Server-side aggregation

## 📝 Best Practices

### Khi sử dụng Analytics

1. **Kiểm tra thường xuyên**: Xem analytics ít nhất 1 lần/tuần
2. **Theo dõi trends**: Chú ý đến các thay đổi đột ngột
3. **Hành động dựa trên insights**: Áp dụng recommendations
4. **Export reports**: Lưu trữ để so sánh dài hạn

### Khi phát triển

1. **Optimize queries**: Sử dụng indexes trong Firestore
2. **Cache data**: Tránh query lại nhiều lần
3. **Lazy load**: Chỉ load data khi cần
4. **Error handling**: Graceful fallbacks

## 🐛 Troubleshooting

### Analytics không hiển thị data

```typescript
// Check Firestore connection
const { firestore } = initializeFirebase();

// Verify user authentication
if (!user) {
  console.error('User not authenticated');
}

// Check Firestore rules
// Ensure user has read permission
```

### Charts không render

```bash
# Reinstall recharts
npm install recharts

# Clear cache
npm run build
```

### Export không hoạt động

```typescript
// Check browser permissions
// Ensure popup blocker is disabled
// Verify file download settings
```

## 📞 Support

Nếu gặp vấn đề với Analytics:
- Check console logs
- Verify Firestore data
- Contact: support@tracuuluat.vn

## 📚 Resources

- [Recharts Documentation](https://recharts.org/)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Author**: ABAII Development Team
