// =========================================================================
// MOCK DATA CHUẨN NGHIỆP VỤ FINTECH ORDER-TO-CASH & AR AUTOMATION
// Theo tài liệu b_o_c_o_ph_n_t_ch_t_i_u_nghi_p_v_o2c_ar.md & Buss.md
// =========================================================================

// 1. KPI & SỐ LIỆU TỔNG QUAN HỆ THỐNG
export const initialDashboardStats = {
  totalExposure: '2.450.000.000 đ',
  creditLimitTotal: '3.000.000.000 đ',
  exposureRate: 81.6,
  dso: 34.2, // Days Sales Outstanding (Kỳ thu tiền bình quân)
  dsoTarget: 40.0,
  dsoBenchmark: 45.0, // Chuẩn ngành Dược & TBYT
  stpRate: 94.8, // Tỷ lệ đối soát tự động qua Virtual Account + VietQR
  stpTarget: 90.0,
  badDebt: '42.000.000 đ', // Nợ xấu quá hạn > 30 ngày (T+30)
  badDebtCount: 2,
  activePTPCount: 18,
  activePTPValue: '450.000.000 đ',
  brokenPTPCount: 2,
  openDisputesCount: 4,
  openDisputesValue: '64.000.000 đ',
  partialCollectedValue: '140.000.000 đ'
};

// 2. DANH SÁCH ĐƠN HÀNG (SO) & KIỂM SOÁT HẠN MỨC TÍN DỤNG (BR-1.1 & BR-1.2)
// Available Credit = Credit Limit - [ Unpaid Invoices + Approved Unbilled SO - Unapplied Cash ]
export const initialSalesOrders = [
  {
    id: 'SO-2026-108',
    customer: 'Bệnh Viện Phụ Sản Quốc Tế',
    customerId: 'CUST-001',
    amount: '85.000.000 đ',
    rawAmount: 85000000,
    creditLimit: '500.000.000 đ',
    availableCredit: '240.000.000 đ',
    overdueDaysMax: 0,
    status: 'APPROVED_RESERVED',
    statusText: 'Đã duyệt & Giữ chỗ hạn mức',
    statusType: 'success',
    note: 'Đạt chuẩn hạn mức khả dụng -> Đã khóa 85 triệu vào hạn mức giữ chỗ',
    date: '10/11/2026, 09:30:00'
  },
  {
    id: 'SO-2026-109',
    customer: 'Công ty Cổ phần Dược Phẩm An Khang',
    customerId: 'CUST-002',
    amount: '240.000.000 đ',
    rawAmount: 240000000,
    creditLimit: '400.000.000 đ',
    availableCredit: '60.000.000 đ',
    overdueDaysMax: 9,
    status: 'ON_HOLD_EXPOSURE',
    statusText: 'Chặn: Vượt trần tín dụng 180M đ',
    statusType: 'error',
    note: 'Vi phạm BR-1.1: Giá trị đơn vượt quá hạn mức khả dụng (Thiếu 180 triệu)',
    date: '10/11/2026, 10:15:22'
  },
  {
    id: 'SO-2026-110',
    customer: 'Tập Đoàn Y Tế Hoàn Mỹ',
    customerId: 'CUST-003',
    amount: '120.000.000 đ',
    rawAmount: 120000000,
    creditLimit: '1.000.000.000 đ',
    availableCredit: '500.000.000 đ',
    overdueDaysMax: 18,
    status: 'ON_HOLD_AGING_LOCK',
    statusText: 'Chặn: Có HĐ quá hạn > 15 ngày',
    statusType: 'warning',
    note: 'Vi phạm BR-1.2: Khóa tự động do có hóa đơn quá hạn 18 ngày (> 15 ngày)',
    date: '10/11/2026, 11:00:10'
  },
  {
    id: 'SO-2026-111',
    customer: 'Trung Tâm Y Tế Quận 1',
    customerId: 'CUST-004',
    amount: '45.000.000 đ',
    rawAmount: 45000000,
    creditLimit: '0 đ (Trả trước)',
    availableCredit: 'Không dùng hạn mức',
    overdueDaysMax: 0,
    status: 'PREPAID_DEPOSIT',
    statusText: 'Khách cọc trước 100%',
    statusType: 'info',
    note: 'Khách hàng thanh toán cọc toàn bộ qua VietQR trước khi xuất kho',
    date: '10/11/2026, 13:45:00'
  }
];

