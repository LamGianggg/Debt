import http from 'http';

export function callTool(command, args) {
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
            setTimeout(() => resolve(content), 15);
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

// Basic Primitives
export async function createFrame(name, x, y, width, height, fill = null, stroke = null, cornerRadius = 0, parentId = null) {
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

export async function createRect(name, x, y, width, height, fill = null, stroke = null, cornerRadius = 0, parentId = null) {
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

export async function createText(name, x, y, text, fontSize = 13, fontWeight = 400, color = '#1E293BFF', parentId = null) {
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

// ==========================================
// VECTOR ICONS & GRAPHICS
// ==========================================

// 1. Cactus Practice Logo
export async function createCactusLogo(x, y, parentId = null) {
  const f = await createFrame('CactusLogo', x, y, 20, 20, '#10B981FF', null, 5, parentId);
  // Main trunk
  await createRect('Stem', 8, 4, 4, 12, '#FFFFFFFF', null, 2, f.id);
  // Left arm
  await createRect('ArmL_H', 4, 8, 5, 3, '#FFFFFFFF', null, 1, f.id);
  await createRect('ArmL_V', 4, 5, 3, 5, '#FFFFFFFF', null, 1, f.id);
  // Right arm
  await createRect('ArmR_H', 11, 10, 5, 3, '#FFFFFFFF', null, 1, f.id);
  await createRect('ArmR_V', 13, 7, 3, 5, '#FFFFFFFF', null, 1, f.id);
  return f;
}

// 2. Chevron Down
export async function createChevronDown(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('ChevronDown', x, y, 8, 6, null, null, 0, parentId);
  await createRect('ArmL', 1, 1, 3.5, 1.5, color, null, 0.7, f.id);
  await createRect('ArmR', 3.5, 1, 3.5, 1.5, color, null, 0.7, f.id);
  await createRect('Tip', 3, 2.5, 2, 1.5, color, null, 0.7, f.id);
  return f;
}

// 3. Home Icon
export async function createHomeIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Home', x, y, 16, 16, null, null, 0, parentId);
  await createRect('RoofRidge', 6, 1, 4, 2.5, color, null, 1, f.id);
  await createRect('RoofBeam', 1, 3, 14, 2, color, null, 1, f.id);
  await createRect('HouseBody', 3, 5, 10, 9, null, color, 1, f.id);
  await createRect('Door', 6, 8, 4, 6, color, null, 1, f.id);
  return f;
}

// 4. Payments Icon (Double Arrows / Cards)
export async function createPaymentsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Payments', x, y, 16, 16, null, null, 0, parentId);
  // Arrow down
  await createRect('ArrowDownStem', 4, 3, 2, 8, color, null, 1, f.id);
  await createRect('ArrowDownTipL', 2, 8, 3, 2, color, null, 1, f.id);
  await createRect('ArrowDownTipR', 5, 8, 3, 2, color, null, 1, f.id);
  // Arrow up
  await createRect('ArrowUpStem', 10, 5, 2, 8, color, null, 1, f.id);
  await createRect('ArrowUpTipL', 8, 6, 3, 2, color, null, 1, f.id);
  await createRect('ArrowUpTipR', 11, 6, 3, 2, color, null, 1, f.id);
  return f;
}

// 5. Balances Icon (Scale)
export async function createBalancesIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Balances', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Post', 7, 2, 2, 12, color, null, 1, f.id);
  await createRect('Beam', 2, 3, 12, 2, color, null, 1, f.id);
  await createRect('Base', 4, 13, 8, 2, color, null, 1, f.id);
  await createRect('PanL', 1, 7, 5, 3, null, color, 1, f.id);
  await createRect('PanR', 10, 7, 5, 3, null, color, 1, f.id);
  return f;
}

// 6. Customers Icon (Silhouette & active dot)
export async function createCustomersIcon(x, y, color = '#4F46E5FF', parentId = null) {
  const f = await createFrame('Icon_Customers', x, y, 16, 16, null, null, 0, parentId);
  // Circular dot highlight
  await createRect('OuterDot', 2, 2, 12, 12, color, null, 6, f.id);
  await createRect('InnerDot', 5, 5, 6, 6, '#FFFFFFFF', null, 3, f.id);
  return f;
}

