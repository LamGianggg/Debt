# BÁO CÁO PHÂN TÍCH, PHẢN BIỆN VÀ TỐI ƯU HÓA NGHIỆP VỤ HỆ THỐNG

**Đề tài:** Quản lý Đơn hàng, Công nợ và Thu hồi nợ tự động (Order-to-Cash & AR Automation)

**Tài liệu gốc phân tích:** `Buss.md`

**Người thực hiện:** Senior Business Analyst & Business Process Architect

**Mức độ đánh giá tài liệu gốc:** **Good (Khá tốt về mặt ý tưởng chiến lược, nhưng Developing về mặt kiểm soát ngoại lệ, phân quyền RBAC và logic hệ thống thực thi)**

## PHẦN A: TỔNG QUAN NGHIỆP VỤ

### 1. Mục tiêu nghiệp vụ

Xây dựng một hệ thống quản lý xuyên suốt từ khi phát sinh đơn hàng đến khi thu hồi tiền mặt (Order-to-Cash - O2C) và tự động hóa quản trị các khoản phải thu (AR Automation) cho mô hình B2B. Mục tiêu cốt lõi là:

* Kiểm soát rủi ro nợ xấu ngay từ khâu duyệt đơn (tiền kiểm).

* Tối ưu hóa tốc độ thu hồi dòng tiền thông qua thanh toán một chạm (1-Click Pay/Dynamic QR) và đối soát tự động.

* Tự động hóa quy trình nhắc nợ đa tầng có sự tham gia của AI nhưng vẫn duy trì mối quan hệ khách hàng thông qua cơ chế quản lý Tranh chấp (Dispute) và Lời hứa trả nợ (Promise-to-Pay - PTP).

* Đảm bảo tính minh bạch, phân tách nhiệm vụ (Segregation of Duties - SoD) giữa Quản trị viên (**Admin**), Nhân viên vận hành (**Staff**) và Khách hàng (**User**).

### 2. Mô tả hệ thống hiện tại (Theo tài liệu `Buss.md`)

Hệ thống được thiết kế theo mô hình lai (**Hybrid Autonomous Order-to-Cash & Smart Debt Engine**), kết hợp giữa chức năng kiểm soát đơn hàng của ERP truyền thống và khả năng thu hồi nợ thông minh của FinTech AR, chia làm 4 giai đoạn:

1. **Giai đoạn 1 (Đơn hàng & Thẩm định Tín dụng):** Kiểm tra hạn mức tín dụng và nợ quá hạn trước khi duyệt Sales Order (SO).

2. **Giai đoạn 2 (Bàn giao & Kích hoạt Nghĩa vụ Nợ):** Xuất kho giao hàng và phát hành Hóa đơn điện tử (E-Invoice) kèm mã QR động.

3. **Giai đoạn 3 (Thanh toán Tự phục vụ & Đối soát):** Cung cấp Customer Portal (Magic Link), lắng nghe Webhook ngân hàng để gạch nợ tự động.

4. **Giai đoạn 4 (Thu hồi nợ Thông minh - Dunning Engine):** Phân kỳ nhắc nợ từ $T-3$ đến $T+30$ qua Zalo/SMS/Email/AI Voice, xử lý ngoại lệ PTP và Dispute.

### 3. Các nghiệp vụ chính

* Quản lý và kiểm duyệt hạn mức tín dụng (Credit Control).

* Phát hành hóa đơn và định danh giao dịch thanh toán (Invoicing & Payment Routing).

* Đối soát và hạch toán thanh toán tự động (Cash Application & Auto-Reconciliation).

* Chiến dịch thu hồi nợ tự động đa kênh (Multi-tier Dunning Cadence).

* Quản lý ngoại lệ công nợ: Cam kết trả nợ (PTP) và Khiếu nại/Tranh chấp (Dispute Management).

* Quản trị phân quyền và kiểm soát nội bộ theo mô hình `Admin - Staff - User` (RBAC & Audit Trail).

### 4. Các vấn đề đáng chú ý (Điểm mù thiết kế trong `Buss.md`)

Mặc dù luồng lý tưởng (Happy Path) rất mượt mà, bản thiết kế hiện tại đang mắc phải **8 nhóm vấn đề cốt tử** khi áp vào vận hành B2B thực tế:

* **Lỗ hổng công thức tín dụng:** Chưa tính đến các đơn hàng "đã duyệt nhưng chưa xuất hóa đơn", dẫn đến nguy cơ khách hàng đặt nhiều đơn liên tiếp làm lủng hạn mức.

* **Xung đột giữa Tranh chấp (Dispute) và Khóa đơn hàng (Aging Lock):** Khách hàng bị giao hàng lỗi, đang khiếu nại chờ xử lý quá 15 ngày thì bị hệ thống tự động khóa quyền mua hàng mới.

* **Lỗ hổng lạm dụng PTP (Gaming the System):** Khách hàng có thể lợi dụng việc hứa trả nợ (PTP) nhiều lần để hoãn lịch nhắc nợ vô thời hạn.

* **Nghịch lý giữa QR Động theo Hóa đơn và Quy tắc gạch nợ FIFO:** Gắn mã QR theo từng hóa đơn nhưng khi trả thiếu lại trừ theo nguyên tắc FIFO (hóa đơn cũ trừ trước).

* **Sự cố thực tế trong Chuyển khoản B2B:** Ngân hàng cắt bớt nội dung chuyển khoản, kế toán bên mua gộp nhiều hóa đơn trả 1 lần, hoặc chuyển dư tiền nhưng hệ thống chưa có trạng thái xử lý.

* **Điểm mù thời điểm bắt đầu tính nợ (**$T+0$**):** Bắt đầu tính hạn nợ khi xuất hóa đơn hay khi giao hàng thành công (POD)?

* **Mâu thuẫn Máy trạng thái (State Machine):** Gộp chung trạng thái thanh toán, trạng thái thời gian và trạng thái khiếu nại vào cùng một trường dữ liệu đơn lẻ.

* **Thiếu cơ chế Phân quyền & Kiểm soát Nội bộ (RBAC):** Chưa định nghĩa rõ ranh giới quyền hạn giữa `Admin`, `Staff` và `User`, dẫn đến rủi ro gian lận nội bộ (nhân viên Sales tự nâng hạn mức hoặc tự hoãn nợ cho khách để chạy doanh số).

## PHẦN B: ĐÁNH GIÁ TÍNH HỢP LÝ CỦA TÀI LIỆU HIỆN TẠI

| Nghiệp vụ | Đánh giá | Vấn đề cốt lõi phát hiện | Mức độ | Hướng xử lý | 
| ----- | ----- | ----- | ----- | ----- | 
| **1. Kiểm tra hạn mức tín dụng (Rule 1.1)** | **Chưa hợp lý** | Công thức thiếu lượng tiền của các SO đã duyệt nhưng chưa xuất Invoice; thiếu cơ chế phê duyệt ngoại lệ (Credit Override). | **Cao (Critical)** | Viết lại công thức tính *Exposure* (Tổng dư nợ tiềm tàng) và bổ sung luồng giữ chỗ tín dụng (Credit Reservation). | 
| **2. Khóa đơn do quá hạn > 15 ngày (Rule 1.2)** | **Hợp lý nhưng cần cải tiến** | Không loại trừ các hóa đơn đang trong trạng thái Tranh chấp (`Disputed`), gây khóa nhầm khách hàng tốt. | **Cao (Critical)** | Thêm điều kiện loại trừ số dư tranh chấp (`Disputed Amount`) và thiết lập ngưỡng tối thiểu (De Minimis Threshold). | 
| **3. Xuất kho** $\rightarrow$ **Tạo E-Invoice (GĐ 2)** | **Chưa hợp lý** | Giả định 1 SO = 1 lần giao = 1 Hóa đơn; chưa xác định mốc tính Due Date ($T$) dựa trên ngày Invoice hay ngày nhận hàng (POD). | **Trung bình (Major)** | Tách bạch sự kiện Xuất kho, Giao thành công (POD) và Phát hành Hóa đơn; hỗ trợ giao hàng từng phần. | 
| **4. Cổng thanh toán & Magic Link (Rule 2.1, 2.2)** | **Hợp lý nhưng cần cải tiến** | Magic Link không mật khẩu tiềm ẩn rủi ro lộ dữ liệu tài chính B2B nếu email bị forward ra ngoài. | **Trung bình (Major)** | Phân quyền truy cập 2 lớp cho `User`: Xem nhanh/Thanh toán (Public Token) vs Xem sao kê tổng hợp/Tạo Dispute (OTP Verification). | 
| **5. Chuỗi nhắc nợ Đa tầng (Rule 3)** | **Hợp lý nhưng cần cải tiến** | Thiếu cơ chế gom nhóm hóa đơn (gây spam nếu khách có 10 hóa đơn lệch ngày); thiếu quy định khung giờ gọi AI hợp pháp. | **Trung bình (Major)** | Chuyển sang nhắc nợ cấp độ Khách hàng/Sao kê khi có nhiều hóa đơn; áp dụng khung giờ hành chính và tần suất tối đa. | 
| **6. Quản lý PTP & Dispute (Rule 4)** | **Chưa hợp lý** | Không giới hạn số lần PTP (khách hứa suông liên tục); không có SLA nội bộ cho việc xử lý Dispute (ticket bị treo vĩnh viễn). | **Cao (Critical)** | Giới hạn tối đa số lần PTP/hóa đơn cho `User` và `Staff`; gắn SLA bắt buộc cho `Staff` khi xử lý Dispute và tách tranh chấp một phần. | 
| **7. Đối soát tự động & FIFO (Rule 5.1, 5.2)** | **Chưa hợp lý** | Mâu thuẫn trực tiếp giữa thanh toán định danh (`INV_ID`) và quy tắc trừ nợ `FIFO`; thiếu xử lý trả dư, phí ngân hàng, gộp đơn. | **Cao (Critical)** | Thiết lập thứ tự ưu tiên phân bổ tiền (Allocation Hierarchy): Đích danh $\rightarrow$ Gộp đơn $\rightarrow$ FIFO (chỉ khi không rõ mã). | 
| **8. Máy trạng thái Hóa đơn (Mục V.2)** | **Chưa hợp lý** | Đặt `Partially Paid`, `Overdue`, `Disputed` ngang hàng trong 1 FSM đơn tuyến là sai kiến trúc dữ liệu. | **Cao (Critical)** | Thiết kế lại mô hình trạng thái đa chiều (Orthogonal State Vectors) gồm 4 trục độc lập. | 
| **9. Phân quyền Hệ thống (Admin/Staff/User)** | **Thiếu thông tin** | Tài liệu gốc chỉ nói đến "Nhân viên", "CSKH", "Pháp chế" chung chung, chưa có ma trận RBAC để lập trình phân quyền. | **Cao (Critical)** | Thiết kế Ma trận RBAC chuẩn hóa cho 3 nhóm `Admin`, `Staff` (Sales/AR/CSKH) và `User` (Buyer AP/Procurement/CFO). | 

