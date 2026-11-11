import http from 'http';

export function callTool(command, args) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ command, args });
    const req = http.request('http://localhost:38450/api/task', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
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
            setTimeout(() => resolve(content), 12);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
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

// Brand Logo: FinDebt O2C & AR Automation
export async function createFinDebtLogo(x, y, parentId = null) {
  const f = await createFrame('Brand_Logo', x, y, 24, 24, '#4F46E5FF', null, 6, parentId);
  // Shield / Vault geometric lines
  await createRect('OuterShield', 4, 3, 16, 18, null, '#FFFFFFFF', 4, f.id);
  await createRect('InnerCore', 8, 7, 8, 10, '#38BDF8FF', null, 2, f.id);
  await createRect('CurrencyCheck', 10, 11, 4, 2, '#FFFFFFFF', null, 0, f.id);
  return f;
}

// Dynamic VietQR Card Mockup
export async function createVietQRComponent(x, y, invCode, customerName, amount, vaNumber, parentId = null) {
  const card = await createFrame(`VietQR_${invCode}`, x, y, 220, 260, '#FFFFFFFF', '#E2E8F0FF', 10, parentId);
  // QR Header
  await createFrame('QRHeaderBg', 0, 0, 220, 36, '#0052CCFF', null, 0, card.id);
  await createText('VietQRTitle', 12, 10, 'VietQR PRO • NAPAS 247', 11, 700, '#FFFFFFFF', card.id);
  
  // QR Code Matrix Box
  const qrBox = await createFrame('QRMatrix', 30, 48, 160, 160, '#F8FAFCFF', '#CBD5E1FF', 6, card.id);
  // QR Corners
  await createRect('QRC1', 12, 12, 34, 34, '#0F172AFF', null, 4, qrBox.id);
  await createRect('QRC1_in', 18, 18, 22, 22, '#FFFFFFFF', null, 2, qrBox.id);
  await createRect('QRC1_dot', 24, 24, 10, 10, '#0F172AFF', null, 1, qrBox.id);

  await createRect('QRC2', 114, 12, 34, 34, '#0F172AFF', null, 4, qrBox.id);
  await createRect('QRC2_in', 120, 18, 22, 22, '#FFFFFFFF', null, 2, qrBox.id);
  await createRect('QRC2_dot', 126, 24, 10, 10, '#0F172AFF', null, 1, qrBox.id);

  await createRect('QRC3', 12, 114, 34, 34, '#0F172AFF', null, 4, qrBox.id);
  await createRect('QRC3_in', 18, 120, 22, 22, '#FFFFFFFF', null, 2, qrBox.id);
  await createRect('QRC3_dot', 24, 126, 10, 10, '#0F172AFF', null, 1, qrBox.id);

  // Center Bank Logo
  await createFrame('CenterBankLogo', 66, 66, 28, 28, '#0052CCFF', '#FFFFFFFF', 4, qrBox.id);
  await createText('BankTag', 70, 72, 'MB', 10, 800, '#FFFFFFFF', qrBox.id);

  // Footer Metadata
  await createText('VALabel', 12, 214, `TK Ảo (VA): ${vaNumber}`, 11, 600, '#0F172AFF', card.id);
  await createText('InvLabel', 12, 230, `Cú pháp: ${invCode}`, 10, 500, '#4F46E5FF', card.id);
  await createText('AmtLabel', 12, 244, `Số tiền: ${amount}`, 11, 700, '#059669FF', card.id);
  return card;
}

// Badge Component
export async function createStatusBadge(x, y, text, type = 'success', parentId = null) {
  const configs = {
    paid: { bg: '#DEF7ECFF', text: '#03543FFF', border: '#A7F3D0FF' },
    partially_paid: { bg: '#E0EAFFFF', text: '#1D4ED8FF', border: '#BFDBFEFF' },
    overdue_t1: { bg: '#FEF08AFF', text: '#854D0EFF', border: '#FDE047FF' },
    overdue_t2: { bg: '#FFEDD5FF', text: '#C2410CFF', border: '#FDBA74FF' },
    overdue_t3: { bg: '#FEE2E2FF', text: '#B91C1CFF', border: '#FCA5A5FF' },
    default_debt: { bg: '#FCE7F3FF', text: '#9D174DFF', border: '#F472B6FF' },
    disputed: { bg: '#FEF3C7FF', text: '#D97706FF', border: '#FCD34DFF' },
    ptp_active: { bg: '#EEF2FFFF', text: '#4338CAFF', border: '#C7D2FEFF' },
    unapplied: { bg: '#CCFBF1FF', text: '#0F766EFF', border: '#99F6E4FF' }
  };
  const c = configs[type.toLowerCase()] || configs.paid;
  const width = Math.max(70, text.length * 7.5 + 16);
  const badge = await createFrame(`Badge_${type}`, x, y, width, 20, c.bg, c.border, 4, parentId);
  await createText('BadgeText', 8, 3, text, 11, 600, c.text, badge.id);
  return badge;
}
