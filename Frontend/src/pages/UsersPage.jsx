import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Crown, 
  Stethoscope, 
  User, 
  Search,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { api } from '../services/api';
import Modal from '../components/common/Modal';

export default function UsersPage() {
  const { currentUser, isBackendConnected } = useDashboard();
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@cactuspractice.com',
      enabled: true,
      roles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER']
    },
    {
      id: 2,
      username: 'staff',
      email: 'staff@cactuspractice.com',
      enabled: true,
      roles: ['ROLE_STAFF', 'ROLE_USER']
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserModal, setNewUserModal] = useState(false);
  const [roleChangeModal, setRoleChangeModal] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_STAFF'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadUsers = async () => {
    try {
      if (isBackendConnected) {
        const list = await api.getUsers();
        if (Array.isArray(list) && list.length > 0) {
          setUsers(list);
        }
      }
    } catch (e) {
      console.warn("Could not load users from backend:", e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [isBackendConnected]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) return;

    setIsSubmitting(true);
    try {
      if (isBackendConnected) {
        await api.createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password || '123456',
          roles: [formData.role]
        });
        await loadUsers();
      } else {
        const newUser = {
          id: Date.now(),
          username: formData.username,
          email: formData.email,
          enabled: true,
          roles: [formData.role]
        };
        setUsers(prev => [...prev, newUser]);
      }

      setFeedbackMsg(`Đã tạo thành công tài khoản: ${formData.username}`);
      setFormData({ username: '', email: '', password: '', role: 'ROLE_STAFF' });
      setNewUserModal(false);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      alert("Lỗi tạo người dùng: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.enabled;
      if (isBackendConnected) {
        await api.toggleUserStatus(user.id, newStatus);
        await loadUsers();
      } else {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, enabled: newStatus } : u));
      }
    } catch (err) {
      alert("Lỗi cập nhật trạng thái: " + err.message);
    }
  };

  const handleAssignRole = async (userId, targetRole) => {
    try {
      let roleList = ['ROLE_USER'];
      if (targetRole === 'ROLE_ADMIN') {
        roleList = ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER'];
      } else if (targetRole === 'ROLE_STAFF') {
        roleList = ['ROLE_STAFF', 'ROLE_USER'];
      }

      if (isBackendConnected) {
        await api.updateUserRoles(userId, roleList);
        await loadUsers();
      } else {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, roles: roleList } : u));
      }
      setRoleChangeModal(null);
    } catch (err) {
      alert("Lỗi cập nhật quyền: " + err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Phân Quyền & Quản Lý Người Dùng
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-[#635BFF] border border-indigo-200">
              RBAC Security
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tài khoản hệ thống, gán vai trò quyền hạn (ROLE_ADMIN, ROLE_STAFF, ROLE_USER) và kích hoạt tài khoản.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Làm mới</span>
          </button>

          <button 
            onClick={() => setNewUserModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm tài khoản mới</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Role Explainers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ROLE_ADMIN */}
        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-[#635BFF] border border-indigo-200">
              <Crown className="w-3.5 h-3.5" />
              ROLE_ADMIN
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Cấp cao nhất</span>
          </div>
          <p className="text-xs font-semibold text-slate-800">Quản Trị Viên Toàn Quyền</p>
          <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
            <li>Quản lý danh sách người dùng và gán vai trò</li>
            <li>Duyệt & giải ngân tiền Payout về ngân hàng</li>
            <li>Thực hiện hoàn tiền (Refund charge)</li>
            <li>Liên kết phòng khám & xuất báo cáo CSV/JSON</li>
          </ul>
        </div>

        {/* ROLE_STAFF */}
        <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <Stethoscope className="w-3.5 h-3.5" />
              ROLE_STAFF
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Bác sĩ / Kế toán</span>
          </div>
          <p className="text-xs font-semibold text-slate-800">Nhân Viên Y Tế & Thu Ngân</p>
          <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
            <li>Tạo phiếu thu tiền & tính phí bệnh nhân</li>
            <li>Quản lý hồ sơ bệnh nhân và gói khám</li>
            <li>Xem danh mục sản phẩm & dịch vụ</li>
            <li><span className="text-rose-500 font-medium">Bị chặn:</span> Không được giải ngân hay hoàn tiền</li>
          </ul>
        </div>

        {/* ROLE_USER */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <User className="w-3.5 h-3.5" />
              ROLE_USER
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Bệnh nhân</span>
          </div>
          <p className="text-xs font-semibold text-slate-800">Khách Hàng / Bệnh Nhân</p>
          <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
            <li>Xem thông tin hồ sơ và gói khám cá nhân</li>
            <li>Xem lịch sử các biên lai thanh toán đã nạp</li>
            <li><span className="text-rose-500 font-medium">Bị chặn:</span> Toàn bộ thao tác quản trị nội bộ</li>
          </ul>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Tổng cộng: {filteredUsers.length} tài khoản
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-6">Tài Khoản</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Vai Trò Phân Quyền (Roles)</th>
                <th className="py-3 px-6">Trạng Thái</th>
                <th className="py-3 px-6 text-right">Thao Tác Quản Trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((user) => {
                const isAdmin = user.roles?.includes('ROLE_ADMIN');
                const isStaff = user.roles?.includes('ROLE_STAFF');
                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
                        {user.username.substring(0, 2)}
                      </div>
                      <span>{user.username}</span>
                      {user.username === currentUser?.username && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-normal">
                          Bạn
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map(r => (
                          <span 
                            key={r}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              r === 'ROLE_ADMIN' 
                                ? 'bg-indigo-50 text-[#635BFF] border border-indigo-200'
                                : r === 'ROLE_STAFF'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {r === 'ROLE_ADMIN' && <Crown className="w-3 h-3" />}
                            {r === 'ROLE_STAFF' && <Stethoscope className="w-3 h-3" />}
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      {user.enabled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                          <XCircle className="w-3.5 h-3.5" />
                          Bị khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => setRoleChangeModal(user)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#635BFF] border border-slate-200 rounded text-xs font-semibold transition"
                      >
                        Đổi vai trò
                      </button>

                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition border ${
                          user.enabled 
                            ? 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        {user.enabled ? 'Khóa' : 'Kích hoạt'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New User */}
      <Modal
        isOpen={newUserModal}
        onClose={() => setNewUserModal(false)}
        title="Tạo Tài Khoản & Gán Quyền Hạn Mới"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Tên đăng nhập (Username) *</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="e.g. dr_hoang, accountant_mai"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Email liên hệ *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. hoang@cactuspractice.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Mật khẩu khởi tạo</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Mặc định: 123456"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Vai trò phân quyền ban đầu (Role)</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF] bg-white font-medium"
            >
              <option value="ROLE_ADMIN">ROLE_ADMIN - Quản trị viên (Toàn quyền)</option>
              <option value="ROLE_STAFF">ROLE_STAFF - Nhân viên / Bác sĩ (Thu viện phí, quản lý bệnh nhân)</option>
              <option value="ROLE_USER">ROLE_USER - Khách hàng / Bệnh nhân (Chỉ xem cá nhân)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewUserModal(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold rounded-lg shadow-xs transition"
            >
              {isSubmitting ? 'Đang tạo...' : 'Xác nhận tạo tài khoản'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Change Role */}
      {roleChangeModal && (
        <Modal
          isOpen={!!roleChangeModal}
          onClose={() => setRoleChangeModal(null)}
          title={`Gán Vai Trò Cho: ${roleChangeModal.username}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Chọn mức phân quyền muốn gán cho tài khoản <strong className="text-slate-900">{roleChangeModal.username}</strong>:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAssignRole(roleChangeModal.id, 'ROLE_ADMIN')}
                className="w-full p-3 border border-slate-200 rounded-lg text-left hover:border-[#635BFF] hover:bg-indigo-50/20 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Crown className="w-4 h-4 text-[#635BFF]" />
                    <span>ROLE_ADMIN (Quản trị viên)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toàn quyền giải ngân, hoàn tiền, quản trị người dùng.</p>
                </div>
                <span className="text-[#635BFF] font-semibold text-xs">Gán quyền</span>
              </button>

              <button
                type="button"
                onClick={() => handleAssignRole(roleChangeModal.id, 'ROLE_STAFF')}
                className="w-full p-3 border border-slate-200 rounded-lg text-left hover:border-sky-500 hover:bg-sky-50/20 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Stethoscope className="w-4 h-4 text-sky-600" />
                    <span>ROLE_STAFF (Nhân viên / Bác sĩ)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Quyền thu tiền, quản lý bệnh nhân. Không được giải ngân.</p>
                </div>
                <span className="text-sky-600 font-semibold text-xs">Gán quyền</span>
              </button>

              <button
                type="button"
                onClick={() => handleAssignRole(roleChangeModal.id, 'ROLE_USER')}
                className="w-full p-3 border border-slate-200 rounded-lg text-left hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>ROLE_USER (Khách hàng)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Chỉ xem thông tin cá nhân của bệnh nhân.</p>
                </div>
                <span className="text-slate-600 font-semibold text-xs">Gán quyền</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRoleChangeModal(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