## PHẦN C: DANH SÁCH VẤN ĐỀ PHÁT HIỆN VÀ PHẢN BIỆN CHI TIẾT

### VẤN ĐỀ 01: Lỗ hổng công thức Hạn mức tín dụng gây "Thủng trần tín dụng" (Credit Bleeding)

* **Mã vấn đề:** `ISS-01`

* **Nội dung:** Rule 1.1 định nghĩa:
  

  $$
  \text{Hạn mức còn lại} = \text{Hạn mức phê duyệt} - (\text{Nợ chưa thanh toán} + \text{Giá trị đơn hàng mới})
  $$

* **Nguyên nhân:** Tài liệu đồng nhất "Nợ chưa thanh toán" với các Hóa đơn đã phát hành (Unpaid Invoices), bỏ qua khoảng trễ thời gian từ lúc **Duyệt Sales Order (GĐ 1)** đến lúc **Xuất kho & Tạo Hóa đơn (GĐ 2)**. Ngoài ra, "Đặt cọc 100%" ở sơ đồ GĐ 1 nếu vẫn đi qua luồng xuất hóa đơn ghi nợ bình thường sẽ tiếp tục bị chặn.

* **Hậu quả:** Một khách hàng (`User`) có hạn mức $100\text{ triệu VNĐ}$, nợ hiện tại bằng $0$. Họ đặt liên tiếp 3 đơn hàng, mỗi đơn $80\text{ triệu VNĐ}$ cách nhau 5 phút. Khi duyệt đơn thứ 2 và thứ 3, vì đơn thứ 1 chưa kịp xuất kho nên "Nợ chưa thanh toán" vẫn bằng $0$. Hệ thống duyệt cả 3 đơn $\rightarrow$ Tổng nợ thực tế vọt lên $240\text{ triệu VNĐ}$ (vượt $240\%$ hạn mức).

* **Mức độ nghiêm trọng:** **Nghiêm trọng (Critical)**

* **Phương án giải quyết:**

  1. Thay đổi công thức tính dựa trên **Tổng mức phơi nhiễm tín dụng (Total Credit Exposure)** bao gồm cả giá trị đơn hàng đã duyệt nhưng chưa lên hóa đơn (`Reserved/Unbilled SO`) và trừ đi số tiền khách đã trả trước/đặt cọc (`Unapplied Cash/Deposits`).

  2. Nếu khách chọn "Cọc 100% / Trả trước (Prepaid)", đơn hàng chuyển sang trạng thái `Pending Deposit` và **bỏ qua (Bypass)** luồng kiểm tra tín dụng sau khi nhận đủ tiền.

### VẤN ĐỀ 02: Mâu thuẫn trực tiếp giữa Định danh QR (`Rule 2.1`) và Khấu trừ FIFO (`Rule 5.2`)

* **Mã vấn đề:** `ISS-02`

* **Nội dung:** Rule 2.1 bắt buộc mỗi hóa đơn gắn mã tham chiếu `INV_[MãHóaĐơn]_[MãKhách]`. Nhưng Rule 5.2 lại quy định: *"Nếu thanh toán thiếu (Partial Payment): Khấu trừ theo nguyên tắc hóa đơn phát hành trước thì trừ trước (FIFO)"*.

* **Nguyên nhân:** Người thiết kế trộn lẫn giữa 2 phương pháp kế toán: *Specific Identification* (Thanh toán đích danh) và *Balance Forward/FIFO* (Thanh toán theo số dư).

* **Hậu quả:** Khách hàng có `INV_01` ($50\text{ triệu}$, đang có tranh chấp ngầm hoặc chưa muốn trả) và `INV_02` ($30\text{ triệu}$). Khách quét mã QR của `INV_02` và chuyển trước $20\text{ triệu}$ (nội dung chuyển khoản ghi rõ `INV_02`). Do chuyển thiếu $10\text{ triệu}$, Rule 5.2 kích hoạt FIFO và đem $20\text{ triệu}$ đó đi trừ vào `INV_01`. Hậu quả: `INV_02` vẫn bị tính là chưa trả đồng nào và bị AI gọi đòi nợ, dẫn đến tranh cãi gay gắt với kế toán của khách hàng.

* **Mức độ nghiêm trọng:** **Nghiêm trọng (Critical)**

* **Phương án giải quyết:** Phân tách rõ:

  * **Khi nội dung chuyển khoản khớp Mã Hóa đơn (`INV_X`):** Bắt buộc trừ trực tiếp vào `INV_X` bất kể trả đủ hay trả một phần.

  * **Khi nội dung chuyển khoản KHÔNG khớp mã hóa đơn nào (chỉ nhận diện được Khách hàng):** Mới áp dụng thuật toán đối soát theo số tiền khớp chính xác hoặc trừ theo `FIFO` (ưu tiên hóa đơn có `Due Date` xa nhất chứ không phải `Issue Date`, và phải bỏ qua các hóa đơn đang `Disputed`).

### VẤN ĐỀ 03: Sai lầm Kiến trúc trong Máy trạng thái hữu hạn (Finite State Machine - FSM)

* **Mã vấn đề:** `ISS-03`

* **Nội dung:** Mục V.2 định nghĩa vòng đời hóa đơn tuyến tính: `Draft` $\rightarrow$ `Issued` $\rightarrow$ `Partially Paid` $\rightarrow$ `Paid` $\rightarrow$ `Overdue` $\rightarrow$ `Disputed` $\rightarrow$ `Default`.

* **Nguyên nhân:** Gom 3 chiều thông tin khác nhau (Tình trạng thanh toán, Tình trạng hạn nợ, Tình trạng khiếu nại) vào chung một biến trạng thái duy nhất.

* **Hậu quả:** Khi lập trình cơ sở dữ liệu và Workflow Engine:

  * Nếu một hóa đơn đang `Partially Paid` (Đã trả một phần) mà bị quá hạn, nó chuyển sang `Overdue` $\rightarrow$ Hệ thống mất dấu việc hóa đơn này đã được trả một phần!

  * Nếu hóa đơn đang `Overdue` chuyển sang `Disputed`, đến khi giải quyết xong tranh chấp thì quay về đâu? Quay về `Issued`, `Partially Paid` hay `Overdue`?

  * Nếu khách hàng chỉ tranh chấp 2 món hàng bị hỏng ($5\text{ triệu}$) trong tổng hóa đơn $100\text{ triệu}$ (`Partial Dispute`), việc chuyển cả hóa đơn sang `Disputed` sẽ làm ngưng đòi nợ cả $95\text{ triệu}$ hoàn toàn hợp lệ còn lại.

* **Mức độ nghiêm trọng:** **Nghiêm trọng (Critical)**

* **Phương án giải quyết:** Tách vòng đời hóa đơn thành **4 Trục Trạng Thái Độc Lập (Orthogonal State Vectors)**: `doc_status`, `payment_status`, `aging_stage`, và `exception_status`.

### VẤN ĐỀ 04: Xung đột quy tắc Khóa đơn hàng (`Rule 1.2`) với Quy trình Tranh chấp (`Rule 4`) và Lỗi số lẻ

* **Mã vấn đề:** `ISS-04`

* **Nội dung:** Rule 1.2 quy định: *"Nếu khách hàng có bất kỳ hóa đơn nào quá hạn trên 15 ngày, hệ thống tự động đình chỉ quyền tạo Sales Order mới"*.

* **Nguyên nhân:** Quy tắc kiểm tra điều kiện quá cứng nhắc (Hard-coded Boolean), không xét đến lý do quá hạn và giá trị quá hạn.

* **Hậu quả:**

  * **Trường hợp 1:** Bạn giao hàng bị lỗi cho đối tác chiến lược. Đối tác khiếu nại (`Disputed`). Bộ phận Kho và Sales bên bạn xử lý chậm trễ mất 16 ngày chưa xuất được hóa đơn điều chỉnh. Ngày thứ 16, đối tác đặt đơn hàng mới trị giá $500\text{ triệu}$ thì bị hệ thống chặn đứng vì "có hóa đơn quá hạn > 15 ngày".

  * **Trường hợp 2:** Khách hàng chuyển khoản trả hóa đơn $100.000.500\text{ VNĐ}$ nhưng kế toán gõ nhầm thành $100.000.000\text{ VNĐ}$ (thiếu $500\text{ đồng}$) hoặc bị ngân hàng trừ phí chuyển tiền. Hóa đơn còn dư nợ $500\text{ đồng}$ quá 15 ngày $\rightarrow$ Hệ thống khóa luôn tài khoản của khách hàng.

* **Mức độ nghiêm trọng:** **Cao (High)**

