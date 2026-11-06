import http from 'http';

// Communication with Figma MCP Server
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

// Basic Figma Primitives
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

async function createText(name, x, y, text, fontSize = 13, fontWeight = 400, color = '#263238FF', parentId = null) {
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

// --- VECTOR ICONS ---

// 1. Rocket Rides Brand Logo
async function createRocketLogo(x, y, parentId) {
  const f = await createFrame('BrandLogo', x, y, 22, 22, null, null, 0, parentId);
  // Speed dashes / rocket streams
  await createRect('Speed1', 2, 6, 7, 2, '#4F566BFF', null, 1, f.id);
  await createRect('Speed2', 0, 10, 10, 2, '#4F566BFF', null, 1, f.id);
  await createRect('Speed3', 3, 14, 6, 2, '#4F566BFF', null, 1, f.id);
  // Rocket capsule body
  await createRect('Capsule', 9, 7, 10, 8, null, '#4F566BFF', 4, f.id);
  await createRect('FinTop', 11, 4, 3, 3, '#4F566BFF', null, 1, f.id);
  await createRect('FinBottom', 11, 15, 3, 3, '#4F566BFF', null, 1, f.id);
  return f;
}

// Chevron Down Vector Icon
async function createChevronDown(x, y, color = '#697386FF', parentId = null) {
  const f = await createFrame('ChevronDown', x, y, 10, 8, null, null, 0, parentId);
  await createRect('ArmL', 1, 2, 4.5, 1.5, color, null, 0.7, f.id);
  await createRect('ArmR', 4.5, 2, 4.5, 1.5, color, null, 0.7, f.id);
  await createRect('Tip', 4, 3.5, 2, 1.5, color, null, 0.7, f.id);
  return f;
}

// 2. Home Icon
async function createHomeIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Home', x, y, 16, 16, null, null, 0, parentId);
  await createRect('RoofRidge', 6, 1, 4, 3, color, null, 1, f.id);
  await createRect('RoofBeam', 1, 3, 14, 2, color, null, 1, f.id);
  await createRect('HouseBody', 3, 5, 10, 9, null, color, 1, f.id);
  await createRect('Door', 6, 8, 4, 6, color, null, 1, f.id);
  return f;
}

// 3. Payments Icon (Credit Card)
async function createPaymentsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Payments', x, y, 16, 16, null, null, 0, parentId);
  await createRect('CardOutline', 1, 2, 14, 11, null, color, 2, f.id);
  await createRect('MagStripe', 1, 5, 14, 2, color, null, 0, f.id);
  await createRect('CardChip', 3, 9, 3, 2, color, null, 1, f.id);
  return f;
}

// 4. Customers Icon (Silhouette)
async function createCustomersIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Customers', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Head', 5, 1, 6, 6, null, color, 3, f.id);
  await createRect('Torso', 2, 9, 12, 6, null, color, 3, f.id);
  return f;
}

// 5. Products Icon (Cube)
async function createProductsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Products', x, y, 16, 16, null, null, 0, parentId);
  await createRect('OuterBox', 2, 2, 12, 12, null, color, 2, f.id);
  await createRect('CenterLineH', 2, 7, 12, 1.5, color, null, 0, f.id);
  await createRect('CenterLineV', 7, 2, 1.5, 12, color, null, 0, f.id);
  return f;
}

// 6. Reports Icon (Bar chart)
async function createReportsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Reports', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Bar1', 2, 9, 3, 6, color, null, 1, f.id);
  await createRect('Bar2', 6, 5, 3, 10, color, null, 1, f.id);
  await createRect('Bar3', 11, 2, 3, 13, color, null, 1, f.id);
  return f;
}

// 7. Accounts Icon (Active Blue Circular Badge)
async function createAccountsIcon(x, y, parentId = null) {
  const f = await createFrame('Icon_Accounts', x, y, 16, 16, '#3B82F6FF', null, 8, parentId);
  // Inner white crescent / detail
  await createRect('AccInner1', 4, 4, 8, 8, '#FFFFFFFF', null, 4, f.id);
  await createRect('AccInner2', 6, 4, 6, 8, '#3B82F6FF', null, 3, f.id);
  return f;
}

// 8. Apps Icon (4-grid)
async function createAppsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Apps', x, y, 16, 16, null, null, 0, parentId);
  await createRect('sq1', 2, 2, 5, 5, color, null, 1, f.id);
  await createRect('sq2', 9, 2, 5, 5, color, null, 1, f.id);
  await createRect('sq3', 2, 9, 5, 5, color, null, 1, f.id);
  await createRect('sq4', 9, 9, 5, 5, color, null, 1, f.id);
  return f;
}

