import {
  callTool,
  createFrame,
  createRect,
  createText,
  createSortIcon,
  createStatusBadge,
  createBelgiumFlag
} from './figma_helpers.js';

async function testStep7() {
  console.log('Testing Step 7...');
  // Find dashboard frame
  const pagesData = await callTool('get-pages', {});
  const page1 = typeof pagesData[0] === 'string' ? JSON.parse(pagesData[0]) : pagesData[0];
  const dash = page1.nodes.find(n => n.name === 'Rocket Rides - Admin Dashboard');
  console.log('Dash found:', dash.id);

  // Check if Accounts Table exists
  let table = dash.children?.find(c => c.name === 'Dashboard / Accounts Table');
  if (!table) {
    console.log('Creating table frame...');
    table = await createFrame('Dashboard / Accounts Table', 240, 146, 1200, 754, '#FFFFFFFF', null, 0, dash.id);
  }
  console.log('Table frame:', table.id);

  console.log('Creating TableHeader...');
  const tableHeader = await createFrame('TableHeader', 0, 0, 1200, 36, '#FFFFFFFF', null, 0, table.id);
  console.log('TableHeader created:', tableHeader.id);

  console.log('Creating HeaderBorder...');
  await createRect('HeaderBorder', 28, 35, 1144, 1, '#E6EAF0FF', null, 0, tableHeader.id);
  console.log('HeaderBorder created.');

  console.log('Creating H_ACCOUNT...');
  await createText('H_ACCOUNT', 28, 10, 'ACCOUNT', 11, 600, '#7B8794FF', tableHeader.id);
  console.log('H_ACCOUNT created.');

  console.log('Creating sort icon...');
  await createSortIcon(90, 11, '#7B8794FF', tableHeader.id);
  console.log('Sort icon created.');

  console.log('Creating TableRow_1...');
  const rowFrame = await createFrame('TableRow_1', 0, 36, 1200, 42, '#FFFFFFFF', null, 0, table.id);
  console.log('RowFrame created:', rowFrame.id);

  console.log('Creating RowSeparator...');
  await createRect('RowSeparator', 28, 41, 1144, 1, '#F0F2F5FF', null, 0, rowFrame.id);
  console.log('RowSeparator created.');

  console.log('Creating Col_Account...');
  await createText('Col_Account', 28, 12, 'Cheri Sherman', 12, 500, '#263238FF', rowFrame.id);
  console.log('Col_Account created.');

  console.log('Creating Col_Status Enabled...');
  await createStatusBadge('Col_Status', 220, 11, 'Enabled', rowFrame.id);
  console.log('Col_Status created.');

  console.log('Creating Col_Balance...');
  await createText('Col_Balance', 485, 12, '$802.12', 12, 400, '#263238FF', rowFrame.id);
  console.log('Col_Balance created.');

  console.log('Creating Col_Connected...');
  const connectedGroup = await createFrame('Col_Connected', 830, 12, 140, 20, null, null, 0, rowFrame.id);
  await createBelgiumFlag(0, 3, connectedGroup.id);
  await createText('ConnectedDate', 24, 1, 'Apr 4', 12, 400, '#7B8794FF', connectedGroup.id);
  console.log('Col_Connected created.');

  console.log('TEST STEP 7 SUCCESSFUL!');
}

testStep7().catch(console.error);