// 3. DANH SÁCH HÓA ĐƠN ĐIỆN TỬ (E-INVOICES) VỚI 4 TRỤC TRẠNG THÁI ĐỘC LẬP (BR-2.1)
// 1.doc_status | 2.payment_status | 3.aging_stage | 4.exception_status
export const initialInvoices = [
  {
    id: 'INV-2026-0891',
    customer: 'Bệnh Viện Phụ Sản Quốc Tế',
    customerId: 'CUST-001',
    taxCode: '0314892109',
    vaNumber: '9688600129',
    vaBank: 'VietinBank',
    amount: '85.000.000 đ',
    rawAmount: 85000000,
    issuedDate: '10/10/2026',
    dueDate: '15/11/2026',
    doc_status: 'ISSUED',
    payment_status: 'UNPAID',
    aging_stage: 'NOT_DUE (T-3)',
    exception_status: 'NORMAL',
    dunningTier: 'T-3 (Nhắc nhở nhẹ qua ZNS)',
    qrPayload: 'https://img.vietqr.io/image/970415-9688600129-compact2.png?amount=85000000&addInfo=9688600129%20INV-2026-0891'
  },
  {
    id: 'INV-2026-0884',
    customer: 'Nha Khoa Minh Tâm',
    customerId: 'CUST-005',
    taxCode: '0315998822',
    vaNumber: '9688600131',
    vaBank: 'VietinBank',
    amount: '32.000.000 đ',
    rawAmount: 32000000,
    issuedDate: '25/09/2026',
    dueDate: '07/11/2026',
    doc_status: 'ISSUED',
    payment_status: 'UNPAID',
    aging_stage: 'OVERDUE_T1 (3d)',
    exception_status: 'PTP_ACTIVE',
    dunningTier: 'Tầng 1 (Quá hạn 1-6d: Zalo ZNS + Email)',
    qrPayload: 'https://img.vietqr.io/image/970415-9688600131-compact2.png?amount=32000000&addInfo=9688600131%20INV-2026-0884'
  },
  {
    id: 'INV-2026-0870',
    customer: 'Công ty TBYT Phương Nam',
    customerId: 'CUST-006',
    taxCode: '0312345678',
    vaNumber: '9688600133',
    vaBank: 'VietinBank',
    amount: '120.000.000 đ',
    rawAmount: 120000000,
    issuedDate: '15/09/2026',
    dueDate: '02/11/2026',
    doc_status: 'ISSUED',
    payment_status: 'PARTIALLY_PAID',
    aging_stage: 'OVERDUE_T2 (8d)',
    exception_status: 'DISPUTE_PARTIAL',
    dunningTier: 'Tầng 2 (Quá hạn 7-14d: Đã tách phần hợp lệ 105M đ)',
    qrPayload: 'https://img.vietqr.io/image/970415-9688600133-compact2.png?amount=15000000&addInfo=9688600133%20INV-2026-0870'
  },
  {
    id: 'INV-2026-0855',
    customer: 'Công ty Cổ phần Dược Phẩm An Khang',
    customerId: 'CUST-002',
    taxCode: '0318991122',
    vaNumber: '9688600130',
    vaBank: 'BIDV',
    amount: '180.000.000 đ',
    rawAmount: 180000000,
    issuedDate: '01/09/2026',
    dueDate: '01/11/2026',
    doc_status: 'ISSUED',
    payment_status: 'UNPAID',
    aging_stage: 'OVERDUE_T2 (9d)',
    exception_status: 'PTP_BROKEN',
    dunningTier: 'Tầng 2 (Khách thất hứa hẹn ngày 08/11 -> Chuyển Tầng 3)',
    qrPayload: 'https://img.vietqr.io/image/970418-9688600130-compact2.png?amount=180000000&addInfo=9688600130%20INV-2026-0855'
  },
  {
    id: 'INV-2026-0820',
    customer: 'Phòng Khám Y Khoa Phước Long',
    customerId: 'CUST-007',
    taxCode: '0317765544',
    vaNumber: '9688600135',
    vaBank: 'VietinBank',
    amount: '42.000.000 đ',
    rawAmount: 42000000,
    issuedDate: '10/08/2026',
    dueDate: '05/10/2026',
    doc_status: 'ISSUED',
    payment_status: 'UNPAID',
    aging_stage: 'DEFAULT (>30d)',
    exception_status: 'LEGAL_PENDING',
    dunningTier: 'Tầng 4 (Quá hạn 35d: Trình Admin ký khởi kiện pháp lý)',
    qrPayload: 'https://img.vietqr.io/image/970415-9688600135-compact2.png?amount=42000000&addInfo=9688600135%20INV-2026-0820'
  }
];