// 9. Developers Icon (< >)
async function createDevelopersIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Developers', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Screen', 1, 2, 14, 12, null, color, 2, f.id);
  await createRect('AngleL', 4, 6, 3, 2, color, null, 1, f.id);
  await createRect('AngleR', 9, 6, 3, 2, color, null, 1, f.id);
  await createRect('Slash', 7, 5, 2, 5, color, null, 0, f.id);
  return f;
}

// 10. Toggle Switch ("Viewing test data")
async function createToggleSwitch(x, y, parentId = null) {
  const f = await createFrame('Toggle_ViewingTestData', x, y, 24, 14, '#CBD5E1FF', null, 7, parentId);
  // Round thumb/knob at left (off state)
  await createRect('Knob', 2, 2, 10, 10, '#FFFFFFFF', null, 5, f.id);
  return f;
}

// 11. Camera floating icon (Bottom left)
async function createCameraFloatingIcon(x, y, parentId = null) {
  const f = await createFrame('CameraOverlayButton', x, y, 64, 64, '#3C4257EE', null, 32, parentId);
  // Camera body outline
  await createRect('CamBody', 16, 20, 32, 24, null, '#FFFFFFFF', 5, f.id);
  // Lens circle
  await createRect('CamLens', 25, 26, 14, 14, null, '#FFFFFFFF', 7, f.id);
  await createRect('CamLensCenter', 29, 30, 6, 6, '#FFFFFFFF', null, 3, f.id);
  // Top bump / flash
  await createRect('CamTop', 28, 17, 8, 4, '#FFFFFFFF', null, 2, f.id);
  return f;
}

// 12. Search Magnifying Glass
async function createSearchIcon(x, y, color = '#8792A2FF', parentId = null) {
  const f = await createFrame('Icon_Search', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Lens', 2, 2, 9, 9, null, color, 5, f.id);
  await createRect('Stem', 9, 9, 5, 2, color, null, 1, f.id);
  return f;
}

// 13. Notification Bell Icon
async function createBellIcon(x, y, color = '#3B82F6FF', parentId = null) {
  const f = await createFrame('Icon_Bell', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Dome', 4, 2, 8, 8, null, color, 4, f.id);
  await createRect('Flange', 2, 10, 12, 2, color, null, 1, f.id);
  await createRect('Clapper', 7, 12, 2, 2, color, null, 1, f.id);
  return f;
}

// 14. Help Question Icon
async function createHelpIcon(x, y, color = '#4F566BFF', parentId = null) {
  const f = await createFrame('Icon_Help', x, y, 16, 16, null, null, 0, parentId);
  await createRect('HelpCircle', 1, 1, 14, 14, null, color, 7, f.id);
  await createText('QMark', 5, 1, '?', 10, 700, color, f.id);
  return f;
}

// 15. User Profile Icon
async function createUserProfileIcon(x, y, color = '#4F566BFF', parentId = null) {
  const f = await createFrame('Icon_Profile', x, y, 18, 18, null, null, 0, parentId);
  await createRect('OuterRing', 1, 1, 16, 16, null, color, 8, f.id);
  await createRect('ProfHead', 6, 3, 6, 6, color, null, 3, f.id);
  await createRect('ProfBody', 4, 11, 10, 5, color, null, 3, f.id);
  return f;
}

// 16. Funnel Filter Icon
async function createFunnelIcon(x, y, color = '#4F566BFF', parentId = null) {
  const f = await createFrame('Icon_Filter', x, y, 12, 12, null, null, 0, parentId);
  await createRect('TopFunnel', 1, 2, 10, 2, color, null, 1, f.id);
  await createRect('MidFunnel', 3, 4, 6, 2, color, null, 1, f.id);
  await createRect('Spout', 5, 6, 2, 4, color, null, 0, f.id);
  return f;
}

// 17. Plus Icon
async function createPlusIcon(x, y, color = '#4F566BFF', parentId = null) {
  const f = await createFrame('Icon_Plus', x, y, 12, 12, null, null, 0, parentId);
  await createRect('HLine', 2, 5, 8, 2, color, null, 1, f.id);
  await createRect('VLine', 5, 2, 2, 8, color, null, 1, f.id);
  return f;
}

// 18. Export Icon
async function createExportIcon(x, y, color = '#4F566BFF', parentId = null) {
  const f = await createFrame('Icon_Export', x, y, 12, 12, null, null, 0, parentId);
  await createRect('BaseL', 2, 4, 2, 6, color, null, 0, f.id);
  await createRect('BaseB', 2, 9, 8, 2, color, null, 0, f.id);
  await createRect('ArrowStem', 4, 4, 6, 1.5, color, null, 0, f.id);
  await createRect('ArrowHeadH', 6, 2, 4, 1.5, color, null, 0, f.id);
  await createRect('ArrowHeadV', 8.5, 2, 1.5, 4, color, null, 0, f.id);
  return f;
}

// 19. Sort Indicator ⇅ (Chevron pair)
async function createSortIcon(x, y, color = '#7B8794FF', parentId = null) {
  const f = await createFrame('Icon_Sort', x, y, 8, 12, null, null, 0, parentId);
  await createRect('UpTip', 3, 1, 2, 2, color, null, 1, f.id);
  await createRect('UpBar', 1, 3, 6, 1.5, color, null, 0, f.id);
  await createRect('DownBar', 1, 7, 6, 1.5, color, null, 0, f.id);
  await createRect('DownTip', 3, 8.5, 2, 2, color, null, 1, f.id);
  return f;
}

// --- COUNTRY FLAGS ---

async function createFlagContainer(name, x, y, parentId = null) {
  const f = await createFrame(name, x, y, 16, 11, '#FFFFFFFF', '#E2E8F0FF', 1, parentId);
  return f;
}

// Belgium (Black, Yellow, Red vertical)
async function createBelgiumFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_Belgium', x, y, parentId);
  await createRect('StripeBlack', 0, 0, 5, 11, '#262626FF', null, 0, f.id);
  await createRect('StripeYellow', 5, 0, 6, 11, '#FCD116FF', null, 0, f.id);
  await createRect('StripeRed', 11, 0, 5, 11, '#CE1126FF', null, 0, f.id);
  return f;
}

// Thailand (Red, White, Blue, White, Red horizontal)
async function createThailandFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_Thailand', x, y, parentId);
  await createRect('TRed1', 0, 0, 16, 2, '#A51931FF', null, 0, f.id);
  await createRect('TWhite1', 0, 2, 16, 2, '#FFFFFFFF', null, 0, f.id);
  await createRect('TBlue', 0, 4, 16, 3, '#2D2A4AFF', null, 0, f.id);
  await createRect('TWhite2', 0, 7, 16, 2, '#FFFFFFFF', null, 0, f.id);
  await createRect('TRed2', 0, 9, 16, 2, '#A51931FF', null, 0, f.id);
  return f;
}

