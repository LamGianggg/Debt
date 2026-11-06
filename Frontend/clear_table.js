import { callTool } from './figma_helpers.js';

async function cleanupTable() {
  console.log('Cleaning up duplicate table rows...');
  const res = await callTool('get-node-info', { id: '2:530' });
  const table = typeof res === 'string' ? JSON.parse(res) : res;

  // Let's delete all existing children in the table frame
  for (const child of table.children) {
    console.log(`Deleting ${child.name} (${child.id})`);
    await callTool('delete-node', { id: child.id });
  }
  console.log('Table children cleared.');
}

cleanupTable().catch(console.error);
