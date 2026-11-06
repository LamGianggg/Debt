import {
  callTool,
  createFrame,
  createRect,
  createText,
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

async function rebuildTable() {
  console.log('=== REBUILDING CLEAN TABLE ROWS IN DASHBOARD / ACCOUNTS TABLE ===');
  const tableId = '2:530';

  // Column X offsets
  const colX = {
    account: 28,     // width ~180
    status: 220,     // width ~160
    balance: 440,    // right aligned value ~530
    volume: 580,     // right aligned value ~680
    type: 720,       // width ~100
    connected: 830   // width ~160
  };

  // 1. TableHeader
  console.log('Creating TableHeader...');
  const tableHeader = await createFrame('TableHeader', 0, 0, 1200, 36, '#FFFFFFFF', null, 0, tableId);
  await createRect('HeaderBorder', 28, 35, 1144, 1, '#E6EAF0FF', null, 0, tableHeader.id);

  // Column headers
  await createText('H_ACCOUNT', colX.account, 10, 'ACCOUNT', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.account + 62, 11, '#7B8794FF', tableHeader.id);

  await createText('H_STATUS', colX.status, 10, 'STATUS', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.status + 50, 11, '#7B8794FF', tableHeader.id);

  await createText('H_BALANCE', colX.balance + 35, 10, 'BALANCE', 11, 600, '#7B8794FF', tableHeader.id);
  await createText('H_VOLUME', colX.volume + 40, 10, 'VOLUME', 11, 600, '#7B8794FF', tableHeader.id);

  await createText('H_TYPE', colX.type, 10, 'TYPE', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.type + 34, 11, '#7B8794FF', tableHeader.id);

  await createText('H_CONNECTED', colX.connected, 10, 'CONNECTED', 11, 600, '#7B8794FF', tableHeader.id);
  await createSortIcon(colX.connected + 74, 11, '#7B8794FF', tableHeader.id);
  console.log('TableHeader created successfully.');

  // 2. All 11 Table Rows
  const tableRows = [
    {
      index: 1,
      account: 'Cheri Sherman',
      status: 'Enabled',
      balance: '$802.12',
      volume: '$802.12',
      type: 'Express',
      flag: createBelgiumFlag,
      date: 'Apr 4'
    },
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
  let currentY = 36;

  for (const row of tableRows) {
    console.log(`Building TableRow_${row.index}: ${row.account}...`);
    const rowFrame = await createFrame(`TableRow_${row.index}`, 0, currentY, 1200, rowHeight, '#FFFFFFFF', null, 0, tableId);

    // Separator line
    await createRect('RowSeparator', 28, rowHeight - 1, 1144, 1, '#F0F2F5FF', null, 0, rowFrame.id);

    // 1. Account name
    await createText('Col_Account', colX.account, 12, row.account, 12, 500, '#263238FF', rowFrame.id);

    // 2. Status badge (pill with vector icon)
    await createStatusBadge('Col_Status', colX.status, 11, row.status, rowFrame.id);

    // 3. Balance (Right-aligned)
    await createText('Col_Balance', colX.balance + 45, 12, row.balance, 12, 400, '#263238FF', rowFrame.id);

    // 4. Volume (Right-aligned)
    await createText('Col_Volume', colX.volume + 35, 12, row.volume, 12, 400, '#7B8794FF', rowFrame.id);

    // 5. Type
    await createText('Col_Type', colX.type, 12, row.type, 12, 400, '#7B8794FF', rowFrame.id);

    // 6. Connected (Flag + Date)
    const connGroup = await createFrame('Col_Connected', colX.connected, 12, 140, 20, null, null, 0, rowFrame.id);
    await row.flag(0, 3, connGroup.id);
    await createText('ConnectedDate', 24, 1, row.date, 12, 400, '#7B8794FF', connGroup.id);

    currentY += rowHeight;
  }

  console.log('=== TABLE REBUILD FINISHED SUCCESSFULLY! ===');
}

rebuildTable().catch((err) => {
  console.error('Rebuild table error:', err);
  process.exit(1);
});
