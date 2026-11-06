import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Tag, 
  Repeat, 
  CheckCircle2, 
  Search,
  DollarSign
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

export default function ProductsPage() {
  const { products, addProduct } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [newProductModal, setNewProductModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billing: 'Recurring (Monthly)'
  });

  const filtered = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newProd = {
      id: `prod_DEBT_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: formData.name,
      description: formData.description,
      price: `$${formData.price} USD ${formData.billing.includes('Recurring') ? '/ mo' : ''}`,
      billing: formData.billing,
      activeSubscribers: 0,
      status: 'Active',
      created: 'Vừa tạo'
    };
    addProduct(newProd);
    setFormData({ name: '', description: '', price: '', billing: 'Recurring (Monthly)' });
    setNewProductModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Danh Mục Hợp Đồng & Gói Dịch Vụ Nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập các hợp đồng trả góp thiết bị, gói nợ thương mại xoay vòng và phí dịch vụ tư vấn thu hồi nợ.
          </p>
        </div>

        <button 
          onClick={() => setNewProductModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo gói hợp đồng nợ</span>
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm hợp đồng hoặc gói nợ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#635BFF] rounded-lg outline-none transition text-slate-800"
            />
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {filtered.length} gói hợp đồng áp dụng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-6">Hợp đồng / Gói nợ</th>
                <th className="py-2.5 px-6">Định mức / Phí</th>
                <th className="py-2.5 px-6">Kỳ hạn thu nợ</th>
                <th className="py-2.5 px-6">Hồ sơ tham gia</th>
                <th className="py-2.5 px-6">Ngày ban hành</th>
                <th className="py-2.5 px-6">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((prod) => (
                <tr key={prod.id} className="table-row-hover">
                  <td className="py-3 px-6">
                    <div>
                      <p className="font-semibold text-slate-900">{prod.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-6 font-bold text-slate-900 whitespace-nowrap">
                    {prod.price}
                  </td>
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                      <Repeat className="w-3 h-3 text-slate-400" />
                      {prod.billing}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-800 whitespace-nowrap">
                    {prod.activeSubscribers} hợp đồng
                  </td>
                  <td className="py-3 px-6 text-slate-400 text-[11px] whitespace-nowrap">
                    {prod.created}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    <StatusBadge type={prod.status === 'Active' ? 'success' : 'neutral'}>
                      {prod.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={newProductModal}
        onClose={() => setNewProductModal(false)}
        title="Tạo Hợp Đồng Nợ / Gói Dịch Vụ Mới"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Tên Hợp đồng / Gói nợ *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Hợp đồng Nợ trả chậm Hóa đơn Thương mại (6 tháng)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Mô tả điều khoản & đối tượng</label>
            <textarea
              rows={2}
              placeholder="Tóm tắt điều khoản phân kỳ, lãi phạt và phương án bảo đảm công nợ"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Định mức / Phí (USD) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="1000.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Kỳ hạn thu nợ</label>
              <select
                value={formData.billing}
                onChange={(e) => setFormData({ ...formData, billing: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF] bg-white"
              >
                <option value="One-time">Tất toán 1 lần (One-time)</option>
                <option value="Recurring (Monthly)">Định kỳ hàng tháng (Monthly)</option>
                <option value="Recurring (Yearly)">Định kỳ hàng năm (Yearly)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewProductModal(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold rounded-lg shadow-xs transition"
            >
              Lưu hợp đồng
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