* **Phương án giải quyết:**

  * Loại trừ toàn bộ số tiền đang tranh chấp hợp lệ (`Disputed Amount`) khỏi điều kiện tính khóa đơn.

  * Áp dụng ngưỡng dung sai tối thiểu (**Small Balance Write-off / De Minimis Threshold**): Chỉ khóa đơn nếu tổng dư nợ quá hạn > 15 ngày vượt quá một định mức nhất định (ví dụ: $> 100.000\text{ VNĐ}$).

### VẤN ĐỀ 05: Lỗ hổng trục lợi "Lời hứa trả nợ" (PTP Loop Exploit) và treo "Tranh chấp" (Zombie Disputes)

* **Mã vấn đề:** `ISS-05`

* **Nội dung:** Rule 4 cho phép khi khách hàng cam kết trả vào ngày $X$ (`ptp_date = X`), toàn bộ chuỗi nhắc nợ tạm hoãn đến $X+1$. Khi khách báo `Disputed`, ngừng ngay việc đòi nợ.

* **Nguyên nhân:** Thiếu giới hạn (Constraints) về số lần được phép hứa hẹn, khoảng cách ngày hứa tối đa, và thiếu SLA giải quyết tranh chấp.

* **Hậu quả:**

  * **Trục lợi PTP:** Ngày $T+7$ AI gọi, khách hẹn $T+20$. Đến $T+21$ chưa trả, hệ thống gọi lại, khách lại hẹn tiếp $T+35$... Khách hàng trì hoãn nợ vô thời hạn mà không bao giờ bị đẩy lên Tầng 3 (Khóa hạn mức & Thu hồi pháp lý).

  * **Treo Dispute:** Khách hàng cố tình bấm nút "Khiếu nại hóa đơn" trên Customer Portal với lý do mơ hồ để né bị đòi nợ và né bị khóa hạn mức mua hàng. Nếu CSKH không xử lý kịp hoặc quên đóng ticket, khoản nợ bị "đóng băng" vĩnh viễn.

* **Mức độ nghiêm trọng:** **Cao (High)**

* **Phương án giải quyết:**

  * **Với PTP:** Giới hạn `User` chỉ được tự tạo PTP **01 lần/hóa đơn** trên Portal (tối đa lùi 5 ngày); `Staff` (Kế toán) được nhập thêm tối đa **01 lần** (tối đa 7 ngày). Quá giới hạn này chỉ có `Admin` mới có quyền mở khóa.

  * **Với Dispute:** Yêu cầu `User` chọn lý do và đính kèm minh chứng khi tạo Dispute trên Portal. Gắn **SLA nội bộ 48–72 giờ** cho `Staff` xác minh. Nếu quá SLA chưa xác minh xong, hệ thống tự động cảnh báo leo thang lên `Admin`.

### VẤN ĐỀ 06: Điểm nghẽn Đối soát Ngân hàng trong môi trường B2B Việt Nam

* **Mã vấn đề:** `ISS-06`

* **Nội dung:** Rule 5.1 & 5.2 dựa hoàn toàn vào việc Regex mã `INV_[MãHóaĐơn]_[MãKhách]` từ Webhook biến động số dư để gạch nợ tự động.

* **Nguyên nhân:** Giả định mọi khách hàng B2B đều quét mã VietQR cho từng hóa đơn.

* **Hậu quả thực tế:**

  1. Trong B2B, kế toán thanh toán của doanh nghiệp lớn thường **không quét QR bằng điện thoại cá nhân**, mà lập Ủy nhiệm chi (UNC) trên Internet Banking doanh nghiệp (cần chữ ký số của Kế toán trưởng và Giám đốc).

  2. Họ thường **gom 5–10 hóa đơn trong tháng để chuyển khoản 1 lần duy nhất** (Lump-sum Payment) với nội dung kiểu: *"CTY ABC TT TIEN HANG THANG 10"*.

  3. Nhiều ngân hàng liên mạng cắt bớt nội dung chuyển khoản hoặc biến đổi ký tự đặc biệt (`_` thành khoảng trắng).
     $\rightarrow$ Hệ thống Regex thất bại, tiền đã vào tài khoản ngân hàng nhưng hóa đơn không được đóng, dẫn đến việc **AI Voice Agent gọi điện đòi nợ một khách hàng vừa chuyển hàng trăm triệu đồng vào buổi sáng**.

* **Mức độ nghiêm trọng:** **Nghiêm trọng (Critical)**

* **Phương án giải quyết:** Thiết kế cơ chế **Đệm an toàn Đối soát (Reconciliation Safety Buffer)** kết hợp **Tài khoản Ảo (Virtual Account - VA)** định danh riêng cho từng khách hàng B2B.

### VẤN ĐỀ 07: Rủi ro Pháp lý và Trải nghiệm của AI Voice Agent (GĐ 4 - Tầng 2)

* **Mã vấn đề:** `ISS-07`

* **Nội dung:** Ngày $T+7$ dùng AI Voice Agent gọi điện trực tiếp cho khách hàng để đòi nợ và xin PTP.

* **Nguyên nhân:** Chưa tính đến quy định pháp luật Việt Nam (Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân, quy định chống cuộc gọi rác) và đặc thù phân cấp nhân sự bên mua.

* **Hậu quả:** Gọi nhầm số của Giám đốc bên mua (thay vì Kế toán thanh toán) vào giờ nghỉ; gọi liên tục nhiều ngày nếu khách có nhiều hóa đơn lệch ngày; hoặc AI tự ý hứa hẹn giảm nợ sai thẩm quyền.

* **Mức độ nghiêm trọng:** **Trung bình - Cao (Major)**

* **Phương án giải quyết:** Phân tách danh bạ liên hệ của `User` (`Buyer_AP` vs `Buyer_CFO`), giới hạn tần suất gọi tối đa 1 cuộc/7 ngày/khách hàng trong giờ hành chính, và đóng khung kịch bản hội thoại của AI.

### VẤN ĐỀ 08: Rủi ro Gian lận và Xung đột lợi ích khi thiếu Phân quyền `Admin - Staff - User`

* **Mã vấn đề:** `ISS-08`

* **Nội dung:** Tài liệu gốc chưa phân định quyền hạn thao tác hệ thống giữa người tạo đơn, người duyệt tín dụng, người gạch nợ và khách hàng.

* **Nguyên nhân:** Thiết kế tập trung vào luồng tự động (System Flow) mà bỏ qua luồng tác nhân con người (Human Actor Permissions).

* **Hậu quả:**

  * Nhân viên Sales (`Staff`) vì áp lực doanh số có thể tự ý sửa tăng hạn mức tín dụng của khách hàng có rủi ro cao hoặc tự ý nhập PTP giả để mở khóa cho đơn hàng mới đi qua.

  * Nhân viên thu hồi nợ (`Staff`) thông đồng với khách hàng để đánh dấu `Disputed` hoặc xóa nợ sai quy định mà không có cơ chế phê duyệt 4 mắt (*Maker-Checker*).

* **Mức độ nghiêm trọng:** **Cao (High)**

* **Phương án giải quyết:** Thiết lập kiến trúc phân quyền **RBAC (Role-Based Access Control)** 3 tầng rõ rệt: `Admin` (Quản trị & Phê duyệt rủi ro) – `Staff` (Thực thi theo phân hệ Sales / AR / CSKH) – `User` (Khách hàng tự phục vụ trên Portal có giới hạn), kèm theo cơ chế **Maker-Checker** (Nhân viên đề xuất – Admin phê duyệt) cho mọi thao tác nhạy cảm về tiền và hạn mức.

## PHẦN D: CÁC PHƯƠNG ÁN ĐỀ XUẤT VÀ SO SÁNH

| Tiêu chí đánh giá | Phương án 1: Vá lỗi Cục bộ (Patching Current Model) | Phương án 2: Kiến trúc Tài khoản Ảo, Đa Trạng thái & Phân quyền RBAC 3 Tầng (Khuyến nghị) | Phương án 3: Tự động hóa Toàn diện bằng AI & Smart Contract (Extreme FinTech) | 
| ----- | ----- | ----- | ----- | 
| **Mô tả cốt lõi** | Giữ nguyên thiết kế trong `Buss.md`, chỉ sửa lại công thức tín dụng, thêm giới hạn số lần PTP và sửa lại thứ tự ưu tiên gạch nợ. | Kết hợp **Virtual Account (VA)** cho từng khách hàng B2B, tách **4 trục trạng thái hóa đơn**, bổ sung **Safety Buffer** chống gọi nhầm, giữ chỗ tín dụng (**Credit Reservation**) và phân quyền chặt **Admin - Staff - User**. | Mọi giao dịch B2B đi qua cổng ký quỹ (Escrow/Dynamic Factoring), AI tự động đàm phán lịch trả góp và tự động tính lãi phạt theo ngày thực tế. | 
| **Logic nghiệp vụ** | Khắc phục được lỗi cơ bản nhưng vẫn kẹt ở khâu đối soát chuyển khoản gộp (UNC) và thiếu kiểm soát phân quyền nội bộ. | **Chặt chẽ, toàn diện**, giải quyết triệt để bài toán UNC của kế toán doanh nghiệp Việt Nam, kiểm soát ngoại lệ và chống gian lận nội bộ. | Rất hiện đại nhưng quá cứng nhắc với văn hóa kinh doanh B2B truyền thống (vốn cần sự linh hoạt và quan hệ đối tác). | 
| **Chi phí triển khai** | Thấp | Trung bình (Chi phí tích hợp API Virtual Account của ngân hàng/PayOS/Sepay rất hợp lý). | Rất cao (Phụ thuộc hạ tầng ngân hàng lõi và mô hình AI phức tạp). | 
| **Độ phức tạp kỹ thuật** | Thấp | Trung bình - Khả thi cao với ngăn xếp Node.js/FastAPI + PostgreSQL hiện tại. | Rất cao | 
| **Kiểm soát rủi ro** | Trung bình (Vẫn có nguy cơ gọi đòi nợ nhầm hoặc nhân viên thao túng hạn mức). | **Rất cao** (Nhờ VA định danh khách hàng + Cơ chế tạm dừng nhắc nợ 24h + Phân quyền Maker-Checker). | Cao về mặt thu hồi tiền nhưng rủi ro **mất khách hàng B2B** rất lớn. | 
| **Hiệu quả vận hành** | Giảm \~50% thao tác thủ công. | **Giảm 85-90% thao tác thủ công**, `Staff` chỉ xử lý ngoại lệ, `Admin` chỉ duyệt các ca vượt ngưỡng. | Tự động 95% nhưng phát sinh nhiều khiếu nại từ bộ phận Kinh doanh (Sales). | 
| **Khả năng mở rộng** | Hạn chế khi số lượng đơn hàng và nhân sự vận hành tăng lên. | **Rất tốt**, sẵn sàng mở rộng sang mô hình Multi-tenant SaaS hoặc Supply Chain Finance. | Cao nhưng kén tệp khách hàng. | 

