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
  createBadge
} from './cactus_helpers.js';

async function buildReports() {
  console.log('=== BUILDING REPORTS FIGMA SCREEN (x: 11240) ===');
  const repScreen = await createFrame('Cactus Practice - Reports / Analytics', 11240, 0, 1440, 920, '#FFFFFFFF');

  // Sidebar (Reports Active)
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, repScreen.id);
  await createRect('SBBorder', 239, 0, 1, 920, '#F1F5F9FF', null, 0, sb.id);
  await createCactusLogo(20, 22, sb.id);
  await createText('WSName', 48, 23, 'Cactus Practice', 13, 600, '#0F172AFF', sb.id);
  await createChevronDown(152, 28, '#64748BFF', sb.id);

  let nY = 64;
  await createHomeIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Home', 48, nY + 3, 'Home', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createPaymentsIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Pay', 48, nY + 3, 'Payments', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createBalancesIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Bal', 48, nY + 3, 'Balances', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createCustomersIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Cust', 48, nY + 3, 'Customers', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createConnectedIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Conn', 48, nY + 3, 'Connected accounts', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createProductsIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Prod', 48, nY + 3, 'Products', 13, 400, '#475569FF', sb.id);
  nY += 34;

  // Reports Active!
  await createReportsIcon(20, nY + 4, '#4F46E5FF', sb.id);
  await createText('N_Rep', 48, nY + 3, 'Reports', 13, 600, '#4F46E5FF', sb.id);

  // Bottom
  await createDevelopersIcon(20, 784, '#64748BFF', sb.id);
  await createText('N_Dev', 48, 783, 'Developers', 13, 400, '#475569FF', sb.id);
  await createToggleSwitch(20, 818, false, sb.id);
  await createText('N_Test', 52, 816, 'View test data', 13, 400, '#64748BFF', sb.id);
  await createSettingsIcon(20, 852, '#64748BFF', sb.id);
  await createText('N_Set', 48, 851, 'Settings', 13, 400, '#475569FF', sb.id);

  // Topbar
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, repScreen.id);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb.id);
  await createBellWithBadge(1070, 18, '2', tb.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb.id);
  await createAvatarIcon(1132, 15, tb.id);

  // Content
  const cnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, repScreen.id);
  await createText('RepTitle', 32, 24, 'Reports & Financial Analytics', 26, 700, '#0F172AFF', cnt.id);
  await createText('RepSub', 32, 58, 'Financial summaries, accounting exports, cohort retention, and revenue recognition.', 13, 400, '#64748BFF', cnt.id);

  const expBtn = await createFrame('Btn_ExportRep', 990, 24, 168, 34, '#4F46E5FF', null, 6, cnt.id);
  await createText('EBText', 14, 8, 'Download financial report', 13, 600, '#FFFFFFFF', expBtn.id);

  // 4 Metrics Cards
  const repMetrics = [
    { label: 'Net revenue (YTD)', val: '$412,890.00', sub: 'Gross minus fees and refunds' },
    { label: 'Processing fees', val: '$11,940.00', sub: 'Stripe interchange & platform' },
    { label: 'Dispute rate', val: '0.08%', sub: 'Far below 1.0% network limit' },
    { label: 'Subscriber LTV', val: '$840.00', sub: 'Average lifetime customer value' },
  ];
  let rmX = 32;
  for (const m of repMetrics) {
    const card = await createFrame(`RCard_${m.label}`, rmX, 96, 260, 88, '#F8FAFCFF', '#E2E8F0FF', 8, cnt.id);
    await createText('RML', 16, 12, m.label, 12, 400, '#64748BFF', card.id);
    await createText('RMV', 16, 32, m.val, 20, 700, '#0F172AFF', card.id);
    await createText('RMS', 16, 60, m.sub, 11, 400, '#94A3B8FF', card.id);
    rmX += 284;
  }

  // Statements Section
  await createText('SecTitle', 32, 214, 'Downloadable Accounting Statements', 15, 600, '#0F172AFF', cnt.id);

  const statements = [
    {
      title: 'Monthly Revenue Recognition Report - September 2026',
      sub: 'QuickBooks & Xero compatible summary of all realized subscription income',
      action: 'Download CSV ↓'
    },
    {
      title: 'Payout Reconciliation Statement - Q3 2026',
      sub: 'Detailed breakdown of gross transfers and bank settlements',
      action: 'Download PDF ↓'
    },
    {
      title: 'Tax Liability & Exemption Report - YTD 2026',
      sub: 'Itemized sales tax and health service tax collected across jurisdictions',
      action: 'Download CSV ↓'
    }
  ];

  let stY = 246;
  for (const st of statements) {
    const stBox = await createFrame(`St_${st.title.slice(0, 15)}`, 32, stY, 1124, 68, '#FFFFFFFF', '#E2E8F0FF', 8, cnt.id);
    await createText('ST_T', 20, 14, st.title, 13, 600, '#0F172AFF', stBox.id);
    await createText('ST_S', 20, 36, st.sub, 12, 400, '#64748BFF', stBox.id);
    await createText('ST_A', 980, 24, st.action, 13, 600, '#4F46E5FF', stBox.id);
    stY += 78;
  }

  console.log('=== REPORTS SCREEN COMPLETED SUCCESSFULLY ===');
}

buildReports().catch(console.error);
