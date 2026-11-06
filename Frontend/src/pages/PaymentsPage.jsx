import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Plus, 
  Search, 
  RotateCcw, 
  Receipt, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

export default function PaymentsPage() {
  const { 
    transactions, 
    selectedTransaction, 
    setSelectedTransaction,
    refundTransaction,
    setActiveModal,
    isAdmin,
    isStaff
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Tab filter logic
  const filteredTransactions = transactions.filter(tx => {
    // Tab match
    if (activeTab === 'succeeded' && tx.status.toLowerCase() !== 'succeeded') return false;
    if (activeTab === 'refunded' && tx.status.toLowerCase() !== 'refunded') return false;
    if (activeTab === 'failed' && tx.status.toLowerCase() !== 'failed') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCustomer = tx.customer.toLowerCase().includes(q);
      const matchEmail = (tx.customerEmail || '').toLowerCase().includes(q);
      const matchId = tx.id.toLowerCase().includes(q);
      const matchAmount = tx.amount.toLowerCase().includes(q);
      return matchCustomer || matchEmail || matchId || matchAmount;
    }
    return true;
  });

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Thu Nợ & Thanh Toán Công Nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi toàn bộ lịch sử thu hồi công nợ, đối soát thanh toán hợp đồng và xử lý hoàn trả tiền nợ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('export')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất báo cáo</span>
          </button>
          
          <button 
            onClick={() => setActiveModal('new-payment')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo phiếu thu nợ</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 border-b md:border-b-0 border-slate-100 pb-2 md:pb-0 overflow-x-auto text-xs font-medium">
            {[
              { id: 'all', label: 'All' },
              { id: 'succeeded', label: 'Succeeded' },
              { id: 'refunded', label: 'Refunded' },
              { id: 'failed', label: 'Failed' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#F0EFFE] text-[#635BFF] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search inside payments */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by customer, ID or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#635BFF] rounded-lg outline-none transition text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-6">Amount</th>
                <th className="py-2.5 px-6">Status</th>
                <th className="py-2.5 px-6">Description</th>
                <th className="py-2.5 px-6">Customer</th>
                <th className="py-2.5 px-6">Method</th>
                <th className="py-2.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No transactions match your current filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="table-row-hover cursor-pointer"
                  >
                    <td className="py-3 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {tx.amount}
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      <StatusBadge type={tx.statusType}>
                        {tx.status} {tx.status === 'Succeeded' && '✓'}
                      </StatusBadge>
                    </td>
                    <td className="py-3 px-6 text-slate-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-medium whitespace-nowrap">
                      {tx.customer}
                    </td>
                    <td className="py-3 px-6 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {tx.method}
                    </td>
                    <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Payment Details"
        maxWidth="max-w-xl"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Top Big Amount */}
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {selectedTransaction.amount}
                </span>
                <span className="text-xs text-slate-400 ml-2">USD</span>
              </div>
              <StatusBadge type={selectedTransaction.statusType}>
                {selectedTransaction.status} {selectedTransaction.status === 'Succeeded' && '✓'}
              </StatusBadge>
            </div>

            {/* Financial Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Gross Amount</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedTransaction.gross}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Stripe Processing Fee</p>
                <p className="font-semibold text-rose-600 mt-0.5">{selectedTransaction.fee}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Net Deposited</p>
                <p className="font-semibold text-emerald-700 mt-0.5">{selectedTransaction.net}</p>
              </div>
            </div>

            {/* Key Value Details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment ID</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-800 text-[11px]">
                  <span>{selectedTransaction.id}</span>
                  <button 
                    onClick={() => handleCopyId(selectedTransaction.id)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Customer</span>
                <span className="font-medium text-slate-800">{selectedTransaction.customer}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-800">{selectedTransaction.customerEmail || '—'}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-mono text-slate-800">{selectedTransaction.method}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-800">{selectedTransaction.date}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Description</span>
                <span className="text-slate-800 text-right">{selectedTransaction.description}</span>
              </div>
            </div>

            {/* Actions: Refund & Send Receipt */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => alert(`Receipt email sent to ${selectedTransaction.customerEmail || 'customer'}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
              >
                <Receipt className="w-3.5 h-3.5 text-slate-500" />
                <span>Send receipt</span>
              </button>

              {selectedTransaction.status === 'Succeeded' && (
                isAdmin ? (
                  <button
                    onClick={() => {
                      if (confirm(`Confirm full refund of ${selectedTransaction.amount} to ${selectedTransaction.customer}?`)) {
                        refundTransaction(selectedTransaction.id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund payment</span>
                  </button>
                ) : (
                  <button
                    disabled
                    title="Chỉ tài khoản ROLE_ADMIN mới được phép hoàn tiền"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed opacity-75"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Refund (Cần ROLE_ADMIN)</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
