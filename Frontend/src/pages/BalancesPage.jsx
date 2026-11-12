import React, { useState } from 'react';
import { 
  Landmark, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Send,
  Building,
  AlertCircle,
  Lock,
  Search,
  X,
  Filter,
  Download
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

export default function BalancesPage() {
  const { payouts, balanceSummary, executePayout, isAdmin, t, setActiveModal } = useDashboard();
  const [instantPayoutModal, setInstantPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('50000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Filters
  const [activeStatusTab, setActiveStatusTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayouts = payouts.filter(po => {
    // Status tab filter
    if (activeStatusTab !== 'ALL') {
      const s = (po.status || '').toUpperCase();
      if (activeStatusTab === 'PAID' && s !== 'PAID') return false;
      if (activeStatusTab === 'IN_TRANSIT' && !s.includes('TRANSIT')) return false;
      if (activeStatusTab === 'PENDING' && !s.includes('PENDING')) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = (po.description || '').toLowerCase().includes(q);
      const matchDest = (po.destination || '').toLowerCase().includes(q);
      const matchId = (po.id || '').toLowerCase().includes(q);
      const matchAmount = (po.amount || '').toLowerCase().includes(q);
      const matchType = (po.type || '').toLowerCase().includes(q);
      return matchDesc || matchDest || matchId || matchAmount || matchType;
    }

    return true;
  });

  const handleExecutePayout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    await executePayout(payoutAmount);
    setIsProcessing(false);
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setInstantPayoutModal(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('expensesTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('expensesSub')}
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

          {isAdmin ? (
            <button 
              onClick={() => setInstantPayoutModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1868DF] hover:bg-[#1255B8] text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('payoutNowBtn')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-lg border border-slate-200 cursor-not-allowed">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('payoutNowLocked')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available to pay out */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('availableToPayOut')}</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            {balanceSummary?.available || "42.850.000 ₫"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {t('readyForTransfer')}
          </p>
        </div>

        {/* In transit (on the way) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('onTheWayToBank')}</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            {balanceSummary?.inTransit || "150.000.000 ₫"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {t('expectedArrival')}
          </p>
        </div>

        {/* Payout Schedule Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t('payoutSchedule')}</span>
            <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
            <span>{t('dailyAutomated')}</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            VietinBank •••• 8888 (Tài khoản vận hành SCF)
          </p>
        </div>
      </div>

      {/* Payouts & Expenses Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'PAID', label: t('paid') },
              { id: 'IN_TRANSIT', label: t('inTransit') },
              { id: 'PENDING', label: t('pending') }
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

          {/* Search bar inside expenses */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
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

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-6">{t('amount')}</th>
                <th className="py-3 px-6">{t('status')}</th>
                <th className="py-3 px-6">{t('description')}</th>
                <th className="py-3 px-6">{t('destination')}</th>
                <th className="py-3 px-6">{t('initiatedDate')}</th>
                <th className="py-3 px-6">{t('arrivalDate')}</th>
                <th className="py-3 px-6">{t('transferType')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    {t('noDataMatch')}
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-bold font-mono text-slate-900">
                      {po.amount}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : po.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          po.status === 'Paid' ? 'bg-emerald-500' : po.status === 'In Transit' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        <span>{po.status === 'Paid' ? t('paid') : po.status === 'In Transit' ? t('inTransit') : t('pending')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-800 font-semibold max-w-xs">
                      <div>{po.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{po.id}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-mono text-[11px]">
                      {po.destination}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {po.initiated || '08/11/2026'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {po.arrivalDate}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                        {po.type || 'Đối soát nợ'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer record counter */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-slate-400 text-xs text-right pr-6">
          {t('showing')} {filteredPayouts.length} / {payouts.length} {t('records')}
        </div>
      </div>

      {/* Modal: Instant Payout */}
      <Modal
        isOpen={instantPayoutModal}
        onClose={() => setInstantPayoutModal(false)}
        title={t('payoutNowBtn')}
        maxWidth="max-w-md"
      >
        {payoutSuccess ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <h4 className="text-base font-bold text-slate-900">Lệnh chi giải ngân đã khởi tạo!</h4>
            <p className="text-xs text-slate-500">Tiền được gửi tới tài khoản đối tác VietinBank / BIDV.</p>
          </div>
        ) : (
          <form onSubmit={handleExecutePayout} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Số tiền giải ngân / chi phí (VND)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-sm font-semibold font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Hạn mức khả dụng: {balanceSummary?.available || "42.850.000 ₫"}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Ngân hàng thụ hưởng:</span>
                <span className="font-semibold text-slate-800">VietinBank VA • 9688600129</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thời gian xử lý:</span>
                <span className="font-semibold text-emerald-600">Tức thì qua Napas 247</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí giao dịch:</span>
                <span className="font-semibold text-slate-800">Miễn phí (Doanh nghiệp B2B)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInstantPayoutModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-1.5 bg-[#1868DF] hover:bg-[#1255B8] disabled:opacity-50 text-white font-semibold rounded-lg shadow-2xs transition cursor-pointer"
              >
                {isProcessing ? 'Đang chuyển khoản...' : t('confirm')}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
