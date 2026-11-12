import React, { useState } from 'react';
import { Search, X, ShieldCheck, Check, Ban, Download } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function MakerCheckerPage() {
  const { makerCheckerApprovals, processMakerChecker, isAdmin, t, setActiveModal } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('ALL');

  const filteredApprovals = makerCheckerApprovals.filter(req => {
    // Status filter
    if (activeStatusTab !== 'ALL') {
      const st = (req.status || 'PENDING').toUpperCase();
      if (activeStatusTab === 'PENDING' && st !== 'PENDING') return false;
      if (activeStatusTab === 'APPROVED' && st !== 'APPROVED') return false;
      if (activeStatusTab === 'REJECTED' && st !== 'REJECTED') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (req.id || '').toLowerCase().includes(q);
      const matchType = (req.type || '').toLowerCase().includes(q);
      const matchMaker = (req.maker || '').toLowerCase().includes(q);
      const matchReason = (req.reason || req.description || '').toLowerCase().includes(q);
      return matchId || matchType || matchMaker || matchReason;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('makerCheckerTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('makerCheckerSub')}
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

      {/* Approvals Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'PENDING', label: 'Chờ duyệt / Pending' },
              { id: 'APPROVED', label: 'Đã duyệt / Approved' },
              { id: 'REJECTED', label: 'Đã từ chối / Rejected' }
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm mã yêu cầu, Maker, lý do..."
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
                <th className="p-4">{t('requestId')}</th>
                <th className="p-4">{t('bizType')}</th>
                <th className="p-4">{t('makerUser')}</th>
                <th className="p-4">{t('explanation')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-right">{t('decision')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    {t('noDataMatch')}
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold font-mono text-blue-600">{req.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{req.type}</td>
                    <td className="p-4 text-slate-600 font-medium">{req.maker}</td>
                    <td className="p-4 text-slate-700 max-w-xs">{req.reason || req.description}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        (req.status || 'PENDING') === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : (req.status || 'PENDING') === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {req.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              processMakerChecker(req.id, 'APPROVED');
                              alert(`Đã phê duyệt yêu cầu ${req.id}!`);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 transition cursor-pointer shadow-2xs"
                          >
                            {t('approveBtn')}
                          </button>
                          <button
                            onClick={() => {
                              processMakerChecker(req.id, 'REJECTED');
                              alert(`Đã từ chối yêu cầu ${req.id}!`);
                            }}
                            className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs hover:bg-rose-700 transition cursor-pointer shadow-2xs"
                          >
                            {t('rejectBtn')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-amber-600 text-[11px] font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Chỉ CFO / Admin có quyền Checker
                        </span>
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
          {t('showing')} {filteredApprovals.length} / {makerCheckerApprovals.length} {t('records')}
        </div>
      </div>
    </div>
  );
}