// 4. DANH SÁCH GIAO DỊCH NGÂN HÀNG REAL-TIME & ĐỐI SOÁT STP (BR-3)
export const initialTransactions = [
  {
    id: 'TXN-98821',
    time: '10/11/2026, 14:28:10',
    amount: '85.000.000 đ',
    rawAmount: 85000000,
    bank: 'VietinBank',
    vaNumber: '9688600129',
    customer: 'Bệnh Viện Phụ Sản Quốc Tế',
    memo: '9688600129 INV-2026-0891 TT TIEN THUOC DOT 1',
    reconcileResult: 'Khớp 100% đích danh INV-2026-0891 (Tất toán xong)',
    status: 'MATCHED_STP',
    statusType: 'success',
    speed: '2 giây (Auto Webhook)'
  },
  {
    id: 'TXN-98822',
    time: '10/11/2026, 11:15:02',
    amount: '50.000.000 đ',
    rawAmount: 50000000,
    bank: 'BIDV',
    vaNumber: '9688600130',
    customer: 'Công ty CP Dược Phẩm An Khang',
    memo: 'An Khang chuyen khoan',
    reconcileResult: 'Thiếu mã HĐ -> Giữ vào Đệm an toàn 24h (UNAPPLIED_CASH_HOLD)',
    status: 'HOLD_BUFFER_24H',
    statusType: 'warning',
    speed: 'Đang giữ an toàn'
  },
  {
    id: 'TXN-98823',
    time: '10/11/2026, 09:04:45',
    amount: '32.000.000 đ',
    rawAmount: 32000000,
    bank: 'VietinBank',
    vaNumber: '9688600131',
    customer: 'Nha Khoa Minh Tâm',
    memo: 'Minh Tam tra tien vat tu',
    reconcileResult: 'Khớp đúng tổ hợp số dư hóa đơn INV-2026-0884',
    status: 'AUTO_COMBINATION',
    statusType: 'info',
    speed: 'Tự động gạch nợ'
  },
  {
    id: 'TXN-98824',
    time: '09/11/2026, 16:40:15',
    amount: '14.960.000 đ',
    rawAmount: 14960000,
    bank: 'VietinBank',
    vaNumber: '9688600132',
    customer: 'Phòng Khám Đa Khoa An Bình',
    memo: 'An Binh thanh toan INV-0880',
    reconcileResult: 'Lệch thiếu 40.000 đ (< Ngưỡng De Minimis 50.000 đ)',
    status: 'AUTO_WRITE_OFF',
    statusType: 'success',
    speed: 'Tự động hạch toán chi phí'
  }
];

