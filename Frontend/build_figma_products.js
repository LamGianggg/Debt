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

async function buildProducts() {
  console.log('=== BUILDING PRODUCTS FIGMA SCREEN (x: 8200) ===');
  const prodScreen = await createFrame('Cactus Practice - Products / Pricing Catalog', 8200, 0, 1440, 920, '#FFFFFFFF');

  // Sidebar (Products Active)
  const sb = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, prodScreen.id);
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

  // Products Active!
  await createProductsIcon(20, nY + 4, '#4F46E5FF', sb.id);
  await createText('N_Prod', 48, nY + 3, 'Products', 13, 600, '#4F46E5FF', sb.id);
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
  const tb = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, prodScreen.id);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb.id);
  await createBellWithBadge(1070, 18, '2', tb.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb.id);
  await createAvatarIcon(1132, 15, tb.id);

  // Content
  const cnt = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, prodScreen.id);
  await createText('ProdTitle', 32, 24, 'Product Catalog and Pricing Plans', 26, 700, '#0F172AFF', cnt.id);
  await createText('ProdSub', 32, 58, 'Manage recurring tiers, telehealth consultations, and digital care packages.', 13, 400, '#64748BFF', cnt.id);

  const addProdBtn = await createFrame('Btn_AddProd', 1034, 24, 124, 34, '#4F46E5FF', null, 6, cnt.id);
  await createText('APText', 20, 8, '+ Add product', 13, 600, '#FFFFFFFF', addProdBtn.id);

  // 3 Product Tier Cards
  const pTiers = [
    { name: 'Premium Plan', price: '$9.99', int: '/ month', desc: "Jane Diaz's active tier. Comprehensive health membership with 24/7 care team access.", subs: '642 active subscribers' },
    { name: 'Pro Care Plan', price: '$29.00', int: '/ month', desc: 'Monthly lab analysis, telehealth follow-ups, and unlimited prescription renewals.', subs: '215 active subscribers' },
    { name: 'Enterprise Health Suite', price: '$99.00', int: '/ month', desc: 'Concierge medical partnerships, dedicated doctors, and rapid priority appointments.', subs: '85 corporate accounts' },
  ];
  let ptX = 32;
  for (const pt of pTiers) {
    const card = await createFrame(`PTCard_${pt.name}`, ptX, 100, 350, 240, '#FFFFFFFF', '#E2E8F0FF', 8, cnt.id);
    await createBadge(`PTBadge_${pt.name}`, 16, 16, 'Active', 'active', card.id);
    await createText('PTN', 16, 44, pt.name, 16, 700, '#0F172AFF', card.id);
    await createText('PTP', 16, 72, pt.price, 24, 700, '#0F172AFF', card.id);
    await createText('PTI', 96, 82, pt.int, 12, 400, '#64748BFF', card.id);
    await createText('PTD', 16, 114, pt.desc, 12, 400, '#64748BFF', card.id);
    await createRect('PTDiv', 16, 180, 318, 1, '#F1F5F9FF', null, 0, card.id);
    await createText('PTS', 16, 198, pt.subs, 12, 500, '#4F46E5FF', card.id);
    ptX += 374;
  }

  console.log('=== PRODUCTS SCREEN COMPLETED SUCCESSFULLY ===');
}

buildProducts().catch(console.error);
