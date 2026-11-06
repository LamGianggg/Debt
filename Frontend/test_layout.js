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

async function testLayout() {
  console.log('Testing set-layout...');
  const frame = await callTool('create-frame', { name: 'TestAutoLayout', x: 0, y: 0, width: 200, height: 50 });
  console.log('Created frame:', frame.id);
  
  const layoutRes = await callTool('set-layout', {
    id: frame.id,
    mode: 'HORIZONTAL',
    itemSpacing: 8,
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'CENTER',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8
  });
  console.log('Layout set successfully:', !layoutRes.isError);

  const t1 = await callTool('create-text', {
    name: 'T1',
    x: 0,
    y: 0,
    text: 'Hello',
    fontName: 'Inter',
    fontSize: 14,
    fontWeight: 500,
    fontColor: '#000000FF',
    parentId: frame.id
  });
  console.log('Added text to frame:', t1.id);

  // Clean up
  await callTool('delete-node', { id: frame.id });
  console.log('Cleaned up test.');
}

testLayout().catch(console.error);