// Austria (Red, White, Red horizontal)
async function createAustriaFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_Austria', x, y, parentId);
  await createRect('ARed1', 0, 0, 16, 3.5, '#ED2939FF', null, 0, f.id);
  await createRect('AWhite', 0, 3.5, 16, 4, '#FFFFFFFF', null, 0, f.id);
  await createRect('ARed2', 0, 7.5, 16, 3.5, '#ED2939FF', null, 0, f.id);
  return f;
}

// Malaysia (Stripes + Blue canton)
async function createMalaysiaFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_Malaysia', x, y, parentId);
  await createRect('MStripe1', 0, 0, 16, 3, '#CC0000FF', null, 0, f.id);
  await createRect('MStripe2', 0, 3, 16, 3, '#FFFFFFFF', null, 0, f.id);
  await createRect('MStripe3', 0, 6, 16, 2.5, '#CC0000FF', null, 0, f.id);
  await createRect('MStripe4', 0, 8.5, 16, 2.5, '#FFFFFFFF', null, 0, f.id);
  await createRect('MCanton', 0, 0, 8, 6, '#000066FF', null, 0, f.id);
  await createRect('MStar', 3, 2, 3, 2, '#FFCC00FF', null, 1, f.id);
  return f;
}

// US Flag (Stripes + Blue canton)
async function createUSFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_USA', x, y, parentId);
  await createRect('UStripe1', 0, 0, 16, 3, '#B22234FF', null, 0, f.id);
  await createRect('UStripe2', 0, 3, 16, 2.5, '#FFFFFFFF', null, 0, f.id);
  await createRect('UStripe3', 0, 5.5, 16, 2.5, '#B22234FF', null, 0, f.id);
  await createRect('UStripe4', 0, 8, 16, 3, '#FFFFFFFF', null, 0, f.id);
  await createRect('UCanton', 0, 0, 7, 5.5, '#3C3B6EFF', null, 0, f.id);
  return f;
}

