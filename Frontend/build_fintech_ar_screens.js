import {
  callTool,
  createFrame,
  createRect,
  createText,
  createFinDebtLogo,
  createVietQRComponent,
  createStatusBadge
} from './fintech_ar_helpers.js';

// Helper to create the FinTech Sidebar
async function createFinTechSidebar(parentFrameId, activeMenuName) {
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', '#E2E8F0FF', 0, parentFrameId);
  await createRect('SBBorder', 239, 0, 1, 920, '#F1F5F9FF', null, 0, sb.id);

  // Logo & System Name
  await createFinDebtLogo(20, 20, sb.id);
  await createText('SysName', 52, 18, 'SMART O2C & AR', 13, 700, '#0F172AFF', sb.id);
  await createText('SysSub', 52, 34, 'FinTech Debt Engine', 10, 600, '#6366F1FF', sb.id);

  const menu = [
    { name: 'Dashboard Tổng quan', icon: '📊' },
    { name: 'Đơn hàng & Tín dụng', icon: '📝' },
    { name: 'Hóa đơn & VietQR', icon: '📄' },
    { name: 'Bàn thu nợ Đa tầng', icon: '⚡' },
    { name: 'PTP & Tranh chấp', icon: '⚖️' },
    { name: 'Đối soát Ngân hàng', icon: '🏦' },
    { name: 'Cổng Khách hàng (Portal)', icon: '🌐' },
    { name: 'Báo cáo Tuổi nợ (Aging)', icon: '📈' },
    { name: 'Phân quyền RBAC & Luật', icon: '🛡️' }
  ];

  let nY = 72;
  for (const item of menu) {
    const isActive = item.name.toLowerCase().includes(activeMenuName.toLowerCase());
    const color = isActive ? '#4F46E5FF' : '#64748BFF';
    const weight = isActive ? 600 : 400;

    if (isActive) {
      await createRect(`ActiveBg_${item.name}`, 12, nY - 2, 216, 32, '#EEF2FFFF', null, 6, sb.id);
    }
    await createText(`Icon_${item.name}`, 22, nY + 4, item.icon, 12, 400, color, sb.id);
    await createText(`Nav_${item.name}`, 48, nY + 4, item.name, 12, weight, color, sb.id);
    nY += 38;
  }

  // Footer: Maker-Checker Role Badge
  await createFrame('RoleBadge', 16, 830, 208, 64, '#F8FAFCFF', '#E2E8F0FF', 8, sb.id);
  await createText('RoleTitle', 28, 840, 'ĐANG ĐĂNG NHẬP:', 10, 700, '#64748BFF', sb.id);
  await createText('RoleVal', 28, 856, 'ADMIN / CHIEF FINANCIAL OFFICER', 10, 700, '#4F46E5FF', sb.id);
  await createText('RoleMode', 28, 872, 'Quyền: Toàn quyền Maker-Checker', 9, 500, '#059669FF', sb.id);

  return sb;
}

// Helper to create Topbar
async function createFinTechTopbar(parentFrameId, title, subTitle) {
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', '#E2E8F0FF', 0, parentFrameId);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);

  await createText('PageTitle', 28, 12, title, 15, 700, '#0F172AFF', tb.id);
  await createText('PageSub', 28, 32, subTitle, 10, 500, '#64748BFF', tb.id);

  // Search box
  await createFrame('SearchBox', 620, 12, 280, 32, '#F8FAFCFF', '#E2E8F0FF', 6, tb.id);
  await createText('SearchPlaceholder', 636, 20, '🔍 Tìm mã HĐ, mã SO, tên khách...', 11, 400, '#94A3B8FF', tb.id);

  // Live Bank Webhook Status
  const wb = await createFrame('WebhookStatus', 920, 14, 150, 28, '#ECFDF5FF', '#A7F3D0FF', 14, tb.id);
  await createText('WbText', 932, 21, '● Webhook Ngân hàng: LIVE', 10, 600, '#047857FF', tb.id);

  // Admin Avatar
  await createFrame('Avatar', 1090, 12, 32, 32, '#4F46E5FF', null, 16, tb.id);
  await createText('AvText', 1098, 20, 'AD', 11, 700, '#FFFFFFFF', tb.id);
  return tb;
}

