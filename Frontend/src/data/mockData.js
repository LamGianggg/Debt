export const initialTransactions = [
  {
    id: 'tx_DEBT_2026_091',
    amount: '$990.00 USD',
    gross: '$990.00 USD',
    fee: '-$29.01 USD',
    net: '$960.99 USD',
    status: 'Succeeded',
    statusType: 'success',
    customer: 'Công ty TNHH Hoàng Phát',
    customerEmail: 'ketoan@hoangphat.vn',
    method: 'Chuyển khoản VCB •••• 4242',
    date: 'Sep 14, 2026, 11:14:02 PM',
    rawAmount: 990.00,
    description: 'Thanh toán đợt 1 Hợp đồng công nợ #HD-2026-091'
  },
  {
    id: 'tx_DEBT_2026_088',
    amount: '$2,500.00 USD',
    gross: '$2,500.00 USD',
    fee: '-$72.80 USD',
    net: '$2,427.20 USD',
    status: 'Succeeded',
    statusType: 'success',
    customer: 'Tập đoàn Xây dựng An Bình',
    customerEmail: 'finance@anbinhgroup.com',
    method: 'Ủy nhiệm chi TCB •••• 1092',
    date: 'Sep 14, 2026, 8:30:15 AM',
    rawAmount: 2500.00,
    description: 'Thu hồi công nợ vật tư quý 3/2026'
  },
  {
    id: 'tx_DEBT_2026_077',
    amount: '$4,900.00 USD',
    gross: '$4,900.00 USD',
    fee: '-$142.40 USD',
    net: '$4,757.60 USD',
    status: 'Succeeded',
    statusType: 'success',
    customer: 'Công ty CP Công Nghệ Việt',
    customerEmail: 'billing@vietitech.com',
    method: 'Visa Doanh nghiệp •••• 3004',
    date: 'Sep 13, 2026, 3:15:40 PM',
    rawAmount: 4900.00,
    description: 'Tất toán gói dịch vụ phần mềm trả chậm'
  },
  {
    id: 'tx_DEBT_2026_065',
    amount: '$350.00 USD',
    gross: '$350.00 USD',
    fee: '-$10.45 USD',
    net: '$339.55 USD',
    status: 'Succeeded',
    statusType: 'success',
    customer: 'Công ty TNHH Hoàng Phát',
    customerEmail: 'ketoan@hoangphat.vn',
    method: 'Chuyển khoản VCB •••• 4242',
    date: 'Sep 13, 2026, 1:05:22 AM',
    rawAmount: 350.00,
    description: 'Thanh toán phí phạt chậm nợ kỳ 2'
  },
  {
    id: 'tx_DEBT_2026_050',
    amount: '$15,000.00 USD',
    gross: '$15,000.00 USD',
    fee: '-$435.30 USD',
    net: '$14,564.70 USD',
    status: 'Succeeded',
    statusType: 'success',
    customer: 'Thương Mại & Dịch Vụ Đại Nam',
    customerEmail: 'tainv@dainam.com',
    method: 'Hóa đơn bảo lãnh BIDV •••• 5511',
    date: 'Sep 12, 2026, 10:00:00 AM',
    rawAmount: 15000.00,
    description: 'Quyết toán công nợ dự án tổng kho logistic'
  },
  {
    id: 'tx_DEBT_2026_042',
    amount: '$1,200.00 USD',
    gross: '$1,200.00 USD',
    fee: '$0.00 USD',
    net: '$0.00 USD',
    status: 'Refunded',
    statusType: 'neutral',
    customer: 'Nguyễn Văn Hùng (Cá nhân)',
    customerEmail: 'hung.nv@gmail.com',
    method: 'Thẻ tín dụng •••• 9812',
    date: 'Sep 11, 2026, 4:22:18 PM',
    rawAmount: 1200.00,
    description: 'Hoàn trả tiền đặt cọc nợ do hủy biên bản cam kết'
  },
  {
    id: 'tx_DEBT_2026_019',
    amount: '$3,800.00 USD',
    gross: '$3,800.00 USD',
    fee: '$0.00 USD',
    net: '$0.00 USD',
    status: 'Failed',
    statusType: 'error',
    customer: 'Doanh nghiệp Tư nhân Minh Phát',
    customerEmail: 'minhphat.contact@gmail.com',
    method: 'Mastercard •••• 4012',
    date: 'Sep 10, 2026, 11:45:00 AM',
    rawAmount: 3800.00,
    description: 'Thanh toán thất bại: Tài khoản đối tác không đủ số dư'
  }
];

