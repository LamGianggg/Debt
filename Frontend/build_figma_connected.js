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

async function buildConnected() {
  console.log('=== BUILDING CONNECTED ACCOUNTS FIGMA SCREEN (x: 9720) ===');
  const connScreen = await createFrame('Cactus Practice - Connected accounts / Clinics', 9720, 0, 1440, 920, '#FFFFFFFF');

  // Sidebar (Connected Accounts Active)
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, connScreen.id);
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

  // Connected accounts Active!
  await createConnectedIcon(20, nY + 4, '#4F46E5FF', sb.id);
  await createText('N_Conn', 48, nY + 3, 'Connected accounts', 13, 600, '#4F46E5FF', sb.id);
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
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, connScreen.id);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb.id);
  await createBellWithBadge(1070, 18, '2', tb.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb.id);
  await createAvatarIcon(1132, 15, tb.id);

  // Content
  const cnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, connScreen.id);
  await createText('ConnTitle', 32, 24, 'Connected Accounts', 26, 700, '#0F172AFF', cnt.id);
  await createText('ConnSub', 32, 58, 'Manage healthcare clinics, platform partners, and doctors under Stripe Connect.', 13, 400, '#64748BFF', cnt.id);

  const addAccBtn = await createFrame('Btn_AddAcc', 1034, 24, 124, 34, '#4F46E5FF', null, 6, cnt.id);
  await createText('AAText', 16, 8, '+ Add account', 13, 600, '#FFFFFFFF', addAccBtn.id);

  // Table
  const cthY = 100;
  await createText('CTH_Name', 32, cthY, 'CLINIC / ACCOUNT NAME', 11, 600, '#64748BFF', cnt.id);
  await createText('CTH_ID', 300, cthY, 'ACCOUNT ID', 11, 600, '#64748BFF', cnt.id);
  await createText('CTH_Country', 480, cthY, 'COUNTRY', 11, 600, '#64748BFF', cnt.id);
  await createText('CTH_Status', 660, cthY, 'PAYOUTS STATUS', 11, 600, '#64748BFF', cnt.id);
  await createText('CTH_Vol', 840, cthY, 'VOLUME YTD', 11, 600, '#64748BFF', cnt.id);
  await createRect('CTH_Div', 32, cthY + 20, 1124, 1, '#E2E8F0FF', null, 0, cnt.id);

  const clinics = [
    { name: 'Bay Area Medical Clinic', id: 'acct_1N9a8822B', country: 'United States 🇺🇸', status: 'Enabled', vol: '$128,400.00' },
    { name: 'Downtown Pediatric Group', id: 'acct_1N8x1199P', country: 'United States 🇺🇸', status: 'Enabled', vol: '$84,120.00' },
    { name: 'Sunset Wellness Partners', id: 'acct_1N7y3344W', country: 'United States 🇺🇸', status: 'Restricted', vol: '$14,500.00' },
  ];
  let ctrY = cthY + 30;
  for (const c of clinics) {
    await createText(`CN_${c.id}`, 32, ctrY, c.name, 13, 600, '#0F172AFF', cnt.id);
    await createText(`CID_${c.id}`, 300, ctrY, c.id, 12, 400, '#64748BFF', cnt.id);
    await createText(`CC_${c.id}`, 480, ctrY, c.country, 13, 400, '#334155FF', cnt.id);
    await createBadge(`CS_${c.id}`, 660, ctrY - 2, c.status, c.status === 'Enabled' ? 'active' : 'default', cnt.id);
    await createText(`CV_${c.id}`, 840, ctrY, c.vol, 13, 600, '#0F172AFF', cnt.id);
    await createMoreDotsIcon(1120, ctrY, '#64748BFF', cnt.id);
    await createRect(`CDiv_${c.id}`, 32, ctrY + 28, 1124, 1, '#F8FAFCFF', null, 0, cnt.id);
    ctrY += 40;
  }

  console.log('=== CONNECTED ACCOUNTS SCREEN COMPLETED SUCCESSFULLY ===');
}

buildConnected().catch(console.error);