$\Rightarrow$ **LỰA CHỌN TỐI ƯU:** **Phương án 2** là phương án cân bằng hoàn hảo nhất giữa tính chặt chẽ kế toán, an toàn bảo mật nội bộ, trải nghiệm khách hàng B2B tại Việt Nam và tính khả thi khi phát triển phần mềm.

## PHẦN E: NGHIỆP VỤ ĐỀ XUẤT TỐI ƯU (BẢN ĐẶC TẢ CHUẨN ĐỂ TRIỂN KHAI)

Dưới đây là bản thiết kế nghiệp vụ hoàn chỉnh đã được tái cấu trúc, sẵn sàng sử dụng làm tài liệu **Business Requirements Document (BRD) / System Specification**.

### 1. Mục tiêu Hệ thống Tối ưu

* Đảm bảo **100% đơn hàng** được kiểm soát rủi ro tín dụng theo thời gian thực (bao gồm cả công nợ tiềm tàng).

* Đạt tỷ lệ **đối soát tự động (Straight-Through Processing) > 90%** kể cả khi khách hàng quét QR từng đơn hay lập Ủy nhiệm chi gộp nhiều đơn.

* Đảm bảo **0% cuộc gọi đòi nợ nhầm** đối với khách hàng đang khiếu nại hoặc vừa chuyển tiền nhưng hệ thống chưa khớp được hóa đơn.

* Thiết lập cơ chế phân quyền **RBAC (Admin - Staff - User)** rõ ràng, đảm bảo nguyên tắc Phân tách nhiệm vụ (*Segregation of Duties*).

### 2. Kiến trúc Phân quyền Vai trò: ADMIN – STAFF – USER (RBAC Model)

Để hệ thống vừa vận hành trơn tru vừa ngăn chặn rủi ro gian lận nội bộ, các tác nhân con người được quy hoạch thành 3 nhóm vai trò chính kết hợp cùng các Tác nhân Tự động (`System Agents`):

#### 2.1. Nhóm vai trò ADMIN (Quản trị Hệ thống & Phê duyệt Cấp cao)

Đại diện cho Ban Giám đốc, Giám đốc Tài chính (CFO), Quản lý Tín dụng (Credit Manager) và Quản trị viên hệ thống:

* **Cấu hình Tham số & Luật Nghiệp vụ (System Policy Configuration):** Thiết lập công thức tính hạn mức, ngưỡng ngày khóa đơn (mặc định 15 ngày), hạn mức xóa nợ số lẻ tự động (mặc định $\le 10.000\text{ VNĐ}$), cấu hình kịch bản nhắc nợ (Dunning Cadence $T-3, T+3, T+7...$) và mẫu kịch bản AI Voice.

* **Quản trị Hạn mức Tín dụng (Credit Limit Approval):** Phê duyệt cấp mới, nâng hoặc hạ hạn mức tín dụng (`Credit Limit`) và thời hạn thanh toán (`Payment Terms - Net N`) cho từng khách hàng B2B.

* **Phê duyệt Ngoại lệ Đặc biệt (Override & Escalation Authority):**

  * Duyệt mở khóa tạm thời (*Credit Hold Override*) cho các đơn hàng vượt hạn mức hoặc đang quá hạn khi có đề xuất hợp lý từ `Staff`.

  * Duyệt gia hạn lịch hẹn trả nợ (`PTP`) vượt quá giới hạn cho phép của `Staff`/`User` (từ lần thứ 3 trở lên hoặc hẹn xa hơn 7 ngày).

  * Duyệt xuất hóa đơn điều chỉnh giảm / xóa nợ xấu (*Write-off*) hoặc quyết định chuyển hồ sơ sang Pháp chế ở mốc $T+30$.

* **Giám sát & Kiểm toán (Audit & Analytics):** Xem Dashboard dòng tiền tổng thể (Aging Report, DSO - Days Sales Outstanding), quản lý tài khoản `Staff` và tra cứu nhật ký thao tác hệ thống (*Immutable Audit Log*).

#### 2.2. Nhóm vai trò STAFF (Nhân viên Vận hành Nội bộ)

Thực hiện các nghiệp vụ hàng ngày và xử lý ngoại lệ trong phạm vi được giao. Để đảm bảo nguyên tắc *Không ai vừa tạo đơn vừa tự duyệt công nợ*, nhóm `Staff` được chia thành 3 phân quyền chuyên môn (Sub-roles):

1. **`Staff_Sales` (Nhân viên Kinh doanh & Quản lý Đơn hàng):**

   * Tạo Báo giá, tạo Đơn bán hàng (Sales Order - SO) hộ khách hàng.

   * Xem tình trạng Hạn mức tín dụng khả dụng và danh sách hóa đơn quá hạn của khách hàng mình phụ trách để chủ động đôn đốc.

   * Khi đơn hàng bị hệ thống chặn (`On-Hold`), có quyền gửi **Yêu cầu xin duyệt ngoại lệ (*Request Credit Override*)** kèm lý do giải trình lên `Admin`.

   * *Giới hạn quyền:* Tuyệt đối **không** có quyền tự sửa hạn mức tín dụng, không được tự ý mở khóa đơn hàng và không được sửa trạng thái thanh toán của hóa đơn.

2. **`Staff_AR` (Kế toán Công nợ & Chuyên viên Thu hồi nợ):**

   * Kiểm tra chứng từ giao hàng (POD) và phát hành Hóa đơn điện tử (E-Invoice).

   * Quản lý danh sách công việc thu hồi nợ hàng ngày (*Daily Collection Worklist*), xử lý các khoản tiền treo chưa rõ hóa đơn (`Unapplied Cash`) khi khách chuyển khoản sai cú pháp/lệch số tiền.

   * Tiếp nhận phản hồi từ khách hàng để cập nhật **Ngày hứa trả nợ (`PTP`)** trên hệ thống (được phép nhập tối đa đến lần thứ 2 cho mỗi hóa đơn, thời gian hẹn $\le 7\text{ ngày}$).

   * Thực hiện cuộc gọi đòi nợ trực tiếp bằng con người ở Tầng 3 ($T+15$) và chuẩn bị bộ hồ sơ pháp lý ở mốc $T+30$ trình `Admin` duyệt.

   * *Giới hạn quyền:* Không được tự ý xóa nợ hoặc giảm trừ giá trị hóa đơn quá hạn mức số lẻ ($10.000\text{ VNĐ}$) nếu không có phê duyệt của `Admin`.

3. **`Staff_CSKH_Ops` (Nhân viên Chăm sóc Khách hàng & Vận hành Kho):**

   * Cập nhật trạng thái Xuất kho và Xác nhận giao hàng thành công (Upload biên bản POD / e-Delivery) để kích hoạt mốc tính hạn nợ.

   * Tiếp nhận và xác minh các phiếu **Khiếu nại / Tranh chấp (`Dispute Ticket`)** từ khách hàng (kiểm tra hàng hỏng, giao thiếu, sai quy cách) trong vòng SLA **72 giờ làm việc**.

   * Đề xuất phương án xử lý Dispute (giao bù hàng hoặc đề nghị `Staff_AR`/`Admin` điều chỉnh giảm hóa đơn).

#### 2.3. Nhóm vai trò USER (Khách hàng B2B - Tương tác qua Self-Service Customer Portal)

Là doanh nghiệp mua hàng, tương tác với hệ thống thông qua Cổng thông tin khách hàng (Customer Portal / Magic Link). Trong một doanh nghiệp khách hàng có thể phân thành 3 đầu mối nhận thông tin và thao tác:

* **Quyền của `User` trên Customer Portal:**

  * **Đặt hàng & Kiểm tra Hạn mức:** Tự lên đơn đặt hàng mới (B2B Ordering), theo dõi trực quan thanh Hạn mức tín dụng được cấp, Dư nợ hiện tại, Giá trị đơn đang chờ giao và Hạn mức còn lại.

  * **Tra cứu & Thanh toán 1-Click:** Xem danh sách hóa đơn, tải file PDF E-Invoice, biên bản giao hàng (POD) và quét mã **Dynamic VietQR** để thanh toán tức thì (1 hóa đơn hoặc chọn gộp nhiều hóa đơn).

  * **Phân bổ Tiền thừa / Tiền chuyển gộp:** Khi kế toán bên mua chuyển khoản Ủy nhiệm chi không ghi mã hóa đơn, `User` có thể bấm vào link thông báo để tích chọn những hóa đơn vừa được thanh toán bằng khoản tiền đó.

  * **Tự đăng ký Cam kết trả nợ (`Self-service PTP`):** Khi kẹt dòng tiền ngắn hạn, `User` được quyền bấm nút *"Hẹn ngày thanh toán"* trực tiếp trên Portal (Hệ thống giới hạn `User` chỉ được tự hẹn **01 lần duy nhất/hóa đơn** và ngày hẹn không vượt quá **05 ngày** kể từ ngày thao tác) để tạm dừng nhận cuộc gọi tự động từ AI.

  * **Gửi Khiếu nại / Tranh chấp (`Raise Dispute`):** Bấm nút *"Báo cáo sai sót"* trên từng dòng hàng của hóa đơn, nhập số tiền tranh chấp và tải ảnh bằng chứng để hệ thống tự động đóng băng việc đòi nợ đối với phần tiền đang khiếu nại.

