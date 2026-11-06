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

export default function CustomersPage() {
  const { 
    customers, 
    viewCustomer, 
    addCustomer,
    setActiveModal
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomerModal, setNewCustomerModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
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
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#635BFF] rounded-lg outline-none transition text-slate-800"
            />
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Hiển thị {filteredCustomers.length} khách nợ
          </span>
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
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                        {cust.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    {cust.email}
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-800 whitespace-nowrap">
                    {cust.totalSpent}
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    {cust.paymentsCount} payments
                  </td>
                  <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                    {cust.created}
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