// 7. Connected Accounts Icon (Globe/Nodes)
export async function createConnectedIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Connected', x, y, 16, 16, null, null, 0, parentId);
  await createRect('GlobeRing', 1, 1, 14, 14, null, color, 7, f.id);
  await createRect('Equator', 2, 7, 12, 2, color, null, 0, f.id);
  await createRect('Meridian', 6, 2, 4, 12, null, color, 2, f.id);
  return f;
}

// 8. Products Icon (Cube)
export async function createProductsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Products', x, y, 16, 16, null, null, 0, parentId);
  await createRect('BoxOuter', 1, 1, 14, 14, null, color, 2, f.id);
  await createRect('CenterLineH', 1, 7, 14, 1.5, color, null, 0, f.id);
  await createRect('CenterLineV', 7, 1, 1.5, 14, color, null, 0, f.id);
  return f;
}

// 9. Reports Icon (Bar chart)
export async function createReportsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Reports', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Bar1', 2, 9, 3, 6, color, null, 1, f.id);
  await createRect('Bar2', 6, 5, 3, 10, color, null, 1, f.id);
  await createRect('Bar3', 11, 2, 3, 13, color, null, 1, f.id);
  return f;
}

// 10. Developers Icon (>_)
export async function createDevelopersIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Developers', x, y, 16, 16, null, null, 0, parentId);
  await createRect('TerminalBg', 1, 2, 14, 12, null, color, 2, f.id);
  await createRect('ArrowTop', 4, 5, 3, 1.5, color, null, 0.7, f.id);
  await createRect('ArrowBot', 4, 8, 3, 1.5, color, null, 0.7, f.id);
  await createRect('CursorLine', 9, 10, 4, 1.5, color, null, 0.5, f.id);
  return f;
}

// 11. Toggle Switch
export async function createToggleSwitch(x, y, isOn = false, parentId = null) {
  const bg = isOn ? '#4F46E5FF' : '#E2E8F0FF';
  const f = await createFrame('ToggleSwitch', x, y, 24, 14, bg, null, 7, parentId);
  const knobX = isOn ? 12 : 2;
  await createRect('Knob', knobX, 2, 10, 10, '#FFFFFFFF', '#CBD5E1FF', 5, f.id);
  return f;
}

// 12. Settings Icon (Gear)
export async function createSettingsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Settings', x, y, 16, 16, null, null, 0, parentId);
  await createRect('GearCenter', 4, 4, 8, 8, null, color, 4, f.id);
  await createRect('SpokeT', 7, 0, 2, 4, color, null, 0, f.id);
  await createRect('SpokeB', 7, 12, 2, 4, color, null, 0, f.id);
  await createRect('SpokeL', 0, 7, 4, 2, color, null, 0, f.id);
  await createRect('SpokeR', 12, 7, 4, 2, color, null, 0, f.id);
  return f;
}

// 13. Search Magnifying Glass
export async function createSearchIcon(x, y, color = '#94A3B8FF', parentId = null) {
  const f = await createFrame('Icon_Search', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Lens', 2, 2, 9, 9, null, color, 5, f.id);
  await createRect('Stem', 9, 9, 5, 2, color, null, 1, f.id);
  return f;
}

// 14. Megaphone Feedback Icon
export async function createMegaphoneIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Megaphone', x, y, 16, 16, null, null, 0, parentId);
  await createRect('HornCone', 2, 5, 8, 6, null, color, 1, f.id);
  await createRect('Mouth', 10, 3, 2, 10, color, null, 1, f.id);
  await createRect('Handle', 4, 10, 2, 4, color, null, 1, f.id);
  return f;
}

// 15. Notification Bell with Badge
export async function createBellWithBadge(x, y, count = '2', parentId = null) {
  const f = await createFrame('Icon_BellWithBadge', x, y, 20, 18, null, null, 0, parentId);
  // Bell body
  await createRect('Dome', 4, 3, 8, 8, null, '#64748BFF', 4, f.id);
  await createRect('Flange', 2, 11, 12, 2, '#64748BFF', null, 1, f.id);
  await createRect('Clapper', 7, 13, 2, 2, '#64748BFF', null, 1, f.id);
  // Badge
  if (count) {
    const badge = await createFrame('NotifBadge', 10, 0, 11, 11, '#EF4444FF', null, 6, f.id);
    await createText('BadgeNum', 2.5, 0.5, count, 8, 700, '#FFFFFFFF', badge.id);
  }
  return f;
}

