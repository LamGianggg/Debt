import {
  callTool,
  createFrame,
  createRect,
  createText,
  createRocketLogo,
  createChevronDown,
  createHomeIcon,
  createPaymentsIcon,
  createCustomersIcon,
  createProductsIcon,
  createReportsIcon,
  createAccountsIcon,
  createAppsIcon,
  createDevelopersIcon,
  createToggleSwitch,
  createCameraFloatingIcon,
  createSearchIcon,
  createBellIcon,
  createHelpIcon,
  createUserProfileIcon,
  createFunnelIcon,
  createPlusIcon,
  createExportIcon,
  createSortIcon,
  createBelgiumFlag,
  createThailandFlag,
  createAustriaFlag,
  createMalaysiaFlag,
  createUSFlag,
  createCanadaFlag,
  createSouthAfricaFlag,
  createStatusBadge
} from './figma_helpers.js';

async function buildDashboard() {
  console.log('=== STARTING ROCKET RIDES ADMIN DASHBOARD RECREATION ===');

  // Step 1: Clean up existing nodes if any
  console.log('Step 1: Inspecting and clearing current canvas...');
  const pagesData = await callTool('get-pages', {});
  const page1 = typeof pagesData[0] === 'string' ? JSON.parse(pagesData[0]) : pagesData[0];
  if (page1 && page1.nodes && page1.nodes.length > 0) {
    for (const n of page1.nodes) {
      console.log(`Deleting previous node: ${n.name} (${n.id})`);
      await callTool('delete-node', { id: n.id });
    }
  }

  // Step 2: Create Main Dashboard Frame (1440 × 900)
  console.log('Step 2: Creating Main Desktop Frame (1440 × 900)...');
  const dashboard = await createFrame('Rocket Rides - Admin Dashboard', 0, 0, 1440, 900, '#FFFFFFFF');

  // ==========================================
  // SECTION 1: SIDEBAR (Dashboard / Sidebar)
  // ==========================================
  console.log('Step 3: Building Dashboard / Sidebar...');
  const sidebar = await createFrame('Dashboard / Sidebar', 0, 0, 240, 900, '#F4F6FAFF', null, 0, dashboard.id);
  // Sidebar right border separator
  await createRect('SidebarBorderRight', 239, 0, 1, 900, '#E6EAF0FF', null, 0, sidebar.id);

  // Brand Header
  const brandGroup = await createFrame('BrandHeader', 16, 16, 208, 36, null, null, 0, sidebar.id);
  await createRocketLogo(0, 7, brandGroup.id);
  await createText('BrandTitle', 28, 10, 'ROCKET RIDES', 13, 700, '#1A1F36FF', brandGroup.id);
  await createChevronDown(132, 14, '#697386FF', brandGroup.id);

  // Navigation Items
  const navItems = [
    { name: 'Home', icon: createHomeIcon, active: false },
    { name: 'Payments', icon: createPaymentsIcon, active: false },
    { name: 'Customers', icon: createCustomersIcon, active: false },
    { name: 'Products', icon: createProductsIcon, active: false },
    { name: 'Reports', icon: createReportsIcon, active: false },
    { name: 'Accounts', icon: createAccountsIcon, active: true },
    { name: 'Apps', icon: createAppsIcon, active: false }
  ];

  let currentNavY = 64;
  for (const item of navItems) {
    const itemFrame = await createFrame(
      `NavItem_${item.name}`,
      12,
      currentNavY,
      216,
      32,
      item.active ? '#EBF2FEFF' : null,
      null,
      6,
      sidebar.id
    );

    // Icon
    if (item.active) {
      await createAccountsIcon(12, 8, itemFrame.id);
    } else {
      await item.icon(12, 8, '#4F566BFF', itemFrame.id);
    }

    // Label
    await createText(
      `Label_${item.name}`,
      36,
      8,
      item.name,
      13,
      item.active ? 600 : 500,
      item.active ? '#3B82F6FF' : '#4F566BFF',
      itemFrame.id
    );

    currentNavY += 34;
  }

  // Subtle Nav Divider
  currentNavY += 8;
  await createRect('NavDivider', 16, currentNavY, 208, 1, '#E6EAF0FF', null, 0, sidebar.id);
  currentNavY += 16;

  // Secondary Nav: Developers
  const devFrame = await createFrame('NavItem_Developers', 12, currentNavY, 216, 32, null, null, 6, sidebar.id);
  await createDevelopersIcon(12, 8, '#4F566BFF', devFrame.id);
  await createText('Label_Developers', 36, 8, 'Developers', 13, 500, '#4F566BFF', devFrame.id);
  currentNavY += 34;

  // Secondary Nav: Viewing test data
  const testDataFrame = await createFrame('NavItem_ViewingTestData', 12, currentNavY, 216, 32, null, null, 6, sidebar.id);
  await createToggleSwitch(12, 9, testDataFrame.id);
  await createText('Label_ViewingTestData', 44, 8, 'Viewing test data', 13, 500, '#4F566BFF', testDataFrame.id);

  // Circular Floating Action Camera Button near bottom (from reference screenshot)
  await createCameraFloatingIcon(28, 680, sidebar.id);

  // ==========================================
  // SECTION 2: TOP HEADER (Dashboard / Header)
  // ==========================================
  console.log('Step 4: Building Dashboard / Header...');
  const header = await createFrame('Dashboard / Header', 240, 0, 1200, 54, '#FFFFFFFF', null, 0, dashboard.id);
  await createRect('HeaderBottomBorder', 0, 53, 1200, 1, '#E6EAF0FF', null, 0, header.id);

  // Search input box
  const searchBox = await createFrame('SearchBar', 28, 11, 400, 32, '#FFFFFFFF', '#E6EAF0FF', 6, header.id);
  await createSearchIcon(10, 8, '#8792A2FF', searchBox.id);
  await createText('SearchPlaceholder', 32, 7, 'Search', 13, 400, '#8792A2FF', searchBox.id);

  // Right Utility Icons
  const utilitiesGroup = await createFrame('HeaderUtilities', 1060, 11, 116, 32, null, null, 0, header.id);
  // Notification Bell (Blue)
  await createBellIcon(10, 8, '#3B82F6FF', utilitiesGroup.id);
  // Help icon (?)
  await createHelpIcon(48, 8, '#4F566BFF', utilitiesGroup.id);
  // Profile silhouette
  await createUserProfileIcon(86, 7, '#4F566BFF', utilitiesGroup.id);

  // ==========================================
  // SECTION 3: STATUS TABS (Dashboard / Status Tabs)
  // ==========================================
  console.log('Step 5: Building Dashboard / Status Tabs...');
  const statusTabs = await createFrame('Dashboard / Status Tabs', 240, 54, 1200, 44, '#FFFFFFFF', null, 0, dashboard.id);
  await createRect('TabsBottomBorder', 0, 43, 1200, 1, '#E6EAF0FF', null, 0, statusTabs.id);

  const tabsConfig = [
    { label: 'All accounts', count: '102', active: true, width: 140 },
    { label: 'Restricted', count: '32', active: false, width: 130 },
    { label: 'Restricted soon', count: '6', active: false, width: 150 },
    { label: 'Pending', count: '4', active: false, width: 120 },
    { label: 'Enabled', count: '11', active: false, width: 120 }
  ];

  let tabX = 28;
  for (const tab of tabsConfig) {
    const tabFrame = await createFrame(`Tab_${tab.label.replace(/\s+/g, '')}`, tabX, 0, tab.width, 44, null, null, 0, statusTabs.id);
    
    // Label and Count
    await createText(
      'TabLabel',
      12,
      13,
      tab.label,
      13,
      tab.active ? 600 : 500,
      tab.active ? '#3B82F6FF' : '#4F566BFF',
      tabFrame.id
    );

    // Compute offset for count
    const labelWidth = tab.label.length * 7.5;
    await createText(
      'TabCount',
      16 + labelWidth,
      13,
      tab.count,
      12,
      400,
      tab.active ? '#60A5FAFF' : '#8792A2FF',
      tabFrame.id
    );

    // Active bottom underline indicator
    if (tab.active) {
      await createRect('ActiveIndicator', 10, 42, tab.width - 20, 2, '#3B82F6FF', null, 1, tabFrame.id);
    }

    tabX += tab.width + 12;
  }

  // ==========================================
  // SECTION 4: TOOLBAR (Dashboard / Toolbar)
  // ==========================================
  console.log('Step 6: Building Dashboard / Toolbar...');
  const toolbar = await createFrame('Dashboard / Toolbar', 240, 98, 1200, 48, '#FFFFFFFF', null, 0, dashboard.id);

  // Filter Button (Left)
  const filterBtn = await createFrame('Button_Filter', 28, 10, 76, 28, '#FFFFFFFF', '#E6EAF0FF', 4, toolbar.id);
  await createFunnelIcon(10, 8, '#4F566BFF', filterBtn.id);
  await createText('FilterText', 26, 6, 'Filter', 12, 500, '#4F566BFF', filterBtn.id);

  // Right Actions: + New and Export
  const rightActions = await createFrame('ToolbarRightActions', 1030, 10, 146, 28, null, null, 0, toolbar.id);
  
  // + New Action
  const newBtn = await createFrame('Action_New', 0, 2, 64, 24, null, null, 4, rightActions.id);
  await createPlusIcon(6, 6, '#4F566BFF', newBtn.id);
  await createText('NewText', 22, 4, 'New', 12, 500, '#4F566BFF', newBtn.id);

  // Export Action
  const exportBtn = await createFrame('Action_Export', 72, 2, 74, 24, null, null, 4, rightActions.id);
  await createExportIcon(6, 6, '#4F566BFF', exportBtn.id);
  await createText('ExportText', 22, 4, 'Export', 12, 500, '#4F566BFF', exportBtn.id);

  // ==========================================
  // SECTION 5: ACCOUNTS DATA TABLE (Dashboard / Accounts Table)
  // ==========================================
  console.log('Step 7: Building Dashboard / Accounts Table...');
  const table = await createFrame('Dashboard / Accounts Table', 240, 146, 1200, 754, '#FFFFFFFF', null, 0, dashboard.id);

  // Column X offsets
  const colX = {
    account: 28,     // width ~180
    status: 220,     // width ~160
    balance: 440,    // right aligned value ~530
    volume: 580,     // right aligned value ~680
    type: 720,       // width ~100
    connected: 830   // width ~160
  };

  // Table Header Row
  const tableHeader = await createFrame('TableHeader', 0, 0, 1200, 36, '#FFFFFFFF', null, 0, table.id);
  await createRect('HeaderBorder', 28, 35, 1144, 1, '#E6EAF0FF', null, 0, tableHeader.id);

  // Header column: ACCOUNT ⇅
  await createText('H_ACCOUNT', colX.account, 10, 'ACCOUNT', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.account + 62, 11, '#7B8794FF', tableHeader.id);

  // Header column: STATUS ⇅
  await createText('H_STATUS', colX.status, 10, 'STATUS', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.status + 50, 11, '#7B8794FF', tableHeader.id);

  // Header column: BALANCE
  await createText('H_BALANCE', colX.balance + 35, 10, 'BALANCE', 11, 600, '#7B8794FF', tableHeader.id);

  // Header column: VOLUME
  await createText('H_VOLUME', colX.volume + 40, 10, 'VOLUME', 11, 600, '#7B8794FF', tableHeader.id);

  // Header column: TYPE ⇅
  await createText('H_TYPE', colX.type, 10, 'TYPE', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.type + 34, 11, '#7B8794FF', tableHeader.id);

  // Header column: CONNECTED ⇅
  await createText('H_CONNECTED', colX.connected, 10, 'CONNECTED', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.connected + 74, 11, '#7B8794FF', tableHeader.id);

  // 11 Rows of Realistic SaaS data matching reference screenshot
  const tableRows = [
    {
      account: 'Cheri Sherman',
      status: 'Enabled',
      balance: '$802.12',
      volume: '$802.12',
      type: 'Express',
      flag: createBelgiumFlag,
      date: 'Apr 4'
    },
    {
      account: 'Tatiana Campbell',
      status: 'Pending',
      balance: '$502.24',
      volume: '$23,283.42',
      type: 'Express',
      flag: createThailandFlag,
      date: 'Mar 2'
    },
    {
      account: 'Katie Ortega',
      status: 'Restricted',
      balance: '$482.46',
      volume: '$9,283.11',
      type: 'Express',
      flag: createAustriaFlag,
      date: 'May 4'
    },
    {
      account: 'Tanya Hagen',
      status: 'Complete',
      balance: '$401.11',
      volume: '$11,283.11',
      type: 'Express',
      flag: createMalaysiaFlag,
      date: 'Jan 29'
    },
    {
      account: 'Krithika Mani',
      status: 'Complete',
      balance: '$350.12',
      volume: '$10,283.98',
      type: 'Express',
      flag: createThailandFlag,
      date: 'May 21'
    },
    {
      account: 'Mark Wang',
      status: 'Complete',
      balance: '$308.41',
      volume: '$2,382.00',
      type: 'Express',
      flag: createUSFlag,
      date: 'May 21'
    },
    {
      account: 'Peter Thand',
      status: 'Complete',
      balance: '$128.42',
      volume: '$1,248.24',
      type: 'Express',
      flag: createSouthAfricaFlag,
      date: 'May 21'
    },
    {
      account: 'Fran Roberts',
      status: 'Pending',
      balance: '$126.49',
      volume: '$812.12',
      type: 'Express',
      flag: createMalaysiaFlag,
      date: 'Apr 15'
    },
    {
      account: 'Kate Johnson',
      status: 'Complete',
      balance: '$102.83',
      volume: '$6,382.03',
      type: 'Express',
      flag: createCanadaFlag,
      date: 'May 16'
    },
    {
      account: 'Matt Youngren',
      status: 'Restricted soon',
      balance: '$84.83',
      volume: '$400.12',
      type: 'Express',
      flag: createBelgiumFlag,
      date: 'Aug 14'
    },
    {
      account: 'Belen Santos',
      status: 'Complete',
      balance: '$70.00',
      volume: '$382.14',
      type: 'Express',
      flag: createUSFlag,
      date: 'Nov 14'
    }
  ];

  let rowY = 36;
  const rowHeight = 42;

  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i];
    const rowFrame = await createFrame(`TableRow_${i + 1}`, 0, rowY, 1200, rowHeight, '#FFFFFFFF', null, 0, table.id);

    // Light horizontal separator line
    await createRect('RowSeparator', 28, rowHeight - 1, 1144, 1, '#F0F2F5FF', null, 0, rowFrame.id);

    // 1. Account Name
    await createText('Col_Account', colX.account, 12, row.account, 12, 500, '#263238FF', rowFrame.id);

    // 2. Status Badge
    await createStatusBadge('Col_Status', colX.status, 11, row.status, rowFrame.id);

    // 3. Balance (Right-aligned)
    await createText('Col_Balance', colX.balance + 45, 12, row.balance, 12, 400, '#263238FF', rowFrame.id);

    // 4. Volume (Right-aligned)
    await createText('Col_Volume', colX.volume + 35, 12, row.volume, 12, 400, '#7B8794FF', rowFrame.id);

    // 5. Type
    await createText('Col_Type', colX.type, 12, row.type, 12, 400, '#7B8794FF', rowFrame.id);

    // 6. Connected (Flag + Date)
    const connectedGroup = await createFrame('Col_Connected', colX.connected, 12, 140, 20, null, null, 0, rowFrame.id);
    await row.flag(0, 3, connectedGroup.id);
    await createText('ConnectedDate', 24, 1, row.date, 12, 400, '#7B8794FF', connectedGroup.id);

    rowY += rowHeight;
  }

  // ==========================================
  // SECTION 6: DESIGN SYSTEM / COMPONENT LIBRARY
  // ==========================================
  console.log('Step 8: Building Design System & Reusable Components frame...');
  const compLib = await createFrame('Design System / Components', 1480, 0, 520, 900, '#F8FAFCFF', '#E2E8F0FF', 8);

  await createText('CompLibTitle', 24, 24, 'Reusable Components Library', 18, 700, '#0F172AFF', compLib.id);
  await createText('CompLibSub', 24, 48, 'Design tokens & master components used across Rocket Rides Dashboard', 12, 400, '#64748BFF', compLib.id);

  let compY = 88;

  // 1. Component: Sidebar Navigation Item
  await createText('C1_Label', 24, compY, '1. Sidebar Navigation Item', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compNavItem = await callTool('create-component', { name: 'Component / Sidebar Nav Item', parentId: compLib.id });
  await callTool('set-fill-color', { id: compNavItem.id, color: '#EBF2FEFF' });
  await callTool('set-corner-radius', { id: compNavItem.id, cornerRadius: 6 });
  await callTool('resize-node', { id: compNavItem.id, width: 200, height: 32 });
  await callTool('move-node', { id: compNavItem.id, x: 24, y: compY });
  await createAccountsIcon(12, 8, compNavItem.id);
  await createText('NavItemText', 36, 8, 'Active Nav Item', 13, 600, '#3B82F6FF', compNavItem.id);
  compY += 48;

  // 2. Component: Search Input
  await createText('C2_Label', 24, compY, '2. Search Input', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compSearch = await callTool('create-component', { name: 'Component / Search Input', parentId: compLib.id });
  await callTool('set-fill-color', { id: compSearch.id, color: '#FFFFFFFF' });
  await callTool('set-stroke-color', { id: compSearch.id, color: '#E6EAF0FF' });
  await callTool('set-corner-radius', { id: compSearch.id, cornerRadius: 6 });
  await callTool('resize-node', { id: compSearch.id, width: 240, height: 32 });
  await callTool('move-node', { id: compSearch.id, x: 24, y: compY });
  await createSearchIcon(10, 8, '#8792A2FF', compSearch.id);
  await createText('SearchInputText', 32, 7, 'Search', 13, 400, '#8792A2FF', compSearch.id);
  compY += 48;

  // 3. Component: Status Tab
  await createText('C3_Label', 24, compY, '3. Status Tab', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compTab = await callTool('create-component', { name: 'Component / Status Tab', parentId: compLib.id });
  await callTool('resize-node', { id: compTab.id, width: 140, height: 40 });
  await callTool('move-node', { id: compTab.id, x: 24, y: compY });
  await createText('TabCompLabel', 8, 10, 'All accounts', 13, 600, '#3B82F6FF', compTab.id);
  await createText('TabCompCount', 96, 10, '102', 12, 500, '#60A5FAFF', compTab.id);
  await createRect('TabUnderline', 6, 38, 128, 2, '#3B82F6FF', null, 1, compTab.id);
  compY += 56;

  // 4. Component: Toolbar Action Button
  await createText('C4_Label', 24, compY, '4. Toolbar Action (Filter / Export / New)', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compToolbarAction = await callTool('create-component', { name: 'Component / Toolbar Action', parentId: compLib.id });
  await callTool('set-fill-color', { id: compToolbarAction.id, color: '#FFFFFFFF' });
  await callTool('set-stroke-color', { id: compToolbarAction.id, color: '#E6EAF0FF' });
  await callTool('set-corner-radius', { id: compToolbarAction.id, cornerRadius: 4 });
  await callTool('resize-node', { id: compToolbarAction.id, width: 84, height: 28 });
  await callTool('move-node', { id: compToolbarAction.id, x: 24, y: compY });
  await createFunnelIcon(10, 8, '#4F566BFF', compToolbarAction.id);
  await createText('ToolbarActionText', 26, 6, 'Filter', 12, 500, '#4F566BFF', compToolbarAction.id);
  compY += 48;

  // 5. Component: Status Badges (5 Variants)
  await createText('C5_Label', 24, compY, '5. Status Badges (5 Variants)', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const badgeVariants = ['Enabled', 'Pending', 'Restricted', 'Restricted soon', 'Complete'];
  let badgeX = 24;
  for (const bType of badgeVariants) {
    const compBadge = await callTool('create-component', { name: `Component / Status Badge - ${bType}`, parentId: compLib.id });
    await callTool('move-node', { id: compBadge.id, x: badgeX, y: compY });
    await createStatusBadge(`Badge_${bType}`, 0, 0, bType, compBadge.id);
    badgeX += 114;
    if (badgeX > 400) {
      badgeX = 24;
      compY += 28;
    }
  }
  compY += 40;

  // 6. Component: Table Header Cell
  await createText('C6_Label', 24, compY, '6. Table Header Cell', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compHeaderCell = await callTool('create-component', { name: 'Component / Table Header Cell', parentId: compLib.id });
  await callTool('resize-node', { id: compHeaderCell.id, width: 140, height: 32 });
  await callTool('move-node', { id: compHeaderCell.id, x: 24, y: compY });
  await createText('HeaderCellText', 6, 8, 'COLUMN', 11, 600, '#7B8794FF', compHeaderCell.id);
  await createSortIcon(64, 9, '#7B8794FF', compHeaderCell.id);
  compY += 48;

  // 7. Component: Table Row
  await createText('C7_Label', 24, compY, '7. Table Row Template', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compTableRow = await callTool('create-component', { name: 'Component / Table Row', parentId: compLib.id });
  await callTool('set-fill-color', { id: compTableRow.id, color: '#FFFFFFFF' });
  await callTool('resize-node', { id: compTableRow.id, width: 460, height: 40 });
  await callTool('move-node', { id: compTableRow.id, x: 24, y: compY });
  await createRect('TemplateRowSep', 0, 39, 460, 1, '#F0F2F5FF', null, 0, compTableRow.id);
  await createText('TemplateName', 8, 12, 'Jane Doe', 12, 500, '#263238FF', compTableRow.id);
  await createStatusBadge('TemplateBadge', 120, 10, 'Enabled', compTableRow.id);
  await createText('TemplateBal', 220, 12, '$1,200.00', 12, 400, '#263238FF', compTableRow.id);
  await createText('TemplateVol', 320, 12, '$15,000.00', 12, 400, '#7B8794FF', compTableRow.id);
  await createText('TemplateType', 410, 12, 'Express', 12, 400, '#7B8794FF', compTableRow.id);

  console.log('=== BUILD COMPLETED SUCCESSFULLY! ===');
}

buildDashboard().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
