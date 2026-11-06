import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  Copy, 
  ExternalLink,
  Layers,
  Code
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function DesignSystemPage() {
  const [toggleState, setToggleState] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);

  const colors = [
    { name: 'Primary Purple (Stripe)', hex: '#635BFF', bg: 'bg-[#635BFF]', text: 'text-white' },
    { name: 'Indigo Accent', hex: '#4F46E5', bg: 'bg-[#4F46E5]', text: 'text-white' },
    { name: 'Cactus Green', hex: '#10B981', bg: 'bg-[#10B981]', text: 'text-white' },
    { name: 'Slate Dark (Headings)', hex: '#0F172A', bg: 'bg-[#0F172A]', text: 'text-white' },
    { name: 'Slate Body', hex: '#475569', bg: 'bg-[#475569]', text: 'text-white' },
    { name: 'Slate Muted', hex: '#64748B', bg: 'bg-[#64748B]', text: 'text-white' },
    { name: 'Border Slate', hex: '#E2E8F0', bg: 'bg-[#E2E8F0]', text: 'text-slate-800' },
    { name: 'Canvas Background', hex: '#F8F9FA', bg: 'bg-[#F8F9FA]', text: 'text-slate-800' },
  ];

  const handleCopyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header matching Frame 13:477 */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#635BFF] uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Figma Frame 13:477 Reference</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Cactus Practice — Design System & UI Components
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Exact color tokens, typography, micro-components, and layout rules extracted directly from Figma.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>1. Color Tokens</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {colors.map((c) => (
            <div 
              key={c.hex}
              onClick={() => handleCopyColor(c.hex)}
              className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-xs cursor-pointer hover:border-slate-300 transition group"
            >
              <div className={`h-14 w-full rounded-lg ${c.bg} flex items-center justify-center shadow-xs transition group-hover:scale-[1.02]`}>
                {copiedColor === c.hex && (
                  <span className={`text-[11px] font-bold ${c.text}`}>Copied!</span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-2 truncate">{c.name}</p>
              <p className="text-[11px] font-mono text-slate-400">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interactive Buttons & Links */}
      <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          2. Buttons & Link Components
        </h2>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Primary Button */}
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Comp_Btn_Primary</p>
            <button className="px-4 py-2 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer">
              Primary Action
            </button>
          </div>

          {/* Outline Button */}
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Comp_Btn_Outline</p>
            <button className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition cursor-pointer">
              Outline Action
            </button>
          </div>

          {/* Link Component */}
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Comp_Link</p>
            <button className="text-xs font-semibold text-[#635BFF] hover:underline pt-2 inline-flex items-center gap-1 cursor-pointer">
              <span>View details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Status Badges */}
      <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          3. Status Badge Variants
        </h2>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Badge_Comp_Succ</p>
            <StatusBadge type="success">Succeeded ✓</StatusBadge>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Badge_Comp_Act</p>
            <StatusBadge type="blue">Active Plan</StatusBadge>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Badge_Comp_Def</p>
            <StatusBadge type="pending">Pending Settlement</StatusBadge>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Badge_Comp_Neut</p>
            <StatusBadge type="neutral">Refunded</StatusBadge>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Badge_Comp_Danger</p>
            <StatusBadge type="error">Payment Failed</StatusBadge>
          </div>
        </div>
      </section>

      {/* 4. Inputs & Toggles */}
      <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          4. Form Inputs & Interactive Toggles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">Comp_Input</p>
            <input
              type="text"
              placeholder="Ví dụ: Nhập tên khách nợ..."
              defaultValue="Công ty CP Tập đoàn Hoàng Phát"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]"
            />
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-mono mb-1">ToggleSwitch (State: {toggleState ? 'ON' : 'OFF'})</p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setToggleState(!toggleState)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  toggleState ? 'bg-[#635BFF]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out transform ${
                    toggleState ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs text-slate-600 font-medium">Enable automatic webhook dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Typography Specs */}
      <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          5. Typography Hierarchy
        </h2>
        <div className="space-y-3 pt-2">
          <div>
            <p className="text-[10px] text-slate-400 font-mono">Display / KPI (Inter Bold 24px - 32px)</p>
            <p className="text-2xl font-bold text-slate-900">$128,490.00 USD</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono">Page Title (Inter Bold 20px)</p>
            <p className="text-xl font-bold text-slate-900">Danh Sách Khách Nợ & Sổ Theo Dõi Công Nợ</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono">Card Subtitle / Header (Inter SemiBold 14px)</p>
            <p className="text-sm font-semibold text-slate-900">Giao Dịch Đối Soát & Giải Ngân Ngân Hàng</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono">Body / Table cell (Inter Regular 12px - 13px)</p>
            <p className="text-xs text-slate-600">Ghi nhận giao dịch thanh toán phân kỳ theo hợp đồng thu hồi nợ.</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono">Code / IDs (JetBrains Mono 11px)</p>
            <p className="text-[11px] font-mono text-slate-500">ch_3N9281h192aa • cus_O9281h192aa</p>
          </div>
        </div>
      </section>
    </div>
  );
}