* **Phân cấp Đầu mối Liên hệ bên trong `User`:**

  * `User_Procurement` (Người mua hàng): Đặt hàng, nhận cảnh báo khi đơn hàng bị giữ do vượt hạn mức.

  * `User_AP` (Kế toán thanh toán): Nhận hóa đơn và các thông báo nhắc nợ từ $T-3$ đến $T+7$, thao tác thanh toán, tạo PTP và Dispute.

  * `User_CFO` (Giám đốc / Cấp quản lý bên mua): Chỉ nhận email/thông báo cảnh báo nghiêm trọng khi nợ leo thang lên Tầng 3 ($T+15$) hoặc trước khi chuyển Pháp chế ($T+30$).

#### 2.4. Ma trận Phân quyền Nghiệp vụ (RBAC & Maker-Checker Matrix)

| Nghiệp vụ / Chức năng Hệ thống | System Agent (Tự động) | ADMIN (Quản trị / CFO) | STAFF (Sales / AR / CSKH) | USER (Khách hàng B2B) | 
| ----- | ----- | ----- | ----- | ----- | 
| **1. Cấu hình công thức tín dụng & Luật nhắc nợ (Dunning)** | Thực thi tự động | **Toàn quyền (CRUD)** | Chỉ xem (View-only) | Không có quyền | 
| **2. Thiết lập & Điều chỉnh Hạn mức Tín dụng (`Credit Limit`)** | Tính toán `Available Credit` | **Phê duyệt (Approve)** | Đề xuất cấp/nâng hạn mức (`Sales`/`AR`) | Xem hạn mức của mình trên Portal | 
| **3. Tạo Đơn bán hàng (`Sales Order`)** | Kiểm tra & Giữ chỗ tín dụng | Xem toàn bộ | **Tạo & Sửa đơn (`Staff_Sales`)** | **Tự đặt hàng trên Portal** | 
| **4. Mở khóa Đơn hàng vượt hạn mức (`Credit Override`)** | Tự động khóa (`On-Hold`) | **Phê duyệt mở khóa** | Gửi yêu cầu xin duyệt (`Staff_Sales`) | Trả bớt nợ cũ hoặc nộp cọc 100% | 
| **5. Xác nhận Giao hàng (POD) & Phát hành E-Invoice** | Sinh mã VietQR + VA, tính `Due Date` | Hủy / Duyệt điều chỉnh HĐ | **Up POD (`CSKH`) & Xuất HĐ (`AR`)** | Xem, tải PDF Hóa đơn & POD | 
| **6. Thanh toán & Đối soát (`Cash Application`)** | Auto-match qua Webhook VA | Duyệt xóa chênh lệch $> 10\text{k VNĐ}$ | **Phân bổ tay các ca lệch (`Staff_AR`)** | **Quét QR / Chọn HĐ cho khoản CK gộp** | 
| **7. Ghi nhận Lời hứa trả nợ (`Promise-to-Pay - PTP`)** | AI Voice tự ghi nhận (Lần 1-2) | **Mở khóa từ lần thứ 3 hoặc** $> 7\text{ ngày}$ | **Nhập lịch hẹn Lần 1-2 (**$\le 7\text{ ngày}$ **- `AR`)** | **Tự hẹn Lần 1 (**$\le 5\text{ ngày}$**) trên Portal** | 
| **8. Báo cáo & Xử lý Tranh chấp (`Dispute Management`)** | Đóng băng nhắc nợ phần tiền lỗi | **Duyệt giảm trừ công nợ / Xuất Credit Note** | **Xác minh lỗi trong SLA 72h (`CSKH`/`AR`)** | **Tạo phiếu Dispute kèm ảnh bằng chứng** | 
| **9. Xử lý Nợ xấu & Pháp lý (**$T+30$ **`DEFAULT`)** | Tự động đóng gói Hồ sơ PDF | **Quyết định khởi kiện / Xóa sổ (Write-off)** | Rà soát chứng từ & Liên hệ lần cuối (`AR`) | Bị khóa toàn bộ quyền mua công nợ | 

### 3. Kiến trúc Trạng thái Đa chiều của Hóa đơn (Orthogonal State Model)

Thay vì một luồng trạng thái đơn lẻ gây xung đột, mỗi thực thể `Invoice` trong cơ sở dữ liệu PostgreSQL phải được quản lý bởi **4 thuộc tính trạng thái độc lập**:

| Trục trạng thái | Tên trường (DB Field) | Các giá trị hợp lệ (Enums) | Quy tắc chuyển đổi chính | 
| ----- | ----- | ----- | ----- | 
| **1. Trạng thái Văn bản** | `doc_status` | `DRAFT` $\rightarrow$ `ISSUED` $\rightarrow$ `CANCELLED` / `ADJUSTED` | Chỉ hóa đơn `ISSUED` mới phát sinh nghĩa vụ nợ. `Staff_AR` phát hành, `Admin` duyệt hủy/điều chỉnh. | 
| **2. Trạng thái Thanh toán** | `payment_status` | `UNPAID` $\rightarrow$ `PARTIALLY_PAID` $\rightarrow$ `PAID` | Tự động tính toán dựa trên: $\text{Paid\_Amount}$ so với $\text{Net\_Invoice\_Amount}$. | 
| **3. Trạng thái Tuổi nợ** | `aging_stage` | `NOT_DUE` $\rightarrow$ `DUE_TODAY` $\rightarrow$ `OVERDUE_T1` (1-6d) $\rightarrow$ `OVERDUE_T2` (7-14d) $\rightarrow$ `OVERDUE_T3` (15-29d) $\rightarrow$ `DEFAULT` ($\ge$30d) | Cronjob cập nhật hàng ngày lúc `00:05 AM` cho các hóa đơn có `payment_status != PAID`. | 
| **4. Cờ Ngoại lệ** | `exception_status` | `NORMAL`, `PTP_ACTIVE`, `PTP_BROKEN`, `DISPUTE_PARTIAL`, `DISPUTE_FULL`, `UNAPPLIED_CASH_HOLD` | Điều khiển trực tiếp việc **Bật / Tạm dừng** `Smart_Dunning_Orchestrator`. | 

### 4. Quy trình Hoạt động Tối ưu & Tương tác Đa Vai trò (End-to-End Flow)

```
flowchart TD
    subgraph GĐ1["Giai đoạn 1: Kiểm soát & Giữ chỗ Tín dụng (User / Staff_Sales / Admin)"]
        A["USER hoặc STAFF_SALES<br/>Tạo Đơn hàng (SO)"] --> B{"Phương thức<br/>Thanh toán?"}
        B -- "Trả trước 100% (Prepaid)" --> C["Chờ USER thanh toán QR Đơn hàng<br/>(Không dùng Hạn mức)"]
        B -- "Mua công nợ (Credit Terms)" --> D{"SYSTEM Kiểm tra Kép:<br/>1. Exposure <= Credit Limit?<br/>2. Nợ quá hạn >15d (trừ Dispute) <= 100k?"}
        D -- "Đạt" --> E["SYSTEM Duyệt SO & Giữ chỗ Tín dụng<br/>(Credit Reservation)"]
        D -- "Không đạt" --> F["Tạm giữ SO (On-Hold)<br/>USER trả bớt nợ hoặc STAFF_SALES xin Override"]
        C -- "Đã nhận tiền" --> E
        F -- "ADMIN Phê duyệt Override" --> E
    end

    subgraph GĐ2["Giai đoạn 2: Giao nhận, Phát hành Hóa đơn & Định danh VA (Staff_CSKH / Staff_AR)"]
        E --> G["STAFF_CSKH/Kho: Xuất kho & Giao hàng"]
        G --> H["STAFF_CSKH: Upload Biên bản Giao hàng (POD)"]
        H --> I["STAFF_AR: Phát hành E-Invoice (Kích hoạt Due Date)<br/>Chuyển Credit Reservation -> AR Balance"]
        I --> J["SYSTEM: Sinh QR Động chứa TK Virtual Account (VA) của USER<br/>+ Nội dung: INV_MãHóaĐơn"]
    end

    subgraph GĐ3["Giai đoạn 3: Đối soát Đa tầng & Đệm An toàn (User / System / Staff_AR)"]
        J --> K["USER Chuyển khoản -> Webhook báo tiền vào TK VA"]
        K --> L{"SYSTEM Bóc tách mã INV<br/>trong nội dung CK?"}
        L -- "Khớp mã INV_X" --> M["Gạch nợ đích danh cho INV_X<br/>(Dù trả đủ hay trả 1 phần)"]
        L -- "Không có mã INV (Trả gộp/UNC)" --> N{"Tổng tiền khớp chính xác<br/>1 hoặc tổ hợp các INV đến hạn?"}
        N -- "Khớp chính xác" --> O["Tự động gạch nợ các INV tương ứng"]
        N -- "Không khớp (Lệch tiền)" --> P["Bật cờ UNAPPLIED_CASH_HOLD (Dừng đòi nợ 24h)<br/>USER chọn HĐ trên Portal hoặc STAFF_AR phân bổ tay"]
    end

    subgraph GĐ4["Giai đoạn 4: Thu hồi nợ Thích ứng & Quản trị Ngoại lệ (System / User / Staff / Admin)"]
        I --> Q["SYSTEM: Theo dõi Tuổi nợ (Aging Engine)"]
        Q --> R{"Kiểm tra Cờ Ngoại lệ<br/>do USER/STAFF tạo"}
        R -- "Dispute Active" --> S["Tạm dừng đòi nợ phần tiền lỗi<br/>STAFF_CSKH xác minh (SLA 72h) -> ADMIN duyệt giảm trừ"]
        R -- "PTP Active" --> S2["Hoãn đòi nợ đến ngày hẹn (PTP)<br/>Nếu quá hẹn -> Bật PTP_BROKEN"]
        R -- "Normal / PTP_Broken" --> T["Thực thi Chuỗi nhắc nợ Đa tầng (T-3 đến T+30)<br/>T+15: STAFF_AR gọi | T+30: ADMIN duyệt Pháp chế"]
    end

```

