import {
  callTool,
  createFrame,
  createRect,
  createText,
  createAccountsIcon,
  createSearchIcon,
  createFunnelIcon,
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

async function completeDashboard() {
  console.log('=== COMPLETING TABLE AND COMPONENT LIBRARY ===');

  const pagesData = await callTool('get-pages', {});
  const page1 = typeof pagesData[0] === 'string' ? JSON.parse(pagesData[0]) : pagesData[0];
  const dash = page1.nodes.find(n => n.name === 'Rocket Rides - Admin Dashboard');
  if (!dash) {
    throw new Error('Dashboard node not found');
  }

  const table = dash.children.find(c => c.name === 'Dashboard / Accounts Table');
  if (!table) {
    throw new Error('Table node not found');
  }

  const tableInfoRes = await callTool('get-node-info', { id: table.id });
  const tableNode = typeof tableInfoRes === 'string' ? JSON.parse(tableInfoRes) : tableInfoRes;

  const tableHeader = tableNode.children.find(c => c.name === 'TableHeader');
  const tableRow1 = tableNode.children.find(c => c.name === 'TableRow_1');

  // Column X offsets
  const colX = {
    account: 28,
    status: 220,
    balance: 440,
    volume: 580,
    type: 720,
    connected: 830
  };

  // Complete TableHeader
  console.log('Completing TableHeader columns...');
  await createText('H_STATUS', colX.status, 10, 'STATUS', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.status + 50, 11, '#7B8794FF', tableHeader.id);

  await createText('H_BALANCE', colX.balance + 35, 10, 'BALANCE', 11, 600, '#7B8794FF', tableHeader.id);
  await createText('H_VOLUME', colX.volume + 40, 10, 'VOLUME', 11, 600, '#7B8794FF', tableHeader.id);

  await createText('H_TYPE', colX.type, 10, 'TYPE', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.type + 34, 11, '#7B8794FF', tableHeader.id);

  await createText('H_CONNECTED', colX.connected, 10, 'CONNECTED', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.connected + 74, 11, '#7B8794FF', tableHeader.id);
  console.log('TableHeader completed.');

  // Complete TableRow_1 (Volume and Type)
  console.log('Completing TableRow_1 missing columns...');
  await createText('Col_Volume', colX.volume + 35, 12, '$802.12', 12, 400, '#7B8794FF', tableRow1.id);
  await createText('Col_Type', colX.type, 12, 'Express', 12, 400, '#7B8794FF', tableRow1.id);
  console.log('TableRow_1 completed.');

  // Build Table Rows 2 to 11
  const remainingRows = [
    {
      index: 2,
      account: 'Tatiana Campbell',
      status: 'Pending',
      balance: '$502.24',
      volume: '$23,283.42',
      type: 'Express',
      flag: createThailandFlag,
      date: 'Mar 2'
    },
    {
      index: 3,
      account: 'Katie Ortega',
      status: 'Restricted',
      balance: '$482.46',
      volume: '$9,283.11',
      type: 'Express',
      flag: createAustriaFlag,
      date: 'May 4'
    },
    {
      index: 4,
      account: 'Tanya Hagen',
      status: 'Complete',
      balance: '$401.11',
      volume: '$11,283.11',
      type: 'Express',
      flag: createMalaysiaFlag,
      date: 'Jan 29'
    },
    {
      index: 5,
      account: 'Krithika Mani',
      status: 'Complete',
      balance: '$350.12',
      volume: '$10,283.98',
      type: 'Express',
      flag: createThailandFlag,
      date: 'May 21'
    },
    {
      index: 6,
      account: 'Mark Wang',
      status: 'Complete',
      balance: '$308.41',
      volume: '$2,382.00',
      type: 'Express',
      flag: createUSFlag,
      date: 'May 21'
    },
    {
      index: 7,
      account: 'Peter Thand',
      status: 'Complete',
      balance: '$128.42',
      volume: '$1,248.24',
      type: 'Express',
      flag: createSouthAfricaFlag,
      date: 'May 21'
    },
    {
      index: 8,
      account: 'Fran Roberts',
      status: 'Pending',
      balance: '$126.49',
      volume: '$812.12',
      type: 'Express',
      flag: createMalaysiaFlag,
      date: 'Apr 15'
    },
    {
      index: 9,
      account: 'Kate Johnson',
      status: 'Complete',
      balance: '$102.83',
      volume: '$6,382.03',
      type: 'Express',
      flag: createCanadaFlag,
      date: 'May 16'
    },
    {
      index: 10,
      account: 'Matt Youngren',
      status: 'Restricted soon',
      balance: '$84.83',
      volume: '$400.12',
      type: 'Express',
      flag: createBelgiumFlag,
      date: 'Aug 14'
    },
    {
      index: 11,
      account: 'Belen Santos',
      status: 'Complete',
      balance: '$70.00',
      volume: '$382.14',
      type: 'Express',
      flag: createUSFlag,
      date: 'Nov 14'
    }
  ];

  const rowHeight = 42;
  let currentY = 36 + rowHeight; // starts after row 1

  for (const row of remainingRows) {
    console.log(`Creating TableRow_${row.index} (${row.account})...`);
    const rowFrame = await createFrame(`TableRow_${row.index}`, 0, currentY, 1200, rowHeight, '#FFFFFFFF', null, 0, table.id);

    // Separator
    await createRect('RowSeparator', 28, rowHeight - 1, 1144, 1, '#F0F2F5FF', null, 0, rowFrame.id);

    // Account
    await createText('Col_Account', colX.account, 12, row.account, 12, 500, '#263238FF', rowFrame.id);

    // Status
    await createStatusBadge('Col_Status', colX.status, 11, row.status, rowFrame.id);

    // Balance
    await createText('Col_Balance', colX.balance + 45, 12, row.balance, 12, 400, '#263238FF', rowFrame.id);

    // Volume
    await createText('Col_Volume', colX.volume + 35, 12, row.volume, 12, 400, '#7B8794FF', rowFrame.id);

    // Type
    await createText('Col_Type', colX.type, 12, row.type, 12, 400, '#7B8794FF', rowFrame.id);

    // Connected
    const connGroup = await createFrame('Col_Connected', colX.connected, 12, 140, 20, null, null, 0, rowFrame.id);
    await row.flag(0, 3, connGroup.id);
    await createText('ConnectedDate', 24, 1, row.date, 12, 400, '#7B8794FF', connGroup.id);

    currentY += rowHeight;
  }
  console.log('All 11 table rows created successfully.');

  // Clean up any old Design System frame if present
  const oldCompLib = page1.nodes.find(n => n.name === 'Design System / Components');
  if (oldCompLib) {
    console.log('Cleaning up old component library...');
    await callTool('delete-node', { id: oldCompLib.id });
  }

  // Create Reusable Component Library
  console.log('Creating Reusable Component Library at x=1480, y=0...');
  const compLib = await createFrame('Design System / Components', 1480, 0, 520, 900, '#F8FAFCFF', '#E2E8F0FF', 8);

  await createText('CompLibTitle', 24, 24, 'Reusable Components Library', 18, 700, '#0F172AFF', compLib.id);
  await createText('CompLibSub', 24, 48, 'Design tokens & master components used across Rocket Rides Dashboard', 12, 400, '#64748BFF', compLib.id);

  let compY = 88;

  // 1. Sidebar Nav Item Component
  console.log('Creating Component / Sidebar Nav Item...');
  await createText('C1_Label', 24, compY, '1. Sidebar Navigation Item', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compNavItem = await callTool('create-component', { name: 'Component / Sidebar Nav Item', parentId: compLib.id });
  await callTool('set-fill-color', { id: compNavItem.id, color: '#EBF2FEFF' });
  await callTool('set-corner-radius', { id: compNavItem.id, cornerRadius: 6 });
  await callTool('resize-node', { id: compNavItem.id, width: 200, height: 32 });
  await callTool('move-node', { id: compNavItem.id, x: 24, y: compY });
  await createAccountsIcon(12, 8, compNavItem.id);
  await createText('NavItemText', 36, 8, 'Accounts (Active)', 13, 600, '#3B82F6FF', compNavItem.id);
  compY += 48;

  // 2. Search Input Component
  console.log('Creating Component / Search Input...');
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

  // 3. Status Tab Component
  console.log('Creating Component / Status Tab...');
  await createText('C3_Label', 24, compY, '3. Status Tab', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compTab = await callTool('create-component', { name: 'Component / Status Tab', parentId: compLib.id });
  await callTool('resize-node', { id: compTab.id, width: 140, height: 40 });
  await callTool('move-node', { id: compTab.id, x: 24, y: compY });
  await createText('TabCompLabel', 8, 10, 'All accounts', 13, 600, '#3B82F6FF', compTab.id);
  await createText('TabCompCount', 96, 10, '102', 12, 500, '#60A5FAFF', compTab.id);
  await createRect('TabUnderline', 6, 38, 128, 2, '#3B82F6FF', null, 1, compTab.id);
  compY += 56;

  // 4. Toolbar Action Component
  console.log('Creating Component / Toolbar Action...');
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

  // 5. Status Badges Variants
  console.log('Creating Component / Status Badges...');
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

  // 6. Table Header Cell Component
  console.log('Creating Component / Table Header Cell...');
  await createText('C6_Label', 24, compY, '6. Table Header Cell', 12, 600, '#334155FF', compLib.id);
  compY += 20;
  const compHeaderCell = await callTool('create-component', { name: 'Component / Table Header Cell', parentId: compLib.id });
  await callTool('resize-node', { id: compHeaderCell.id, width: 140, height: 32 });
  await callTool('move-node', { id: compHeaderCell.id, x: 24, y: compY });
  await createText('HeaderCellText', 6, 8, 'ACCOUNT', 11, 600, '#7B8794FF', compHeaderCell.id);
  await createSortIcon(64, 9, '#7B8794FF', compHeaderCell.id);
  compY += 48;

  // 7. Table Row Template Component
  console.log('Creating Component / Table Row Template...');
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

  console.log('=== COMPLETE DASHBOARD BUILD FINISHED SUCCESSFULLY! ===');
}

completeDashboard().catch((err) => {
  console.error('Completion error:', err);
  process.exit(1);
});
