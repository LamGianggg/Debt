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
  createSubscriptionPlanIcon,
  createVisaLogo,
  createPencilIcon,
  createCancelXIcon,
  createTrashIcon,
  createMoreDotsIcon,
  createCheckbox,
  createBadge
} from './cactus_helpers.js';

async function buildCactusDashboard() {
  console.log('=== STARTING CACTUS PRACTICE DASHBOARD RECREATION ===');

  // Step 1: Clean up previous canvas frames
  console.log('Step 1: Inspecting and clearing current canvas...');
  const pagesData = await callTool('get-pages', {});
  const page1 = typeof pagesData[0] === 'string' ? JSON.parse(pagesData[0]) : pagesData[0];
  if (page1 && page1.nodes && page1.nodes.length > 0) {
    for (const n of page1.nodes) {
      console.log(`Deleting previous node: ${n.name} (${n.id})`);
      await callTool('delete-node', { id: n.id });
    }
  }

  // Step 2: Create Main Dashboard Frame (1440 × 920)
  console.log('Step 2: Creating Main Desktop Frame (1440 × 920)...');
  const dashboard = await createFrame('Cactus Practice - Customers / Jane Diaz', 0, 0, 1440, 920, '#FFFFFFFF');

  // ==========================================
  // SECTION 1: SIDEBAR NAVIGATION (Width: 240)
  // ==========================================
  console.log('Step 3: Building Sidebar...');
  const sidebar = await createFrame('Dashboard / Sidebar', 0, 0, 240, 920, '#FFFFFFFF', null, 0, dashboard.id);
  // Sidebar right border separator
  await createRect('SidebarBorderRight', 239, 0, 1, 920, '#F1F5F9FF', null, 0, sidebar.id);

  // Logo & Workspace Switcher
  await createCactusLogo(20, 22, sidebar.id);
  await createText('WorkspaceName', 48, 23, 'Cactus Practice', 13, 600, '#0F172AFF', sidebar.id);
  await createChevronDown(152, 28, '#64748BFF', sidebar.id);

  // Main Nav Items
  let navY = 64;
  const navItems = [
    { name: 'Home', icon: createHomeIcon, active: false },
    { name: 'Payments', icon: createPaymentsIcon, active: false },
    { name: 'Balances', icon: createBalancesIcon, active: false },
    { name: 'Customers', icon: createCustomersIcon, active: true },
  ];

  for (const item of navItems) {
    if (item.active) {
      // Active item
      await item.icon(20, navY + 4, '#4F46E5FF', sidebar.id);
      await createText(`Nav_${item.name}`, 48, navY + 3, item.name, 13, 600, '#4F46E5FF', sidebar.id);
      navY += 30;

      // Sub-items indented under Customers
      await createText('Sub_Subscriptions', 48, navY + 3, 'Subscriptions', 13, 400, '#64748BFF', sidebar.id);
      navY += 26;
      await createText('Sub_Invoices', 48, navY + 3, 'Invoices', 13, 400, '#64748BFF', sidebar.id);
      navY += 34;
    } else {
      await item.icon(20, navY + 4, '#64748BFF', sidebar.id);
      await createText(`Nav_${item.name}`, 48, navY + 3, item.name, 13, 400, '#475569FF', sidebar.id);
      navY += 34;
    }
  }

  const secondaryNav = [
    { name: 'Connected accounts', icon: createConnectedIcon },
    { name: 'Products', icon: createProductsIcon },
    { name: 'Reports', icon: createReportsIcon },
  ];

  for (const item of secondaryNav) {
    await item.icon(20, navY + 4, '#64748BFF', sidebar.id);
    await createText(`Nav_${item.name}`, 48, navY + 3, item.name, 13, 400, '#475569FF', sidebar.id);
    navY += 34;
  }

  // Bottom Nav Items (fixed to bottom)
  const bottomY = 780;
  await createDevelopersIcon(20, bottomY + 4, '#64748BFF', sidebar.id);
  await createText('Nav_Developers', 48, bottomY + 3, 'Developers', 13, 400, '#475569FF', sidebar.id);

  // View test data toggle
  await createToggleSwitch(20, bottomY + 36, false, sidebar.id);
  await createText('Nav_Test_Data', 52, bottomY + 35, 'View test data', 13, 400, '#64748BFF', sidebar.id);

  // Settings
  await createSettingsIcon(20, bottomY + 68, '#64748BFF', sidebar.id);
  await createText('Nav_Settings', 48, bottomY + 67, 'Settings', 13, 400, '#475569FF', sidebar.id);

  // ==========================================
  // SECTION 2: TOP HEADER BAR (x: 240..1440, h: 56)
  // ==========================================
  console.log('Step 4: Building Top Navigation Bar...');
  const topbar = await createFrame('Dashboard / Topbar', 240, 0, 1200, 56, '#FFFFFFFF', null, 0, dashboard.id);
  await createRect('TopbarBorderBottom', 0, 55, 1200, 1, '#F1F5F9FF', null, 0, topbar.id);

  // Search input
  await createSearchIcon(24, 20, '#94A3B8FF', topbar.id);
  await createText('SearchPlaceholder', 48, 19, 'Search...', 13, 400, '#94A3B8FF', topbar.id);

  // Right action controls
  const rightX = 960;
  await createMegaphoneIcon(rightX, 20, '#64748BFF', topbar.id);
  await createText('FeedbackLink', rightX + 22, 19, 'Feedback?', 13, 400, '#64748BFF', topbar.id);

  await createBellWithBadge(rightX + 110, 18, '2', topbar.id);
  await createHelpIcon(rightX + 144, 19, '#64748BFF', topbar.id);
  await createAvatarIcon(rightX + 172, 15, topbar.id);

  // ==========================================
  // SECTION 3: MAIN CONTENT (Customer Jane Diaz)
  // ==========================================
  console.log('Step 5: Building Customer Details Content...');
  const mainContent = await createFrame('Dashboard / Content', 240, 56, 1200, 864, '#FFFFFFFF', null, 0, dashboard.id);

  // Customer Name & Email
  await createText('CustomerName', 32, 24, 'Jane Diaz', 26, 700, '#0F172AFF', mainContent.id);
  await createText('CustomerEmail', 32, 58, 'jane.diaz@example.com', 13, 400, '#64748BFF', mainContent.id);

  // Actions Dropdown Button (top right)
  const actionsBtn = await createFrame('Btn_Actions', 1060, 24, 96, 34, '#4F46E5FF', null, 6, mainContent.id);
  await createText('ActionsText', 18, 8, 'Actions', 13, 600, '#FFFFFFFF', actionsBtn.id);
  await createChevronDown(72, 15, '#FFFFFFFF', actionsBtn.id);

  // Tabs: Overview & Events and logs
  const tabY = 96;
  await createText('Tab_Overview', 32, tabY, 'Overview', 13, 600, '#4F46E5FF', mainContent.id);
  // Active indicator line
  await createRect('TabActiveLine', 32, tabY + 24, 58, 2, '#4F46E5FF', null, 1, mainContent.id);

  await createText('Tab_Events', 114, tabY, 'Events and logs', 13, 400, '#64748BFF', mainContent.id);
  // Full-width divider line
  await createRect('TabsDivider', 32, tabY + 25, 1124, 1, '#E2E8F0FF', null, 0, mainContent.id);

  // Summary Metrics Row
  const statsY = 144;
  // 1. Spent
  await createText('Lbl_Spent', 32, statsY, 'Spent', 12, 400, '#64748BFF', mainContent.id);
  await createText('Val_Spent', 32, statsY + 18, '$635.93', 15, 600, '#0F172AFF', mainContent.id);

  // 2. Since
  await createText('Lbl_Since', 120, statsY, 'Since', 12, 400, '#64748BFF', mainContent.id);
  await createText('Val_Since', 120, statsY + 18, 'Aug 2020', 15, 600, '#0F172AFF', mainContent.id);

  // 3. MRR
  await createText('Lbl_MRR', 210, statsY, 'MRR', 12, 400, '#64748BFF', mainContent.id);
  await createChevronDown(240, statsY + 4, '#64748BFF', mainContent.id);
  await createText('Val_MRR', 210, statsY + 18, '$9.99', 15, 600, '#0F172AFF', mainContent.id);

  // ==========================================
  // TWO-COLUMN LAYOUT
  // ==========================================
  const bodyY = 210;

  // --- LEFT COLUMN: DETAILS & METADATA ---
  console.log('Step 6: Building Left Details Column...');
  const leftCol = await createFrame('Col_Left_Details', 32, bodyY, 260, 600, null, null, 0, mainContent.id);

  // Header Details
  await createText('TriangleDown', 0, 3, '▾', 10, 600, '#0F172AFF', leftCol.id);
  await createText('Title_Details', 12, 0, 'Details', 14, 600, '#0F172AFF', leftCol.id);
  await createText('Link_Edit', 224, 0, 'Edit', 13, 500, '#4F46E5FF', leftCol.id);

  // Customer ID pill
  const idPill = await createFrame('Pill_CustID', 0, 28, 140, 24, '#F8FAFCFF', '#E2E8F0FF', 4, leftCol.id);
  await createText('CustIDText', 8, 4, 'cus_Hwy555rNEuVeTp', 10, 400, '#475569FF', idPill.id);

  // Account details group
  await createText('Lbl_AccDetails', 0, 68, 'Account details', 12, 400, '#64748BFF', leftCol.id);
  await createText('Val_AccName', 0, 88, 'Jane Diaz', 13, 400, '#0F172AFF', leftCol.id);
  await createText('Val_AccEmail', 0, 108, 'jane.diaz@example.com', 13, 400, '#64748BFF', leftCol.id);

  // Billing emails group
  await createText('Lbl_BillingEmails', 0, 140, 'Billing emails', 12, 400, '#64748BFF', leftCol.id);
  await createText('Val_BillingEmail', 0, 160, 'jane.diaz@example.com', 13, 400, '#64748BFF', leftCol.id);

  // Show more link
  await createText('Link_ShowMore', 0, 196, 'Show more', 13, 500, '#4F46E5FF', leftCol.id);

  // Metadata accordion
  await createText('TriangleRight', 0, 245, '▸', 10, 600, '#0F172AFF', leftCol.id);
  await createText('Title_Metadata', 12, 242, 'Metadata', 14, 600, '#0F172AFF', leftCol.id);

  // --- RIGHT COLUMN: SECTIONS ---
  console.log('Step 7: Building Right Sections Column...');
  const rightCol = await createFrame('Col_Right_Sections', 312, bodyY, 844, 640, null, null, 0, mainContent.id);

  let secY = 0;

  // --- 1. Subscriptions Section ---
  await createText('Sec_Subscriptions', 0, secY, 'Subscriptions', 15, 600, '#0F172AFF', rightCol.id);
  await createText('Link_CreateSub', 804, secY, 'Create', 13, 500, '#4F46E5FF', rightCol.id);

  // Plan item row
  const planItemY = secY + 28;
  await createSubscriptionPlanIcon(0, planItemY, rightCol.id);
  await createText('PlanName', 36, planItemY, 'Premium Plan', 13, 600, '#0F172AFF', rightCol.id);
  await createBadge('PlanActive', 134, planItemY, 'Active', 'active', rightCol.id);
  await createText('PlanSub', 36, planItemY + 20, 'Billing monthly • Next invoice on Oct 14 for $9.99', 12, 400, '#64748BFF', rightCol.id);

  // Action icons container (pencil, close, more)
  const actGroup1 = await createFrame('ActGroup_Sub', 752, planItemY + 2, 88, 24, '#FFFFFFFF', '#E2E8F0FF', 4, rightCol.id);
  await createPencilIcon(6, 4, '#64748BFF', actGroup1.id);
  await createRect('DivAct1', 28, 0, 1, 24, '#E2E8F0FF', null, 0, actGroup1.id);
  await createCancelXIcon(34, 4, '#64748BFF', actGroup1.id);
  await createRect('DivAct2', 58, 0, 1, 24, '#E2E8F0FF', null, 0, actGroup1.id);
  await createMoreDotsIcon(64, 4, '#64748BFF', actGroup1.id);

  // Divider
  await createRect('Div_Sub', 0, planItemY + 54, 844, 1, '#F1F5F9FF', null, 0, rightCol.id);

  // --- 2. Payments Section ---
  secY = planItemY + 70;
  await createText('Sec_Payments', 0, secY, 'Payments', 15, 600, '#0F172AFF', rightCol.id);
  await createText('Link_ViewAllPay', 748, secY, 'View all', 13, 500, '#4F46E5FF', rightCol.id);
  await createText('Link_CreatePay', 804, secY, 'Create', 13, 500, '#4F46E5FF', rightCol.id);

  // Table Header
  const thY = secY + 26;
  await createCheckbox(4, thY + 2, false, rightCol.id);
  await createText('TH_Amount', 32, thY, 'AMOUNT', 11, 600, '#64748BFF', rightCol.id);
  await createText('TH_Desc', 220, thY, 'DESCRIPTION', 11, 600, '#64748BFF', rightCol.id);
  await createText('TH_Date', 420, thY, 'DATE', 11, 600, '#64748BFF', rightCol.id);

  await createRect('Div_TH', 0, thY + 20, 844, 1, '#E2E8F0FF', null, 0, rightCol.id);

  // 5 Payment rows
  const paymentRows = [
    { amount: '$9.93', cur: 'USD', status: 'Succeeded', desc: 'Subscription update', date: 'Sep 14, 11:14 PM' },
    { amount: '$2.00', cur: 'USD', status: 'Succeeded', desc: 'Subscription update', date: 'Sep 14, 1:06 AM' },
    { amount: '$2.00', cur: 'USD', status: 'Succeeded', desc: 'Subscription update', date: 'Sep 13, 1:05 AM' },
    { amount: '$2.00', cur: 'USD', status: 'Succeeded', desc: 'Subscription update', date: 'Sep 12, 1:03 AM' },
    { amount: '$2.00', cur: 'USD', status: 'Succeeded', desc: 'Subscription update', date: 'Sep 11, 1:03 AM' },
  ];

  let trY = thY + 26;
  for (let i = 0; i < paymentRows.length; i++) {
    const row = paymentRows[i];
    await createCheckbox(4, trY + 2, false, rightCol.id);
    await createText(`RowAmt_${i}`, 32, trY, row.amount, 13, 600, '#0F172AFF', rightCol.id);
    await createText(`RowCur_${i}`, 78, trY, row.cur, 11, 400, '#64748BFF', rightCol.id);
    await createBadge(`PayStatus_${i}`, 114, trY, row.status, 'success', rightCol.id);

    await createText(`RowDesc_${i}`, 220, trY, row.desc, 13, 400, '#334155FF', rightCol.id);
    await createText(`RowDate_${i}`, 420, trY, row.date, 13, 400, '#64748BFF', rightCol.id);
    await createMoreDotsIcon(820, trY, '#64748BFF', rightCol.id);

    trY += 28;
  }

  // Divider
  await createRect('Div_Payments', 0, trY + 6, 844, 1, '#F1F5F9FF', null, 0, rightCol.id);

  // --- 3. Payment Methods Section ---
  secY = trY + 22;
  await createText('Sec_PaymentMethods', 0, secY, 'Payment methods', 15, 600, '#0F172AFF', rightCol.id);
  await createText('Link_AddPayMethod', 818, secY, 'Add', 13, 500, '#4F46E5FF', rightCol.id);

  const pmY = secY + 28;
  await createText('PM_Arrow', 2, pmY + 4, '▸', 10, 600, '#64748BFF', rightCol.id);
  await createVisaLogo(18, pmY, rightCol.id);
  await createText('PM_Title', 58, pmY, 'Visa •••• 4242', 13, 600, '#0F172AFF', rightCol.id);
  await createBadge('PM_Default', 168, pmY, 'Default', 'default', rightCol.id);
  await createText('PM_Expiry', 58, pmY + 20, 'Expires Apr 2022', 12, 400, '#64748BFF', rightCol.id);

  // Action icons container (pencil, trash, more)
  const actGroup2 = await createFrame('ActGroup_PM', 752, pmY + 2, 88, 24, '#FFFFFFFF', '#E2E8F0FF', 4, rightCol.id);
  await createPencilIcon(6, 4, '#64748BFF', actGroup2.id);
  await createRect('DivPM1', 28, 0, 1, 24, '#E2E8F0FF', null, 0, actGroup2.id);
  await createTrashIcon(34, 4, '#64748BFF', actGroup2.id);
  await createRect('DivPM2', 58, 0, 1, 24, '#E2E8F0FF', null, 0, actGroup2.id);
  await createMoreDotsIcon(64, 4, '#64748BFF', actGroup2.id);

  // Divider
  await createRect('Div_PM', 0, pmY + 48, 844, 1, '#F1F5F9FF', null, 0, rightCol.id);

  // --- 4. Credit Balance Section ---
  secY = pmY + 62;
  await createText('Sec_CreditBalance', 0, secY, 'Credit balance', 15, 600, '#0F172AFF', rightCol.id);
  await createText('Link_AdjustBalance', 752, secY, 'Adjust balance', 13, 500, '#4F46E5FF', rightCol.id);

  await createText('Val_CreditBalance', 0, secY + 26, '$0.00 USD', 14, 600, '#0F172AFF', rightCol.id);

  // Divider
  await createRect('Div_CB', 0, secY + 54, 844, 1, '#F1F5F9FF', null, 0, rightCol.id);

  // --- 5. Invoices Section ---
  secY = secY + 68;
  await createText('Sec_Invoices', 0, secY, 'Invoices', 15, 600, '#0F172AFF', rightCol.id);
  await createText('Link_ViewAllInv', 748, secY, 'View all', 13, 500, '#4F46E5FF', rightCol.id);
  await createText('Link_CreateInv', 804, secY, 'Create', 13, 500, '#4F46E5FF', rightCol.id);

  console.log('=== MAIN CACTUS DASHBOARD COMPLETED SUCCESSFULLY ===');
}

buildCactusDashboard().catch(console.error);