export const initialCustomers = [
  {
    id: 'cus_DEBT_001',
    name: 'Công ty TNHH Hoàng Phát',
    email: 'ketoan@hoangphat.vn',
    phone: '+84 (024) 3892-1234',
    balance: '$5,400.00 USD',
    totalSpent: '$1,340.00 USD',
    paymentsCount: 2,
    created: 'Aug 14, 2026',
    status: 'Active',
    address: 'Tầng 5, Tòa nhà Charmvit, 117 Trần Duy Hưng, Hà Nội',
    defaultPayment: 'Vietcombank •••• 4242',
    subscriptions: [
      { id: 'sub_hd_01', plan: 'Hợp đồng trả góp thiết bị máy móc', amount: '$990.00/tháng', status: 'Active', renewal: 'Oct 14, 2026' }
    ]
  },
  {
    id: 'cus_DEBT_002',
    name: 'Tập đoàn Xây dựng An Bình',
    email: 'finance@anbinhgroup.com',
    phone: '+84 (028) 3910-5678',
    balance: '$12,800.00 USD',
    totalSpent: '$2,500.00 USD',
    paymentsCount: 1,
    created: 'Sep 01, 2026',
    status: 'Active',
    address: 'Số 88 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    defaultPayment: 'Techcombank •••• 1092',
    subscriptions: [
      { id: 'sub_hd_02', plan: 'Hạn mức nợ gối đầu vật liệu công trình', amount: '$2,500.00/tháng', status: 'Active', renewal: 'Oct 01, 2026' }
    ]
  },
  {
    id: 'cus_DEBT_003',
    name: 'Công ty CP Công Nghệ Việt',
    email: 'billing@vietitech.com',
    phone: '+84 (024) 7300-8899',
    balance: '$0.00 USD',
    totalSpent: '$4,900.00 USD',
    paymentsCount: 1,
    created: 'Jul 22, 2026',
    status: 'Active',
    address: 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội',
    defaultPayment: 'MBBank •••• 3004',
    subscriptions: []
  },
  {
    id: 'cus_DEBT_004',
    name: 'Thương Mại & Dịch Vụ Đại Nam',
    email: 'tainv@dainam.com',
    phone: '+84 (0236) 3822-456',
    balance: '$24,500.00 USD',
    totalSpent: '$15,000.00 USD',
    paymentsCount: 1,
    created: 'Jun 15, 2026',
    status: 'Active',
    address: '152 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng',
    defaultPayment: 'BIDV •••• 5511',
    subscriptions: []
  },
  {
    id: 'cus_DEBT_005',
    name: 'Nguyễn Văn Hùng (Cá nhân)',
    email: 'hung.nv@gmail.com',
    phone: '+84 912 345 678',
    balance: '$0.00 USD',
    totalSpent: '$0.00 USD',
    paymentsCount: 0,
    created: 'May 30, 2026',
    status: 'Active',
    address: 'Số 45 Ngõ 12 Đào Tấn, Ba Đình, Hà Nội',
    defaultPayment: 'VPBank •••• 9812',
    subscriptions: []
  },
  {
    id: 'cus_DEBT_006',
    name: 'Doanh nghiệp Tư nhân Minh Phát',
    email: 'minhphat.contact@gmail.com',
    phone: '+84 (0274) 3811-999',
    balance: '$18,500.00 USD',
    totalSpent: '$0.00 USD',
    paymentsCount: 0,
    created: 'Sep 09, 2026',
    status: 'Delinquent', // NỢ QUÁ HẠN / NỢ XẤU CẦN THU HỒI
    address: 'KCN VSIP 1, Thuận An, Bình Dương',
    defaultPayment: 'ACB •••• 4012',
    subscriptions: []
  }
];

export const initialPayouts = [
  {
    id: 'po_REC_2026_01',
    amount: '$18,250.00 USD',
    status: 'Paid',
    statusType: 'success',
    destination: 'Vietcombank •••• 8841 (Tài khoản thu hồi nợ)',
    initiated: 'Sep 12, 2026',
    arrival: 'Sep 14, 2026',
    type: 'Đối soát thu nợ tự động'
  },
  {
    id: 'po_REC_2026_02',
    amount: '$14,500.00 USD',
    status: 'Paid',
    statusType: 'success',
    destination: 'Vietcombank •••• 8841 (Tài khoản thu hồi nợ)',
    initiated: 'Sep 05, 2026',
    arrival: 'Sep 07, 2026',
    type: 'Đối soát nợ định kỳ tuần'
  },
  {
    id: 'po_REC_2026_03',
    amount: '$9,800.00 USD',
    status: 'Paid',
    statusType: 'success',
    destination: 'Vietcombank •••• 8841 (Tài khoản thu hồi nợ)',
    initiated: 'Aug 29, 2026',
    arrival: 'Aug 31, 2026',
    type: 'Quyết toán công nợ tháng 8'
  },
  {
    id: 'po_REC_2026_04',
    amount: '$12,400.00 USD',
    status: 'In Transit',
    statusType: 'pending',
    destination: 'Vietcombank •••• 8841 (Tài khoản thu hồi nợ)',
    initiated: 'Sep 14, 2026',
    arrival: 'Expected Sep 16, 2026',
    type: 'Đang chuyển khoản thu nợ'
  }
];