// 5. BÀN LÀM VIỆC THU NỢ HÀNG NGÀY (DAILY COLLECTION WORKLIST - BR-4)
export const initialDunningWorklist = [
  {
    priority: '🔴 CAO NHẤT',
    customer: 'Phòng Khám Y Khoa Phước Long',
    contact: 'Kế toán trưởng: 0903.112.445 (Giờ HC)',
    overdueAmount: '42.000.000 đ',
    tier: 'Tầng 4 (Quá hạn 35 ngày)',
    history: 'AI Voice gọi không nghe máy -> Đã lập hồ sơ khởi kiện',
    action: 'Trình Admin ký kiện pháp lý'
  },
  {
    priority: '🟠 CAO',
    customer: 'Công ty Cổ phần Dược Phẩm An Khang',
    contact: 'Phòng Mua hàng: 0918.455.789 (Anh Tuấn)',
    overdueAmount: '180.000.000 đ',
    tier: 'Tầng 2 (Quá hạn 9 ngày)',
    history: 'Khách hứa trả ngày 08/11 nhưng trễ -> PTP Broken',
    action: 'AR Staff gọi trực tiếp'
  },
  {
    priority: '🟡 TRUNG BÌNH',
    customer: 'Bệnh Viện Sài Gòn',
    contact: 'Phòng Tài chính: 028.3822.9011 (Ms. Lan)',
    overdueAmount: '95.000.000 đ',
    tier: 'Tầng 2 (Quá hạn 7 ngày)',
    history: 'AI Voice đã gọi -> Khách hẹn trả ngày 15/11/2026',
    action: 'Ghi nhận PTP Lần 1'
  },
  {
    priority: '🟢 BÌNH THƯỜNG',
    customer: 'Nha Khoa Minh Tâm',
    contact: 'Chủ phòng khám: 0908.223.344 (Bác sĩ Tâm)',
    overdueAmount: '32.000.000 đ',
    tier: 'Tầng 1 (Quá hạn 3 ngày)',
    history: 'Đã gửi tin Zalo ZNS nhắc nhở nhẹ nhàng kèm VietQR',
    action: 'Theo dõi tự động'
  }
];

// 6. QUẢN LÝ CAM KẾT THANH TOÁN (PTP) & CHỐNG LẠM DỤNG (BR-5.2)
export const initialPTPList = [
  {
    id: 'PTP-2026-018',
    customer: 'Phòng Khám Y Khoa Hòa Hảo',
    invoiceId: 'INV-2026-0890',
    amount: '45.000.000 đ',
    promiseDate: '15/11/2026',
    extensionCount: 'Lần 1 (Tự tạo trên Portal)',
    creator: 'User (Portal Khách)',
    status: 'ON_TRACK',
    statusText: 'HỢP LỆ (Đang trong hạn)',
    statusType: 'success'
  },
  {
    id: 'PTP-2026-019',
    customer: 'Bệnh Viện Sài Gòn',
    invoiceId: 'INV-2026-0888',
    amount: '95.000.000 đ',
    promiseDate: '18/11/2026',
    extensionCount: 'Lần 2 (AR Staff xác nhận qua Call)',
    creator: 'Lê Thu Hà (AR Staff)',
    status: 'WARNING_LAST_TIME',
    statusText: 'CẢNH BÁO LẦN CUỐI',
    statusType: 'warning'
  },
  {
    id: 'PTP-2026-020',
    customer: 'Công ty CP Dược Phẩm An Khang',
    invoiceId: 'INV-2026-0875',
    amount: '180.000.000 đ',
    promiseDate: '10/11/2026',
    extensionCount: 'Lần 3 (VI PHẠM HẸN)',
    creator: 'Lê Thu Hà (AR Staff)',
    status: 'BROKEN_ABUSE',
    statusText: 'BROKEN - CHỜ ADMIN DUYỆT',
    statusType: 'error'
  }
];

