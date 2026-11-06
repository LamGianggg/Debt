import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Menu, 
  Megaphone, 
  User, 
  CheckCircle2, 
  ExternalLink,
  Crown,
  Stethoscope,
  ShieldCheck,
  LogOut,
  LogIn,
  Key
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import Modal from './Modal';

export default function Topbar() {
  const { 
    globalSearch, 
    setGlobalSearch, 
    setSidebarOpen, 
    isTestMode, 
    switchView, 
    isBackendConnected,
    currentUser,
    switchUserRole,
    loginUser,
    logoutUser,
    isAdmin
  } = useDashboard();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'password123' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const activeRole = currentUser?.roles?.includes('ROLE_ADMIN') 
    ? 'ROLE_ADMIN' 
    : currentUser?.roles?.includes('ROLE_STAFF') 
      ? 'ROLE_STAFF' 
      : 'ROLE_USER';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const res = await loginUser(loginForm.username, loginForm.password);
    setLoginLoading(false);
    if (res.success) {
      setLoginModalOpen(false);
      setProfileOpen(false);
    } else {
      setLoginError(res.error || 'Đăng nhập không thành công');
    }
  };

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between shrink-0 select-none z-30">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search (customers, payments, plans)..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] rounded-lg outline-none transition text-slate-800 placeholder:text-slate-400"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Backend Connection Status Badge */}
        {isBackendConnected ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Connected to Spring Boot API & MySQL 8 on port 8080">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Backend: Live (MySQL)
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200" title="Backend offline. Start Spring Boot on port 8080 to sync live data.">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Backend: Offline (Mock)
          </span>
        )}

        {/* Environment Badge */}
        {isTestMode ? (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            TEST MODE
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            LIVE
          </span>
        )}

        {/* Feedback / Updates */}
        <button 
          onClick={() => alert("Cactus Practice - Phân quyền RBAC (Role-Based Access Control) & Stripe Payments đang hoạt động.")}
          className="hidden sm:flex text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          title="Announcements"
        >
          <Megaphone className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#635BFF] ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] text-slate-400">2 unread</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-800">Payout $18,250.00 settled</p>
                    <p className="text-[10px] text-slate-400">Deposited to Chase Bank •••• 8841</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-800">Tiếp nhận hồ sơ nợ mới</p>
                    <p className="text-[10px] text-slate-400">Minh Phát Logistics ký cam kết trả góp</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button 
          onClick={() => switchView('design-system')}
          className="text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          title="Figma Design Specs"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Account & Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 focus:outline-none cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase border ${
              activeRole === 'ROLE_ADMIN' 
                ? 'bg-indigo-100 text-[#635BFF] border-indigo-200' 
                : activeRole === 'ROLE_STAFF' 
                  ? 'bg-sky-100 text-sky-700 border-sky-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {activeRole === 'ROLE_ADMIN' ? <Crown className="w-3.5 h-3.5" /> : activeRole === 'ROLE_STAFF' ? <Stethoscope className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                {currentUser?.username || 'admin'}
              </span>
              <span className={`text-[10px] font-bold ${
                activeRole === 'ROLE_ADMIN' 
                  ? 'text-[#635BFF]' 
                  : activeRole === 'ROLE_STAFF' 
                    ? 'text-sky-600' 
                    : 'text-slate-500'
              }`}>
                {activeRole}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{currentUser?.username}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeRole === 'ROLE_ADMIN' 
                      ? 'bg-indigo-50 text-[#635BFF] border border-indigo-200' 
                      : activeRole === 'ROLE_STAFF' 
                        ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {activeRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{currentUser?.email || 'admin@cactuspractice.com'}</p>
              </div>

              {/* Quick Role Switcher for instant permission testing */}
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/60">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Thử nghiệm nhanh phân quyền:
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => { switchUserRole('ROLE_ADMIN'); setProfileOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition ${
                      activeRole === 'ROLE_ADMIN' ? 'bg-indigo-100/70 text-[#635BFF] font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-[#635BFF]" />
                      ROLE_ADMIN (Toàn quyền)
                    </span>
                    {activeRole === 'ROLE_ADMIN' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => { switchUserRole('ROLE_STAFF'); setProfileOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition ${
                      activeRole === 'ROLE_STAFF' ? 'bg-sky-100/70 text-sky-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                      ROLE_STAFF (Nhân viên)
                    </span>
                    {activeRole === 'ROLE_STAFF' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => { switchUserRole('ROLE_USER'); setProfileOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition ${
                      activeRole === 'ROLE_USER' ? 'bg-slate-200 text-slate-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      ROLE_USER (Khách hàng)
                    </span>
                    {activeRole === 'ROLE_USER' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="py-1">
                <button 
                  onClick={() => { switchView('users'); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-[#635BFF]" />
                  <span>Quản lý phân quyền người dùng</span>
                </button>

                <button 
                  onClick={() => { setLoginModalOpen(true); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                >
                  <Key className="w-4 h-4 text-slate-500" />
                  <span>Đăng nhập tài khoản khác</span>
                </button>

                <button 
                  onClick={() => { logoutUser(); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium border-t border-slate-100 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Login */}
      <Modal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        title="Đăng Nhập Hệ Thống (Spring Security JWT)"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {loginError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-medium mb-1">Tên đăng nhập</label>
            <input
              type="text"
              required
              value={loginForm.username}
              onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
              placeholder="e.g. admin hoặc staff"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Mật khẩu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Tài khoản mặc định:</p>
            <p>• Admin (toàn quyền): <code className="text-[#635BFF] font-mono font-bold">admin</code> / <code className="font-mono">123456</code></p>
            <p>• Staff (nhân viên): <code className="text-sky-600 font-mono font-bold">staff</code> / <code className="font-mono">123456</code></p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLoginModalOpen(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loginLoading}
              className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold rounded-lg shadow-xs transition"
            >
              {loginLoading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
}
