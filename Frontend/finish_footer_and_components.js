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
            setTimeout(() => resolve(content), 25);
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

async function createFrame(name, x, y, width, height, fill = null, stroke = null, cornerRadius = 0, parentId = null) {
  const frame = await callTool('create-frame', {
    name,
    x,
    y,
    width,
    height,
    ...(parentId ? { parentId } : {})
  });
  if (fill) {
    await callTool('set-fill-color', { id: frame.id, color: fill });
  }
  if (stroke) {
    await callTool('set-stroke-color', { id: frame.id, color: stroke });
  }
  if (cornerRadius > 0) {
    await callTool('set-corner-radius', { id: frame.id, cornerRadius });
  }
  return frame;
}

async function createRect(name, x, y, width, height, fill = null, stroke = null, cornerRadius = 0, parentId = null) {
  const rect = await callTool('create-rectangle', {
    name,
    x,
    y,
    width,
    height,
    ...(parentId ? { parentId } : {})
  });
  if (fill) {
    await callTool('set-fill-color', { id: rect.id, color: fill });
  }
  if (stroke) {
    await callTool('set-stroke-color', { id: rect.id, color: stroke });
  }
  if (cornerRadius > 0) {
    await callTool('set-corner-radius', { id: rect.id, cornerRadius });
  }
  return rect;
}

async function createText(name, x, y, text, fontSize = 13, fontWeight = 400, color = '#1E293BFF', parentId = null) {
  return await callTool('create-text', {
    name,
    x,
    y,
    text,
    fontName: 'Inter',
    fontSize,
    fontWeight,
    fontColor: color,
    ...(parentId ? { parentId } : {})
  });
}

async function createFolderIcon(x, y, color = '#475569FF', parentId = null) {
  const f = await createFrame('Icon_Folder', x, y, 16, 14, null, null, 0, parentId);
  await createRect('f_tab', 1, 1, 6, 3, null, color, 1, f.id);
  await createRect('f_body', 1, 3, 14, 10, null, color, 2, f.id);
  return f;
}

async function createFunnelIcon(x, y, color = '#0D3B85FF', parentId = null) {
  const f = await createFrame('Icon_Funnel', x, y, 14, 14, null, null, 0, parentId);
  await createRect('TopFunnel', 1, 2, 12, 2, color, null, 1, f.id);
  await createRect('MidFunnel', 3, 4, 8, 3, color, null, 1, f.id);
  await createRect('Spout', 6, 7, 2, 5, color, null, 0, f.id);
  return f;
}

async function createEditButton(x, y, parentId = null) {
  const btn = await createFrame('Btn_Edit', x, y, 28, 28, '#FFFFFFFF', '#CBD5E1FF', 4, parentId);
  await createRect('pen_body', 7, 9, 12, 3, null, '#475569FF', 1, btn.id);
  await createRect('pen_tip', 17, 7, 4, 4, '#475569FF', null, 1, btn.id);
  await createRect('pen_line', 7, 14, 14, 1.5, '#475569FF', null, 0, btn.id);
  return btn;
}

async function createDeleteButton(x, y, parentId = null) {
  const btn = await createFrame('Btn_Delete', x, y, 28, 28, '#FFFFFFFF', '#CBD5E1FF', 4, parentId);
  await createRect('tr_lid', 7, 7, 14, 2, '#475569FF', null, 1, btn.id);
  await createRect('tr_handle', 11, 5, 6, 2, '#475569FF', null, 1, btn.id);
  await createRect('tr_body', 8, 10, 12, 11, null, '#475569FF', 2, btn.id);
  await createRect('tr_s1', 11, 12, 1.5, 6, '#475569FF', null, 0, btn.id);
  await createRect('tr_s2', 15, 12, 1.5, 6, '#475569FF', null, 0, btn.id);
  return btn;
}

