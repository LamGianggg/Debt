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
  Lock
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

export default function BalancesPage() {
  const { payouts, balanceSummary, executePayout, isAdmin } = useDashboard();
  const [instantPayoutModal, setInstantPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('5000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Số Dư Nợ & Đối Soát Ngân Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tiền nợ đã thu hồi, các khoản đang đối soát ngân hàng và tài khoản nhận tiền nợ.
          </p>
        </div>

        {isAdmin ? (
          <button 
            onClick={() => setInstantPayoutModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pay out now</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-lg border border-slate-200 cursor-not-allowed" title="Chức năng giải ngân chỉ dành cho Quản trị viên (ROLE_ADMIN)">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Pay out now (Khóa: Cần ROLE_ADMIN)</span>
          </div>
        )}
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available to pay out */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Available to pay out</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {balanceSummary?.available || "$42,850.00"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Ready for instant or scheduled bank transfer
          </p>
        </div>

        {/* In transit (on the way) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>On the way to your bank</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-[#635BFF]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {balanceSummary?.inTransit || "$12,400.00"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Expected arrival: within 48 hours
          </p>
        </div>

        {/* Payout Schedule Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Payout schedule</span>
            <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
            <span>Daily Automated</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Chase Bank •••• 8841 (Operating Account)
          </p>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Bank Transfers</h2>
            <p className="text-xs text-slate-500">History of automated electronic funds transfers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Destination</th>
                <th className="py-3 px-6">Initiated</th>
                <th className="py-3 px-6">Estimated Arrival</th>
                <th className="py-3 px-6">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payouts.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-6 font-bold text-slate-900">
                    {po.amount}
                  </td>
                  <td className="py-3 px-6">
                    <StatusBadge type={po.statusType || (po.status === 'Paid' ? 'success' : 'pending')}>
                      {po.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-6 text-slate-600 font-mono text-[11px]">
                    {po.destination}
                  </td>
                  <td className="py-3 px-6 text-slate-500">
                    {po.initiated}
                  </td>
                  <td className="py-3 px-6 text-slate-500">
                    {po.arrival}
                  </td>
                  <td className="py-3 px-6 text-slate-600">
                    {po.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Instant Payout */}
      <Modal
        isOpen={instantPayoutModal}
        onClose={() => setInstantPayoutModal(false)}
        title="Disburse Instant Payout to Bank"
        maxWidth="max-w-md"
      >
        {payoutSuccess ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <h4 className="text-base font-bold text-slate-900">Transfer Initiated!</h4>
            <p className="text-xs text-slate-500">Funds dispatched to Chase Bank •••• 8841.</p>
          </div>
        ) : (
          <form onSubmit={handleExecutePayout} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Disbursement Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  max="42850"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF] text-sm font-semibold"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Available balance: {balanceSummary?.available || "$42,850.00"}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Destination Bank</span>
                <span className="font-semibold text-slate-800">Chase Bank •••• 8841</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Arrival Time</span>
                <span className="font-semibold text-emerald-600">Within 30 minutes</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transfer Fee (1.0%)</span>
                <span className="font-semibold text-slate-800">${(parseFloat(payoutAmount || 0) * 0.01).toFixed(2)} USD</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInstantPayoutModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition"
              >
                {isProcessing ? 'Processing Transfer...' : 'Confirm & Disburse'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