### 5. Hệ thống Quy tắc Nghiệp vụ Chi tiết (Detailed Business Rules)

#### Nhóm Quy tắc 1: Thẩm định và Giữ chỗ Tín dụng (Credit Control & Reservation)

* **BR-1.1 (Công thức tính Hạn mức khả dụng chuẩn):**
  

  $$
  \text{Available Credit} = \text{Credit Limit} - \left( \text{Unpaid Invoices} + \text{Approved Unbilled SO} - \text{Unapplied Cash/Deposits} \right)
  $$

  * Trong đó: `Approved Unbilled SO` là tổng giá trị các đơn hàng đã duyệt nhưng chưa xuất hóa đơn. Khi SO được duyệt, khoản này lập tức khóa một phần hạn mức (Credit Reservation). Khi SO chuyển thành Invoice, số tiền chuyển từ `Approved Unbilled SO` sang `Unpaid Invoices` (không bị tính trùng). Nếu SO bị hủy trước khi giao, giải phóng hạn mức ngay lập tức.

* **BR-1.2 (Quy tắc Khóa đơn quá hạn thông minh - Smart Overdue Lock):**
  Hệ thống chỉ tự động chặn tạo đơn hàng công nợ mới khi thỏa mãn **đồng thời** các điều kiện sau:
  

  $$
  \sum \left( \text{Balance of Invoices Overdue} > 15\text{ days} - \text{Disputed Amount} \right) > \text{De Minimis Threshold } (100.000\text{ VNĐ})
  $$

  * *Ý nghĩa:* Hóa đơn đang tranh chấp hợp lệ hoặc hóa đơn chỉ lệch vài trăm/vài nghìn đồng tiền lẻ sẽ **không** làm khóa quyền mua hàng của `User`.

* **BR-1.3 (Luồng Phê duyệt Ngoại lệ theo cơ chế Maker-Checker):**
  Khi đơn hàng bị chặn bởi `BR-1.1` hoặc `BR-1.2`, hệ thống cung cấp 3 lựa chọn thay vì hủy đơn:

  1. `User` chuyển sang thanh toán ngay 100% giá trị đơn mới (Prepaid).

  2. `User` thanh toán bớt nợ cũ qua QR trên Portal để giải phóng hạn mức tức thời.

  3. `Staff_Sales` (Maker) bấm *"Yêu cầu duyệt ngoại lệ (Request Credit Override)"* kèm lý do $\rightarrow$ Gửi thông báo cho `Admin` (Checker) phê duyệt 1 lần (One-time Override) ngay trên hệ thống. Mọi thao tác Override đều được ghi vào `Audit_Log`.

#### Nhóm Quy tắc 2: Kích hoạt Nghĩa vụ Nợ & Định danh Thanh toán (Invoicing & Virtual Account)

* **BR-2.1 (Mốc tính thời hạn nợ - Baseline Date for Due Date):**
  

  $$
  \text{Due Date } (T) = \max(\text{Invoice Issue Date}, \text{Confirmed Delivery Date (POD)}) + \text{Payment Terms (Net } N \text{ days)}
  $$

  * *Lý do:* Tránh trường hợp `Staff_AR` xuất hóa đơn ngày 01/10 nhưng kho giao hàng đến cho `User` vào ngày 05/10, khiến khách bị mất 5 ngày công nợ và dẫn đến khiếu nại.

* **BR-2.2 (Định danh Kép bằng Virtual Account + Reference Code):**

  * Mỗi khách hàng B2B (`User`) được cấp 1 số **Tài khoản ảo định danh (Virtual Account - VA)** duy nhất (ví dụ: `96886 + MãKháchHàng`).

  * Mã VietQR động trên từng hóa đơn sẽ nhúng: **Số tài khoản = Số VA của Khách** + **Nội dung = `INV_[MãHóaĐơn]`**.

  * *Lợi ích kép:* Nếu `User` quét QR $\rightarrow$ Hệ thống biết cả Khách hàng lẫn Hóa đơn (Tự động 100%). Nếu kế toán của `User` lập Ủy nhiệm chi thủ công vào số tài khoản VA đó mà quên ghi mã hóa đơn $\rightarrow$ Hệ thống vẫn biết chính xác tiền của Khách hàng nào để đưa vào luồng đối soát theo khách hàng!

* **BR-2.3 (Bảo mật Customer Portal 2 lớp cho `User`):**

  * **Lớp 1 (Quick Pay Link):** Nhấp vào Magic Link trong Email/Zalo chỉ hiển thị tóm tắt hóa đơn đó (che bớt thông tin nhạy cảm) và mã QR để thanh toán nhanh.

  * **Lớp 2 (Full Statement & Action Portal):** Khi `User` muốn xem toàn bộ lịch sử sao kê công nợ, tải hóa đơn PDF gốc hoặc thực hiện thao tác tạo Tranh chấp (`Dispute`) / Cam kết trả nợ (`PTP`), hệ thống gửi mã **OTP 6 số** về email/SĐT của `User_AP` đã đăng ký.

#### Nhóm Quy tắc 3: Thứ tự Ưu tiên Đối soát và Xóa nợ Tự động (Cash Application Hierarchy)

Khi nhận Webhook biến động số dư với số tiền $M$ từ ngân hàng, `Cash_Matching_Engine` xử lý theo thứ tự ưu tiên từ trên xuống dưới:

* **Mức ưu tiên 1 (Khớp Đích danh - Explicit Invoice Match):**
  Bóc tách nội dung chuyển khoản tìm mã `INV_X` (hoặc danh sách `INV_X, INV_Y`).

  * Nếu $M == \text{Số dư của } INV\_X$: Chuyển `INV_X` sang `PAID`.

  * Nếu $M < \text{Số dư của } INV\_X$: Cập nhật `INV_X` sang `PARTIALLY_PAID` và trừ trực tiếp vào `INV_X` (**Tuyệt đối không dùng FIFO sang hóa đơn khác khi khách đã chỉ định mã hóa đơn**).

  * Nếu $\left| M - \text{Số dư của } INV\_X \right| \le 10.000\text{ VNĐ}$ (Sai số nhỏ do gõ nhầm tiền lẻ/phí NH): Tự động đóng `INV_X` (`PAID`) và hạch toán phần chênh lệch vào tài khoản *Chi phí/Thu nhập làm tròn số lẻ (Small Balance Write-off)*. Nếu chênh lệch $> 10.000\text{ VNĐ}$, chuyển vào danh sách chờ `Staff_AR` xử lý.

* **Mức ưu tiên 2 (Khớp Tổ hợp Số tiền theo Khách hàng - Exact Combo Match via VA):**
  Nếu nội dung chuyển khoản **không** có mã hóa đơn, nhưng tiền vào từ **Virtual Account (VA)** của Khách hàng $K$:

  * Hệ thống kiểm tra xem số tiền $M$ có bằng chính xác: (a) 1 hóa đơn đang mở bất kỳ của khách $K$, hoặc (b) Tổng các hóa đơn đã đến hạn (`Overdue` + `Due Today`), hoặc (c) Tổng toàn bộ sao kê tháng trước của khách $K$ hay không.

  * Nếu khớp duy nhất 1 phương án $\rightarrow$ Tự động gạch nợ và gửi thông báo xác nhận phân bổ tiền cho `User_AP`.

* **Mức ưu tiên 3 (Đệm An toàn & Phối hợp `User` / `Staff_AR` - Safety Buffer & Controlled FIFO):**
  Nếu tiền vào VA của Khách hàng $K$ nhưng không khớp tổ hợp nào ở Mức 1 và Mức 2:

  1. Ghi nhận khoản tiền $M$ vào ví tạm thu của khách hàng (`Unapplied_Cash_Balance`).

  2. Ngay lập tức bật cờ `UNAPPLIED_CASH_HOLD` cho khách hàng $K$ $\rightarrow$ **Tạm dừng toàn bộ tin nhắn/cuộc gọi đòi nợ trong 24 giờ** (tránh gọi đòi nợ khi khách vừa chuyển tiền).

  3. Gửi thông báo tự động qua Zalo/Email cho `User_AP` (kèm tạo task trên Worklist của `Staff_AR`): *"Chúng tôi vừa nhận được* $M\text{ VNĐ}$ *từ Quý khách. Vui lòng bấm vào đây để tích chọn hóa đơn cần thanh toán, hoặc hệ thống sẽ tự động khấu trừ vào các hóa đơn đến hạn sớm nhất sau 24 giờ."*

  4. Sau 24 giờ nếu cả `User_AP` và `Staff_AR` chưa phân bổ thủ công, hệ thống tự động khấu trừ theo nguyên tắc **Due-Date FIFO** (Hóa đơn nào có **Ngày đến hạn `Due Date` cũ nhất** và **không nằm trong diện `Disputed`** thì trừ trước).