async function finish() {
  console.log('=== CREATING TABLE FOOTER & COMPONENT LIBRARY ===');

  const tableCardId = '3:95';
  const rowY = 46 + 8 * 48; // 430

  // 1. Table Footer Pagination
  console.log('Building TableFooter in TableCard...');
  const footer = await createFrame('TableFooter', 0, rowY, 1142, 48, '#FFFFFFFF', null, 0, tableCardId);

  // Left: "8 dòng / 8"
  await createText('FooterCount', 24, 15, '8 dòng / 8', 12, 500, '#64748BFF', footer.id);

  // Center/Right: Pagination Buttons: < [ 1 ] >
  const paginGroup = await createFrame('Pagination', 530, 10, 96, 28, null, null, 0, footer.id);

  // Prev button
  const prevBtn = await createFrame('Pagin_Prev', 0, 0, 26, 26, '#FFFFFFFF', '#CBD5E1FF', 4, paginGroup.id);
  await createText('PrevIcon', 9, 5, '<', 12, 500, '#64748BFF', prevBtn.id);

  // Page 1 (Active Navy Blue)
  const p1Btn = await createFrame('Pagin_Page1', 32, 0, 26, 26, '#0D3B85FF', null, 4, paginGroup.id);
  await createText('Page1Num', 10, 5, '1', 12, 600, '#FFFFFFFF', p1Btn.id);

  // Next button
  const nextBtn = await createFrame('Pagin_Next', 64, 0, 26, 26, '#FFFFFFFF', '#CBD5E1FF', 4, paginGroup.id);
  await createText('NextIcon', 10, 5, '>', 12, 500, '#64748BFF', nextBtn.id);
  console.log('TableFooter created.');

  // 2. Reusable Component Library Frame
  console.log('Building Design System / Components Frame...');
  const compLib = await createFrame('Design System / Components', 1480, 0, 520, 900, '#F8FAFCFF', '#E2E8F0FF', 8);

  await createText('CompTitle', 24, 24, 'Thư viện Component Hệ Thống', 18, 700, '#0D3B85FF', compLib.id);
  await createText('CompSub', 24, 48, 'Design system cho Quản lý môn học - Hệ thống Quản trị', 12, 400, '#64748BFF', compLib.id);

  let compY = 86;

  // 1. Sidebar Nav Item Component
  console.log('Creating Component / Nav Item - Active...');
  await createText('C1_Label', 24, compY, '1. Sidebar Nav Item (Active & Inactive)', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compNavActive = await callTool('create-component', { name: 'Component / Nav Item - Active', parentId: compLib.id });
  await callTool('set-fill-color', { id: compNavActive.id, color: '#EBF3FEFF' });
  await callTool('set-corner-radius', { id: compNavActive.id, cornerRadius: 6 });
  await callTool('resize-node', { id: compNavActive.id, width: 226, height: 36 });
  await callTool('move-node', { id: compNavActive.id, x: 24, y: compY });
  await createFolderIcon(10, 11, '#0D3B85FF', compNavActive.id);
  await createText('NavActiveText', 34, 10, 'Quản lý niên khóa', 13, 600, '#0D3B85FF', compNavActive.id);
  compY += 46;

  // 2. Primary Button Component ("+ Thêm mới")
  console.log('Creating Component / Button Primary...');
  await createText('C2_Label', 24, compY, '2. Primary Action Button (+ Thêm mới)', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compPrimaryBtn = await callTool('create-component', { name: 'Component / Button Primary', parentId: compLib.id });
  await callTool('set-fill-color', { id: compPrimaryBtn.id, color: '#0D3B85FF' });
  await callTool('set-corner-radius', { id: compPrimaryBtn.id, cornerRadius: 6 });
  await callTool('resize-node', { id: compPrimaryBtn.id, width: 110, height: 36 });
  await callTool('move-node', { id: compPrimaryBtn.id, x: 24, y: compY });
  await createText('BtnPrimaryPlus', 12, 9, '+', 15, 600, '#FFFFFFFF', compPrimaryBtn.id);
  await createText('BtnPrimaryText', 26, 9, 'Thêm mới', 13, 600, '#FFFFFFFF', compPrimaryBtn.id);
  compY += 48;

  // 3. Search Filter Button ("Tìm kiếm")
  console.log('Creating Component / Button Filter...');
  await createText('C3_Label', 24, compY, '3. Filter Button (Tìm kiếm)', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compFilterBtn = await callTool('create-component', { name: 'Component / Button Filter', parentId: compLib.id });
  await callTool('set-fill-color', { id: compFilterBtn.id, color: '#FFFFFFFF' });
  await callTool('set-stroke-color', { id: compFilterBtn.id, color: '#0D3B85FF' });
  await callTool('set-corner-radius', { id: compFilterBtn.id, cornerRadius: 6 });
  await callTool('resize-node', { id: compFilterBtn.id, width: 110, height: 36 });
  await callTool('move-node', { id: compFilterBtn.id, x: 24, y: compY });
  await createFunnelIcon(12, 11, '#0D3B85FF', compFilterBtn.id);
  await createText('BtnFilterText', 32, 9, 'Tìm kiếm', 13, 500, '#0D3B85FF', compFilterBtn.id);
  compY += 48;

  // 4. Action Buttons (Edit & Delete)
  console.log('Creating Component / Actions...');
  await createText('C4_Label', 24, compY, '4. Row Action Buttons (Sửa & Xóa)', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compEdit = await callTool('create-component', { name: 'Component / Action - Edit', parentId: compLib.id });
  await callTool('resize-node', { id: compEdit.id, width: 28, height: 28 });
  await callTool('move-node', { id: compEdit.id, x: 24, y: compY });
  await createEditButton(0, 0, compEdit.id);

  const compDel = await callTool('create-component', { name: 'Component / Action - Delete', parentId: compLib.id });
  await callTool('resize-node', { id: compDel.id, width: 28, height: 28 });
  await callTool('move-node', { id: compDel.id, x: 60, y: compY });
  await createDeleteButton(0, 0, compDel.id);
  compY += 42;

  // 5. Table Header Component
  console.log('Creating Component / Table Header Bar...');
  await createText('C5_Label', 24, compY, '5. Table Header (Navy Bar)', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compHeader = await callTool('create-component', { name: 'Component / Table Header Bar', parentId: compLib.id });
  await callTool('set-fill-color', { id: compHeader.id, color: '#0D3B85FF' });
  await callTool('resize-node', { id: compHeader.id, width: 460, height: 40 });
  await callTool('move-node', { id: compHeader.id, x: 24, y: compY });
  await createText('ThTT', 16, 12, 'TT', 11, 700, '#FFFFFFFF', compHeader.id);
  await createText('ThTen', 50, 12, 'Tên niên khóa', 11, 700, '#FFFFFFFF', compHeader.id);
  await createText('ThMoTa', 150, 12, 'Mô tả', 11, 700, '#FFFFFFFF', compHeader.id);
  await createText('ThNam', 280, 12, 'Năm bắt đầu', 11, 700, '#FFFFFFFF', compHeader.id);
  await createText('ThAct', 380, 12, 'Hành động', 11, 700, '#FFFFFFFF', compHeader.id);
  compY += 52;

  // 6. Pagination Group Component
  console.log('Creating Component / Pagination Bar...');
  await createText('C6_Label', 24, compY, '6. Pagination Controls', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compPagin = await callTool('create-component', { name: 'Component / Pagination Bar', parentId: compLib.id });
  await callTool('resize-node', { id: compPagin.id, width: 200, height: 32 });
  await callTool('move-node', { id: compPagin.id, x: 24, y: compY });
  await createText('PgCount', 0, 8, '8 dòng / 8', 12, 500, '#64748BFF', compPagin.id);
  const pBtn1 = await createFrame('P1', 90, 3, 26, 26, '#0D3B85FF', null, 4, compPagin.id);
  await createText('P1T', 10, 5, '1', 12, 600, '#FFFFFFFF', pBtn1.id);

  console.log('=== ALL FINISHED SUCCESSFULLY! ===');
}

finish().catch((err) => {
  console.error('Finish error:', err);
  process.exit(1);
});