// -------------------------------------------------------------
// 1. SCREEN 1: EXECUTIVE AR & CREDIT RISK DASHBOARD
// -------------------------------------------------------------
async function buildExecutiveDashboard() {
  console.log('Building Screen 1: Executive AR Dashboard...');
  const main = await createFrame('O2C_01_Executive_AR_Dashboard', 0, 0, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Dashboard');
  await createFinTechTopbar(main.id, 'TỔNG QUAN QUẢN TRỊ CÔNG NỢ & RỦI RO TÍN DỤNG', 'Hệ thống Quản lý Đơn hàng, Công nợ và Thu hồi nợ tự động (O2C & AR Engine)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Row 1: KPI Cards
  const kpis = [
    { title: 'TỔNG PHƠI NHIỄM TÍN DỤNG', val: '2.450.000.000 đ', sub: 'Bao gồm HĐ nợ + Đơn đã duyệt chờ giao', color: '#4F46E5FF', alert: 'Exposure: 81.6% Hạn mức cấp' },
    { title: 'KỲ THU TIỀN BÌNH QUÂN (DSO)', val: '34.2 Ngày', sub: 'Mục tiêu: < 40 ngày (Giảm 8.4 ngày)', color: '#059669FF', alert: 'Tốc độ quay vòng vốn: TỐT' },
    { title: 'TỶ LỆ ĐỐI SOÁT TỰ ĐỘNG (STP)', val: '94.8%', sub: 'Nhận diện qua Virtual Account + VietQR', color: '#0284C7FF', alert: 'Mục tiêu đề ra: > 90%' },
    { title: 'NỢ XẤU CẦN PHÁP LÝ CAN THIỆP', val: '42.000.000 đ', sub: '2 Hóa đơn quá hạn > 30 ngày (T+30)', color: '#DC2626FF', alert: 'Chờ Admin duyệt hồ sơ' }
  ];

  let kX = 28;
  for (const k of kpis) {
    const card = await createFrame(`KPI_${k.title}`, kX, 20, 266, 110, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
    await createText('KTitle', 16, 14, k.title, 10, 700, '#64748BFF', card.id);
    await createText('KVal', 16, 32, k.val, 17, 700, k.color, card.id);
    await createText('KSub', 16, 62, k.sub, 10, 400, '#475569FF', card.id);
    await createRect('KDiv', 16, 80, 234, 1, '#F1F5F9FF', null, 0, card.id);
    await createText('KAlert', 16, 88, k.alert, 10, 600, k.color, card.id);
    kX += 284;
  }

  // Row 2: Aging Buckets Card (Phân loại tuổi nợ đa tầng)
  const agingCard = await createFrame('AgingCard', 28, 146, 1108, 160, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('AgingTitle', 20, 16, 'PHÂN BỔ TUỔI NỢ ĐA TẦNG (AGING BUCKETS CADENCE)', 12, 700, '#0F172AFF', agingCard.id);
  await createText('AgingSub', 20, 34, 'Quy chuẩn phân kỳ nhắc nợ từ T-3 đến T+30 theo khuyến nghị tối ưu', 10, 400, '#64748BFF', agingCard.id);

  const buckets = [
    { stage: 'T - 3 Ngày', label: 'Sắp đến hạn', amount: '680.000.000 đ', count: '14 HĐ', action: 'Zalo / Email tự động', color: '#6366F1FF', bg: '#EEF2FFFF' },
    { stage: 'T + 0 Ngày', label: 'Đến hạn hôm nay', amount: '340.000.000 đ', count: '8 HĐ', action: 'Zalo ZNS / SMS', color: '#0EA5E9FF', bg: '#F0F9FFFF' },
    { stage: 'Tầng 1 (1-6d)', label: 'Quá hạn nhẹ', amount: '195.000.000 đ', count: '5 HĐ', action: 'Nhắc nhẹ + Báo Sales', color: '#EAB308FF', bg: '#FEFCE8FF' },
    { stage: 'Tầng 2 (7-14d)', label: 'Quá hạn vừa', amount: '110.000.000 đ', count: '3 HĐ', action: 'AI Voice Agent gọi PTP', color: '#F97316FF', bg: '#FFF7EDFF' },
    { stage: 'Tầng 3 (15-29d)', label: 'Khóa tín dụng', amount: '75.000.000 đ', count: '2 HĐ', action: 'Khóa đơn + AR gọi', color: '#EF4444FF', bg: '#FEF2F2FF' },
    { stage: 'Nợ xấu (>=30d)', label: 'Chuyển Pháp chế', amount: '42.000.000 đ', count: '2 HĐ', action: 'Đóng gói hồ sơ kiện', color: '#881337FF', bg: '#FFE4E6FF' }
  ];

  let bX = 20;
  for (const b of buckets) {
    const bFrame = await createFrame(`Bucket_${b.stage}`, bX, 58, 170, 86, b.bg, '#E2E8F0FF', 6, agingCard.id);
    await createText('BStage', 10, 8, b.stage, 10, 700, b.color, bFrame.id);
    await createText('BLabel', 10, 24, b.label, 9, 600, '#475569FF', bFrame.id);
    await createText('BAmt', 10, 42, b.amount, 12, 700, '#0F172AFF', bFrame.id);
    await createText('BAction', 10, 64, b.action, 9, 500, b.color, bFrame.id);
    bX += 178;
  }

  // Row 3: Hàng đợi phê duyệt Maker-Checker (Pending Overrides & Escalations)
  const approvalCard = await createFrame('ApprovalCard', 28, 322, 1108, 480, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('AppTitle', 20, 16, 'HÀNG ĐỢI DUYỆT NGOẠI LỆ CẤP CAO (MAKER - CHECKER QUEUE FOR ADMIN / CFO)', 12, 700, '#0F172AFF', approvalCard.id);
  await createText('AppSub', 20, 34, 'Cơ chế 4 mắt: Nhân viên đề xuất (Maker) -> Admin/CFO phê duyệt (Checker) tránh gian lận nội bộ', 10, 400, '#64748BFF', approvalCard.id);

  // Table header
  await createRect('ThBg', 20, 58, 1068, 32, '#F1F5F9FF', null, 4, approvalCard.id);
  await createText('Th1', 32, 68, 'MÃ ĐỀ XUẤT', 10, 700, '#475569FF', approvalCard.id);
  await createText('Th2', 150, 68, 'KHÁCH HÀNG B2B', 10, 700, '#475569FF', approvalCard.id);
  await createText('Th3', 350, 68, 'LOẠI NGOẠI LỆ NGHIỆP VỤ', 10, 700, '#475569FF', approvalCard.id);
  await createText('Th4', 580, 68, 'GIÁ TRỊ ẢNH HƯỞNG', 10, 700, '#475569FF', approvalCard.id);
  await createText('Th5', 730, 68, 'NHÂN VIÊN ĐỀ XUẤT (MAKER)', 10, 700, '#475569FF', approvalCard.id);
  await createText('Th6', 950, 68, 'THAO TÁC ADMIN', 10, 700, '#475569FF', approvalCard.id);

  const pendingRequests = [
    { id: 'OVR-2026-001', cust: 'Công ty CP Dược Phẩm An Khang', type: 'Xin mở khóa Hạn mức (Credit Override)', amt: 'Đơn hàng 240.000.000 đ', maker: 'Trần Văn Nam (Sales)', status: 'Pending' },
    { id: 'PTP-2026-004', cust: 'Bệnh Viện Đa Khoa Sài Gòn', type: 'Gia hạn Cam kết trả nợ Lần 3 (> 7 ngày)', amt: 'Hóa đơn 180.000.000 đ', maker: 'Lê Thu Hà (Kế toán AR)', status: 'Pending' },
    { id: 'DIS-2026-012', cust: 'Tập Đoàn Y Tế Hoàn Mỹ', type: 'Duyệt Giảm trừ nợ Tranh chấp (Credit Memo)', amt: 'Giảm trừ 15.000.000 đ', maker: 'Nguyễn Minh (CSKH Kho)', status: 'Pending' },
    { id: 'DEF-2026-002', cust: 'Phòng Khám Y Khoa Phước Long', type: 'Ký duyệt Hồ sơ Pháp lý Nợ xấu (T+30)', amt: 'Tổng nợ 42.000.000 đ', maker: 'Lê Thu Hà (Kế toán AR)', status: 'Pending' }
  ];

  let rY = 98;
  for (const r of pendingRequests) {
    await createRect(`Row_${r.id}`, 20, rY, 1068, 56, null, '#F1F5F9FF', 4, approvalCard.id);
    await createText(`R_Id_${r.id}`, 32, rY + 18, r.id, 11, 700, '#4F46E5FF', approvalCard.id);
    await createText(`R_Cust_${r.id}`, 150, rY + 12, r.cust, 11, 600, '#0F172AFF', approvalCard.id);
    await createText(`R_Sub_${r.id}`, 150, rY + 30, 'Mã số thuế: 0314892109 • Hạng A', 9, 400, '#64748BFF', approvalCard.id);
    await createText(`R_Type_${r.id}`, 350, rY + 18, r.type, 11, 600, '#D97706FF', approvalCard.id);
    await createText(`R_Amt_${r.id}`, 580, rY + 18, r.amt, 11, 700, '#0F172AFF', approvalCard.id);
    await createText(`R_Maker_${r.id}`, 730, rY + 18, r.maker, 11, 500, '#334155FF', approvalCard.id);

    // Admin Action Buttons: Duyệt & Từ chối
    const btnApprove = await createFrame(`BtnApp_${r.id}`, 940, rY + 14, 64, 28, '#059669FF', null, 4, approvalCard.id);
    await createText('BtnAppT', 12, 7, 'Duyệt', 11, 700, '#FFFFFFFF', btnApprove.id);

    const btnReject = await createFrame(`BtnRej_${r.id}`, 1012, rY + 14, 64, 28, '#FFFFFFFF', '#CBD5E1FF', 4, approvalCard.id);
    await createText('BtnRejT', 10, 7, 'Từ chối', 11, 600, '#64748BFF', btnReject.id);

    rY += 62;
  }
}

// -------------------------------------------------------------
// 2. SCREEN 2: SALES ORDERS & CREDIT CONTROL (THẨM ĐỊNH TÍN DỤNG)
// -------------------------------------------------------------
async function buildCreditControlScreen() {
  console.log('Building Screen 2: Sales Orders & Credit Control...');
  const main = await createFrame('O2C_02_Sales_Orders_Credit_Control', 1520, 0, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Đơn hàng');
  await createFinTechTopbar(main.id, 'QUẢN LÝ ĐƠN HÀNG (SO) & THẨM ĐỊNH HẠN MỨC TÍN DỤNG', 'Kiểm tra kép rủi ro nợ: Hạn mức khả dụng & Khóa quá hạn > 15 ngày (BR-1.1 & BR-1.2)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Top Formula Banner
  const formulaBox = await createFrame('FormulaBox', 28, 20, 1108, 64, '#EEF2FFFF', '#C7D2FEFF', 8, content.id);
  await createText('FTitle', 20, 12, '💡 CÔNG THỨC THẨM ĐỊNH HẠN MỨC KHẢ DỤNG CHUẨN (LOẠI BỎ LỖ HỔNG THỦNG TRẦN TÍN DỤNG):', 11, 700, '#312E81FF', formulaBox.id);
  await createText('FBody', 20, 32, 'Available Credit = Credit Limit - [ Unpaid Invoices (HĐ chưa trả) + Approved Unbilled SO (Đơn đã duyệt chờ giao) - Unapplied Cash (Tiền cọc) ]', 12, 600, '#4338CAFF', formulaBox.id);

  // Sales Orders Table
  const tableCard = await createFrame('SO_TableCard', 28, 96, 1108, 720, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('TTitle', 20, 16, 'DANH SÁCH ĐƠN BÁN HÀNG (SALES ORDERS) & KẾT QUẢ THẨM ĐỊNH TÍN DỤNG', 12, 700, '#0F172AFF', tableCard.id);

  // Table header
  await createRect('ThBg', 20, 50, 1068, 32, '#F1F5F9FF', null, 4, tableCard.id);
  await createText('Th1', 32, 60, 'MÃ ĐƠN SO', 10, 700, '#475569FF', tableCard.id);
  await createText('Th2', 140, 60, 'KHÁCH HÀNG B2B', 10, 700, '#475569FF', tableCard.id);
  await createText('Th3', 350, 60, 'GIÁ TRỊ ĐƠN HÀNG', 10, 700, '#475569FF', tableCard.id);
  await createText('Th4', 500, 60, 'HẠN MỨC CÒN LẠI (TRƯỚC DUYỆT)', 10, 700, '#475569FF', tableCard.id);
  await createText('Th5', 720, 60, 'TRẠNG THÁI KIỂM DUYỆT TÍN DỤNG', 10, 700, '#475569FF', tableCard.id);
  await createText('Th6', 940, 60, 'HÀNH ĐỘNG HỆ THỐNG', 10, 700, '#475569FF', tableCard.id);

  const orders = [
    { id: 'SO-2026-108', cust: 'Bệnh Viện Phụ Sản Quốc Tế', val: '85.000.000 đ', avail: '240.000.000 đ', status: 'APPROVED_RESERVED', statusType: 'paid', note: 'Đạt chuẩn -> Đã giữ chỗ tín dụng' },
    { id: 'SO-2026-109', cust: 'Công ty Dược Phẩm An Khang', val: '240.000.000 đ', avail: '60.000.000 đ', status: 'ON_HOLD_EXPOSURE', statusType: 'overdue_t3', note: 'Chặn: Vượt hạn mức 180 triệu đ' },
    { id: 'SO-2026-110', cust: 'Tập Đoàn Y Tế Hoàn Mỹ', val: '120.000.000 đ', avail: '500.000.000 đ', status: 'ON_HOLD_AGING_LOCK', statusType: 'overdue_t2', note: 'Chặn: Có HĐ quá hạn >15d (chờ override)' },
    { id: 'SO-2026-111', cust: 'Trung Tâm Y Tế Quận 1', val: '45.000.000 đ', avail: 'Không dùng hạn mức', status: 'PREPAID_DEPOSIT', statusType: 'partially_paid', note: 'Khách chọn thanh toán cọc 100%' }
  ];

  let soY = 90;
  for (const o of orders) {
    await createRect(`Row_${o.id}`, 20, soY, 1068, 64, null, '#F1F5F9FF', 4, tableCard.id);
    await createText(`Id_${o.id}`, 32, soY + 16, o.id, 11, 700, '#4F46E5FF', tableCard.id);
    await createText(`Cust_${o.id}`, 140, soY + 14, o.cust, 11, 600, '#0F172AFF', tableCard.id);
    await createText(`Note_${o.id}`, 140, soY + 34, o.note, 10, 400, '#64748BFF', tableCard.id);
    await createText(`Val_${o.id}`, 350, soY + 22, o.val, 12, 700, '#0F172AFF', tableCard.id);
    await createText(`Avail_${o.id}`, 500, soY + 22, o.avail, 11, 600, '#334155FF', tableCard.id);

    await createStatusBadge(720, soY + 20, o.status, o.statusType, tableCard.id);

    if (o.status.includes('ON_HOLD')) {
      const btnOvr = await createFrame(`BtnOvr_${o.id}`, 930, soY + 18, 140, 28, '#EEF2FFFF', '#C7D2FEFF', 4, tableCard.id);
      await createText('BtnOvrT', 10, 7, '⚡ Gửi xin Override', 10, 700, '#4338CAFF', btnOvr.id);
    } else {
      const btnView = await createFrame(`BtnView_${o.id}`, 930, soY + 18, 140, 28, '#FFFFFFFF', '#E2E8F0FF', 4, tableCard.id);
      await createText('BtnViewT', 18, 7, 'Xuất kho giao hàng', 10, 600, '#059669FF', btnView.id);
    }
    soY += 72;
  }
}

// -------------------------------------------------------------
// 3. SCREEN 3: E-INVOICES WITH DYNAMIC VIETQR & VIRTUAL ACCOUNT
// -------------------------------------------------------------
async function buildSmartInvoicingScreen() {
  console.log('Building Screen 3: E-Invoices & Smart Invoicing...');
  const main = await createFrame('O2C_03_Invoices_VietQR_VirtualAccount', 3040, 0, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Hóa đơn');
  await createFinTechTopbar(main.id, 'HÓA ĐƠN ĐIỆN TỬ, ĐỊNH DANH VIRTUAL ACCOUNT & VIETQR ĐỘNG', 'Quản lý 4 trục trạng thái độc lập và gạch nợ tự động theo thứ tự ưu tiên (BR-2.1, 2.2 & BR-3)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Left: Table of Invoices (with 4-axis status)
  const leftTable = await createFrame('InvTableFrame', 28, 20, 840, 800, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('ITitle', 20, 16, 'DANH SÁCH HÓA ĐƠN PHẢI THU (4 TRỤC TRẠNG THÁI ĐỘC LẬP)', 12, 700, '#0F172AFF', leftTable.id);
  await createText('ISub', 20, 34, 'Trục: 1.Văn bản | 2.Thanh toán | 3.Tuổi nợ | 4.Cờ ngoại lệ (Dispute/PTP/Hold)', 10, 400, '#64748BFF', leftTable.id);

  await createRect('ThBg', 20, 58, 800, 32, '#F1F5F9FF', null, 4, leftTable.id);
  await createText('Th1', 32, 68, 'MÃ HÓA ĐƠN', 10, 700, '#475569FF', leftTable.id);
  await createText('Th2', 150, 68, 'KHÁCH HÀNG & TK ẢO (VA)', 10, 700, '#475569FF', leftTable.id);
  await createText('Th3', 370, 68, 'SỐ TIỀN / CÒN NỢ', 10, 700, '#475569FF', leftTable.id);
  await createText('Th4', 530, 68, 'HẠN NỢ (DUE DATE)', 10, 700, '#475569FF', leftTable.id);
  await createText('Th5', 680, 68, 'CỜ NGOẠI LỆ / TRẠNG THÁI', 10, 700, '#475569FF', leftTable.id);

  const invList = [
    { id: 'INV-2026-0891', cust: 'BV Phụ Sản Quốc Tế', va: 'VA: 9688600129', total: '85.000.000 đ', due: '15/11/2026 (T-3)', st: 'PTP_ACTIVE', stType: 'ptp_active', tag: 'Hẹn trả 14/11' },
    { id: 'INV-2026-0892', cust: 'Dược Phẩm An Khang', va: 'VA: 9688600130', total: '240.000.000 đ', due: '10/11/2026 (T+0)', st: 'NORMAL', stType: 'paid', tag: 'Đến hạn hôm nay' },
    { id: 'INV-2026-0885', cust: 'Tập Đoàn Hoàn Mỹ', va: 'VA: 9688600131', total: '120.000.000 đ', due: '03/11/2026 (T+7)', st: 'DISPUTE_PARTIAL', stType: 'disputed', tag: 'Lỗi hàng 15tr (SLA 72h)' },
    { id: 'INV-2026-0870', cust: 'PK Y Khoa Phước Long', va: 'VA: 9688600132', total: '42.000.000 đ', due: '05/10/2026 (T+35)', st: 'DEFAULT', stType: 'default_debt', tag: 'Nợ xấu -> Chờ duyệt kiện' }
  ];

  let iY = 98;
  for (const inv of invList) {
    await createRect(`Row_${inv.id}`, 20, iY, 800, 68, null, '#F1F5F9FF', 4, leftTable.id);
    await createText(`Id_${inv.id}`, 32, iY + 16, inv.id, 11, 700, '#4F46E5FF', leftTable.id);
    await createText(`Cust_${inv.id}`, 150, iY + 14, inv.cust, 11, 600, '#0F172AFF', leftTable.id);
    await createText(`VA_${inv.id}`, 150, iY + 34, inv.va, 10, 500, '#0284C7FF', leftTable.id);
    await createText(`Amt_${inv.id}`, 370, iY + 22, inv.total, 12, 700, '#0F172AFF', leftTable.id);
    await createText(`Due_${inv.id}`, 530, iY + 22, inv.due, 11, 500, '#475569FF', leftTable.id);

    await createStatusBadge(670, iY + 16, inv.st, inv.stType, leftTable.id);
    await createText(`Tag_${inv.id}`, 670, iY + 40, inv.tag, 9, 600, '#D97706FF', leftTable.id);

    iY += 76;
  }

  // Right: Live VietQR Component Preview for Selected Invoice
  const rightPreview = await createFrame('RightQRCard', 884, 20, 252, 420, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('QRCardTitle', 16, 16, 'MÃ VIETQR ĐỘNG THEO HÓA ĐƠN', 11, 700, '#0F172AFF', rightPreview.id);
  await createText('QRCardSub', 16, 32, 'Nhúng sẵn STK Virtual Account & Mã INV', 10, 400, '#64748BFF', rightPreview.id);

  await createVietQRComponent(16, 60, 'INV-2026-0891', 'BV Phụ Sản Quốc Tế', '85.000.000 đ', '9688600129', rightPreview.id);

  await createText('QRTip', 16, 340, '⚡ Quét mã thanh toán tự động gạch nợ trong 3 giây qua Bank Webhook.', 10, 500, '#059669FF', rightPreview.id);
}

// -------------------------------------------------------------
// 4. SCREEN 4: DAILY COLLECTION WORKLIST & SMART DUNNING
// -------------------------------------------------------------
async function buildCollectionWorklistScreen() {
  console.log('Building Screen 4: Collection Worklist...');
  const main = await createFrame('O2C_04_Collection_Worklist_Dunning', 4560, 0, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Bàn thu nợ');
  await createFinTechTopbar(main.id, 'BÀN LÀM VIỆC THU HỒI NỢ HÀNG NGÀY & CHIẾN DỊCH ĐA TẦNG (DUNNING)', 'Phân luồng công việc theo ưu tiên cho Kế toán AR & AI Voice Agent (BR-4 & BR-5.1)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Daily Stats for AR Staff
  const stats = [
    { title: 'TỔNG ĐẦU VIỆC HÔM NAY', val: '24 Cuộc gọi / Nhắc', color: '#4F46E5FF' },
    { title: 'ĐÃ CAM KẾT TRẢ (PTP)', val: '12 Khách hàng', color: '#059669FF' },
    { title: 'ĐANG TRANH CHẤP (DISPUTE)', val: '3 Trường hợp (Kho xử lý)', color: '#D97706FF' },
    { title: 'THẤT HỨA (PTP BROKEN)', val: '1 Khách hàng -> Đẩy Tầng 3', color: '#DC2626FF' }
  ];

  let sX = 28;
  for (const s of stats) {
    const sc = await createFrame(`Stat_${s.title}`, sX, 20, 266, 80, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
    await createText('STitle', 16, 14, s.title, 10, 700, '#64748BFF', sc.id);
    await createText('SVal', 16, 34, s.val, 15, 700, s.color, sc.id);
    sX += 284;
  }

  // Worklist Table
  const wlCard = await createFrame('WorklistCard', 28, 120, 1108, 680, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('WlTitle', 20, 16, 'DANH SÁCH THU NỢ ƯU TIÊN THEO PHÂN KỲ TẦNG DUNNING (DAILY PRIORITY WORKLIST)', 12, 700, '#0F172AFF', wlCard.id);

  await createRect('ThBg', 20, 50, 1068, 32, '#F1F5F9FF', null, 4, wlCard.id);
  await createText('Th1', 32, 60, 'MỨC ĐỘ ƯU TIÊN', 10, 700, '#475569FF', wlCard.id);
  await createText('Th2', 150, 60, 'KHÁCH HÀNG B2B', 10, 700, '#475569FF', wlCard.id);
  await createText('Th3', 380, 60, 'SỐ TIỀN QUÁ HẠN', 10, 700, '#475569FF', wlCard.id);
  await createText('Th4', 530, 60, 'TẦNG NHẮC NỢ HIỆN TẠI', 10, 700, '#475569FF', wlCard.id);
  await createText('Th5', 730, 60, 'LỊCH SỬ TƯƠNG TÁC GẦN NHẤT', 10, 700, '#475569FF', wlCard.id);
  await createText('Th6', 950, 60, 'HÀNH ĐỘNG THU NỢ', 10, 700, '#475569FF', wlCard.id);

  const workItems = [
    { p: '🔴 CAO NHẤT', cust: 'PK Y Khoa Phước Long', amt: '42.000.000 đ', tier: 'Tầng 3 (Quá hạn 35d)', hist: 'AI Voice gọi không nghe -> Hồ sơ pháp lý', act: 'Trình Admin ký kiện' },
    { p: '🟠 CAO', cust: 'Dược Phẩm An Khang', amt: '180.000.000 đ', tier: 'Tầng 2 (Quá hạn 9d)', hist: 'Khách hứa trả 08/11 nhưng trễ -> PTP Broken', act: 'AR Staff gọi trực tiếp' },
    { p: '🟡 TRUNG BÌNH', cust: 'Bệnh Viện Sài Gòn', amt: '95.000.000 đ', tier: 'Tầng 2 (Quá hạn 7d)', hist: 'AI Voice đã gọi -> Khách hẹn trả 15/11', act: 'Ghi nhận PTP Lần 1' },
    { p: '🟢 BÌNH THƯỜNG', cust: 'Nha Khoa Minh Tâm', amt: '32.000.000 đ', tier: 'Tầng 1 (Quá hạn 3d)', hist: 'Đã gửi Zalo ZNS nhắc nhở nhẹ nhàng', act: 'Theo dõi tự động' }
  ];

  let wY = 92;
  for (const w of workItems) {
    await createRect(`WRow_${w.cust}`, 20, wY, 1068, 64, null, '#F1F5F9FF', 4, wlCard.id);
    await createText(`P_${w.cust}`, 32, wY + 22, w.p, 11, 700, '#0F172AFF', wlCard.id);
    await createText(`Cust_${w.cust}`, 150, wY + 14, w.cust, 11, 600, '#0F172AFF', wlCard.id);
    await createText(`Cont_${w.cust}`, 150, wY + 34, 'Kế toán trưởng: 0903.112.445 (Giờ HC)', 9, 400, '#64748BFF', wlCard.id);
    await createText(`Amt_${w.cust}`, 380, wY + 22, w.amt, 12, 700, '#DC2626FF', wlCard.id);
    await createText(`Tier_${w.cust}`, 530, wY + 22, w.tier, 11, 600, '#D97706FF', wlCard.id);
    await createText(`Hist_${w.cust}`, 730, wY + 22, w.hist, 10, 500, '#475569FF', wlCard.id);

    const btnAct = await createFrame(`BtnAct_${w.cust}`, 940, wY + 16, 130, 30, '#4F46E5FF', null, 4, wlCard.id);
    await createText('BtnActT', 10, 8, w.act, 10, 700, '#FFFFFFFF', btnAct.id);

    wY += 72;
  }
}

// -------------------------------------------------------------
// 5. SCREEN 5: PTP & DISPUTE MANAGEMENT (CAM KẾT TRẢ & TRANH CHẤP)
// -------------------------------------------------------------
async function buildPTPAndDisputeScreen() {
  console.log('Building Screen 5: PTP & Disputes...');
  const main = await createFrame('O2C_05_PTP_Disputes', 6080, 0, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'PTP & Tranh chấp');
  await createFinTechTopbar(main.id, 'CAM KẾT THANH TOÁN (PTP) & XỬ LÝ TRANH CHẤP CÔNG NỢ', 'Kiểm soát chống lạm dụng gia hạn nợ & Cơ chế tách nợ tranh chấp để tiếp tục thu phần hợp lệ (BR-5.2)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Stats Bar
  const stats = [
    { title: 'CAM KẾT TRẢ (PTP) HIỆU LỰC', val: '18 Khách hàng (450M đ)', color: '#059669FF' },
    { title: 'THẤT HỨA (BROKEN PTP)', val: '2 Khách (Kích hoạt Tầng 3)', color: '#DC2626FF' },
    { title: 'TRANH CHẤP MỞ (SLA < 72H)', val: '4 Vụ việc (64M đ)', color: '#D97706FF' },
    { title: 'ĐÃ THU PHẦN HỢP LỆ (PARTIAL)', val: '140M đ (Đang giữ an toàn)', color: '#4F46E5FF' }
  ];

  let sX = 28;
  for (const s of stats) {
    const sc = await createFrame(`PTPStat_${s.title}`, sX, 20, 266, 80, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
    await createText('PTitle', 16, 14, s.title, 10, 700, '#64748BFF', sc.id);
    await createText('PVal', 16, 34, s.val, 14, 700, s.color, sc.id);
    sX += 284;
  }

  // Left Card: PTP Management (Anti-Abuse Engine)
  const ptpCard = await createFrame('PTPCard', 28, 116, 560, 680, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('PTPCardT', 20, 16, 'QUẢN TRỊ CAM KẾT THANH TOÁN & CHỐNG LẠM DỤNG', 11, 700, '#0F172AFF', ptpCard.id);
  
  // Policy Box
  const polBox = await createFrame('PTPRule', 20, 44, 520, 48, '#FEF2F2FF', '#FECACARR', 6, ptpCard.id);
  await createText('RuleT', 12, 10, 'LUẬT CHỐNG LẠM DỤNG (ANTI-ABUSE THRESHOLD):', 9, 700, '#991B1BFF', polBox.id);
  await createText('RuleB', 12, 26, 'User: Tối đa 1 lần ≤ 5d | AR: Tối đa 2 lần ≤ 7d | ≥ 3 lần: Bắt buộc Maker-Checker', 9, 500, '#B91C1CFF', polBox.id);

  const ptpItems = [
    { cust: 'PK Y Khoa Hòa Hảo', inv: 'INV-0890', amt: '45.000.000 đ', count: 'Lần 1 (Portal)', date: '15/11/2026', st: 'HỢP LỆ (ON TRACK)', color: '#059669FF' },
    { cust: 'Bệnh Viện Sài Gòn', inv: 'INV-0888', amt: '95.000.000 đ', count: 'Lần 2 (AR Staff)', date: '18/11/2026', st: 'CẢNH BÁO LẦN CUỐI', color: '#D97706FF' },
    { cust: 'Dược Phẩm An Khang', inv: 'INV-0875', amt: '180.000.000 đ', count: 'Lần 3 (VI PHẠM)', date: '10/11/2026', st: 'BROKEN - CHỜ DUYỆT', color: '#DC2626FF' }
  ];

  let pY = 104;
  for (const it of ptpItems) {
    await createRect(`PRow_${it.cust}`, 20, pY, 520, 78, null, '#F1F5F9FF', 4, ptpCard.id);
    await createText('PCust', 30, pY + 12, it.cust, 11, 600, '#0F172AFF', ptpCard.id);
    await createText('PInv', 30, pY + 30, `Hóa đơn: ${it.inv} • Số tiền: ${it.amt}`, 10, 400, '#64748BFF', ptpCard.id);
    await createText('PDate', 30, pY + 50, `Hẹn ngày: ${it.date} (${it.count})`, 9, 500, '#4338CAFF', ptpCard.id);
    
    await createText('PSt', 360, pY + 14, it.st, 9, 700, it.color, ptpCard.id);
    if (it.count.includes('VI PHẠM')) {
      const btn = await createFrame(`BtnApp_${it.inv}`, 360, pY + 40, 140, 24, '#DC2626FF', null, 4, ptpCard.id);
      await createText('BtnT', 12, 5, 'Trình Admin ký phạt', 9, 700, '#FFFFFFFF', btn.id);
    } else {
      const btn = await createFrame(`BtnFol_${it.inv}`, 360, pY + 40, 140, 24, '#EEF2FFFF', '#C7D2FEFF', 4, ptpCard.id);
      await createText('BtnT', 20, 5, 'Theo dõi tự động', 9, 600, '#4338CAFF', btn.id);
    }
    pY += 88;
  }

  // Right Card: Dispute Resolution (Tách nợ & SLA 72h)
  const dspCard = await createFrame('DSPCard', 608, 116, 560, 680, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('DSPCardT', 20, 16, 'QUẢN LÝ TRANH CHẤP & TÁCH NỢ THU HỒI PHẦN HỢP LỆ', 11, 700, '#0F172AFF', dspCard.id);

  // Dispute Rule Box
  const dspRule = await createFrame('DSPRule', 20, 44, 520, 48, '#FFFBEBFF', '#FDE68AFF', 6, dspCard.id);
  await createText('DSPRuleT', 12, 10, 'QUY TRÌNH TÁCH NỢ TRANH CHẤP (PARTIAL DISPUTE):', 9, 700, '#92400EFF', dspRule.id);
  await createText('DSPRuleB', 12, 26, 'Phần tranh chấp: Tạm dừng dunning, SLA giải quyết 72h | Phần hợp lệ: Tiếp tục thu ngay', 9, 500, '#B45309FF', dspRule.id);

  const dspItems = [
    { id: 'DSP-092', cust: 'Cty TBYT Phương Nam', inv: 'INV-0870 (120M đ)', issue: 'Giao thiếu 5 kiện găng tay (15M đ)', action: 'Đã thu phần hợp lệ 105M đ', sla: 'SLA: Còn 14 giờ (Kho xác minh)' },
    { id: 'DSP-093', cust: 'Nha Khoa Tâm Đức', inv: 'INV-0885 (35M đ)', issue: 'Sai tỷ lệ chiết khấu hợp đồng 5%', action: 'Chờ Sales xác nhận phụ lục', sla: 'SLA: Còn 36 giờ (Sales xử lý)' },
    { id: 'DSP-094', cust: 'Phòng Khám Đa Khoa An Bình', inv: 'INV-0862 (68M đ)', issue: 'Chưa nhận hóa đơn GTGT điện tử gốc', action: 'Hệ thống đã tự gửi lại E-Invoice', sla: 'ĐÃ XỬ LÝ XONG (RESOLVED)' }
  ];

  let dY = 104;
  for (const d of dspItems) {
    await createRect(`DRow_${d.id}`, 20, dY, 520, 84, null, '#F1F5F9FF', 4, dspCard.id);
    await createText('DId', 30, dY + 12, `${d.id} • ${d.cust}`, 11, 700, '#0F172AFF', dspCard.id);
    await createText('DIssue', 30, dY + 30, `Lý do: ${d.issue}`, 10, 500, '#D97706FF', dspCard.id);
    await createText('DAct', 30, dY + 48, `Giải pháp: ${d.action}`, 9, 400, '#475569FF', dspCard.id);
    await createText('DSla', 30, dY + 64, d.sla, 9, 700, d.sla.includes('RESOLVED') ? '#059669FF' : '#DC2626FF', dspCard.id);

    const btnRes = await createFrame(`BtnDsp_${d.id}`, 400, dY + 28, 100, 26, '#0F172AFF', null, 4, dspCard.id);
    await createText('BtnResT', 12, 6, 'Xử lý vụ việc', 9, 600, '#FFFFFFFF', btnRes.id);
    dY += 94;
  }
}

// -------------------------------------------------------------
// 6. SCREEN 6: BANK RECONCILIATION & CASH APPLICATION (GẠCH NỢ 4 CẤP)
// -------------------------------------------------------------
async function buildBankCashApplicationScreen() {
  console.log('Building Screen 6: Bank Cash Application...');
  const main = await createFrame('O2C_06_Bank_Cash_Application', 0, 1000, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Đối soát Ngân hàng');
  await createFinTechTopbar(main.id, 'ĐỐI SOÁT TỰ ĐỘNG (STP) & MA TRẬN GẠCH NỢ 4 CẤP (CASH APPLICATION)', 'Tích hợp Webhook tài khoản ảo (VA) VietinBank & BIDV - Gạch nợ tức thì không phụ thuộc nhân sự (BR-3)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Cash Application Hierarchy Banner
  const ruleCard = await createFrame('RuleCard', 28, 20, 1108, 64, '#ECFDF5FF', '#A7F3D0FF', 8, content.id);
  await createText('RuleTitle', 20, 12, '⚡ MA TRẬN 4 CẤP PHÂN BỔ TIỀN VÀO (CASH ALLOCATION HIERARCHY):', 11, 700, '#065F46FF', ruleCard.id);
  await createText('RuleDesc', 20, 32, '1. Gạch đích danh mã HĐ INV_X -> 2. Khớp đúng tổ hợp số tiền -> 3. Đệm an toàn 24h (UNAPPLIED_CASH_HOLD) -> 4. FIFO theo hạn nợ', 11, 600, '#047857FF', ruleCard.id);

  // Bank Webhook Live Feed Table
  const tableCard = await createFrame('BankTableCard', 28, 96, 1108, 480, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('BTTitle', 20, 16, 'DÒNG TIỀN VÀO TÀI KHOẢN ẢO REAL-TIME & KẾT QUẢ GẠCH NỢ (LIVE BANK WEBHOOK FEED)', 12, 700, '#0F172AFF', tableCard.id);

  await createRect('ThBg', 20, 50, 1068, 32, '#F1F5F9FF', null, 4, tableCard.id);
  await createText('Th1', 32, 60, 'MÃ GIAO DỊCH / GIỜ', 10, 700, '#475569FF', tableCard.id);
  await createText('Th2', 170, 60, 'TÀI KHOẢN ẢO & KHÁCH HÀNG', 10, 700, '#475569FF', tableCard.id);
  await createText('Th3', 380, 60, 'SỐ TIỀN VÀO', 10, 700, '#475569FF', tableCard.id);
  await createText('Th4', 500, 60, 'NỘI DUNG CHUYỂN KHOẢN (MEMO)', 10, 700, '#475569FF', tableCard.id);
  await createText('Th5', 730, 60, 'KẾT QUẢ GẠCH NỢ TỰ ĐỘNG', 10, 700, '#475569FF', tableCard.id);
  await createText('Th6', 950, 60, 'TRẠNG THÁI STP', 10, 700, '#475569FF', tableCard.id);

  const bankTxns = [
    { id: 'TXN-98821', time: '14:28:10 Hôm nay', va: 'VietinBank VA-9688600129', cust: 'BV Phụ Sản Quốc Tế', amt: '+85.000.000 đ', memo: '9688600129 INV-2026-0891 TT TIEN THUOC', res: 'Khớp 100% INV-2026-0891 (Hết nợ)', st: 'TỰ ĐỘNG 100% (STP)', color: '#059669FF' },
    { id: 'TXN-98822', time: '11:15:02 Hôm nay', va: 'BIDV VA-9688600130', cust: 'Dược Phẩm An Khang', amt: '+50.000.000 đ', memo: 'An Khang chuyen khoan', res: 'Thiếu mã HĐ -> Giữ vào Đệm an toàn 24h', st: 'HOLD_BUFFER_24H', color: '#D97706FF' },
    { id: 'TXN-98823', time: '09:04:45 Hôm nay', va: 'VietinBank VA-9688600131', cust: 'Nha Khoa Minh Tâm', amt: '+32.000.000 đ', memo: 'Minh Tam tra tien vat tu', res: 'Khớp chính xác số dư INV-2026-0884', st: 'TỔ HỢP TỰ ĐỘNG', color: '#0284C7FF' },
    { id: 'TXN-98824', time: 'Hôm qua 16:40', va: 'VietinBank VA-9688600132', cust: 'PK Đa Khoa An Bình', amt: '+14.960.000 đ', memo: 'An Binh thanh toan INV-0880', res: 'Lệch thiếu 40.000 đ (< De Minimis 50k đ)', st: 'TỰ ĐỘNG XÓA LỆCH', color: '#6366F1FF' }
  ];

  let bY = 90;
  for (const b of bankTxns) {
    await createRect(`BRow_${b.id}`, 20, bY, 1068, 64, null, '#F1F5F9FF', 4, tableCard.id);
    await createText('BId', 32, bY + 14, b.id, 11, 700, '#0F172AFF', tableCard.id);
    await createText('BTime', 32, bY + 34, b.time, 9, 400, '#64748BFF', tableCard.id);
    await createText('BVa', 170, bY + 14, b.va, 10, 600, '#4338CAFF', tableCard.id);
    await createText('BCust', 170, bY + 34, b.cust, 11, 600, '#0F172AFF', tableCard.id);
    await createText('BAmt', 380, bY + 22, b.amt, 12, 700, '#059669FF', tableCard.id);
    await createText('BMemo', 500, bY + 22, b.memo, 10, 500, '#334155FF', tableCard.id);
    await createText('BRes', 730, bY + 22, b.res, 10, 600, '#0F172AFF', tableCard.id);
    await createText('BSt', 950, bY + 22, b.st, 10, 700, b.color, tableCard.id);
    bY += 72;
  }

  // Bottom Box: De Minimis Threshold Rule (Ngưỡng chênh lệch nhỏ)
  const deMinimisCard = await createFrame('DeMinimisCard', 28, 590, 1108, 190, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('DMTitle', 20, 16, 'QUY TẮC XỬ LÝ LỆCH DƯ/THIẾU NHỎ (DE MINIMIS & WRITE-OFF POLICY)', 11, 700, '#0F172AFF', deMinimisCard.id);
  
  const dm1 = await createFrame('DMBox1', 20, 48, 520, 110, '#F8FAFCFF', '#E2E8F0FF', 6, deMinimisCard.id);
  await createText('DM1T', 16, 14, 'KHÁCH THANH TOÁN THIẾU < 50.000 VNĐ:', 10, 700, '#059669FF', dm1.id);
  await createText('DM1D', 16, 34, 'Hệ thống tự động hạch toán vào Chi phí Tài chính (Finance Expense)', 10, 400, '#64748BFF', dm1.id);
  await createText('DM1S', 16, 54, 'Đánh dấu HĐ là HOÀN TẤT (PAID) - Không làm phiền khách vì số tiền nhỏ', 10, 600, '#0F172AFF', dm1.id);
  await createText('DM1A', 16, 76, 'Tránh tình trạng nợ lắt nhắt vài nghìn đồng làm khóa đơn hàng tiếp theo.', 9, 500, '#059669FF', dm1.id);

  const dm2 = await createFrame('DMBox2', 560, 48, 528, 110, '#F8FAFCFF', '#E2E8F0FF', 6, deMinimisCard.id);
  await createText('DM2T', 16, 14, 'KHÁCH THANH TOÁN DƯ TIỀN:', 10, 700, '#4F46E5FF', dm2.id);
  await createText('DM2D', 16, 34, 'Số tiền dư tự động treo vào Tiền gửi chưa phân bổ (Unapplied Cash)', 10, 400, '#64748BFF', dm2.id);
  await createText('DM2S', 16, 54, 'Cộng ngay vào Hạn mức khả dụng (Available Credit) cho đơn SO kế tiếp', 10, 600, '#0F172AFF', dm2.id);
  await createText('DM2A', 16, 76, 'Ưu tiên cấn trừ tự động vào hóa đơn phát sinh trong tương lai.', 9, 500, '#4338CAFF', dm2.id);
}

// -------------------------------------------------------------
// 7. SCREEN 7: 2-TIER CUSTOMER SELF-SERVICE PORTAL (PORTAL KHÁCH)
// -------------------------------------------------------------
async function buildCustomerPortalScreen() {
  console.log('Building Screen 7: Customer Portal...');
  const main = await createFrame('O2C_07_Customer_Portal', 1520, 1000, 1440, 920, '#F8FAFCFF');
  
  // Custom Customer Portal Topbar
  const ptTop = await createFrame('PortalTopbar', 0, 0, 1440, 64, '#FFFFFFFF', '#E2E8F0FF', 0, main.id);
  await createFinDebtLogo(32, 20, ptTop.id);
  await createText('PLogoT', 64, 18, 'CỔNG QUẢN LÝ CÔNG NỢ B2B (CUSTOMER AR PORTAL)', 13, 700, '#0F172AFF', ptTop.id);
  await createText('PLogoS', 64, 36, 'Khách hàng: Bệnh Viện Phụ Sản Quốc Tế • MST: 0314892109', 10, 500, '#64748BFF', ptTop.id);

  const ptRole = await createFrame('PtRole', 1180, 16, 220, 32, '#ECFDF5FF', '#A7F3D0FF', 16, ptTop.id);
  await createText('PtRT', 16, 8, '👤 Kế toán AP: Nguyễn Thu Trang', 10, 600, '#065F46FF', ptRole.id);

  const content = await createFrame('Content', 0, 64, 1440, 856, '#F8FAFCFF', null, 0, main.id);

  // Overview summary cards for customer
  const custStats = [
    { title: 'HẠN MỨC TÍN DỤNG CẤP', val: '500.000.000 đ', sub: 'Hạn mức khả dụng còn: 240.000.000 đ', color: '#4F46E5FF' },
    { title: 'TỔNG CÔNG NỢ PHẢI TRẢ', val: '85.000.000 đ', sub: '1 Hóa đơn sắp đáo hạn (T-3)', color: '#059669FF' },
    { title: 'NỢ QUÁ HẠN HIỆN TẠI', val: '0 đ (Không có nợ quá hạn)', sub: 'Tài khoản được hưởng chiết khấu 1.5%', color: '#0284C7FF' },
    { title: 'SỐ DƯ TIỀN CỌC / TREO', val: '0 đ', sub: 'Tài khoản ảo: 9688600129 (VietinBank)', color: '#64748BFF' }
  ];

  let csX = 40;
  for (const cs of custStats) {
    const card = await createFrame(`CSCard_${cs.title}`, csX, 24, 320, 90, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
    await createText('CSTitle', 18, 14, cs.title, 10, 700, '#64748BFF', card.id);
    await createText('CSVal', 18, 36, cs.val, 16, 700, cs.color, card.id);
    await createText('CSSub', 18, 62, cs.sub, 10, 500, '#0F172AFF', card.id);
    csX += 344;
  }

  // Left Section: Interactive Invoice & Actions Table
  const leftCard = await createFrame('CustInvCard', 40, 134, 980, 680, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('CICTitle', 24, 20, 'DANH SÁCH HÓA ĐƠN ĐIỆN TỬ CỦA DOANH NGHIỆP', 13, 700, '#0F172AFF', leftCard.id);
  await createText('CICSub', 24, 40, 'Khách hàng có thể Tải hóa đơn gốc, Tạo cam kết thanh toán hoặc Khiếu nại sai lệch số liệu trực tuyến', 10, 400, '#64748BFF', leftCard.id);

  await createRect('ThBg', 24, 70, 932, 32, '#F1F5F9FF', null, 4, leftCard.id);
  await createText('Th1', 36, 80, 'MÃ HÓA ĐƠN', 10, 700, '#475569FF', leftCard.id);
  await createText('Th2', 150, 80, 'NGÀY PHÁT HÀNH', 10, 700, '#475569FF', leftCard.id);
  await createText('Th3', 270, 80, 'HẠN THANH TOÁN', 10, 700, '#475569FF', leftCard.id);
  await createText('Th4', 400, 80, 'SỐ TIỀN THANH TOÁN', 10, 700, '#475569FF', leftCard.id);
  await createText('Th5', 560, 80, 'TRẠNG THÁI', 10, 700, '#475569FF', leftCard.id);
  await createText('Th6', 740, 80, 'HÀNH ĐỘNG TƯƠNG TÁC CỦA KHÁCH', 10, 700, '#475569FF', leftCard.id);

  const invoices = [
    { id: 'INV-2026-0891', date: '10/10/2026', due: '15/11/2026', amt: '85.000.000 đ', st: 'SẮP ĐẾN HẠN (T-3)', stColor: '#D97706FF', isDue: true },
    { id: 'INV-2026-0850', date: '15/09/2026', due: '20/10/2026', amt: '120.000.000 đ', st: 'ĐÃ THANH TOÁN', stColor: '#059669FF', isDue: false },
    { id: 'INV-2026-0812', date: '01/08/2026', due: '05/09/2026', amt: '64.000.000 đ', st: 'ĐÃ THANH TOÁN', stColor: '#059669FF', isDue: false }
  ];

  let iY = 112;
  for (const inv of invoices) {
    await createRect(`IRow_${inv.id}`, 24, iY, 932, 64, null, '#F1F5F9FF', 4, leftCard.id);
    await createText('IId', 36, iY + 22, inv.id, 11, 700, '#4F46E5FF', leftCard.id);
    await createText('IDate', 150, iY + 22, inv.date, 10, 500, '#475569FF', leftCard.id);
    await createText('IDue', 270, iY + 22, inv.due, 10, 600, inv.isDue ? '#DC2626FF' : '#475569FF', leftCard.id);
    await createText('IAmt', 400, iY + 22, inv.amt, 11, 700, '#0F172AFF', leftCard.id);
    await createText('ISt', 560, iY + 22, inv.st, 10, 700, inv.stColor, leftCard.id);

    if (inv.isDue) {
      // 3 interactive buttons for pending invoice: Pay QR | Promise PTP | Dispute
      const btnPay = await createFrame(`BtnPay_${inv.id}`, 700, iY + 16, 75, 28, '#059669FF', null, 4, leftCard.id);
      await createText('BPT', 10, 7, '⚡ Trả QR', 10, 700, '#FFFFFFFF', btnPay.id);

      const btnPtp = await createFrame(`BtnPtp_${inv.id}`, 785, iY + 16, 75, 28, '#EEF2FFFF', '#C7D2FEFF', 4, leftCard.id);
      await createText('BPTPT', 10, 7, '📅 Hẹn trả', 10, 600, '#4338CAFF', btnPtp.id);

      const btnDsp = await createFrame(`BtnDsp_${inv.id}`, 870, iY + 16, 75, 28, '#FFFFFFFF', '#E2E8F0FF', 4, leftCard.id);
      await createText('BDSPT', 10, 7, '❓ Báo sai', 10, 600, '#64748BFF', btnDsp.id);
    } else {
      const btnPdf = await createFrame(`BtnPdf_${inv.id}`, 820, iY + 16, 125, 28, '#F8FAFCFF', '#E2E8F0FF', 4, leftCard.id);
      await createText('BPdfT', 14, 7, '📄 Tải HĐ gốc PDF', 10, 500, '#334155FF', btnPdf.id);
    }

    iY += 74;
  }

  // Right Section: Instant VietQR Paywall for Selected Invoice
  const rightQR = await createFrame('PortalQRCard', 1040, 134, 360, 680, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('PQRT', 20, 18, 'THANH TOÁN TỨC THÌ (VIETQR)', 12, 700, '#0F172AFF', rightQR.id);
  await createText('PQRS', 20, 36, 'Quét bằng mọi ứng dụng Mobile Banking', 10, 400, '#64748BFF', rightQR.id);

  await createVietQRComponent(20, 64, 'INV-2026-0891', 'Bệnh Viện Phụ Sản Quốc Tế', '85.000.000 đ', '9688600129', rightQR.id);

  const tipsBox = await createFrame('QRTips', 20, 340, 320, 140, '#F8FAFCFF', '#E2E8F0FF', 6, rightQR.id);
  await createText('TipsT', 14, 12, 'HƯỚNG DẪN THANH TOÁN B2B:', 10, 700, '#4338CAFF', tipsBox.id);
  await createText('Tips1', 14, 32, '1. Mở App Ngân hàng (VCB, Vietin, BIDV, Tech...)', 9, 400, '#334155FF', tipsBox.id);
  await createText('Tips2', 14, 52, '2. Quét mã QR - Số tiền và STK ảo tự điền 100%', 9, 400, '#334155FF', tipsBox.id);
  await createText('Tips3', 14, 72, '3. Giữ nguyên nội dung chuyển khoản để gạch nợ tức thì', 9, 400, '#334155FF', tipsBox.id);
  await createText('Tips4', 14, 94, '⚡ Hóa đơn sẽ tự động chuyển sang PAID trong 3 giây.', 9, 600, '#059669FF', tipsBox.id);
}

// -------------------------------------------------------------
// 8. SCREEN 8: AGING ANALYTICS & CASHFLOW FORECASTING (TUỔI NỢ)
// -------------------------------------------------------------
async function buildAgingAnalyticsScreen() {
  console.log('Building Screen 8: Aging Analytics & Cashflow...');
  const main = await createFrame('O2C_08_Aging_Analytics', 3040, 1000, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Báo cáo Tuổi nợ');
  await createFinTechTopbar(main.id, 'BÁO CÁO PHÂN TÍCH TUỔI NỢ (AGING REPORT) & DỰ BÁO DÒNG TIỀN THU', 'Phân tích 5 xô tuổi nợ, xu hướng DSO và mô hình dòng tiền dự kiến 30 ngày (BR-4 & BR-6)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // Row 1: 5 Aging Buckets
  const agingBuckets = [
    { title: 'CHƯA ĐẾN HẠN (CURRENT)', amt: '1.680.000.000 đ', pct: '68.5% Tổng nợ', action: 'Gửi sao kê định kỳ', color: '#059669FF' },
    { title: '1 - 6 NGÀY (TẦNG 1)', amt: '420.000.000 đ', pct: '17.1% Tổng nợ', action: 'Zalo ZNS tự động', color: '#0284C7FF' },
    { title: '7 - 14 NGÀY (TẦNG 2)', amt: '210.000.000 đ', pct: '8.6% Tổng nợ', action: 'AI Voice + AR Gọi', color: '#D97706FF' },
    { title: '15 - 29 NGÀY (TẦNG 3)', amt: '98.000.000 đ', pct: '4.0% Tổng nợ', action: 'Khóa tín dụng + Dọa phạt', color: '#EA580CFF' },
    { title: 'TRÊN 30 NGÀY (NỢ XẤU)', amt: '42.000.000 đ', pct: '1.8% Tổng nợ', action: 'Pháp lý / Thu hồi', color: '#DC2626FF' }
  ];

  let aX = 28;
  for (const a of agingBuckets) {
    const card = await createFrame(`AgeCard_${a.title}`, aX, 20, 210, 110, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
    await createText('ATitle', 14, 14, a.title, 9, 700, '#64748BFF', card.id);
    await createText('AAmt', 14, 36, a.amt, 13, 700, a.color, card.id);
    await createText('APct', 14, 60, a.pct, 10, 600, '#0F172AFF', card.id);
    await createText('AAct', 14, 82, `▶ ${a.action}`, 9, 500, a.color, card.id);
    aX += 224;
  }

  // Row 2: Cashflow Forecasting (Dự báo dòng tiền thu 30 ngày)
  const fcCard = await createFrame('ForecastCard', 28, 144, 1108, 660, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('FCTitle', 20, 18, 'MÔ HÌNH DỰ BÁO DÒNG TIỀN THU HỒI NỢ THEO XÁC SUẤT 30 NGÀY TỚI (EXPECTED CASH INFLOW)', 12, 700, '#0F172AFF', fcCard.id);
  await createText('FCSub', 20, 36, 'Tính toán dựa trên lịch sử thanh toán, hạn mức tín dụng và cam kết PTP của từng khách hàng B2B', 10, 400, '#64748BFF', fcCard.id);

  // Forecast Bars
  const weeks = [
    { name: 'Tuần 1 (10/11 - 16/11)', expected: '520.000.000 đ', prob: '95% Xác suất', invoices: '12 Hóa đơn đến hạn (Đã có 8 PTP)', width: 680, color: '#4F46E5FF' },
    { name: 'Tuần 2 (17/11 - 23/11)', expected: '380.000.000 đ', prob: '88% Xác suất', invoices: '9 Hóa đơn đến hạn (5 khách Hạng A)', width: 500, color: '#059669FF' },
    { name: 'Tuần 3 (24/11 - 30/11)', expected: '290.000.000 đ', prob: '75% Xác suất', invoices: '7 Hóa đơn đến hạn (Cần theo dõi Tầng 2)', width: 380, color: '#0284C7FF' },
    { name: 'Tuần 4 (01/12 - 07/12)', expected: '150.000.000 đ', prob: '50% Xác suất', invoices: '4 Hóa đơn (Chứa nợ tranh chấp và PTP gia hạn)', width: 220, color: '#D97706FF' }
  ];

  let wY = 74;
  for (const w of weeks) {
    await createRect(`WkBg_${w.name}`, 20, wY, 1068, 70, null, '#F1F5F9FF', 4, fcCard.id);
    await createText('WName', 32, wY + 16, w.name, 11, 700, '#0F172AFF', fcCard.id);
    await createText('WExp', 32, wY + 36, `Dự kiến thu: ${w.expected}`, 12, 700, w.color, fcCard.id);
    await createText('WProb', 220, wY + 36, `(${w.prob})`, 10, 600, '#059669FF', fcCard.id);
    await createText('WInv', 320, wY + 36, `• Chi tiết: ${w.invoices}`, 10, 400, '#64748BFF', fcCard.id);

    // Visual progress bar
    await createRect(`BarBg_${w.name}`, 680, wY + 28, 380, 16, '#E2E8F0FF', null, 8, fcCard.id);
    await createRect(`BarFill_${w.name}`, 680, wY + 28, Math.round(w.width * 0.5), 16, w.color, null, 8, fcCard.id);
    wY += 82;
  }

  // Bottom Analysis: Key metrics
  const metCard = await createFrame('MetCard', 20, 420, 1068, 210, '#F8FAFCFF', '#E2E8F0FF', 6, fcCard.id);
  await createText('MetT', 16, 14, 'ĐÁNH GIÁ CHỈ SỐ SỨC KHỎE CÔNG NỢ DOANH NGHIỆP (AR HEALTH CHECK)', 11, 700, '#0F172AFF', metCard.id);

  const metrics = [
    { name: 'Chỉ số DSO (Days Sales Outstanding)', val: '34.2 Ngày', bench: 'Chuẩn ngành Dược: 45 Ngày', st: 'TỐT (Thấp hơn chuẩn 10.8 ngày)' },
    { name: 'Tỷ lệ Nợ xấu / Tổng doanh số', val: '1.71%', bench: 'Ngưỡng an toàn: < 2.5%', st: 'AN TOÀN' },
    { name: 'Tỷ lệ Thu đúng hạn (Collection Rate)', val: '91.4%', bench: 'Mục tiêu: > 88%', st: 'ĐẠT CHỈ TIÊU' },
    { name: 'Chi phí cơ hội vốn bị chiếm dụng', val: '18.400.000 đ/tháng', bench: 'Lãi suất vay ngắn hạn 7.5%', st: 'ĐÃ GIẢM 42% NHỜ THU TỰ ĐỘNG' }
  ];

  let mY = 44;
  for (const m of metrics) {
    await createText('MName', 16, mY, `● ${m.name}:`, 10, 600, '#334155FF', metCard.id);
    await createText('MVal', 340, mY, m.val, 11, 700, '#0F172AFF', metCard.id);
    await createText('MBench', 480, mY, `(Mục tiêu: ${m.bench})`, 10, 400, '#64748BFF', metCard.id);
    await createText('MSt', 780, mY, `▶ ${m.st}`, 10, 700, '#059669FF', metCard.id);
    mY += 38;
  }
}

// -------------------------------------------------------------
// 9. SCREEN 9: 3-TIER RBAC & POLICY MATRIX (PHÂN QUYỀN & CHÍNH SÁCH)
// -------------------------------------------------------------
async function buildRBACSystemPoliciesScreen() {
  console.log('Building Screen 9: RBAC & Policies...');
  const main = await createFrame('O2C_09_RBAC_System_Policies', 4560, 1000, 1440, 920, '#F8FAFCFF');
  await createFinTechSidebar(main.id, 'Phân quyền RBAC');
  await createFinTechTopbar(main.id, 'MA TRẬN PHÂN QUYỀN 3 CẤP ĐỘ (RBAC) & CƠ CHẾ KIỂM SOÁT MAKER-CHECKER', 'Thiết lập hạn mức phê duyệt, chính sách dunning và lưu vết kiểm toán hành vi (Audit Log) (BR-5.3 & BR-7)');

  const content = await createFrame('Content', 240, 56, 1200, 864, '#F8FAFCFF', null, 0, main.id);

  // 3-Tier Architecture Columns
  const roles = [
    {
      title: '1. VAI TRÒ ADMIN (CFO / BAN TÍN DỤNG)',
      sub: 'Quyền phê duyệt tối cao & Kiểm soát rủi ro',
      color: '#4F46E5FF',
      perms: [
        '✔ Duyệt cấp hạn mức tín dụng > 500 triệu đ',
        '✔ Ký duyệt Override đơn hàng bị khóa tín dụng',
        '✔ Phê duyệt gia hạn PTP lần 3 trở lên',
        '✔ Ký quyết định miễn/giảm lãi phạt quá hạn',
        '✔ Phê duyệt chuyển hồ sơ khởi kiện nợ xấu T+30',
        '✔ Cấu hình ngưỡng De Minimis & Ma trận Dunning'
      ]
    },
    {
      title: '2. VAI TRÒ STAFF (AR / SALES / KHO / KẾ TOÁN)',
      sub: 'Thực thi nghiệp vụ & Đề xuất (Maker)',
      color: '#0284C7FF',
      perms: [
        '✔ Nhập đơn bán hàng (SO) & Đề xuất cấp hạn mức',
        '✔ Tra cứu công nợ & Trạng thái 4 trục hóa đơn',
        '✔ Ghi nhận cam kết PTP lần 1 & lần 2 (≤ 7 ngày)',
        '✔ Tiếp nhận & Xác minh tranh chấp (SLA 72h)',
        '✔ Điều chỉnh số dư nợ khi có biên bản hàng trả',
        '✔ Phân bổ gạch nợ thủ công (Manual Match)'
      ]
    },
    {
      title: '3. VAI TRÒ USER (KHÁCH HÀNG B2B - AP / MUA)',
      sub: 'Tự phục vụ trên Portal & Minh bạch số liệu',
      color: '#059669FF',
      perms: [
        '✔ Tra cứu sao kê công nợ & HĐ điện tử (PDF/XML)',
        '✔ Quét mã VietQR động thanh toán tức thì',
        '✔ Tự tạo cam kết thanh toán PTP lần 1 (≤ 5 ngày)',
        '✔ Gửi yêu cầu khiếu nại sai lệch đơn giá / số lượng',
        '✔ Theo dõi tiến độ giao hàng và xác nhận biên bản',
        '✔ Tải giấy báo có & Xác nhận đối chiếu công nợ'
      ]
    }
  ];

  let rX = 28;
  for (const r of roles) {
    const rCard = await createFrame(`RoleCard_${r.title}`, rX, 20, 356, 380, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
    await createText('RCTitle', 18, 16, r.title, 11, 700, r.color, rCard.id);
    await createText('RCSub', 18, 36, r.sub, 10, 400, '#64748BFF', rCard.id);

    let pY = 68;
    for (const p of r.perms) {
      await createText('RCPerm', 18, pY, p, 10, 500, '#334155FF', rCard.id);
      pY += 46;
    }
    rX += 376;
  }

  // Bottom: Maker-Checker Matrix & Audit Log
  const mcCard = await createFrame('MakerCheckerCard', 28, 420, 1108, 380, '#FFFFFFFF', '#E2E8F0FF', 8, content.id);
  await createText('MCTitle', 20, 18, 'MA TRẬN KIỂM SOÁT TÁCH BẠCH TRÁCH NHIỆM (MAKER-CHECKER MATRIX)', 12, 700, '#0F172AFF', mcCard.id);
  await createText('MCSub', 20, 36, 'Đảm bảo nguyên tắc "Bốn mắt" (Four-eyes principle) - Không một cá nhân nào có toàn quyền tự tạo và tự duyệt', 10, 400, '#64748BFF', mcCard.id);

  await createRect('ThBg', 20, 64, 1068, 32, '#F1F5F9FF', null, 4, mcCard.id);
  await createText('Th1', 32, 74, 'LOẠI HÀNH VI / NGHIỆP VỤ', 10, 700, '#475569FF', mcCard.id);
  await createText('Th2', 300, 74, 'NGƯỜI ĐỀ XUẤT (MAKER)', 10, 700, '#475569FF', mcCard.id);
  await createText('Th3', 520, 74, 'NGƯỜI THẨM ĐỊNH (CHECKER)', 10, 700, '#475569FF', mcCard.id);
  await createText('Th4', 760, 74, 'CẤP PHÊ DUYỆT (APPROVER)', 10, 700, '#475569FF', mcCard.id);
  await createText('Th5', 960, 74, 'LƯU VẾT KIỂM TOÁN', 10, 700, '#475569FF', mcCard.id);

  const mcRows = [
    { act: 'Cấp / Tăng hạn mức tín dụng > 500 triệu đ', maker: 'Nhân viên Sales phụ trách', checker: 'Chuyên viên Quản trị rủi ro', app: 'Giám đốc Tài chính (CFO)', log: 'Audit Log #8912' },
    { act: 'Override duyệt đơn SO khi khách nợ quá hạn > 15d', maker: 'Trưởng phòng Kinh doanh', checker: 'Kế toán trưởng AR', app: 'Hội đồng Tín dụng (Credit Com)', log: 'Audit Log #8913' },
    { act: 'Gia hạn Cam kết thanh toán (PTP) lần 3 trở lên', maker: 'Kế toán công nợ AR', checker: 'Trưởng nhóm Thu hồi nợ', app: 'Credit Manager', log: 'Audit Log #8914' },
    { act: 'Miễn giảm lãi phạt chậm trả & Xóa nợ nhỏ', maker: 'Kế toán AR lập tờ trình', checker: 'Kiểm toán nội bộ', app: 'Giám đốc Tài chính (CFO)', log: 'Audit Log #8915' }
  ];

  let mcY = 104;
  for (const m of mcRows) {
    await createRect(`MCRow_${m.act}`, 20, mcY, 1068, 54, null, '#F1F5F9FF', 4, mcCard.id);
    await createText('MAct', 32, mcY + 18, m.act, 10, 600, '#0F172AFF', mcCard.id);
    await createText('MMaker', 300, mcY + 18, m.maker, 10, 500, '#475569FF', mcCard.id);
    await createText('MChecker', 520, mcY + 18, m.checker, 10, 500, '#0284C7FF', mcCard.id);
    await createText('MApp', 760, mcY + 18, m.app, 10, 700, '#4F46E5FF', mcCard.id);
    await createText('MLog', 960, mcY + 18, m.log, 10, 600, '#059669FF', mcCard.id);
    mcY += 60;
  }
}

// -------------------------------------------------------------
// MAIN MASTER EXECUTOR: BUILD ALL 9 SCREENS
// -------------------------------------------------------------
export async function buildAllFinTechScreens() {
  console.log('=== BẮT ĐẦU XÂY DỰNG TOÀN BỘ 9 GIAO DIỆN FINTECH ORDER-TO-CASH & AR AUTOMATION TRÊN FIGMA ===');

  try {
    // Step 1: Clean old generic screens
    console.log('1. Quét dọn các frame cũ trên canvas...');
    const pagesData = await callTool('get-pages', {});
    const page1 = typeof pagesData[0] === 'string' ? JSON.parse(pagesData[0]) : pagesData[0];
    if (page1 && page1.nodes && page1.nodes.length > 0) {
      for (const n of page1.nodes) {
        console.log(`Đang xóa node cũ: ${n.name} (${n.id})`);
        await callTool('delete-node', { id: n.id });
      }
    }

    // Step 2: Build Row 1 (Screens 1 to 5)
    console.log('2. Dựng Hàng 1 (Screens 1 đến 5)...');
    await buildExecutiveDashboard();
    await buildCreditControlScreen();
    await buildSmartInvoicingScreen();
    await buildCollectionWorklistScreen();
    await buildPTPAndDisputeScreen();

    // Step 3: Build Row 2 (Screens 6 to 9)
    console.log('3. Dựng Hàng 2 (Screens 6 đến 9)...');
    await buildBankCashApplicationScreen();
    await buildCustomerPortalScreen();
    await buildAgingAnalyticsScreen();
    await buildRBACSystemPoliciesScreen();

    console.log('=== HOÀN TẤT THIẾT KẾ TOÀN BỘ 9 MÀN HÌNH CHUẨN NGHIỆP VỤ FINTECH TRÊN FIGMA ===');
  } catch (err) {
    console.error('Lỗi khi dựng màn hình Figma:', err);
  }
}

// Run if called directly
buildAllFinTechScreens();
