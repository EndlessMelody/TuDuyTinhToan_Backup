# Tài liệu Giao diện Người dùng (UI/UX) - TasteMap Dashboard

Tài liệu này mô tả chi tiết về cấu trúc, tính năng và các yếu tố thiết kế của TasteMap Dashboard hiện tại, giúp các thành viên trong team nắm bắt nhanh tiến độ và logic của ứng dụng.

---

## 1. Tổng quan Kiến trúc & Công nghệ
- **Framework**: Next.js 14+ (App Router).
- **UI Library**: Once UI (Hệ thống nguyên tử - Atomic Design).
- **Motion**: Framer Motion (Đảm bảo hiệu ứng mượt mà 60fps).
- **Type Safety**: TypeScript (Định nghĩa chặt chẽ cho toàn bộ dữ liệu Mock).
- **Phong cách Thiết kế**: Premium iOS "Super App" - Tập trung vào sự tối giản, sang trọng, hiệu ứng kính (Glassmorphism) và các góc bo tròn lớn (28px - 32px).

---

## 2. Các Module Chính & Chức năng

### A. Dashboard Header (Thanh đầu trang thông minh)
- **Dynamic Island**: Chuyển đổi trạng thái linh hoạt khi cuộn trang.
- **Tính năng Profile "Trim"**: Khi cuộn trang, tên người dùng và cấp độ sẽ tự động ẩn đi, thanh header thu gọn lại thành một "Island" chứa Avatar và Thanh tìm kiếm, giúp tối ưu diện tích hiển thị.
- **Layout**: Cố định ở trên cùng (Sticky), luôn nằm chính giữa nội dung chính (Center-constrained).

### B. Hero Section (Khu vực Nổi bật)
- **Cấu trúc**: Chia làm 2 phần (Widget Bản đồ & Banner Hero).
- **Độ cao**: Đã được tinh chỉnh xuống **300px** (Compact) để tăng mật độ thông tin.
- **Map Widget**: Hiển thị vị trí trực tiếp (Live) với thiết kế bo tròn hiện đại.
- **Hero Banner**: 
  - Sử dụng dữ liệu động từ `mock-data.ts`.
  - Có các Badge cao cấp: "Verified Sponsored" (Kính xanh) và "Featured Tour" (Đỏ Ruby).
  - Nút CTA (Book Now) có hiệu ứng "Quang phổ" (Glow Animation) chạy dọc thân nút.

### C. Tour Builder / Promo Banner (Banner Quảng bá)
- **Vị trí**: Nằm ở cuối trang Dashboard.
- **Thiết kế**: Nền Gradient Silver (Xám sang trọng) hoặc sử dụng ảnh nền (Background Image).
- **Lớp phủ (Overlay)**: Khi sử dụng ảnh nền, một lớp gradient tối sẽ tự động phủ lên bên trái để đảm bảo chữ trắng luôn sắc nét và dễ đọc.
- **Dữ liệu**: Hiện đang được dùng để quảng bá tính năng "Tour Builder" (Tính năng mới giúp lập kế hoạch lộ trình ẩm thực bằng AI).

### D. Trending Reels (Video Xu hướng)
- **Giao diện**: Hiển thị dưới dạng thẻ dọc lấy cảm hứng từ Instagram/TikTok.
- **Chế độ xem**: Preview nhanh video với các thông số Views và Avatar người dùng được xử lý theo phong cách Glassmorphism.

### E. AI Picks & Contextual Navigator
- **AI Picks**: Đề xuất các địa điểm dựa trên giải thuật AI (Match Score).
- **Contextual Navigator**: Thanh điều hướng dựa trên ngữ cảnh (Sáng, Trưa, Chiều, Tối) với các tag linh hoạt (VD: "Cozy", "Date Night").

---

## 3. Hệ thống Design Tokens (Mã định danh thiết kế)

### Lớp phủ & Hiệu ứng
- `.glass-premium`: Hiệu ứng kính mờ 2 lớp với viền sáng nội thất (Internal highlights).
- `.noise-overlay`: Lớp nhiễu hạt nhẹ phủ lên ảnh để tạo cảm giác analog cao cấp.

### Màu sắc chính (Elite Palette)
- **Apple Blue (`#007AFF`)**: Màu hành động chính (Primary Action).
- **Ruby Red (`#E63946`)**: Màu cho các thông tin quan trọng/nổi bật.
- **Premium Silver**: Gradient dành cho các tính năng Pro/Elite.

---

## 4. Quản lý Dữ liệu
Toàn bộ nội dung hiển thị (Text, Ảnh, Badge) được tách biệt hoàn toàn tại:
`src/constants/mock-data.ts`

**Cách cập nhật**: Team chỉ cần thay đổi giá trị trong file này, giao diện sẽ tự động cập nhật theo mà không cần can thiệp vào logic code của Component.

---

## 5. Định hướng Tiếp theo (Late 2026)
- Tích hợp **Tour Builder AI Engine**: Giải thuật tối ưu hóa lộ trình dựa trên lưu lượng giao thông và thời tiết.
- Nâng cấp **Social Feed**: Tích hợp Reels tương tác trực tiếp trên bản đồ.

---
*Tài liệu được cập nhật bởi Antigravity AI.*
