import http from 'http';

function callTool(command, args) {
  return new Promise((resolve, reject) => {
    const req = http.request('http://localhost:38450/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.isError) {
            reject(new Error(typeof json.content === 'object' ? JSON.stringify(json.content) : json.content));
          } else {
            let content = json.content;
            if (typeof content === 'string') {
              try { content = JSON.parse(content); } catch {}
            }
            setTimeout(() => resolve(content), 30);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({ command, args }));
    req.end();
  });
}

async function testInstance() {
  const comp = await callTool('create-component', { name: 'MasterBadge' });
  console.log('Comp created:', comp.id);
  
  const inst = await callTool('create-instance', { componentId: comp.id, name: 'BadgeInstance', x: 10, y: 10 });
  console.log('Instance created:', inst.id);
  
  const frame = await callTool('create-frame', { name: 'Container', x: 100, y: 100, width: 200, height: 100 });
  console.log('Frame created:', frame.id);
  
  const moveRes = await callTool('set-parent-id', { id: inst.id, parentId: frame.id });
  console.log('Moved to frame:', !moveRes.isError);
  
  // Cleanup
  await callTool('delete-node', { id: comp.id });
  await callTool('delete-node', { id: frame.id });
  console.log('Cleaned up.');
}

testInstance().catch(console.error);
