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

// Helpers
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

// Vector Icons

// 1. Red University Seal / Logo
async function createUniversitySeal(x, y, parentId) {
  const f = await createFrame('UniversitySeal', x, y, 36, 36, '#BA1B1DFF', null, 18, parentId);
  // Inner white circle outline
  await createRect('InnerRing', 3, 3, 30, 30, null, '#FFFFFFFF', 15, f.id);
  // Star/emblem in center
  await createRect('EmblemH', 10, 16, 16, 4, '#FFFFFFFF', null, 2, f.id);
  await createRect('EmblemV', 16, 10, 4, 16, '#FFFFFFFF', null, 2, f.id);
  await createRect('EmblemD1', 13, 13, 10, 10, null, '#FFFFFFFF', 5, f.id);
  await createRect('CenterDot', 16, 16, 4, 4, '#BA1B1DFF', null, 2, f.id);
  return f;
}

// 2. Folder Icon for Sidebar Menu Items
async function createFolderIcon(x, y, color = '#475569FF', parentId = null) {
  const f = await createFrame('Icon_Folder', x, y, 16, 14, null, null, 0, parentId);
  // Folder top tab
  await createRect('f_tab', 1, 1, 6, 3, null, color, 1, f.id);
  // Folder main body
  await createRect('f_body', 1, 3, 14, 10, null, color, 2, f.id);
  return f;
}

// 3. Chevron Down Icon for Sub-menus
async function createChevronDown(x, y, color = '#94A3B8FF', parentId = null) {
  const f = await createFrame('Icon_ChevronDown', x, y, 8, 6, null, null, 0, parentId);
  await createRect('ArmL', 1, 1, 3.5, 1.5, color, null, 0.7, f.id);
  await createRect('ArmR', 3.5, 1, 3.5, 1.5, color, null, 0.7, f.id);
  await createRect('Tip', 3, 2.5, 2, 1.5, color, null, 0.7, f.id);
  return f;
}

// 4. Search Magnifying Glass
async function createSearchIcon(x, y, color = '#94A3B8FF', parentId = null) {
  const f = await createFrame('Icon_Search', x, y, 16, 16, null, null, 0, parentId);
  await createRect('lens', 2, 2, 9, 9, null, color, 5, f.id);
  await createRect('stem', 9, 9, 5, 2, color, null, 1, f.id);
  return f;
}

// 5. Funnel Filter Icon
async function createFunnelIcon(x, y, color = '#0D3B85FF', parentId = null) {
  const f = await createFrame('Icon_Funnel', x, y, 14, 14, null, null, 0, parentId);
  await createRect('TopFunnel', 1, 2, 12, 2, color, null, 1, f.id);
  await createRect('MidFunnel', 3, 4, 8, 3, color, null, 1, f.id);
  await createRect('Spout', 6, 7, 2, 5, color, null, 0, f.id);
  return f;
}

// 6. Action Button Edit (Pencil)
async function createEditButton(x, y, parentId = null) {
  const btn = await createFrame('Btn_Edit', x, y, 28, 28, '#FFFFFFFF', '#CBD5E1FF', 4, parentId);
  // Pencil body
  await createRect('pen_body', 7, 9, 12, 3, null, '#475569FF', 1, btn.id);
  await createRect('pen_tip', 17, 7, 4, 4, '#475569FF', null, 1, btn.id);
  await createRect('pen_line', 7, 14, 14, 1.5, '#475569FF', null, 0, btn.id);
  return btn;
}

// 7. Action Button Delete (Trash)
async function createDeleteButton(x, y, parentId = null) {
  const btn = await createFrame('Btn_Delete', x, y, 28, 28, '#FFFFFFFF', '#CBD5E1FF', 4, parentId);
  // Trash lid
  await createRect('tr_lid', 7, 7, 14, 2, '#475569FF', null, 1, btn.id);
  await createRect('tr_handle', 11, 5, 6, 2, '#475569FF', null, 1, btn.id);
  // Trash can body
  await createRect('tr_body', 8, 10, 12, 11, null, '#475569FF', 2, btn.id);
  // Vertical slats
  await createRect('tr_s1', 11, 12, 1.5, 6, '#475569FF', null, 0, btn.id);
  await createRect('tr_s2', 15, 12, 1.5, 6, '#475569FF', null, 0, btn.id);
  return btn;
}

