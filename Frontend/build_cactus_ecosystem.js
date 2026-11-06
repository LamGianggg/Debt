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
  createVisaLogo,
  createMoreDotsIcon,
  createCheckbox,
  createBadge
} from './cactus_helpers.js';

async function buildEcosystem() {
  console.log('=== STARTING EXTENDED CACTUS PRACTICE SCREENS ===');

  // ========================================================
  // FRAME 2: CUSTOMERS DIRECTORY SCREEN (x: 1520, y: 0, 1440 × 920)
  // ========================================================
  console.log('Creating Screen 2: Customers Directory (1440 × 920)...');
  const custScreen = await createFrame('Cactus Practice - Customers / All Customers', 1520, 0, 1440, 920, '#FFFFFFFF');

  // Sidebar (same structure)
  const sb2 = await createFrame('Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, custScreen.id);
  await createRect('SBBorder', 239, 0, 1, 920, '#F1F5F9FF', null, 0, sb2.id);
  await createCactusLogo(20, 22, sb2.id);
  await createText('WSName', 48, 23, 'Cactus Practice', 13, 600, '#0F172AFF', sb2.id);
  await createChevronDown(152, 28, '#64748BFF', sb2.id);

  let nY = 64;
  await createHomeIcon(20, nY + 4, '#64748BFF', sb2.id);
  await createText('N_Home', 48, nY + 3, 'Home', 13, 400, '#475569FF', sb2.id);
  nY += 34;

  await createPaymentsIcon(20, nY + 4, '#64748BFF', sb2.id);
  await createText('N_Payments', 48, nY + 3, 'Payments', 13, 400, '#475569FF', sb2.id);
  nY += 34;

  await createBalancesIcon(20, nY + 4, '#64748BFF', sb2.id);
  await createText('N_Balances', 48, nY + 3, 'Balances', 13, 400, '#475569FF', sb2.id);
  nY += 34;

  // Customers Active
  await createCustomersIcon(20, nY + 4, '#4F46E5FF', sb2.id);
  await createText('N_Customers', 48, nY + 3, 'Customers', 13, 600, '#4F46E5FF', sb2.id);
  nY += 30;

  await createText('N_Sub', 48, nY + 3, 'Subscriptions', 13, 400, '#64748BFF', sb2.id);
  nY += 26;
  await createText('N_Inv', 48, nY + 3, 'Invoices', 13, 400, '#64748BFF', sb2.id);
  nY += 34;

  await createConnectedIcon(20, nY + 4, '#64748BFF', sb2.id);
  await createText('N_Conn', 48, nY + 3, 'Connected accounts', 13, 400, '#475569FF', sb2.id);
  nY += 34;

  await createProductsIcon(20, nY + 4, '#64748BFF', sb2.id);
  await createText('N_Prod', 48, nY + 3, 'Products', 13, 400, '#475569FF', sb2.id);
  nY += 34;

  await createReportsIcon(20, nY + 4, '#64748BFF', sb2.id);
  await createText('N_Rep', 48, nY + 3, 'Reports', 13, 400, '#475569FF', sb2.id);

  // Bottom items
  await createDevelopersIcon(20, 784, '#64748BFF', sb2.id);
  await createText('N_Dev', 48, 783, 'Developers', 13, 400, '#475569FF', sb2.id);
  await createToggleSwitch(20, 818, false, sb2.id);
  await createText('N_Test', 52, 816, 'View test data', 13, 400, '#64748BFF', sb2.id);
  await createSettingsIcon(20, 852, '#64748BFF', sb2.id);
  await createText('N_Set', 48, 851, 'Settings', 13, 400, '#475569FF', sb2.id);

  // Topbar
  const tb2 = await createFrame('Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, custScreen.id);
  await createRect('TBBorder', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, tb2.id);
  await createSearchIcon(24, 20, '#94A3B8FF', tb2.id);
  await createText('SearchPh', 48, 19, 'Search...', 13, 400, '#94A3B8FF', tb2.id);
  await createMegaphoneIcon(960, 20, '#64748BFF', tb2.id);
  await createText('FBText', 982, 19, 'Feedback?', 13, 400, '#64748BFF', tb2.id);
  await createBellWithBadge(1070, 18, '2', tb2.id);
  await createHelpIcon(1104, 19, '#64748BFF', tb2.id);
  await createAvatarIcon(1132, 15, tb2.id);

  // Content Area
  const cnt2 = await createFrame('Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, custScreen.id);

  // Header row
  await createText('CustPageTitle', 32, 24, 'Customers', 26, 700, '#0F172AFF', cnt2.id);
  // Buttons
  const exportBtn = await createFrame('Btn_Export', 940, 24, 84, 34, '#FFFFFFFF', '#E2E8F0FF', 6, cnt2.id);
  await createText('ExpTxt', 22, 8, 'Export', 13, 500, '#334155FF', exportBtn.id);

  const addCustBtn = await createFrame('Btn_AddCust', 1034, 24, 124, 34, '#4F46E5FF', null, 6, cnt2.id);
  await createText('AddTxt', 16, 8, '+ Add customer', 13, 600, '#FFFFFFFF', addCustBtn.id);

  // Metrics summary
  const mY = 80;
  const metrics = [
    { label: 'All customers', val: '1,482' },
    { label: 'New this month', val: '+128' },
    { label: 'Active subscribers', val: '942' },
    { label: 'Net churn rate', val: '1.1%' },
  ];
  let mX = 32;
  for (const m of metrics) {
    await createText(`MLbl_${m.label}`, mX, mY, m.label, 12, 400, '#64748BFF', cnt2.id);
    await createText(`MVal_${m.label}`, mX, mY + 18, m.val, 16, 700, '#0F172AFF', cnt2.id);
    mX += 140;
  }

  // Filter toolbar
  const filterY = 144;
  const searchFilter = await createFrame('SearchInput', 32, filterY, 280, 32, '#FFFFFFFF', '#E2E8F0FF', 6, cnt2.id);
  await createSearchIcon(8, 8, '#94A3B8FF', searchFilter.id);
  await createText('SF_Text', 28, 7, 'Filter by email, name or ID...', 12, 400, '#94A3B8FF', searchFilter.id);

  const filterBtn = await createFrame('Btn_Filter', 322, filterY, 80, 32, '#FFFFFFFF', '#E2E8F0FF', 6, cnt2.id);
  await createText('FilTxt', 18, 7, 'Filter', 12, 500, '#334155FF', filterBtn.id);

  // Table header
  const thY = 196;
  await createCheckbox(36, thY + 2, false, cnt2.id);
  await createText('TH_Cust', 68, thY, 'CUSTOMER', 11, 600, '#64748BFF', cnt2.id);
  await createText('TH_Status', 360, thY, 'STATUS', 11, 600, '#64748BFF', cnt2.id);
  await createText('TH_Spent', 490, thY, 'TOTAL SPENT', 11, 600, '#64748BFF', cnt2.id);
  await createText('TH_MRR', 630, thY, 'MRR', 11, 600, '#64748BFF', cnt2.id);
  await createText('TH_Created', 760, thY, 'CREATED', 11, 600, '#64748BFF', cnt2.id);

  await createRect('TH_Div', 32, thY + 20, 1124, 1, '#E2E8F0FF', null, 0, cnt2.id);

  // Customers table rows
  const custRows = [
    { name: 'Jane Diaz', email: 'jane.diaz@example.com', status: 'Active', spent: '$635.93', mrr: '$9.99', created: 'Aug 14, 2020' },
    { name: 'Alexander Hamilton', email: 'alex.h@treasury.gov', status: 'Active', spent: '$1,240.00', mrr: '$29.00', created: 'Jul 22, 2020' },
    { name: 'Sophia Lee', email: 'sophia.lee@acme.co', status: 'Active', spent: '$4,190.50', mrr: '$99.00', created: 'May 04, 2020' },
    { name: 'Liam Nguyen', email: 'liam.nguyen@techflow.io', status: 'Active', spent: '$89.00', mrr: '$9.99', created: 'Sep 02, 2020' },
    { name: 'Emma Wilson', email: 'emma.wilson@cloudops.com', status: 'Active', spent: '$540.20', mrr: '$19.99', created: 'Sep 10, 2020' },
    { name: 'Marcus Brody', email: 'm.brody@museum.org', status: 'Active', spent: '$210.00', mrr: '$9.99', created: 'Sep 12, 2020' },
    { name: 'Clara Oswald', email: 'clara.o@tardis.net', status: 'Active', spent: '$950.00', mrr: '$49.00', created: 'Oct 01, 2020' }
  ];

  let trY = thY + 26;
  for (let i = 0; i < custRows.length; i++) {
    const row = custRows[i];
    await createCheckbox(36, trY + 8, false, cnt2.id);

    // Customer Name + Email
    await createText(`CName_${i}`, 68, trY + 2, row.name, 13, 600, '#0F172AFF', cnt2.id);
    await createText(`CEmail_${i}`, 68, trY + 20, row.email, 12, 400, '#64748BFF', cnt2.id);

    // Status
    await createBadge(`CStat_${i}`, 360, trY + 8, row.status, 'active', cnt2.id);

    // Spent
    await createText(`CSpent_${i}`, 490, trY + 8, row.spent, 13, 600, '#0F172AFF', cnt2.id);

    // MRR
    await createText(`CMRR_${i}`, 630, trY + 8, row.mrr, 13, 600, '#0F172AFF', cnt2.id);

    // Created
    await createText(`CCreated_${i}`, 760, trY + 8, row.created, 13, 400, '#64748BFF', cnt2.id);

    // Actions
    await createMoreDotsIcon(1120, trY + 8, '#64748BFF', cnt2.id);

    // Row divider
    await createRect(`CRowDiv_${i}`, 32, trY + 44, 1124, 1, '#F8FAFCFF', null, 0, cnt2.id);
    trY += 48;
  }

  // Pagination bar
  await createText('PagingInfo', 32, trY + 20, 'Showing 1 to 7 of 1,482 customers', 12, 400, '#64748BFF', cnt2.id);
  const prevBtn = await createFrame('Btn_Prev', 1030, trY + 16, 56, 28, '#FFFFFFFF', '#E2E8F0FF', 4, cnt2.id);
  await createText('PrevTxt', 12, 6, 'Previous', 11, 500, '#64748BFF', prevBtn.id);
  const nextBtn = await createFrame('Btn_Next', 1094, trY + 16, 56, 28, '#FFFFFFFF', '#E2E8F0FF', 4, cnt2.id);
  await createText('NextTxt', 16, 6, 'Next', 11, 500, '#334155FF', nextBtn.id);

  // ========================================================
  // FRAME 3: DESIGN SYSTEM & COMPONENT LIBRARY (x: 3040, y: 0, 560 × 920)
  // ========================================================
  console.log('Creating Screen 3: Design System & Components (560 × 920)...');
  const dsScreen = await createFrame('Cactus Practice - Design System & UI Components', 3040, 0, 560, 920, '#F8FAFCFF', '#E2E8F0FF', 8);

  await createText('DSTitle', 32, 28, 'Design System & UI Components', 20, 700, '#0F172AFF', dsScreen.id);
  await createText('DSSub', 32, 56, 'Reusable Stripe/Cactus Practice components and tokens', 13, 400, '#64748BFF', dsScreen.id);
  await createRect('DSDiv1', 32, 84, 496, 1, '#E2E8F0FF', null, 0, dsScreen.id);

  let dsY = 104;

  // 1. Buttons
  await createText('DS_BtnLabel', 32, dsY, '1. Buttons & Actions', 14, 600, '#0F172AFF', dsScreen.id);
  dsY += 24;
  const pBtn = await createFrame('Comp_Btn_Primary', 32, dsY, 110, 34, '#4F46E5FF', null, 6, dsScreen.id);
  await createText('PBText', 16, 8, 'Primary Button', 12, 600, '#FFFFFFFF', pBtn.id);

  const sBtn = await createFrame('Comp_Btn_Outline', 152, dsY, 110, 34, '#FFFFFFFF', '#E2E8F0FF', 6, dsScreen.id);
  await createText('SBText', 18, 8, 'Outline Button', 12, 500, '#334155FF', sBtn.id);

  await createText('Comp_Link', 280, dsY + 8, 'Action Link →', 13, 500, '#4F46E5FF', dsScreen.id);

  dsY += 56;
  // 2. Status Badges
  await createText('DS_BadgeLabel', 32, dsY, '2. Status Badges & Pills', 14, 600, '#0F172AFF', dsScreen.id);
  dsY += 24;
  await createBadge('Comp_Succ', 32, dsY, 'Succeeded', 'success', dsScreen.id);
  await createBadge('Comp_Act', 122, dsY, 'Active', 'active', dsScreen.id);
  await createBadge('Comp_Def', 186, dsY, 'Default', 'default', dsScreen.id);
  await createBadge('Comp_Neut', 250, dsY, 'Neutral', 'neutral', dsScreen.id);

  dsY += 56;
  // 3. Form Inputs & Controls
  await createText('DS_InputLabel', 32, dsY, '3. Inputs & Switches', 14, 600, '#0F172AFF', dsScreen.id);
  dsY += 24;
  const sampleInput = await createFrame('Comp_Input', 32, dsY, 200, 32, '#FFFFFFFF', '#E2E8F0FF', 6, dsScreen.id);
  await createText('InpPh', 10, 7, 'Text input placeholder...', 12, 400, '#94A3B8FF', sampleInput.id);

  await createToggleSwitch(252, dsY + 8, false, dsScreen.id);
  await createText('Lbl_SwOff', 284, dsY + 7, 'Off State', 12, 400, '#64748BFF', dsScreen.id);

  await createToggleSwitch(352, dsY + 8, true, dsScreen.id);
  await createText('Lbl_SwOn', 384, dsY + 7, 'On State', 12, 400, '#4F46E5FF', dsScreen.id);

  dsY += 56;
  // 4. Cards & Tables
  await createText('DS_CardLabel', 32, dsY, '4. Card & Table Row Preview', 14, 600, '#0F172AFF', dsScreen.id);
  dsY += 24;

  const cardSample = await createFrame('Comp_Card', 32, dsY, 496, 72, '#FFFFFFFF', '#E2E8F0FF', 8, dsScreen.id);
  await createVisaLogo(16, 16, cardSample.id);
  await createText('CSC_Title', 56, 16, 'Visa •••• 4242', 13, 600, '#0F172AFF', cardSample.id);
  await createBadge('CSC_Badge', 160, 16, 'Default', 'default', cardSample.id);
  await createText('CSC_Sub', 56, 38, 'Expires Apr 2022 • Added Aug 14, 2020', 12, 400, '#64748BFF', cardSample.id);

  dsY += 96;
  // 5. Brand Palette
  await createText('DS_ColorsLabel', 32, dsY, '5. Color Tokens', 14, 600, '#0F172AFF', dsScreen.id);
  dsY += 24;
  const colors = [
    { name: 'Indigo #4F46E5', color: '#4F46E5FF' },
    { name: 'Emerald #10B981', color: '#10B981FF' },
    { name: 'Slate #0F172A', color: '#0F172AFF' },
    { name: 'Muted #64748B', color: '#64748BFF' },
    { name: 'Light #F8FAFC', color: '#F8FAFCFF', border: '#E2E8F0FF' },
  ];
  let cX = 32;
  for (const c of colors) {
    await createFrame(`Col_${c.name}`, cX, dsY, 40, 40, c.color, c.border || null, 6, dsScreen.id);
    cX += 54;
  }

  console.log('=== EXTENDED SCREENS COMPLETED SUCCESSFULLY ===');
}

buildEcosystem().catch(console.error);
