import {
  callTool,
  createFrame,
  createRect,
  createText,
  createCactusLogo,
  createChevronDown,
  createHomeIcon,
  createPaymentsIcon,
  createBalancesIcon,
  createCustomersIcon,
  createConnectedIcon,
  createProductsIcon,
  createReportsIcon,
  createDevelopersIcon,
  createToggleSwitch,
  createSettingsIcon,
  createSearchIcon,
  createMegaphoneIcon,
  createBellWithBadge,
  createHelpIcon,
  createAvatarIcon,
  createMoreDotsIcon,
  createBadge
} from './cactus_helpers.js';

// Helper to create a standard sidebar with active item highlighted
async function createStandardSidebar(parentFrameId, activeItemName) {
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, parentFrameId);
  await createRect('SBBorder', 239, 0, 1, 920, '#F1F5F9FF', null, 0, sb.id);

  // Logo
  await createCactusLogo(20, 22, sb.id);
  await createText('WSName', 48, 23, 'Cactus Practice', 13, 600, '#0F172AFF', sb.id);
  await createChevronDown(152, 28, '#64748BFF', sb.id);

  const menu = [
    { name: 'Home', icon: createHomeIcon },
    { name: 'Payments', icon: createPaymentsIcon },
    { name: 'Balances', icon: createBalancesIcon },
    { name: 'Customers', icon: createCustomersIcon },
    { name: 'Connected accounts', icon: createConnectedIcon },
    { name: 'Products', icon: createProductsIcon },
    { name: 'Reports', icon: createReportsIcon },
  ];

  let nY = 64;
  for (const item of menu) {
    const isActive = item.name.toLowerCase() === activeItemName.toLowerCase();
    const color = isActive ? '#4F46E5FF' : '#64748BFF';
    const textColor = isActive ? '#4F46E5FF' : '#475569FF';
    const weight = isActive ? 600 : 400;

    await item.icon(20, nY + 4, color, sb.id);
    await createText(`N_${item.name}`, 48, nY + 3, item.name, 13, weight, textColor, sb.id);
    nY += 34;
  }

  // Bottom
  await createDevelopersIcon(20, 784, '#64748BFF', sb.id);
  await createText('N_Dev', 48, 783, 'Developers', 13, 400, '#475569FF', sb.id);
  await createToggleSwitch(20, 818, false, sb.id);
  await createText('N_Test', 52, 816, 'View test data', 13, 400, '#64748BFF', sb.id);
  await createSettingsIcon(20, 852, '#64748BFF', sb.id);
  await createText('N_Set', 48, 851, 'Settings', 13, 400, '#475569FF', sb.id);

  return sb;
}

// Helper to create topbar
async function createStandardTopbar(parentFrameId) {
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, parentFrameId);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb.id);
  await createBellWithBadge(1070, 18, '2', tb.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb.id);
  await createAvatarIcon(1132, 15, tb.id);
  return tb;
}

