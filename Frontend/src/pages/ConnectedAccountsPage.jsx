import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  ArrowUpRight
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

export default function ConnectedAccountsPage() {
  const { connectedAccounts, addConnectedAccount } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [newBranchModal, setNewBranchModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Chi nhánh nội bộ',
    location: '',
    payoutBank: 'Vietcombank •••• 5590'
  });

  const filtered = connectedAccounts.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newAcct = {
      id: `acct_CN_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: formData.name,
      type: formData.type,
      email: formData.email,
      debtFiles: 0,
      grossVolume: '$0.00 USD',
      status: 'Enabled',
      statusType: 'success',
      location: formData.location || 'Việt Nam',
      payoutBank: formData.payoutBank
    };
    addConnectedAccount(newAcct);
    setFormData({ name: '', email: '', type: 'Chi nhánh nội bộ', location: '', payoutBank: 'Vietcombank •••• 5590' });
    setNewBranchModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Chi Nhánh & Đại Lý Thu Hồi Nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý mạng lưới văn phòng thu nợ, đối tác pháp lý ủy quyền và phân bổ giải ngân thu hồi nợ.
          </p>
        </div>

        <button 
          onClick={() => setNewBranchModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm chi nhánh thu nợ</span>
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm chi nhánh, đại lý, địa bàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#635BFF] rounded-lg outline-none transition text-slate-800"
            />
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {filtered.length} đơn vị liên kết
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-6">Chi nhánh / Đại lý</th>
                <th className="py-2.5 px-6">Mô hình</th>
                <th className="py-2.5 px-6">Địa bàn</th>
                <th className="py-2.5 px-6">Hồ sơ nợ</th>
                <th className="py-2.5 px-6">Tổng dư nợ đã thu</th>
                <th className="py-2.5 px-6">Tài khoản đối soát</th>
                <th className="py-2.5 px-6">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((branch) => (
                <tr key={branch.id} className="table-row-hover">
                  <td className="py-3 px-6 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-slate-900">{branch.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{branch.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    {branch.type}
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    {branch.location}
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-800 whitespace-nowrap">
                    {branch.debtFiles ?? branch.patients ?? 0} hồ sơ
                  </td>
                  <td className="py-3 px-6 font-bold text-slate-900 whitespace-nowrap">
                    {branch.grossVolume}
                  </td>
                  <td className="py-3 px-6 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {branch.payoutBank}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    <StatusBadge type={branch.statusType}>
                      {branch.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connect Branch Modal */}
      <Modal
        isOpen={newBranchModal}
        onClose={() => setNewBranchModal(false)}
        title="Thêm Chi Nhánh / Đại Lý Thu Nợ Mới"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Tên Chi nhánh / Văn phòng đại lý *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Chi nhánh Thu nợ Hải Phòng & Quảng Ninh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Email kế toán / đối soát *</label>
            <input
              type="email"
              required
              placeholder="ketoan.chinhanh@debtmaster.vn"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Mô hình xử lý nợ</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF] bg-white"
            >
              <option value="Chi nhánh nội bộ">Chi nhánh nội bộ trực thuộc</option>
              <option value="Đại lý thu hộ">Đại lý ủy quyền thu hộ</option>
              <option value="Đối tác pháp lý">Văn phòng luật sư / Đối tác tố tụng</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Địa bàn hoạt động (Tỉnh / Thành phố)</label>
            <input
              type="text"
              placeholder="Hải Phòng, Việt Nam"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewBranchModal(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold rounded-lg shadow-xs transition"
            >
              Xác nhận thêm
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