// 7. QUẢN LÝ TRANH CHẤP & TÁCH NỢ THU HỒI PHẦN HỢP LỆ (BR-5.2)
export const initialDisputesList = [
  {
    id: 'DSP-092',
    customer: 'Công ty TBYT Phương Nam',
    invoiceId: 'INV-2026-0870 (120M đ)',
    issue: 'Giao thiếu 5 kiện găng tay y tế (Giá trị tranh chấp 15M đ)',
    action: 'Đã tách nợ: Đã thu phần hợp lệ 105M đ thành công',
    department: 'Kho vận & Giao nhận',
    slaRemaining: 'SLA còn 14 giờ (Kho đang kiểm tra)',
    status: 'IN_PROGRESS',
    statusType: 'warning'
  },
  {
    id: 'DSP-093',
    customer: 'Nha Khoa Tâm Đức',
    invoiceId: 'INV-2026-0885 (35M đ)',
    issue: 'Sai tỷ lệ chiết khấu hợp đồng 5% (Chênh lệch 1.750.000 đ)',
    action: 'Chờ Sales xác nhận phụ lục hợp đồng thương mại',
    department: 'Phòng Kinh doanh',
    slaRemaining: 'SLA còn 36 giờ (Sales xử lý)',
    status: 'IN_PROGRESS',
    statusType: 'warning'
  },
  {
    id: 'DSP-094',
    customer: 'Phòng Khám Đa Khoa An Bình',
    invoiceId: 'INV-2026-0862 (68M đ)',
    issue: 'Chưa nhận hóa đơn GTGT điện tử gốc qua email',
    action: 'Hệ thống đã tự động gửi lại E-Invoice có chữ ký số',
    department: 'Hệ thống E-Invoice',
    slaRemaining: 'ĐÃ XỬ LÝ XONG (RESOLVED)',
    status: 'RESOLVED',
    statusType: 'success'
  }
];

// 8. PHÊ DUYỆT MAKER-CHECKER DÀNH RIÊNG CHO ADMIN / CFO (BR-5.3 & BR-7)
export const initialMakerCheckerApprovals = [
  {
    id: 'REQ-2026-001',
    customer: 'Tập Đoàn Y Tế Hoàn Mỹ',
    type: 'Override Mở khóa Đơn SO nợ quá hạn > 15d',
    amount: 'Giá trị đơn: 120.000.000 đ',
    maker: 'Trần Văn Mạnh (Trưởng phòng Sales)',
    reason: 'Khách hàng VIP Hạng A cam kết tất toán cùng đợt giải ngân ngày 15/11',
    status: 'PENDING'
  },
  {
    id: 'REQ-2026-002',
    customer: 'Phòng Khám Y Khoa Phước Long',
    type: 'Ký duyệt Hồ sơ Pháp lý Khởi kiện Nợ xấu (T+30)',
    amount: 'Tổng dư nợ: 42.000.000 đ',
    maker: 'Lê Thu Hà (Kế toán AR)',
    reason: 'Quá hạn 35 ngày, AI Voice và AR Staff liên hệ nhiều lần không phản hồi',
    status: 'PENDING'
  },
  {
    id: 'REQ-2026-003',
    customer: 'Công ty Cổ phần Dược Phẩm An Khang',
    type: 'Gia hạn Cam kết thanh toán (PTP) lần 3',
    amount: 'Hóa đơn: 180.000.000 đ',
    maker: 'Lê Thu Hà (Kế toán AR)',
    reason: 'Khách xuất trình chứng từ bệnh viện đối tác chậm thanh toán giải ngân',
    status: 'PENDING'
  }
];

