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

async function test() {
  console.log('Testing create-component...');
  const comp = await callTool('create-component', { name: 'TestComponent' });
  console.log('Created component:', comp);
  await callTool('set-fill-color', { id: comp.id, color: '#3B82F6FF' });
  await callTool('resize-node', { id: comp.id, width: 100, height: 40 });
  console.log('Component customized.');
  
  // Clean up
  await callTool('delete-node', { id: comp.id });
  console.log('Deleted test component.');
}

test().catch(console.error);
