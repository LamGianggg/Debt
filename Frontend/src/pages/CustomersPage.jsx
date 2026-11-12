import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Download, 
  Search, 
  Mail, 
  Phone, 
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

function getCustomerInitials(name) {
  if (!name) return 'KH';
  const clean = name.replace(/^(Công ty TNHH|Công ty CP|Tập Đoàn|Doanh Nghiệp|Chi Nhánh)\s+/i, '').trim();
  const target = clean || name;
  const words = target.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return target.substring(0, 2).toUpperCase();
}

export default function CustomersPage() {
  const { 
    customers, 
    viewCustomer, 
    addCustomer,
    setActiveModal,
    t
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('ALL');
  const [newCustomerModal, setNewCustomerModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const filteredCustomers = customers.filter(c => {
    // Status tab filter
    if (activeStatusTab !== 'ALL') {
      const s = (c.status || '').toUpperCase();
      if (activeStatusTab === 'ACTIVE' && s !== 'ACTIVE') return false;
      if (activeStatusTab === 'WARNING' && !s.includes('WARN')) return false;
      if (activeStatusTab === 'LOCKED' && !s.includes('LOCK')) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.id || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q);
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newCust = {
      id: `cus_${Math.random().toString(36).substring(2, 11)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      balance: '$0.00 USD',
      totalSpent: '$0.00 USD',
      paymentsCount: 0,
      created: 'Just now',
      status: 'Active',
      address: formData.address || 'Unspecified address',
      defaultPayment: 'No payment method added',
      subscriptions: []
    };

    addCustomer(newCust);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setNewCustomerModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Khách Hàng Nợ & Đối Tác Công Nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh mục khách hàng nợ, đối tác công nợ, theo dõi số dư nợ hiện tại và tình trạng thanh toán (Đúng hạn, Nợ quá hạn - Delinquent).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('export')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất file</span>
          </button>
          
          <button 
            onClick={() => setNewCustomerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm khách nợ mới</span>
          </button>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'ACTIVE', label: 'Hoạt động tốt' },
              { id: 'WARNING', label: 'Cảnh báo nợ' },
              { id: 'LOCKED', label: 'Khóa hạn mức' }
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

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition text-slate-800"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-6">Customer</th>
                <th className="py-2.5 px-6">Email</th>
                <th className="py-2.5 px-6">Total Spent</th>
                <th className="py-2.5 px-6">Payments</th>
                <th className="py-2.5 px-6">Created</th>
                <th className="py-2.5 px-6">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.map((cust) => (
                <tr 
                  key={cust.id}
                  onClick={() => viewCustomer(cust)}
                  className="table-row-hover cursor-pointer"
                >
                  <td className="py-3 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200/80 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0 overflow-hidden select-none">
                        {getCustomerInitials(cust.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-900">{cust.name}</span>
                        {cust.taxCode && (
                          <span className="text-[11px] text-slate-400 font-mono">MST: {cust.taxCode}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    {cust.email || (cust.contact ? cust.contact.split(' - ')[0] : '—')}
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-800 whitespace-nowrap">
                    {cust.totalSpent || cust.unpaidBalance || '—'}
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    {cust.paymentsCount !== undefined ? `${cust.paymentsCount} payments` : (cust.dso ? `DSO: ${cust.dso}d` : '—')}
                  </td>
                  <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                    {cust.created || '10/11/2026'}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    <StatusBadge type={cust.status.toLowerCase() === 'active' ? 'success' : 'error'}>
                      {cust.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="text-[#635BFF] hover:underline font-semibold inline-flex items-center gap-0.5">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={newCustomerModal}
        onClose={() => setNewCustomerModal(false)}
        title="Add New Customer"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Diaz"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="jane.diaz@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Billing Address</label>
            <textarea
              rows={2}
              placeholder="Street address, city, state, zip"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewCustomerModal(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold rounded-lg shadow-xs transition"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
