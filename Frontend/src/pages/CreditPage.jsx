import React, { useState } from 'react';
import { Search, X, Check, ShieldCheck, AlertTriangle, Download, Plus } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function CreditPage() {
  const { salesOrders, approveOrderCredit, isAdmin, t, setActiveModal } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('ALL');

  const filteredOrders = salesOrders.filter(so => {
    // Status filter
    if (activeStatusTab !== 'ALL') {
      const st = (so.creditStatus || so.status || '').toUpperCase();
      if (activeStatusTab === 'APPROVED' && !st.includes('PASS') && !st.includes('APPROVED')) return false;
      if (activeStatusTab === 'HOLD' && !st.includes('HOLD')) return false;
      if (activeStatusTab === 'PREPAID' && !st.includes('PREPAID')) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (so.id || '').toLowerCase().includes(q);
      const matchCust = (so.customer || so.customerName || '').toLowerCase().includes(q);
      const matchAmt = (so.amount || so.orderAmount || '').toLowerCase().includes(q);
      return matchId || matchCust || matchAmt;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('creditTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('creditSub')}
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

      {/* Orders Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'APPROVED', label: 'Đã Duyệt / Pass' },
              { id: 'HOLD', label: 'Bị Chặn / On Hold' },
              { id: 'PREPAID', label: 'Cọc Trước / Prepaid' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeStatusTab === tab.id
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn SO, tên khách hàng..."
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
                <th className="p-4">{t('soNumber')}</th>
                <th className="p-4">{t('client')}</th>
                <th className="p-4">{t('orderValue')}</th>
                <th className="p-4">{t('remainingCredit')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    {t('noDataMatch')}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((so) => (
                  <tr key={so.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold font-mono text-blue-600">{so.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{so.customer || so.customerName}</td>
                    <td className="p-4 font-bold font-mono text-slate-900">{so.amount || so.orderAmount}</td>
                    <td className="p-4 font-mono text-slate-600">{so.availableCredit || so.creditLimit}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        so.creditStatus === 'PASS' || so.status === 'APPROVED_RESERVED' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : so.status === 'PREPAID_DEPOSIT'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {so.statusText || so.creditStatus || so.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <button
                          onClick={() => {
                            approveOrderCredit(so.id);
                            alert(`Admin đã phê duyệt đơn ${so.id}!`);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-2xs"
                        >
                          {t('approveOrder')}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">{t('awaitingAdmin')}</span>
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
          {t('showing')} {filteredOrders.length} / {salesOrders.length} {t('records')}
        </div>
      </div>
    </div>
  );
}