// 9. DANH SÁCH KHÁCH HÀNG B2B & HẠN MỨC TÍN DỤNG
export const initialCustomers = [
  {
    id: 'CUST-001',
    name: 'Bệnh Viện Phụ Sản Quốc Tế',
    taxCode: '0314892109',
    creditTier: 'Hạng A (Tín nhiệm cao)',
    creditLimit: '500.000.000 đ',
    unpaidBalance: '85.000.000 đ',
    availableCredit: '240.000.000 đ',
    vaNumber: '9688600129',
    bank: 'VietinBank',
    dso: 28.5,
    status: 'Active',
    contact: 'Nguyễn Thu Trang (Kế toán AP) - 0903.456.789'
  },
  {
    id: 'CUST-002',
    name: 'Công ty Cổ phần Dược Phẩm An Khang',
    taxCode: '0318991122',
    creditTier: 'Hạng B (Theo dõi chặt)',
    creditLimit: '400.000.000 đ',
    unpaidBalance: '180.000.000 đ',
    availableCredit: '60.000.000 đ',
    vaNumber: '9688600130',
    bank: 'BIDV',
    dso: 48.0,
    status: 'Warning',
    contact: 'Phạm Văn Tuấn (Mua hàng) - 0918.455.789'
  },
  {
    id: 'CUST-003',
    name: 'Tập Đoàn Y Tế Hoàn Mỹ',
    taxCode: '0309988776',
    creditTier: 'Hạng A (Đối tác chiến lược)',
    creditLimit: '1.000.000.000 đ',
    unpaidBalance: '380.000.000 đ',
    availableCredit: '500.000.000 đ',
    vaNumber: '9688600138',
    bank: 'VietinBank',
    dso: 35.0,
    status: 'Locked_Aging',
    contact: 'Trần Lan Hương (Kế toán trưởng) - 028.3822.1199'
  }
];


// 10. DỮ LIỆU ĐỐI SOÁT & KẾT NỐI HỆ THỐNG PHỤ TRỢ (COMPATIBILITY)
export const initialPayouts = [
  {
    id: 'po_AUTO_RECON_01',
    amount: '85.000.000 đ',
    rawAmount: 85000000,
    status: 'Paid',
    statusType: 'success',
    arrivalDate: '10/11/2026',
    destination: 'VietinBank Virtual Account (9688600129)',
    description: 'Quyết toán đối soát STP tự động HĐ #INV-2026-0891'
  },
  {
    id: 'po_AUTO_RECON_02',
    amount: '32.000.000 đ',
    rawAmount: 32000000,
    status: 'Paid',
    statusType: 'success',
    arrivalDate: '10/11/2026',
    destination: 'VietinBank Virtual Account (9688600131)',
    description: 'Gạch nợ tổ hợp số dư HĐ #INV-2026-0884'
  }
];

export const initialConnectedAccounts = [
  {
    id: 'acct_VIETINBANK_VA',
    name: 'Cổng Webhook Tài khoản ảo VietinBank',
    type: 'Virtual Account Gateway',
    email: 'integration@vietinbank.vn',
    debtFiles: 142,
    grossVolume: '1.850.000.000 đ',
    status: 'Enabled',
    statusType: 'success',
    location: 'Hệ thống Live',
    payoutBank: 'VietinBank VA Engine'
  },
  {
    id: 'acct_BIDV_VA',
    name: 'Cổng Webhook Tài khoản ảo BIDV',
    type: 'Virtual Account Gateway',
    email: 'openbanking@bidv.com.vn',
    debtFiles: 68,
    grossVolume: '600.000.000 đ',
    status: 'Enabled',
    statusType: 'success',
    location: 'Hệ thống Live',
    payoutBank: 'BIDV Direct Connect'
  }
];

export const initialProducts = [
  {
    id: 'prod_O2C_01',
    name: 'Gói Hạn mức Tín dụng B2B Xoay vòng (Revolving Credit)',
    description: 'Cấp hạn mức công nợ mua thuốc & vật tư y tế 30 ngày, miễn lãi nếu thanh toán trong hạn.',
    price: 'Hạn mức đến 1.000.000.000 đ',
    billing: 'Kỳ hạn 30 ngày',
    activeSubscribers: 18,
    status: 'Active',
    created: '10/10/2026'
  },
  {
    id: 'prod_O2C_02',
    name: 'Gói Thu nợ Tự động Đa kênh (Multi-tier Dunning Suite)',
    description: 'Tích hợp tự động Zalo ZNS, AI Voice Agent và kết nối cổng thanh toán VietQR động.',
    price: 'Theo số lượng hóa đơn',
    billing: 'Tự động kích hoạt',
    activeSubscribers: 35,
    status: 'Active',
    created: '15/10/2026'
  }
];
