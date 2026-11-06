import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Plus, 
  MoreHorizontal, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import { VisaLogo } from '../components/icons/Icons';

export default function CustomerDetailPage() {
  const { 
    selectedCustomer, 
    switchView, 
    transactions, 
    setSelectedTransaction,
    setActiveModal 
  } = useDashboard();

  const [copied, setCopied] = useState(false);
  const customer = selectedCustomer;

  if (!customer) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No customer selected.</p>
        <button 
          onClick={() => switchView('customers')}
          className="mt-3 text-[#635BFF] font-semibold underline"
        >
          Return to Customers list
        </button>
      </div>
    );
  }

  // Filter transactions for this customer
  const customerTransactions = transactions.filter(t => 
    t.customer.toLowerCase() === customer.name.toLowerCase()
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button 
          onClick={() => switchView('customers')}
          className="hover:text-slate-800 flex items-center gap-1 font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customers</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-slate-800">{customer.name}</span>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-[#635BFF] flex items-center justify-center font-bold text-base border border-indigo-200">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {customer.name}
              </h1>
              <StatusBadge type={customer.status === 'Active' ? 'success' : 'error'}>
                {customer.status}
              </StatusBadge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{customer.email}</span>
              <span>•</span>
              <span className="font-mono text-[11px]">{customer.id}</span>
              <button 
                onClick={() => handleCopy(customer.id)} 
                className="text-slate-400 hover:text-slate-600"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('new-payment')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create payment</span>
          </button>
          
          <button 
            onClick={() => alert(`Actions menu for customer ${customer.name}`)}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile & Payment Method */}
        <div className="lg:col-span-1 space-y-6">
          {/* Details Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Customer Details
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="text-slate-800 font-medium">{customer.email}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Phone</span>
                <span className="text-slate-800 font-medium">{customer.phone}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Billing Address</span>
                <span className="text-slate-800 font-medium">{customer.address}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Member Since</span>
                <span className="text-slate-800 font-medium">{customer.created}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Invoice Prefix</span>
                <span className="text-slate-800 font-mono text-[11px]">JD-</span>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Payment Methods
              </h2>
              <button 
                onClick={() => alert("Add card modal")}
                className="text-xs text-[#635BFF] font-semibold hover:underline"
              >
                + Add
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 bg-white border border-slate-200 rounded flex items-center justify-center shadow-xs">
                  <VisaLogo />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 font-mono">•••• 4242</p>
                  <p className="text-[10px] text-slate-400">Expires 12/2028</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                Default
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Subscriptions & Payment Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Subscriptions Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Hợp Đồng Nợ & Gói Trả Góp Đang Thực Hiện</h2>
                <p className="text-xs text-slate-500">Các gói hợp đồng trả chậm, giãn nợ và phân kỳ công nợ</p>
              </div>
            </div>

            <div className="p-6">
              {customer.subscriptions && customer.subscriptions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {customer.subscriptions.map((sub) => (
                    <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{sub.plan}</p>
                        <p className="text-[11px] text-slate-400">Next billing date: {sub.renewal}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">{sub.amount}</span>
                        <StatusBadge type="success">{sub.status}</StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No active recurring subscriptions.</p>
              )}
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Payment History</h2>
                <p className="text-xs text-slate-500">All transactions and charges billed to this customer</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-6">Amount</th>
                    <th className="py-2.5 px-6">Status</th>
                    <th className="py-2.5 px-6">Description</th>
                    <th className="py-2.5 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {customerTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                        Chưa có giao dịch thu hồi nợ nào được ghi nhận cho khách hàng này.
                      </td>
                    </tr>
                  ) : (
                    customerTransactions.map((tx) => (
                      <tr 
                        key={tx.id}
                        onClick={() => setSelectedTransaction(tx)}
                        className="table-row-hover cursor-pointer"
                      >
                        <td className="py-3 px-6 font-semibold text-slate-900">
                          {tx.amount}
                        </td>
                        <td className="py-3 px-6">
                          <StatusBadge type={tx.statusType}>
                            {tx.status} {tx.status === 'Succeeded' && '✓'}
                          </StatusBadge>
                        </td>
                        <td className="py-3 px-6 text-slate-600">
                          {tx.description}
                        </td>
                        <td className="py-3 px-6 text-slate-500">
                          {tx.date}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