* **Mức ưu tiên 4 (Xử lý Thanh toán Dư - Overpayment):**
  Nếu sau khi trừ hết các hóa đơn được chỉ định mà vẫn thừa một khoản tiền $\Delta M > 10.000\text{ VNĐ}$, hệ thống chuyển $\Delta M$ vào `Unapplied_Cash` của `User` để tự động cấn trừ cho hóa đơn kế tiếp hoặc `Staff_AR` lập lệnh hoàn tiền theo yêu cầu.

#### Nhóm Quy tắc 4: Chiến dịch Đòi nợ Đa tầng Thích ứng (Smart Dunning Cadence)

Để tránh spam khách hàng có nhiều hóa đơn, hệ thống gom nhóm thông báo theo nguyên tắc **Statement-Level Consolidation** (tối đa 1 tin nhắn/ngày và 1 cuộc gọi/7 ngày cho mỗi khách hàng):

| Mốc thời gian | Tầng xử lý | Vai trò Nhận (`User`) | Vai trò Phối hợp Nội bộ (`Staff` / `Admin`) | Kênh & Hành động Nghiệp vụ Chuẩn hóa | 
| ----- | ----- | ----- | ----- | ----- | 
| $T - 3$ **ngày** | Nhắc trước hạn | `User_AP` | `System` tự động | **Email / Zalo ZNS:** Nhắc lịch thanh toán sắp tới kèm link Portal và QR động. | 
| $T + 0$ **ngày** | Đúng hạn | `User_AP` | `System` tự động | **Email / Zalo ZNS:** Thông báo hóa đơn đến hạn thanh toán hôm nay. | 
| $T + 3$ **ngày** | Quá hạn Tầng 1 (`OVERDUE_T1`) | `User_AP` | CC thông báo cho `Staff_Sales` | **Zalo ZNS / SMS + Cảnh báo nội bộ:** Nhắc quá hạn lần 1 nhẹ nhàng; báo cho `Staff_Sales` phụ trách để nắm tình hình khách hàng. | 
| $T + 7$ **ngày** | Quá hạn Tầng 2 (`OVERDUE_T2`) | `User_AP` | `System AI` $\rightarrow$ Tạo task cho `Staff_AR`/`CSKH` nếu có ngoại lệ | **AI Voice Agent (Giờ hành chính) + Email:** Thu thập phản hồi theo 3 nhánh: (1) Đã CK $\rightarrow$ Báo `Staff_AR` đối soát; (2) Hẹn ngày trả $\rightarrow$ Tạo `PTP`; (3) Báo lỗi $\rightarrow$ Tạo ticket `Dispute` cho `Staff_CSKH`. | 
| $T + 15$ **ngày** | Quá hạn Tầng 3 (`OVERDUE_T3`) | `User_AP` + `User_CFO` | `Staff_AR` gọi trực tiếp; `Admin` giám sát | **Khóa quyền tạo SO công nợ mới (`BR-1.2`) + Email Cảnh báo Cấp Quản lý + `Staff_AR` gọi điện đàm phán:** Thông báo tạm ngưng cấp tín dụng mới và tính phí chậm trả. | 
| $T + 30$ **ngày** | Nợ xấu (`DEFAULT`) | `User_CFO` | `Staff_AR` lập hồ sơ $\rightarrow$ **`Admin` phê duyệt Pháp chế** | **Đóng băng toàn bộ tài khoản + Xuất bộ Hồ sơ Pháp lý tự động (Dossier Pack):** Hệ thống đóng gói PDF chứng từ, `Admin` ký duyệt chuyển bộ phận Pháp chế hoặc duyệt xóa nợ xấu. | 

#### Nhóm Quy tắc 5: Kiểm soát Chặt chẽ PTP và Dispute theo Phân quyền (Anti-Abuse Rules)

* **BR-5.1 (Ràng buộc Lời hứa trả nợ theo Cấp độ Vai trò - Role-based PTP Guardrails):**

  * **Quyền của `User` (trên Customer Portal):** Chỉ được tự bấm hẹn trả nợ **tối đa 01 lần/hóa đơn** (chỉ áp dụng khi hóa đơn đang ở trạng thái quá hạn $< 15\text{ ngày}$) và ngày hẹn `ptp_date` không vượt quá **05 ngày lịch**.

  * **Quyền của `Staff_AR` (trên Hệ thống Nội bộ):** Được phép ghi nhận tối đa đến **lần PTP thứ 02** cho một hóa đơn (bao gồm cả lần khách hẹn qua AI Voice), với `ptp_date` không vượt quá **07 ngày lịch**.

  * **Quyền của `Admin`:** Mọi yêu cầu hẹn trả nợ từ **lần thứ 03 trở lên** hoặc kéo dài **quá 07 ngày** đều bị hệ thống chặn và bắt buộc phải do `Admin` phê duyệt mở khóa.

  * **Xử lý Thất hứa (`Broken PTP`):** Nếu đến `23:59` ngày `ptp_date` mà chưa ghi nhận thanh toán $\rightarrow$ Chuyển cờ sang `PTP_BROKEN`, khóa vĩnh viễn quyền tự tạo PTP của `User` đối với các kỳ sau, tự động trừ điểm tín dụng nội bộ và kích hoạt ngay hành động của tầng đòi nợ kế tiếp vào sáng ngày `ptp_date + 1`.

* **BR-5.2 (Quy trình Phối hợp Xử lý Tranh chấp Một phần và Toàn phần - Dispute Resolution Workflow):**

  * **Bước 1 (`User` khởi tạo):** `User` tạo `Dispute` trên Portal (hoặc báo qua AI Voice/Email), bắt buộc chọn *Phân loại lỗi* (Sai giá / Thiếu hàng / Hàng hỏng / Sai thông tin thuế), nhập *Số tiền tranh chấp (`Disputed_Amount`)* và đính kèm hình ảnh/chứng từ.

  * **Bước 2 (`System` tách dòng nợ):** Nếu `Disputed_Amount < Invoice_Amount` (**Tranh chấp một phần** - ví dụ hóa đơn $100\text{ triệu}$, hàng lỗi $10\text{ triệu}$), hệ thống chỉ đóng băng việc đòi nợ đối với $10\text{ triệu}$ đang tranh chấp. Phần $90\text{ triệu}$ hợp lệ còn lại vẫn tiếp tục luồng nhắc nợ bình thường!

  * **Bước 3 (`Staff_CSKH_Ops` & `Staff_AR` xác minh - SLA 72h):** Ticket tự động gán cho `Staff_CSKH_Ops` (nếu lỗi hàng hóa/giao nhận) hoặc `Staff_AR` (nếu lỗi giá/hóa đơn) với thời hạn xử lý **72 giờ làm việc**. Nếu quá 72 giờ chưa xử lý xong, hệ thống gửi cảnh báo đỏ lên Dashboard của `Admin`.

  * **Bước 4 (`Admin` phê duyệt kết quả):**

    * *Nếu khiếu nại ĐÚNG:* `Staff_AR` lập Phiếu điều chỉnh giảm công nợ (`Credit Memo` / Hóa đơn điều chỉnh) trình `Admin` bấm duyệt $\rightarrow$ Hệ thống tự động giảm số dư hóa đơn gốc và gửi lại mã QR mới cho `User`.

    * *Nếu khiếu nại SAI (Khách báo nhầm hoặc cố tình chây ì):* `Staff` đính kèm biên bản đối chiếu hợp lệ và đóng ticket $\rightarrow$ Hóa đơn quay lại luồng nhắc nợ ngay tại tầng tuổi nợ tương ứng mà không được cộng thêm ngày ân hạn.

### 6. Xử lý các Trường hợp Ngoại lệ & Rủi ro Hệ thống (Edge Cases & Concurrency)

1. **Xung đột Đồng thời (Race Condition giữa Webhook Ngân hàng và AI Voice Dialer):**

   * *Tình huống:* Đúng `09:00:00`, hệ thống xếp hàng cuộc gọi AI cho `User A`. Lúc `09:00:05`, `User A` vừa bấm chuyển khoản xong.

   * *Xử lý:* Trước khi thực hiện lệnh quay số (Dial-out) hoặc gửi SMS ở bất kỳ worker nào, hệ thống bắt buộc thực hiện bước **Pre-dispatch Check (Kiểm tra tức thời)** trong Database: Kiểm tra xem `payment_status != PAID` và `exception_status == NORMAL` và không có giao dịch Webhook nào vừa vào VA của khách trong 5 phút qua.

2. **Hủy hoặc Điều chỉnh Hóa đơn sau khi đã phát hành (Credit Note / e-Invoice Adjustment):**

   * Theo quy định hóa đơn điện tử tại Việt Nam (Nghị định 123/2020/NĐ-CP & Nghị định 70/2025/NĐ-CP), hóa đơn đã phát hành bị sai tiền không được tự ý sửa trực tiếp số dư mà phải xuất **Hóa đơn điều chỉnh** hoặc **Hóa đơn thay thế**.

   * Hệ thống hỗ trợ thực thể `Credit_Memo / Adjustment_Invoice` (do `Staff_AR` tạo, `Admin` duyệt) gắn kết (Link) với `Invoice` gốc để giảm trừ trực tiếp dư nợ gốc trước khi tính tuổi nợ.

3. **Giao hàng Nhiều đợt cho 1 Sales Order (Partial Delivery):**

   * Nếu 1 SO trị giá $100\text{ triệu}$ nhưng kho chỉ giao đợt 1 được $60\text{ triệu}$ $\rightarrow$ `Staff_AR` chỉ xuất hóa đơn $60\text{ triệu}$ cho đợt 1. Phần $40\text{ triệu}$ chưa giao vẫn giữ ở trạng thái `Approved Unbilled SO` (tiếp tục giữ chỗ tín dụng cho đến khi giao đợt 2 hoặc hủy phần còn lại).

## PHẦN F: SO SÁNH TRƯỚC VÀ SAU KHI TỐI ƯU