// 16. Help Icon (?)
export async function createHelpIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Help', x, y, 16, 16, null, null, 0, parentId);
  await createRect('HelpRing', 1, 1, 14, 14, null, color, 7, f.id);
  await createText('Q', 5, 0.5, '?', 10, 700, color, f.id);
  return f;
}

// 17. User Profile Avatar
export async function createAvatarIcon(x, y, parentId = null) {
  const f = await createFrame('Icon_Avatar', x, y, 24, 24, '#E2E8F0FF', null, 12, parentId);
  await createRect('Head', 8, 4, 8, 8, '#64748BFF', null, 4, f.id);
  await createRect('Torso', 4, 13, 16, 8, '#64748BFF', null, 4, f.id);
  return f;
}

// 18. Plan Icon (Green target/eye in rounded square)
export async function createSubscriptionPlanIcon(x, y, parentId = null) {
  const f = await createFrame('Icon_SubPlan', x, y, 26, 26, '#10B981FF', null, 6, parentId);
  await createRect('Ring', 5, 5, 16, 16, null, '#FFFFFFFF', 8, f.id);
  await createRect('Dot', 10, 10, 6, 6, '#FFFFFFFF', null, 3, f.id);
  return f;
}

// 19. Visa Logo Card
export async function createVisaLogo(x, y, parentId = null) {
  const f = await createFrame('Card_Visa', x, y, 32, 22, '#0A2540FF', null, 4, parentId);
  await createText('VisaText', 4, 4, 'VISA', 10, 700, '#FFFFFFFF', f.id);
  return f;
}

// 20. Action Icons (Pencil, Trash, X, More)
export async function createPencilIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Pencil', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Shaft', 4, 3, 8, 3, color, null, 1, f.id);
  await createRect('Tip', 2, 7, 3, 3, color, null, 1, f.id);
  return f;
}

export async function createCancelXIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_CloseX', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Line1', 3, 7, 10, 2, color, null, 1, f.id);
  await createRect('Line2', 7, 3, 2, 10, color, null, 1, f.id);
  return f;
}

export async function createTrashIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_Trash', x, y, 16, 16, null, null, 0, parentId);
  await createRect('Lid', 3, 2, 10, 2, color, null, 1, f.id);
  await createRect('Can', 4, 5, 8, 9, null, color, 1, f.id);
  return f;
}

export async function createMoreDotsIcon(x, y, color = '#64748BFF', parentId = null) {
  const f = await createFrame('Icon_More', x, y, 16, 16, null, null, 0, parentId);
  await createRect('D1', 2, 7, 3, 3, color, null, 1.5, f.id);
  await createRect('D2', 7, 7, 3, 3, color, null, 1.5, f.id);
  await createRect('D3', 12, 7, 3, 3, color, null, 1.5, f.id);
  return f;
}

// 21. Checkbox
export async function createCheckbox(x, y, isChecked = false, parentId = null) {
  const f = await createFrame('Checkbox', x, y, 14, 14, '#FFFFFFFF', '#CBD5E1FF', 3, parentId);
  if (isChecked) {
    await createRect('Checkmark', 3, 3, 8, 8, '#4F46E5FF', null, 2, f.id);
  }
  return f;
}

// 22. Status Badges
export async function createBadge(name, x, y, text, type = 'success', parentId = null) {
  let bg = '#DEF7ECFF';
  let textColor = '#03543FFF';
  let hasCheck = false;

  if (type === 'success') {
    bg = '#DEF7ECFF';
    textColor = '#03543FFF';
    hasCheck = true;
  } else if (type === 'active') {
    bg = '#DEF7ECFF';
    textColor = '#03543FFF';
  } else if (type === 'default') {
    bg = '#E0EAFFFF';
    textColor = '#3559E0FF';
  } else if (type === 'neutral') {
    bg = '#F1F5F9FF';
    textColor = '#475569FF';
  }

  const width = hasCheck ? 80 : 54;
  const f = await createFrame(`Badge_${name}`, x, y, width, 18, bg, null, 9, parentId);
  if (hasCheck) {
    await createText('Check', 6, 2, '✓', 9, 700, textColor, f.id);
    await createText('Text', 16, 2, text, 10, 600, textColor, f.id);
  } else {
    await createText('Text', 8, 2, text, 10, 600, textColor, f.id);
  }
  return f;
}