async function buildAllRemaining() {
  console.log('=== BUILDING ALL REMAINING FIGMA SCREENS ===');

  // ==========================================
  // SCREEN 5: HOME DASHBOARD (x: 5160)
  // ==========================================
  console.log('Step 1: Building Home Dashboard (x: 5160)...');
  const homeScreen = await createFrame('Cactus Practice - Home / Dashboard Overview', 5160, 0, 1440, 920, '#FFFFFFFF');
  await createStandardSidebar(homeScreen.id, 'Home');
  await createStandardTopbar(homeScreen.id);

  const homeCnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, homeScreen.id);
  await createText('HomeTitle', 32, 24, 'Today at Cactus Practice', 26, 700, '#0F172AFF', homeCnt.id);
  await createText('HomeSub', 32, 58, 'Real-time overview of monthly recurring revenue, recent charges, and business health.', 13, 400, '#64748BFF', homeCnt.id);

  // 4 KPI Cards
  const kpis = [
    { title: 'Gross volume', val: '$128,490.00', sub: '↑ +14.2% vs last month', subCol: '#10B981FF' },
    { title: 'Current MRR', val: '$14,290.00', sub: '↑ +8.5% growth', subCol: '#10B981FF' },
    { title: 'Net revenue', val: '$96,210.00', sub: '↑ +12.0% after fees', subCol: '#10B981FF' },
    { title: 'Active subscribers', val: '942', sub: '+38 new this week', subCol: '#10B981FF' },
  ];

  let kpiX = 32;
  for (const k of kpis) {
    const card = await createFrame(`Card_${k.title}`, kpiX, 96, 260, 88, '#FFFFFFFF', '#E2E8F0FF', 8, homeCnt.id);
    await createText('KT', 16, 12, k.title, 12, 400, '#64748BFF', card.id);
    await createText('KV', 16, 32, k.val, 20, 700, '#0F172AFF', card.id);
    await createText('KS', 16, 60, k.sub, 11, 500, k.subCol, card.id);
    kpiX += 284;
  }

  // Chart Box
  const chartBox = await createFrame('ChartBox', 32, 208, 720, 240, '#FFFFFFFF', '#E2E8F0FF', 8, homeCnt.id);
  await createText('CBT', 16, 16, 'Gross Volume Over Time', 14, 600, '#0F172AFF', chartBox.id);
  await createText('CBS', 16, 36, 'Daily transaction volume (USD)', 12, 400, '#64748BFF', chartBox.id);
  // Chart visual grid & bars
  await createRect('GridLine1', 16, 80, 688, 1, '#F1F5F9FF', null, 0, chartBox.id);
  await createRect('GridLine2', 16, 130, 688, 1, '#F1F5F9FF', null, 0, chartBox.id);
  await createRect('GridLine3', 16, 180, 688, 1, '#F1F5F9FF', null, 0, chartBox.id);

  // Visual trend bar heights
  const bars = [40, 65, 80, 50, 95, 110, 85, 125, 140, 120, 160];
  let barX = 32;
  for (const h of bars) {
    await createRect(`Bar_${barX}`, barX, 190 - h, 36, h, '#EEF2FFFF', '#4F46E5FF', 4, chartBox.id);
    barX += 60;
  }

  // Quick actions column
  const qaBox = await createFrame('QABox', 776, 208, 380, 240, '#F8FAFCFF', '#E2E8F0FF', 8, homeCnt.id);
  await createText('QAT', 16, 16, 'Quick Actions', 14, 600, '#0F172AFF', qaBox.id);
  const qActions = [
    { title: 'Create subscription', sub: 'Bill recurring medical practice plans' },
    { title: 'Add customer', sub: 'Register new patient account' },
    { title: 'Send payment link', sub: 'Collect one-off charges instantly' },
  ];
  let qaY = 48;
  for (const qa of qActions) {
    const qItem = await createFrame(`QA_${qa.title}`, 16, qaY, 348, 52, '#FFFFFFFF', '#E2E8F0FF', 6, qaBox.id);
    await createText('QT', 12, 8, qa.title, 12, 600, '#0F172AFF', qItem.id);
    await createText('QS', 12, 26, qa.sub, 11, 400, '#64748BFF', qItem.id);
    qaY += 60;
  }

  // ==========================================
  // SCREEN 6: BALANCES & PAYOUTS (x: 6680)
  // ==========================================
  console.log('Step 2: Building Balances Screen (x: 6680)...');
  const balScreen = await createFrame('Cactus Practice - Balances / Payouts Overview', 6680, 0, 1440, 920, '#FFFFFFFF');
  await createStandardSidebar(balScreen.id, 'Balances');
  await createStandardTopbar(balScreen.id);

  const balCnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, balScreen.id);
  await createText('BalTitle', 32, 24, 'Balances & Payouts', 26, 700, '#0F172AFF', balCnt.id);
  await createText('BalSub', 32, 58, 'Track your available funds, pending settlements, and automatic bank payout schedules.', 13, 400, '#64748BFF', balCnt.id);

  const payOutBtn = await createFrame('Btn_PayOut', 1034, 24, 124, 34, '#4F46E5FF', null, 6, balCnt.id);
  await createText('POText', 22, 8, 'Pay out now', 13, 600, '#FFFFFFFF', payOutBtn.id);

  // 3 Balance Hero Cards
  const bCards = [
    { label: 'Available balance', val: '$42,850.00 USD', sub: 'Ready for automatic daily payout', col: '#10B981FF' },
    { label: 'Pending payout', val: '$3,210.50 USD', sub: 'Settling in 1-2 business days', col: '#64748BFF' },
    { label: 'Payout schedule', val: 'Daily automatic', sub: 'Destination: Chase Bank •••• 9812', col: '#4F46E5FF' },
  ];
  let bX = 32;
  for (const b of bCards) {
    const card = await createFrame(`BCard_${b.label}`, bX, 96, 350, 100, '#F8FAFCFF', '#E2E8F0FF', 8, balCnt.id);
    await createText('BL', 16, 14, b.label, 12, 400, '#64748BFF', card.id);
    await createText('BV', 16, 36, b.val, 22, 700, '#0F172AFF', card.id);
    await createText('BS', 16, 70, b.sub, 11, 500, b.col, card.id);
    bX += 374;
  }

  // Payout History Table
  await createText('PHTitle', 32, 226, 'Payout History', 15, 600, '#0F172AFF', balCnt.id);
  const pthY = 256;
  await createText('PTH_ID', 32, pthY, 'PAYOUT ID', 11, 600, '#64748BFF', balCnt.id);
  await createText('PTH_Amt', 220, pthY, 'AMOUNT', 11, 600, '#64748BFF', balCnt.id);
  await createText('PTH_Dest', 380, pthY, 'DESTINATION', 11, 600, '#64748BFF', balCnt.id);
  await createText('PTH_Init', 620, pthY, 'INITIATED', 11, 600, '#64748BFF', balCnt.id);
  await createText('PTH_Status', 840, pthY, 'STATUS', 11, 600, '#64748BFF', balCnt.id);
  await createRect('PTH_Div', 32, pthY + 20, 1124, 1, '#E2E8F0FF', null, 0, balCnt.id);

  const payouts = [
    { id: 'po_1O83Ab991122', amt: '$18,420.00 USD', dest: 'Chase Bank •••• 9812', date: 'Oct 18, 2026' },
    { id: 'po_1O79Zx883344', amt: '$14,190.50 USD', dest: 'Chase Bank •••• 9812', date: 'Oct 17, 2026' },
    { id: 'po_1O65Kk772211', amt: '$10,239.50 USD', dest: 'Chase Bank •••• 9812', date: 'Oct 16, 2026' },
  ];
  let ptrY = pthY + 30;
  for (const p of payouts) {
    await createText(`PID_${p.id}`, 32, ptrY, p.id, 12, 400, '#334155FF', balCnt.id);
    await createText(`PAmt_${p.id}`, 220, ptrY, p.amt, 13, 600, '#0F172AFF', balCnt.id);
    await createText(`PDest_${p.id}`, 380, ptrY, p.dest, 13, 400, '#64748BFF', balCnt.id);
    await createText(`PDate_${p.id}`, 620, ptrY, p.date, 13, 400, '#64748BFF', balCnt.id);
    await createBadge(`PStat_${p.id}`, 840, ptrY - 2, 'Paid', 'success', balCnt.id);
    await createRect(`PDiv_${p.id}`, 32, ptrY + 28, 1124, 1, '#F8FAFCFF', null, 0, balCnt.id);
    ptrY += 40;
  }

  // ==========================================
  // SCREEN 7: PRODUCTS & PRICING (x: 8200)
  // ==========================================
  console.log('Step 3: Building Products Screen (x: 8200)...');
  const prodScreen = await createFrame('Cactus Practice - Products / Pricing Catalog', 8200, 0, 1440, 920, '#FFFFFFFF');
  await createStandardSidebar(prodScreen.id, 'Products');
  await createStandardTopbar(prodScreen.id);

  const prodCnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, prodScreen.id);
  await createText('ProdTitle', 32, 24, 'Product Catalog & Pricing Plans', 26, 700, '#0F172AFF', prodCnt.id);
  await createText('ProdSub', 32, 58, 'Manage recurring tiers, telehealth consultations, and digital care packages.', 13, 400, '#64748BFF', prodCnt.id);

  const addProdBtn = await createFrame('Btn_AddProd', 1034, 24, 124, 34, '#4F46E5FF', null, 6, prodCnt.id);
  await createText('APText', 20, 8, '+ Add product', 13, 600, '#FFFFFFFF', addProdBtn.id);

  // 3 Product Tier Cards
  const pTiers = [
    { name: 'Premium Plan', price: '$9.99', int: '/ month', desc: "Jane Diaz's active tier. Comprehensive health membership with 24/7 care team access.", subs: '642 active subscribers', badge: 'Active' },
    { name: 'Pro Care Plan', price: '$29.00', int: '/ month', desc: 'Monthly lab analysis, telehealth follow-ups, and unlimited prescription renewals.', subs: '215 active subscribers', badge: 'Active' },
    { name: 'Enterprise Health Suite', price: '$99.00', int: '/ month', desc: 'Concierge medical partnerships, dedicated doctors, and rapid priority appointments.', subs: '85 corporate accounts', badge: 'Active' },
  ];
  let ptX = 32;
  for (const pt of pTiers) {
    const card = await createFrame(`PTCard_${pt.name}`, ptX, 100, 350, 240, '#FFFFFFFF', '#E2E8F0FF', 8, prodCnt.id);
    await createBadge(`PTBadge_${pt.name}`, 16, 16, pt.badge, 'active', card.id);
    await createText('PTN', 16, 44, pt.name, 16, 700, '#0F172AFF', card.id);
    await createText('PTP', 16, 72, pt.price, 24, 700, '#0F172AFF', card.id);
    await createText('PTI', 96, 82, pt.int, 12, 400, '#64748BFF', card.id);
    await createText('PTD', 16, 114, pt.desc, 12, 400, '#64748BFF', card.id);
    await createRect('PTDiv', 16, 180, 318, 1, '#F1F5F9FF', null, 0, card.id);
    await createText('PTS', 16, 198, pt.subs, 12, 500, '#4F46E5FF', card.id);
    ptX += 374;
  }

  // ==========================================
  // SCREEN 8: CONNECTED ACCOUNTS & REPORTS (x: 9720)
  // ==========================================
  console.log('Step 4: Building Connected Accounts Screen (x: 9720)...');
  const connScreen = await createFrame('Cactus Practice - Connected accounts / Clinics', 9720, 0, 1440, 920, '#FFFFFFFF');
  await createStandardSidebar(connScreen.id, 'Connected accounts');
  await createStandardTopbar(connScreen.id);

  const connCnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, connScreen.id);
  await createText('ConnTitle', 32, 24, 'Connected Accounts', 26, 700, '#0F172AFF', connCnt.id);
  await createText('ConnSub', 32, 58, 'Manage healthcare clinics, platform partners, and doctors under Stripe Connect.', 13, 400, '#64748BFF', connCnt.id);

  // Table
  const cthY = 100;
  await createText('CTH_Name', 32, cthY, 'CLINIC / ACCOUNT NAME', 11, 600, '#64748BFF', connCnt.id);
  await createText('CTH_ID', 300, cthY, 'ACCOUNT ID', 11, 600, '#64748BFF', connCnt.id);
  await createText('CTH_Country', 480, cthY, 'COUNTRY', 11, 600, '#64748BFF', connCnt.id);
  await createText('CTH_Status', 660, cthY, 'PAYOUTS STATUS', 11, 600, '#64748BFF', connCnt.id);
  await createText('CTH_Vol', 840, cthY, 'VOLUME YTD', 11, 600, '#64748BFF', connCnt.id);
  await createRect('CTH_Div', 32, cthY + 20, 1124, 1, '#E2E8F0FF', null, 0, connCnt.id);

  const clinics = [
    { name: 'Bay Area Medical Clinic', id: 'acct_1N9a8822B', country: 'United States 🇺🇸', status: 'Enabled', vol: '$128,400.00' },
    { name: 'Downtown Pediatric Group', id: 'acct_1N8x1199P', country: 'United States 🇺🇸', status: 'Enabled', vol: '$84,120.00' },
    { name: 'Sunset Wellness Partners', id: 'acct_1N7y3344W', country: 'United States 🇺🇸', status: 'Restricted', vol: '$14,500.00' },
  ];
  let ctrY = cthY + 30;
  for (const c of clinics) {
    await createText(`CN_${c.id}`, 32, ctrY, c.name, 13, 600, '#0F172AFF', connCnt.id);
    await createText(`CID_${c.id}`, 300, ctrY, c.id, 12, 400, '#64748BFF', connCnt.id);
    await createText(`CC_${c.id}`, 480, ctrY, c.country, 13, 400, '#334155FF', connCnt.id);
    await createBadge(`CS_${c.id}`, 660, ctrY - 2, c.status, c.status === 'Enabled' ? 'active' : 'default', connCnt.id);
    await createText(`CV_${c.id}`, 840, ctrY, c.vol, 13, 600, '#0F172AFF', connCnt.id);
    await createMoreDotsIcon(1120, ctrY, '#64748BFF', connCnt.id);
    await createRect(`CDiv_${c.id}`, 32, ctrY + 28, 1124, 1, '#F8FAFCFF', null, 0, connCnt.id);
    ctrY += 40;
  }

  console.log('=== ALL REMAINING FIGMA SCREENS COMPLETED! ===');
}

buildAllRemaining().catch(console.error);