export const initialConnectedAccounts = [
  {
    id: 'acct_CN_HN',
    name: 'Chi nhánh Thu nợ Hà Nội & Miền Bắc',
    type: 'Văn phòng thu hồi',
    email: 'thuno.hn@debtmaster.vn',
    debtFiles: 248,
    grossVolume: '$134,920.00 USD',
    status: 'Enabled',
    statusType: 'success',
    location: 'Hà Nội, Việt Nam',
    payoutBank: 'Vietcombank •••• 3120'
  },
  {
    id: 'acct_CN_HCM',
    name: 'Chi nhánh Quản lý Công nợ TP.HCM & Miền Nam',
    type: 'Văn phòng thu hồi',
    email: 'thuno.hcm@debtmaster.vn',
    debtFiles: 412,
    grossVolume: '$252,180.00 USD',
    status: 'Enabled',
    statusType: 'success',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    payoutBank: 'Techcombank •••• 7714'
  },
  {
    id: 'acct_CN_DN',
    name: 'Đại diện Thu nợ Khu vực Miền Trung',
    type: 'Đại lý thu hộ',
    email: 'thuno.mientrung@debtmaster.vn',
    debtFiles: 98,
    grossVolume: '$41,200.00 USD',
    status: 'Needs Info',
    statusType: 'pending',
    location: 'Đà Nẵng, Việt Nam',
    payoutBank: 'BIDV •••• 9940'
  },
  {
    id: 'acct_PARTNER_LAW',
    name: 'Văn phòng Luật sư & Xử lý Nợ Pháp lý An Phát',
    type: 'Đối tác pháp lý',
    email: 'phaply@anphatlaw.vn',
    debtFiles: 310,
    grossVolume: '$184,800.00 USD',
    status: 'Enabled',
    statusType: 'success',
    location: 'Toàn quốc',
    payoutBank: 'MBBank •••• 1152'
  }
];

export const initialProducts = [
  {
    id: 'prod_DEBT_01',
    name: 'Hợp đồng Nợ trả góp Thiết bị máy móc (12 tháng)',
    description: 'Khoản nợ mua sắm trang thiết bị thanh toán định kỳ hàng tháng, lãi suất cam kết theo hợp đồng.',
    price: '$990.00 USD / mo',
    billing: 'Recurring (Monthly)',
    activeSubscribers: 142,
    status: 'Active',
    created: 'Jan 10, 2026'
  },
  {
    id: 'prod_DEBT_02',
    name: 'Gói Nợ gối đầu Vật tư xây dựng & Công trình',
    description: 'Hạn mức công nợ xoay vòng 30 - 60 ngày cho các nhà thầu thi công xây dựng.',
    price: '$2,500.00 USD / mo',
    billing: 'Recurring (Monthly)',
    activeSubscribers: 68,
    status: 'Active',
    created: 'Feb 15, 2026'
  },
  {
    id: 'prod_DEBT_03',
    name: 'Hợp đồng Nợ tín dụng Thương mại thường niên',
    description: 'Bảo lãnh và tài trợ thanh toán công nợ nhà cung cấp với thời hạn 1 năm.',
    price: '$12,000.00 USD / yr',
    billing: 'Recurring (Yearly)',
    activeSubscribers: 25,
    status: 'Active',
    created: 'Mar 01, 2026'
  },
  {
    id: 'prod_DEBT_04',
    name: 'Gói Dịch vụ Tư vấn & Thu hồi Nợ Doanh nghiệp',
    description: 'Thu phí dịch vụ xử lý hồ sơ công nợ quá hạn và đàm phán tất toán nợ xấu trọn gói.',
    price: '$1,500.00 USD',
    billing: 'One-time',
    activeSubscribers: 0,
    status: 'Active',
    created: 'May 12, 2026'
  },
  {
    id: 'prod_DEBT_05',
    name: 'Thẩm định Hồ sơ Tín dụng & Xếp hạng Nợ',
    description: 'Báo cáo điều tra năng lực tài chính, rà soát lịch sử tín dụng trước khi cấp công nợ.',
    price: '$500.00 USD',
    billing: 'One-time',
    activeSubscribers: 0,
    status: 'Active',
    created: 'Jun 20, 2026'
  }
];