// --- MAIN BUILD ROUTINE ---
async function buildUniversityDashboard() {
  console.log('=== STARTING UNIVERSITY COURSE MANAGEMENT DASHBOARD BUILD ===');

  // Step 1: Clean up old nodes
  console.log('1. Cleaning up previous canvas nodes...');
  const pagesData = await callTool('get-pages', {});
  const page1 = typeof pagesData[0] === 'string' ? JSON.parse(pagesData[0]) : pagesData[0];
  if (page1 && page1.nodes && page1.nodes.length > 0) {
    for (const n of page1.nodes) {
      console.log(`Deleting node: ${n.name} (${n.id})`);
      await callTool('delete-node', { id: n.id });
    }
  }

  // Step 2: Main Canvas Frame (1440 × 900)
  console.log('2. Creating Desktop Canvas Frame (1440 × 900)...');
  const dashboard = await createFrame('Quản lý niên khóa - Hệ thống Quản trị', 0, 0, 1440, 900, '#E5E9F0FF');

  // ==========================================
  // SECTION 1: SIDEBAR (Left: 250px × 900px, White)
  // ==========================================
  console.log('3. Building Sidebar Navigation...');
  const sidebar = await createFrame('Sidebar', 0, 0, 250, 900, '#FFFFFFFF', '#DDE3EAFF', 0, dashboard.id);

  // Brand Header
  const brand = await createFrame('SidebarBrand', 16, 16, 218, 48, null, null, 0, sidebar.id);
  await createUniversitySeal(0, 6, brand.id);
  await createText('BrandTitle', 44, 8, 'QUẢN LÝ MÔN HỌC', 13, 700, '#0F172AFF', brand.id);
  await createText('BrandSubtitle', 44, 26, 'HỆ THỐNG QUẢN TRỊ', 10, 600, '#64748BFF', brand.id);

  // Sidebar Menu Items
  const menuItems = [
    { title: 'Trang chủ', active: false, hasSub: false },
    { title: 'Chương trình đào tạo', active: false, hasSub: true },
    { title: 'Quản lý lớp học', active: false, hasSub: false },
    { title: 'Quản lý môn học', active: false, hasSub: false },
    { title: 'Quản lý học phần', active: false, hasSub: false },
    { title: 'Quản lý niên khóa', active: true, hasSub: false },
    { title: 'Quản lý ngành', active: false, hasSub: false },
    { title: 'Quản lý chuyên ngành', active: false, hasSub: false },
    { title: 'Quản lý giáo viên', active: false, hasSub: false },
    { title: 'Quản lý sinh viên', active: false, hasSub: false },
    { title: 'Báo cáo thống kê', active: false, hasSub: true }
  ];

  let navY = 74;
  for (const item of menuItems) {
    const itemFrame = await createFrame(
      `NavItem_${item.title}`,
      12,
      navY,
      226,
      36,
      item.active ? '#EBF3FEFF' : null,
      null,
      6,
      sidebar.id
    );

    // Folder icon
    await createFolderIcon(10, 11, item.active ? '#0D3B85FF' : '#475569FF', itemFrame.id);

    // Title
    await createText(
      'NavTitle',
      34,
      10,
      item.title,
      13,
      item.active ? 600 : 500,
      item.active ? '#0D3B85FF' : '#334155FF',
      itemFrame.id
    );

    // Chevron down for expandable items
    if (item.hasSub) {
      await createChevronDown(204, 15, '#94A3B8FF', itemFrame.id);
    }

    navY += 38;
  }

  // ==========================================
  // SECTION 2: MAIN CONTENT AREA
  // ==========================================
  console.log('4. Building Main Content Area...');
  const mainArea = await createFrame('MainContent', 250, 0, 1190, 900, '#E5E9F0FF', null, 0, dashboard.id);

  // 1. Top Header Row: Page Title + Button "+ Thêm mới"
  const topBar = await createFrame('TopBar', 24, 20, 1142, 38, null, null, 0, mainArea.id);
  await createText('PageTitle', 0, 6, 'Quản lý niên khóa', 20, 700, '#0F172AFF', topBar.id);

  // Button "+ Thêm mới" (Navy blue `#0D3B85`)
  const addBtn = await createFrame('Btn_ThemMoi', 1032, 1, 110, 36, '#0D3B85FF', null, 6, topBar.id);
  await createText('AddPlus', 12, 9, '+', 15, 600, '#FFFFFFFF', addBtn.id);
  await createText('AddText', 26, 9, 'Thêm mới', 13, 600, '#FFFFFFFF', addBtn.id);

  // 2. Search & Filter Card Container (White)
  console.log('5. Building Search Card...');
  const searchCard = await createFrame('SearchCard', 24, 68, 1142, 54, '#FFFFFFFF', '#DDE3EAFF', 8, mainArea.id);

  // Search input field
  const searchInput = await createFrame('SearchInput', 16, 9, 988, 36, '#FFFFFFFF', '#CBD5E1FF', 6, searchCard.id);
  await createSearchIcon(10, 10, '#94A3B8FF', searchInput.id);
  await createText('SearchPlaceholder', 32, 9, 'Tìm kiếm theo tên niên khóa, mã...', 13, 400, '#94A3B8FF', searchInput.id);

  // "Tìm kiếm" button
  const searchBtn = await createFrame('Btn_TimKiem', 1016, 9, 110, 36, '#FFFFFFFF', '#0D3B85FF', 6, searchCard.id);
  await createFunnelIcon(12, 11, '#0D3B85FF', searchBtn.id);
  await createText('SearchBtnText', 32, 9, 'Tìm kiếm', 13, 500, '#0D3B85FF', searchBtn.id);

  // 3. Main Data Table Card Container (White with Navy Header)
  console.log('6. Building Data Table Card...');
  const tableCard = await createFrame('TableCard', 24, 134, 1142, 530, '#FFFFFFFF', '#DDE3EAFF', 8, mainArea.id);

  // Table Column Layout X offsets (Width total: 1142)
  const colX = {
    tt: 30,          // TT: centered over width 60
    ten: 110,        // Tên niên khóa: left aligned
    mota: 300,       // Mô tả: left aligned
    batdau: 630,     // Năm bắt đầu: center aligned
    ketthuc: 770,    // Năm kết thúc: center aligned
    hanhdong: 920    // Hành động: center aligned (width 160)
  };

  // Table Header (Navy Blue `#0D3B85`)
  const tableHeader = await createFrame('TableHeader', 0, 0, 1142, 46, '#0D3B85FF', null, 0, tableCard.id);
  // Column Titles in Header (White text, Bold 12-13px)
  await createText('H_TT', colX.tt + 15, 14, 'TT', 12, 700, '#FFFFFFFF', tableHeader.id);
  await createText('H_Ten', colX.ten, 14, 'Tên niên khóa', 12, 700, '#FFFFFFFF', tableHeader.id);
  await createText('H_MoTa', colX.mota, 14, 'Mô tả', 12, 700, '#FFFFFFFF', tableHeader.id);
  await createText('H_BatDau', colX.batdau + 15, 14, 'Năm bắt đầu', 12, 700, '#FFFFFFFF', tableHeader.id);
  await createText('H_KetThuc', colX.ketthuc + 15, 14, 'Năm kết thúc', 12, 700, '#FFFFFFFF', tableHeader.id);
  await createText('H_HanhDong', colX.hanhdong + 45, 14, 'Hành động', 12, 700, '#FFFFFFFF', tableHeader.id);

  // 8 Exact Rows from the Reference Screenshot
  const rows = [
    { tt: '1', ten: 'K2020', mota: 'Lớp sinh viên 2020', batdau: '2020', ketthuc: '2024' },
    { tt: '2', ten: '11111111', mota: '121212121', batdau: '111111', ketthuc: '111111' },
    { tt: '3', ten: 'K2022', mota: 'Lớp sinh viên 2022', batdau: '2022', ketthuc: '2026' },
    { tt: '4', ten: 'K2021', mota: 'Lớp sinh viên 2021', batdau: '2021', ketthuc: '2025' },
    { tt: '5', ten: 'K2023', mota: 'Lớp sinh viên 2023', batdau: '2023', ketthuc: '2027' },
    { tt: '6', ten: '123124', mota: '12331234', batdau: '123', ketthuc: '1212' },
    { tt: '7', ten: 'K2024', mota: 'Lớp sinh viên 2024', batdau: '2024', ketthuc: '2028' },
    { tt: '8', ttBold: true, ten: '123122', mota: '12312312312341234123', batdau: '1213', ketthuc: '123122' }
  ];

  let rowY = 46;
  const rowHeight = 48;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    console.log(`Building Row ${r.tt}: ${r.ten}...`);
    const rowFrame = await createFrame(`TableRow_${r.tt}`, 0, rowY, 1142, rowHeight, '#FFFFFFFF', null, 0, tableCard.id);

    // Separator line
    await createRect('RowSep', 16, rowHeight - 1, 1110, 1, '#E2E8F0FF', null, 0, rowFrame.id);

    // 1. TT (Center)
    await createText('Col_TT', colX.tt + 20, 15, r.tt, 12, 500, '#334155FF', rowFrame.id);

    // 2. Tên niên khóa (Left)
    await createText('Col_Ten', colX.ten, 15, r.ten, 12, 600, '#0F172AFF', rowFrame.id);

    // 3. Mô tả (Left)
    await createText('Col_MoTa', colX.mota, 15, r.mota, 12, 400, '#334155FF', rowFrame.id);

    // 4. Năm bắt đầu (Center)
    await createText('Col_BatDau', colX.batdau + 35, 15, r.batdau, 12, 400, '#334155FF', rowFrame.id);

    // 5. Năm kết thúc (Center)
    await createText('Col_KetThuc', colX.ketthuc + 35, 15, r.ketthuc, 12, 400, '#334155FF', rowFrame.id);

    // 6. Hành động (Center: 2 buttons side by side)
    const actionGroup = await createFrame('Col_HanhDong', colX.hanhdong + 40, 10, 68, 28, null, null, 0, rowFrame.id);
    await createEditButton(0, 0, actionGroup.id);
    await createDeleteButton(36, 0, actionGroup.id);

    rowY += rowHeight;
  }

  // 4. Table Footer Pagination (Inside Table Card at bottom)
  console.log('7. Building Table Pagination Footer...');
  const footer = await createFrame('TableFooter', 0, rowY, 1142, 48, '#FFFFFFFF', null, 0, tableCard.id);

  // Left: "8 dòng / 8"
  await createText('FooterCount', 24, 15, '8 dòng / 8', 12, 500, '#64748BFF', footer.id);

  // Right: Pagination Buttons: < [ 1 ] >
  const paginGroup = await createFrame('Pagination', 530, 10, 84, 28, null, null, 0, footer.id);
  
  // Prev button
  const prevBtn = await createFrame('Pagin_Prev', 0, 0, 26, 26, '#FFFFFFFF', '#CBD5E1FF', 4, paginGroup.id);
  await createText('PrevIcon', 9, 5, '<', 12, 500, '#64748BFF', prevBtn.id);

  // Page 1 (Active Navy Blue)
  const p1Btn = await createFrame('Pagin_Page1', 30, 0, 26, 26, '#0D3B85FF', null, 4, paginGroup.id);
  await createText('Page1Num', 10, 5, '1', 12, 600, '#FFFFFFFF', p1Btn.id);

  // Next button
  const nextBtn = await createFrame('Pagin_Next', 60, 0, 26, 26, '#FFFFFFFF', '#CBD5E1FF', 4, paginGroup.id);
  await createText('NextIcon', 10, 5, '>', 12, 500, '#64748BFF', nextBtn.id);

  // ==========================================
  // SECTION 3: REUSABLE COMPONENT LIBRARY
  // ==========================================
  console.log('8. Building Design System & Master Components Library...');
  const compLib = await createFrame('Design System / Components', 1480, 0, 520, 900, '#F8FAFCFF', '#E2E8F0FF', 8);

  await createText('CompTitle', 24, 24, 'Thư viện Component Hệ Thống', 18, 700, '#0D3B85FF', compLib.id);
  await createText('CompSub', 24, 48, 'Design system cho Quản lý môn học - Hệ thống Quản trị', 12, 400, '#64748BFF', compLib.id);

  let compY = 86;

  // 1. Sidebar Nav Item Component
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
  await createText('C6_Label', 24, compY, '6. Pagination Controls', 12, 600, '#1E293BFF', compLib.id);
  compY += 20;
  const compPagin = await callTool('create-component', { name: 'Component / Pagination Bar', parentId: compLib.id });
  await callTool('resize-node', { id: compPagin.id, width: 200, height: 32 });
  await callTool('move-node', { id: compPagin.id, x: 24, y: compY });
  await createText('PgCount', 0, 8, '8 dòng / 8', 12, 500, '#64748BFF', compPagin.id);
  const pBtn1 = await createFrame('P1', 90, 3, 26, 26, '#0D3B85FF', null, 4, compPagin.id);
  await createText('P1T', 10, 5, '1', 12, 600, '#FFFFFFFF', pBtn1.id);

  console.log('=== UNIVERSITY DASHBOARD BUILD FINISHED SUCCESSFULLY! ===');
}

buildUniversityDashboard().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});
