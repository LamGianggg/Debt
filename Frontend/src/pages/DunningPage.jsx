import React, { useState } from 'react';
import { Search, X, BellRing, PhoneCall, Mail, AlertTriangle, Send, Download, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function DunningPage() {
  const { dunningWorklist, sendDunningReminder, t, setActiveModal } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTierTab, setActiveTierTab] = useState('ALL');
  const [remindedItems, setRemindedItems] = useState({});

  const filteredItems = dunningWorklist.filter(item => {
    // Tier filter
    if (activeTierTab !== 'ALL') {
      const tierStr = (item.tier || '').toUpperCase();
      if (activeTierTab === 'TIER4' && !tierStr.includes('TẦNG 4') && !tierStr.includes('35')) return false;
      if (activeTierTab === 'TIER2' && !tierStr.includes('TẦNG 2')) return false;
      if (activeTierTab === 'TIER1' && !tierStr.includes('TẦNG 1')) return false;
      if (activeTierTab === 'T3' && !tierStr.includes('T-3')) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCust = (item.customer || '').toLowerCase().includes(q);
      const matchContact = (item.contact || '').toLowerCase().includes(q);
      const matchAmt = (item.overdueAmount || '').toLowerCase().includes(q);
      return matchCust || matchContact || matchAmt;
    }

    return true;
  });

  const handleSendReminder = (idx, customer) => {
    sendDunningReminder(idx);
    setRemindedItems(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setRemindedItems(prev => ({ ...prev, [idx]: false }));
    }, 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('dunningTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('dunningSub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('export')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('export')}</span>
          </button>
        </div>
      </div>

      {/* Dunning Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tier Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'TIER4', label: 'Tầng 4 (Quá hạn >30d)' },
              { id: 'TIER2', label: 'Tầng 2 (Quá hạn 7-14d)' },
              { id: 'TIER1', label: 'Tầng 1 (Quá hạn 1-6d)' },
              { id: 'T3', label: 'T-3 (Sắp đến hạn)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTierTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTierTab === tab.id
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm khách hàng nợ, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">{t('priority')}</th>
                <th className="p-4">KHÁCH HÀNG & LIÊN HỆ</th>
                <th className="p-4">{t('overdueCol')}</th>
                <th className="p-4">{t('dunningTierCol')}</th>
                <th className="p-4">{t('historyCol')}</th>
                <th className="p-4 text-right">{t('triggerAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    {t('noDataMatch')}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-xs">{item.priority}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{item.customer}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.contact}</div>
                    </td>
                    <td className="p-4 font-bold font-mono text-slate-900">{item.overdueAmount}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.tier}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-[11px] max-w-xs">{item.history}</td>
                    <td className="p-4 text-right">
                      {remindedItems[idx] ? (
                        <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã gửi ZNS!</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendReminder(idx, item.customer)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          {item.action || 'Gửi nhắc nợ'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer record counter */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-slate-400 text-xs text-right pr-6">
          {t('showing')} {filteredItems.length} / {dunningWorklist.length} {t('records')}
        </div>
      </div>
    </div>
  );
}
