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

async function buildBalances() {
  console.log('=== BUILDING BALANCES FIGMA SCREEN (x: 6680) ===');
  const balScreen = await createFrame('Cactus Practice - Balances / Payouts Overview', 6680, 0, 1440, 920, '#FFFFFFFF');

  // Sidebar (Balances Active)
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, balScreen.id);
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

  // Balances Active
  await createBalancesIcon(20, nY + 4, '#4F46E5FF', sb.id);
  await createText('N_Bal', 48, nY + 3, 'Balances', 13, 600, '#4F46E5FF', sb.id);
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
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, balScreen.id);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb.id);
  await createBellWithBadge(1070, 18, '2', tb.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb.id);
  await createAvatarIcon(1132, 15, tb.id);

  // Content
  const cnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, balScreen.id);
  await createText('BalTitle', 32, 24, 'Balances and Payouts', 26, 700, '#0F172AFF', cnt.id);
  await createText('BalSub', 32, 58, 'Track your available funds, pending settlements, and automatic bank payout schedules.', 13, 400, '#64748BFF', cnt.id);

  const poBtn = await createFrame('Btn_PayOut', 1034, 24, 124, 34, '#4F46E5FF', null, 6, cnt.id);
  await createText('POText', 22, 8, 'Pay out now', 13, 600, '#FFFFFFFF', poBtn.id);

  // 3 Balance Hero Cards
  const bCards = [
    { label: 'Available balance', val: '$42,850.00 USD', sub: 'Ready for automatic daily payout', col: '#10B981FF' },
    { label: 'Pending payout', val: '$3,210.50 USD', sub: 'Settling in 1-2 business days', col: '#64748BFF' },
    { label: 'Payout schedule', val: 'Daily automatic', sub: 'Destination: Chase Bank •••• 9812', col: '#4F46E5FF' },
  ];
  let bX = 32;
  for (const b of bCards) {
    const card = await createFrame(`BCard_${b.label}`, bX, 96, 350, 100, '#F8FAFCFF', '#E2E8F0FF', 8, cnt.id);
    await createText('BL', 16, 14, b.label, 12, 400, '#64748BFF', card.id);
    await createText('BV', 16, 36, b.val, 22, 700, '#0F172AFF', card.id);
    await createText('BS', 16, 70, b.sub, 11, 500, b.col, card.id);
    bX += 374;
  }

  // Payout History Table
  await createText('PHTitle', 32, 226, 'Payout History', 15, 600, '#0F172AFF', cnt.id);
  const pthY = 256;
  await createText('PTH_ID', 32, pthY, 'PAYOUT ID', 11, 600, '#64748BFF', cnt.id);
  await createText('PTH_Amt', 240, pthY, 'AMOUNT', 11, 600, '#64748BFF', cnt.id);
  await createText('PTH_Dest', 420, pthY, 'DESTINATION', 11, 600, '#64748BFF', cnt.id);
  await createText('PTH_Init', 680, pthY, 'INITIATED', 11, 600, '#64748BFF', cnt.id);
  await createText('PTH_Status', 880, pthY, 'STATUS', 11, 600, '#64748BFF', cnt.id);
  await createRect('PTH_Div', 32, pthY + 20, 1124, 1, '#E2E8F0FF', null, 0, cnt.id);

  const payouts = [
    { id: 'po_1O83Ab991122', amt: '$18,420.00 USD', dest: 'Chase Bank •••• 9812', date: 'Oct 18, 2026' },
    { id: 'po_1O79Zx883344', amt: '$14,190.50 USD', dest: 'Chase Bank •••• 9812', date: 'Oct 17, 2026' },
    { id: 'po_1O65Kk772211', amt: '$10,239.50 USD', dest: 'Chase Bank •••• 9812', date: 'Oct 16, 2026' },
  ];
  let ptrY = pthY + 30;
  for (const p of payouts) {
    await createText(`PID_${p.id}`, 32, ptrY, p.id, 12, 400, '#334155FF', cnt.id);
    await createText(`PAmt_${p.id}`, 240, ptrY, p.amt, 13, 600, '#0F172AFF', cnt.id);
    await createText(`PDest_${p.id}`, 420, ptrY, p.dest, 13, 400, '#64748BFF', cnt.id);
    await createText(`PDate_${p.id}`, 680, ptrY, p.date, 13, 400, '#64748BFF', cnt.id);
    await createBadge(`PStat_${p.id}`, 880, ptrY - 2, 'Paid', 'active', cnt.id);
    await createRect(`PDiv_${p.id}`, 32, ptrY + 28, 1124, 1, '#F8FAFCFF', null, 0, cnt.id);
    ptrY += 40;
  }

  console.log('=== BALANCES SCREEN COMPLETED SUCCESSFULLY ===');
}

buildBalances().catch(console.error);