// Canada Flag (Red, White, Red)
async function createCanadaFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_Canada', x, y, parentId);
  await createRect('CRed1', 0, 0, 4, 11, '#FF0000FF', null, 0, f.id);
  await createRect('CWhite', 4, 0, 8, 11, '#FFFFFFFF', null, 0, f.id);
  await createRect('CRed2', 12, 0, 4, 11, '#FF0000FF', null, 0, f.id);
  await createRect('CLeaf', 7, 4, 3, 3, '#FF0000FF', null, 1, f.id);
  return f;
}

// South Africa Flag
async function createSouthAfricaFlag(x, y, parentId = null) {
  const f = await createFlagContainer('Flag_SouthAfrica', x, y, parentId);
  await createRect('SARed', 0, 0, 16, 4, '#DE3831FF', null, 0, f.id);
  await createRect('SABlue', 0, 7, 16, 4, '#002395FF', null, 0, f.id);
  await createRect('SAGreen', 0, 4, 16, 3, '#007A3DFF', null, 0, f.id);
  await createRect('SABlackTriangle', 0, 2, 4, 7, '#000000FF', null, 0, f.id);
  return f;
}

// --- STATUS BADGES WITH CRISP VECTOR ICONS ---

// Vector Checkmark for Enabled & Complete
async function createVectorCheckmark(x, y, color, parentId) {
  const f = await createFrame('Icon_Check', x, y, 10, 10, null, null, 0, parentId);
  await createRect('chk_l', 1, 4, 2, 3, color, null, 0.5, f.id);
  await createRect('chk_b', 2, 6, 3, 2, color, null, 0.5, f.id);
  await createRect('chk_r', 4, 2, 2, 6, color, null, 0.5, f.id);
  return f;
}

// Vector Sync/Refresh for Pending
async function createVectorRefresh(x, y, color, parentId) {
  const f = await createFrame('Icon_Refresh', x, y, 10, 10, null, null, 0, parentId);
  await createRect('rf_ring', 1, 1, 8, 8, null, color, 4, f.id);
  await createRect('rf_gap', 5, 0, 3, 3, '#F1F3F5FF', null, 0, f.id);
  await createRect('rf_arrow', 6, 1, 2.5, 2.5, color, null, 0.5, f.id);
  return f;
}

// Vector Restricted/Prohibited
async function createVectorRestricted(x, y, color, parentId) {
  const f = await createFrame('Icon_Restricted', x, y, 10, 10, null, null, 0, parentId);
  await createRect('rst_ring', 1, 1, 8, 8, null, color, 4, f.id);
  await createRect('rst_slash', 2, 4.5, 6, 1.5, color, null, 0.5, f.id);
  return f;
}

// Vector Warning for Restricted Soon
async function createVectorWarning(x, y, color, parentId) {
  const f = await createFrame('Icon_Warning', x, y, 10, 10, null, null, 0, parentId);
  await createRect('wrn_ring', 1, 1, 8, 8, null, color, 4, f.id);
  await createRect('wrn_bar', 4.2, 2.5, 1.6, 3, color, null, 0.5, f.id);
  await createRect('wrn_dot', 4.2, 6.2, 1.6, 1.5, color, null, 0.5, f.id);
  return f;
}

async function createStatusBadge(name, x, y, statusType, parentId = null) {
  const configs = {
    'Enabled': { bg: '#E6F4FFFF', text: '#0A66C2FF', w: 72, iconFn: createVectorCheckmark, iconX: 56 },
    'Complete': { bg: '#E6F4FFFF', text: '#0A66C2FF', w: 78, iconFn: createVectorCheckmark, iconX: 62 },
    'Pending': { bg: '#F1F3F5FF', text: '#495057FF', w: 72, iconFn: createVectorRefresh, iconX: 56 },
    'Restricted': { bg: '#FCE8E8FF', text: '#DC2626FF', w: 82, iconFn: createVectorRestricted, iconX: 66 },
    'Restricted soon': { bg: '#FFF4D6FF', text: '#B45309FF', w: 104, iconFn: createVectorWarning, iconX: 88 }
  };

  const cfg = configs[statusType] || configs['Complete'];
  const badge = await createFrame(name, x, y, cfg.w, 20, cfg.bg, null, 10, parentId);
  
  // Status text
  await createText('BadgeText', 8, 2, statusType, 11, 500, cfg.text, badge.id);
  
  // Vector Icon
  await cfg.iconFn(cfg.iconX, 5, cfg.text, badge.id);

  return badge;
}

export {
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
};
