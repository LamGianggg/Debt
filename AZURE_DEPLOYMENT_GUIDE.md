# Hướng Dẫn Triển Khai DebtMaster Lên Microsoft Azure (100% Qua Trình Duyệt Web)

> **Lưu ý quan trọng:** Bạn **không cần tải hay cài đặt bất kỳ phần mềm nào** về máy tính cá nhân. Toàn bộ thao tác chỉ cần thực hiện bằng chuột trên trình duyệt tại [portal.azure.com](https://portal.azure.com).

---

## 1. Kiến trúc hệ thống trên Azure
- **Frontend (Giao diện React + Mona Sans VF)**: Triển khai trên **Azure Static Web Apps** (Gói Free - Miễn phí trọn đời, tự động có chứng chỉ bảo mật HTTPS/SSL).
- **Backend (Spring Boot 3.3.4, Java 17)**: Triển khai trên **Azure App Service (Linux)** (Gói F1 - Free).
- **Database (Cơ sở dữ liệu)**:
  - *Mặc định để demo 0 đồng:* Chạy profile `h2` trong RAM (không cần mua server MySQL).
  - *Nếu có MySQL:* Kết nối qua biến môi trường `SPRING_DATASOURCE_URL`.

---

## 2. Các bước triển khai chi tiết

### BƯỚC 1: Triển khai Frontend lên Azure Static Web Apps (Khoảng 2 phút)

1. Mở trình duyệt và đăng nhập vào **[portal.azure.com](https://portal.azure.com)**.
2. Trên thanh tìm kiếm ở đỉnh trang, gõ `Static Web Apps` và chọn dịch vụ **Static Web Apps**.
3. Bấm **+ Create** (Tạo mới).
4. Điền các thông tin cơ bản:
   - **Subscription**: Chọn gói Azure của bạn (Free Trial / Azure for Students).
   - **Resource Group**: Bấm *Create new* -> đặt tên `rg-debtmaster`.
   - **Name**: Đặt tên website, ví dụ: `debtmaster-web`.
   - **Plan type**: Chọn **Free**.
   - **Region**: Chọn `East Asia` hoặc `Southeast Asia`.
5. Phần **Deployment details**:
   - **Source**: Chọn **GitHub**.
   - Bấm nút **Sign in with GitHub** và xác thực cấp quyền.
   - **Organization**: Chọn tài khoản GitHub của bạn.
   - **Repository**: Chọn **`Debt`** (hoặc `LamGianggg/Debt`).
   - **Branch**: Chọn **`main`**.
6. Phần **Build Details**:
   - **Build Presets**: Chọn **Custom**.
   - **App location**: Nhập `/Frontend`.
   - **Api location**: Để trống.
   - **Output location**: Nhập `dist`.
7. Bấm **Review + create** -> Bấm **Create**.
   - *Azure sẽ tự động kích hoạt GitHub Actions để build mã nguồn và sau 1-2 phút bạn sẽ có link website hoạt động 24/7 (dạng `https://...azurestaticapps.net`).*

---

### BƯỚC 2: Triển khai Backend lên Azure App Service (Khoảng 3 phút)

1. Tại thanh tìm kiếm của **Azure Portal**, gõ `App Services` và chọn **App Services**.
2. Bấm **+ Create** -> Chọn **Web App**.
3. Điền thông tin:
   - **Resource Group**: Chọn `rg-debtmaster` (đã tạo ở Bước 1).
   - **Name**: Đặt tên API, ví dụ: `debtmaster-api` (đường link sẽ là `https://debtmaster-api.azurewebsites.net`).
   - **Publish**: Chọn **Code**.
   - **Runtime stack**: Chọn **Java 17**.
   - **Java web server stack**: Chọn **Java SE** (hoặc Embedded Web Server).
   - **Operating System**: Chọn **Linux**.
   - **Region**: Chọn `Southeast Asia` (Singapore) hoặc `East Asia`.
   - **Pricing plan**: Bấm *Explore pricing plans* -> chọn tab *Dev / Test* -> Chọn gói **F1 (Free)**.
4. Chuyển sang tab **Deployment**:
   - **Continuous deployment**: Chọn **Enable**.
   - Chọn tài khoản GitHub -> Repo: `Debt` -> Branch: `main`.
5. Bấm **Review + create** -> Bấm **Create**.

---

### BƯỚC 3: Cấu hình kết nối Frontend và Backend

1. **Bật cơ sở dữ liệu miễn phí cho Backend**:
   - Vào App Service `debtmaster-api` vừa tạo -> Mục menu bên trái chọn **Configuration** (hoặc **Environment variables**).
   - Bấm **+ Add** (Thêm biến môi trường mới):
     - **Name**: `SPRING_PROFILES_ACTIVE`
     - **Value**: `h2`
   - Bấm **Save** (Lưu) và **Restart** lại App Service.

2. **Nối đường link API vào Frontend**:
   - Vào Static Web App `debtmaster-web` -> Mục **Configuration**.
   - Thêm biến môi trường:
     - **Name**: `VITE_API_BASE_URL`
     - **Value**: `https://debtmaster-api.azurewebsites.net/api`
   - Bấm **Save**.

---

## 3. Khắc phục lỗi thường gặp (FAQ)
- **Nếu cần gõ lệnh cấu hình mà không có máy tính cài công cụ?**
  - Bấm vào biểu tượng **`>_` (Cloud Shell)** ở góc trên bên phải thanh điều hướng của Azure Portal để dùng Terminal Linux trực tuyến miễn phí của Microsoft.
- **Lỗi 404 khi F5 trang trên Static Web Apps?**
  - Dự án đã tích hợp sẵn file `Frontend/staticwebapp.config.json` tự động rewrite các route về `index.html`, bạn không cần chỉnh sửa gì thêm.
