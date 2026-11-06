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
  createCheckbox,
  createBadge
} from './cactus_helpers.js';

async function buildPaymentsScreen() {
  console.log('=== CREATING PAYMENTS TRANSACTIONS SCREEN (1440 × 920) ===');
  const payScreen = await createFrame('Cactus Practice - Payments / All Transactions', 3640, 0, 1440, 920, '#FFFFFFFF');

  // Sidebar
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, payScreen.id);
  await createRect('SBBorder', 239, 0, 1, 920, '#F1F5F9FF', null, 0, sb.id);
  await createCactusLogo(20, 22, sb.id);
  await createText('WSName', 48, 23, 'Cactus Practice', 13, 600, '#0F172AFF', sb.id);
  await createChevronDown(152, 28, '#64748BFF', sb.id);

  let nY = 64;
  await createHomeIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Home', 48, nY + 3, 'Home', 13, 400, '#475569FF', sb.id);
  nY += 34;

  // Payments Active!
  await createPaymentsIcon(20, nY + 4, '#4F46E5FF', sb.id);
  await createText('N_Payments', 48, nY + 3, 'Payments', 13, 600, '#4F46E5FF', sb.id);
  nY += 34;

  await createBalancesIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Balances', 48, nY + 3, 'Balances', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createCustomersIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Customers', 48, nY + 3, 'Customers', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createConnectedIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Conn', 48, nY + 3, 'Connected accounts', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createProductsIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Prod', 48, nY + 3, 'Products', 13, 400, '#475569FF', sb.id);
  nY += 34;

  await createReportsIcon(20, nY + 4, '#64748BFF', sb.id);
  await createText('N_Rep', 48, nY + 3, 'Reports', 13, 400, '#475569FF', sb.id);

  // Bottom
  await createDevelopersIcon(20, 784, '#64748BFF', sb.id);
  await createText('N_Dev', 48, 783, 'Developers', 13, 400, '#475569FF', sb.id);
  await createToggleSwitch(20, 818, false, sb.id);
  await createText('N_Test', 52, 816, 'View test data', 13, 400, '#64748BFF', sb.id);
  await createSettingsIcon(20, 852, '#64748BFF', sb.id);
  await createText('N_Set', 48, 851, 'Settings', 13, 400, '#475569FF', sb.id);

  // Topbar
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, payScreen.id);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb.id);
  await createBellWithBadge(1070, 18, '2', tb.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb.id);
  await createAvatarIcon(1132, 15, tb.id);

  // Content
  const cnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, payScreen.id);
  await createText('PayTitle', 32, 24, 'Payments', 26, 700, '#0F172AFF', cnt.id);

  const newPayBtn = await createFrame('Btn_NewPay', 1034, 24, 124, 34, '#4F46E5FF', null, 6, cnt.id);
  await createText('NPText', 16, 8, '+ Create payment', 13, 600, '#FFFFFFFF', newPayBtn.id);

  // Summary Metrics
  const mY = 80;
  await createText('ML1', 32, mY, 'Total volume', 12, 400, '#64748BFF', cnt.id);
  await createText('MV1', 32, mY + 18, '$84,290.00', 16, 700, '#0F172AFF', cnt.id);

  await createText('ML2', 180, mY, 'Net volume', 12, 400, '#64748BFF', cnt.id);
  await createText('MV2', 180, mY + 18, '$78,410.00', 16, 700, '#0F172AFF', cnt.id);

  await createText('ML3', 320, mY, 'Success rate', 12, 400, '#64748BFF', cnt.id);
  await createText('MV3', 320, mY + 18, '98.4%', 16, 700, '#10B981FF', cnt.id);

  // Status Tabs
  const tabY = 144;
  await createText('TabAll', 32, tabY, 'All', 13, 600, '#4F46E5FF', cnt.id);
  await createRect('TabLine', 32, tabY + 22, 24, 2, '#4F46E5FF', null, 1, cnt.id);
  await createText('TabSucc', 80, tabY, 'Succeeded', 13, 400, '#64748BFF', cnt.id);
  await createText('TabRef', 164, tabY, 'Refunded', 13, 400, '#64748BFF', cnt.id);
  await createText('TabFail', 246, tabY, 'Failed', 13, 400, '#64748BFF', cnt.id);
  await createRect('TabsDiv', 32, tabY + 23, 1124, 1, '#E2E8F0FF', null, 0, cnt.id);

  // Table
  const thY = 190;
  await createCheckbox(36, thY + 2, false, cnt.id);
  await createText('TH_Amount', 68, thY, 'AMOUNT', 11, 600, '#64748BFF', cnt.id);
  await createText('TH_Status', 220, thY, 'STATUS', 11, 600, '#64748BFF', cnt.id);
  await createText('TH_Desc', 360, thY, 'DESCRIPTION', 11, 600, '#64748BFF', cnt.id);
  await createText('TH_Cust', 580, thY, 'CUSTOMER', 11, 600, '#64748BFF', cnt.id);
  await createText('TH_Date', 800, thY, 'DATE', 11, 600, '#64748BFF', cnt.id);
  await createRect('TH_Div', 32, thY + 20, 1124, 1, '#E2E8F0FF', null, 0, cnt.id);

  const txs = [
    { amt: '$9.93 USD', status: 'Succeeded', desc: 'Subscription update', cust: 'Jane Diaz', date: 'Sep 14, 11:14 PM' },
    { amt: '$29.00 USD', status: 'Succeeded', desc: 'Pro Plan Monthly', cust: 'Alexander Hamilton', date: 'Sep 14, 8:30 AM' },
    { amt: '$99.00 USD', status: 'Succeeded', desc: 'Enterprise Plan', cust: 'Sophia Lee', date: 'Sep 13, 3:15 PM' },
    { amt: '$2.00 USD', status: 'Succeeded', desc: 'Subscription update', cust: 'Jane Diaz', date: 'Sep 13, 1:05 AM' },
    { amt: '$19.99 USD', status: 'Succeeded', desc: 'CloudOps Addon', cust: 'Emma Wilson', date: 'Sep 10, 4:22 PM' },
  ];

  let rY = thY + 28;
  for (let i = 0; i < txs.length; i++) {
    const t = txs[i];
    await createCheckbox(36, rY + 4, false, cnt.id);
    await createText(`TAmt_${i}`, 68, rY, t.amt, 13, 600, '#0F172AFF', cnt.id);
    await createBadge(`TStat_${i}`, 220, rY, t.status, 'success', cnt.id);
    await createText(`TDesc_${i}`, 360, rY, t.desc, 13, 400, '#334155FF', cnt.id);
    await createText(`TCust_${i}`, 580, rY, t.cust, 13, 500, '#4F46E5FF', cnt.id);
    await createText(`TDate_${i}`, 800, rY, t.date, 13, 400, '#64748BFF', cnt.id);
    await createMoreDotsIcon(1120, rY, '#64748BFF', cnt.id);

    await createRect(`RDiv_${i}`, 32, rY + 28, 1124, 1, '#F8FAFCFF', null, 0, cnt.id);
    rY += 36;
  }

  console.log('=== PAYMENTS SCREEN COMPLETED SUCCESSFULLY ===');
}

buildPaymentsScreen().catch(console.error);
