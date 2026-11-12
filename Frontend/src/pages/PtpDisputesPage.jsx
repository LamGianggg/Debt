import React, { useState } from 'react';
import { Search, X, Scale, CheckCircle2, AlertCircle, Download, Clock } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function PtpDisputesPage() {
  const { ptpList, disputesList, resolveDispute, t, setActiveModal } = useDashboard();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.toLowerCase().trim();

  const filteredPtp = ptpList.filter(item => {
    if (activeTab === 'DISPUTES') return false;
    if (!q) return true;
    return (item.customer || '').toLowerCase().includes(q) || (item.promiseAmount || '').toLowerCase().includes(q);
  });

  const filteredDisputes = disputesList.filter(item => {
    if (activeTab === 'PTP') return false;
    if (!q) return true;
    return (item.customer || '').toLowerCase().includes(q) || (item.invoiceId || '').toLowerCase().includes(q) || (item.reason || '').toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cam Kết Trả Nợ (PTP) & Xử Lý Khiếu Nại
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi lời hứa thanh toán Promise-to-Pay và giải quyết tranh chấp hóa đơn, tạm dừng đôn đốc tự động.
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

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'PTP', label: 'Cam Kết Trả (PTP)' },
              { id: 'DISPUTES', label: 'Khiếu Nại & Tranh Chấp' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
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
              placeholder="Tìm khách hàng, mã HĐ, lý do..."
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

        {/* PTP Section */}
        {activeTab !== 'DISPUTES' && (
          <div className="p-5 border-b border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Danh Sách Cam Kết Thanh Toán (Promise-to-Pay)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">KHÁCH HÀNG</th>
                    <th className="p-3">SỐ TIỀN CAM KẾT</th>
                    <th className="p-3">NGÀY HỨA TRẢ</th>
                    <th className="p-3">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPtp.map((ptp, i) => (
                    <tr key={i} className="hover:bg-slate-50/70">
                      <td className="p-3 font-semibold text-slate-900">{ptp.customer}</td>
                      <td className="p-3 font-bold font-mono text-slate-900">{ptp.promiseAmount}</td>
                      <td className="p-3 text-slate-600">{ptp.promiseDate}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ptp.status === 'ON_TRACK' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {ptp.statusText || ptp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disputes Section */}
        {activeTab !== 'PTP' && (
          <div className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hàng Chờ Khiếu Nại & Tạm Dừng Đôn Đốc (Disputes)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">MÃ HĐ</th>
                    <th className="p-3">KHÁCH HÀNG</th>
                    <th className="p-3">SỐ TIỀN TRANH CHẤP</th>
                    <th className="p-3">LÝ DO</th>
                    <th className="p-3 text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDisputes.map((disp, i) => (
                    <tr key={i} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-blue-600">{disp.invoiceId}</td>
                      <td className="p-3 font-semibold text-slate-900">{disp.customer}</td>
                      <td className="p-3 font-bold font-mono text-rose-600">{disp.disputedAmount}</td>
                      <td className="p-3 text-slate-600 max-w-xs">{disp.reason}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            resolveDispute(disp.id || i);
                            alert(`Đã giải quyết khiếu nại cho ${disp.invoiceId}!`);
                          }}
                          className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded text-xs hover:bg-blue-700 cursor-pointer shadow-2xs"
                        >
                          Xử lý xong
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