| Hạng mục | Nghiệp vụ Cũ (`Buss.md`) | Nghiệp vụ Mới Đề xuất (Tối ưu) | Lợi ích đạt được & Rủi ro được loại bỏ | 
| ----- | ----- | ----- | ----- | 
| **Mô hình Vai trò & Phân quyền** | Chưa phân định rõ quyền hạn giữa người dùng, nhân viên và quản lý. | Phân tách **3 tầng RBAC (`Admin` - `Staff` \[Sales/AR/CSKH\] - `User`)** kèm cơ chế phê duyệt 4 mắt (*Maker-Checker*). | Ngăn chặn triệt để gian lận nội bộ (Sales tự mở khóa đơn nợ, kế toán tự xóa nợ); trao quyền tự phục vụ có kiểm soát cho Khách hàng. | 
| **Công thức Hạn mức Tín dụng** | Chỉ trừ `Nợ chưa thanh toán` + `Đơn mới`. | Trừ `Unpaid Invoices` + `Approved Unbilled SO` - `Unapplied Cash`. | Loại bỏ 100% rủi ro khách đặt liên tiếp nhiều đơn làm vượt trần tín dụng khi kho chưa kịp xuất hóa đơn. | 
| **Điều kiện Khóa đơn hàng quá hạn** | Cứ có hóa đơn quá hạn > 15 ngày là khóa cứng. | Trừ phần tiền đang `Disputed` và áp dụng ngưỡng tối thiểu $100.000\text{ VNĐ}$. | Không khóa nhầm khách hàng đang khiếu nại chính đáng hoặc chỉ lệch vài đồng tiền lẻ chuyển khoản. | 
| **Định danh & Đối soát Thanh toán** | Phụ thuộc hoàn toàn vào Regex mã `INV_` trong nội dung CK; trả thiếu thì trừ theo FIFO. | Dùng **Virtual Account (VA)** riêng cho từng khách + Ưu tiên trừ đích danh `INV_` trước, chỉ dùng FIFO khi không có mã. | Giải quyết bài toán kế toán B2B lập Ủy nhiệm chi gộp nhiều đơn hoặc bị ngân hàng cắt nội dung; xóa bỏ mâu thuẫn QR vs FIFO. | 
| **Xử lý Tiền vào chưa rõ Hóa đơn** | Không có quy định (rơi vào trạng thái lỗi đối soát, AI vẫn gọi đòi nợ). | Cơ chế **Safety Buffer (`UNAPPLIED_CASH_HOLD`)** tự động dừng nhắc nợ 24h để `User` hoặc `Staff_AR` chọn hóa đơn. | Loại bỏ hoàn toàn thảm họa "Khách vừa chuyển tiền xong thì bị AI gọi điện đòi nợ". | 
| **Quản lý Trạng thái Hóa đơn** | 1 máy trạng thái tuyến tính đơn lẻ (7 trạng thái trộn lẫn). | **Mô hình 4 trục trạng thái độc lập** (Văn bản, Thanh toán, Tuổi nợ, Ngoại lệ). | Cơ sở dữ liệu chuẩn hóa, không bị mất trạng thái `Partially Paid` khi hóa đơn chuyển sang `Overdue` hoặc `Disputed`. | 
| **Kiểm soát PTP & Dispute** | Hứa trả (PTP) hoặc báo Tranh chấp (Dispute) là hoãn đòi nợ vô điều kiện. | Phân quyền hạn mức PTP (`User` 1 lần/5d, `Staff` 2 lần/7d, `Admin` duyệt vượt khung); hỗ trợ **Tranh chấp một phần**; gắn SLA 72h. | Chặn đứng hành vi khách hàng lợi dụng PTP/Dispute để chây ì công nợ vô thời hạn. | 

## PHẦN G: CÁC VẤN ĐỀ CẦN BẠN XÁC NHẬN THÊM (OPEN QUESTIONS)

Để chuyển hóa bản thiết kế này thành tài liệu đặc tả kỹ thuật (SRS) hoặc code chi tiết mà không tự ý giả định sai chính sách công ty của bạn, bạn vui lòng xác nhận **5 thông số nghiệp vụ** sau:

1. **Chính sách Lãi phạt chậm trả (Late Payment Interest / Penalty):**

   * Ở Tầng 3 ($T+15$), tài liệu có nhắc đến *"thông báo phạt chậm trả (nếu có trong hợp đồng)"*. Bạn muốn hệ thống **tự động tính lãi phạt hàng ngày** và sinh ra một *Debit Note (Phiếu báo nợ lãi)* riêng do `Admin` duyệt, hay chỉ dừng ở mức **hiển thị con số cảnh báo** để `Staff_AR` thương lượng?

2. **Chính sách Chiết khấu Thanh toán sớm (Early Payment Discount - Ví dụ: `2/10 Net 30`):**

   * Doanh nghiệp có áp dụng chiết khấu cho `User` trả trước hạn (ví dụ trả trong 10 ngày đầu được giảm 2%) không? Nếu có, mã QR động cần tự động giảm 2% khi `User` quét trước ngày thứ 10.

3. **Mối quan hệ giữa Đơn hàng và Hóa đơn (Billing Model):**

   * Hệ thống của bạn xuất hóa đơn theo từng lần giao hàng (1 SO $\rightarrow$ Nhiều lần giao $\rightarrow$ Nhiều Invoice) hay chốt bảng kê cuối tháng xuất 1 hóa đơn tổng (Consolidated Monthly Invoice)?

4. **Đơn vị tiền tệ (Multi-currency):**

   * Hệ thống chỉ xử lý `VNĐ` hay có cả ngoại tệ (`USD`)? (Nếu có `USD`, bài toán đối soát tự động sẽ cần thêm quy tắc xử lý *Chênh lệch tỷ giá hối đoái - FX Gain/Loss*).

5. **Mục đích sử dụng cuối cùng của Tài liệu này:**

   * Đây là đồ án/dự án nghiên cứu môn *Công nghệ tài chính và ứng dụng (FinTech)* hay là dự án phát triển sản phẩm SaaS thực tế? (Nếu là đồ án môn học, tôi có thể giúp bạn bổ sung thêm phần **Mô hình chấm điểm tín dụng nội bộ tự động - Automated Internal Credit Scoring** để `Admin` có cơ sở duyệt hạn mức).

## PHẦN H: KẾT LUẬN VÀ KHUYẾN NGHỊ

### 1. Kết luận tổng thể

* **Nghiệp vụ hiện tại trong `Buss.md` có hợp lý không?** $\rightarrow$ **Hợp lý về mặt tư tưởng chiến lược và khung quy trình tổng quát**, nhưng **chưa hợp lý ở tầng logic chi tiết, xử lý ngoại lệ và phân quyền người dùng**.

* **Có nên giữ nguyên hay thay đổi?** $\rightarrow$ Giữ nguyên **khung 4 giai đoạn** của bạn, nhưng **bắt buộc phải bổ sung mô hình phân quyền `Admin - Staff - User`, cấu trúc 4 trục trạng thái dữ liệu và bộ quy tắc nghiệp vụ (Business Rules)** theo Phần E của báo cáo này.

### 2. Phân loại các thay đổi

* **Những thay đổi BẮT BUỘC phải thực hiện (Must-Have):**

  1. Áp dụng **Ma trận phân quyền RBAC (`Admin` - `Staff` \[Sales/AR/CSKH\] - `User`)** và nguyên tắc *Maker-Checker* cho các thao tác duyệt vượt hạn mức, gia hạn PTP lần 3 và giảm trừ công nợ (Mục E.2).

  2. Tách 1 trạng thái hóa đơn thành **4 trục trạng thái độc lập** (Mục E.3).

  3. Sửa công thức tính hạn mức tín dụng có bao gồm **Giữ chỗ tín dụng (`Credit Reservation`)** cho các đơn hàng đã duyệt nhưng chưa xuất hóa đơn (`BR-1.1`).

  4. Loại bỏ quy tắc FIFO khi khách đã chuyển khoản có mã hóa đơn; chỉ dùng FIFO khi chuyển khoản không định danh hóa đơn (`BR-3`).

  5. Bổ sung giới hạn số lần cam kết trả nợ (**`User` tối đa 1 lần, `Staff` tối đa 2 lần / hóa đơn**) và tách **Tranh chấp một phần (`Partial Dispute`)** (`BR-5`).

* **Những thay đổi NÊN thực hiện (Should-Have để tối ưu đột phá):**

  1. Ứng dụng **Tài khoản ảo định danh khách hàng (Virtual Account - VA)** kết hợp cơ chế **Đệm an toàn 24h (`UNAPPLIED_CASH_HOLD`)** để triệt tiêu rủi ro gọi đòi nợ nhầm khi kế toán B2B chuyển khoản gộp.

  2. Gom nhóm thông báo nhắc nợ theo cấp độ Khách hàng (**Statement-level Consolidation**) và phân tầng người nhận bên phía `User` (`User_AP` vs `User_CFO`).

### 3. Rủi ro còn tồn tại cần lưu ý khi vận hành

* **Rủi ro dữ liệu đầu vào (Master Data Quality):** Hệ thống tự động hóa phụ thuộc rất lớn vào việc lưu đúng SĐT Zalo và Email của đúng người làm Kế toán thanh toán (`User_AP`) và Giám đốc (`User_CFO`) bên phía khách hàng. `Staff_Sales` cần xác thực thông tin này ngay khi tạo hồ sơ khách hàng mới.

* **Rủi ro phụ thuộc bên thứ ba (Third-party Webhook Downtime):** Khi cổng ngân hàng/Open Banking bảo trì khiến Webhook bị trễ, hệ thống cần có cơ chế **Polling (chủ động truy vấn sao kê định kỳ mỗi 15–30 phút)** làm phương án dự phòng trước khi kích hoạt chiến dịch gọi điện AI Voice.