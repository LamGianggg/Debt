import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  Hexagon, 
  Bell, 
  Check, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu,
  X,
  FileText,
  Users,
  QrCode,
  ArrowRight,
  CreditCard,
  Crown,
  Stethoscope,
  Lock
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function Topbar() {
  const { 
    globalSearch, 
    setGlobalSearch, 
    setSidebarOpen, 
    currentUser, 
    switchUserRole, 
    isBackendConnected,
    setActiveModal,
    isAdmin,
    isStaff,
    invoices,
    customers,
    salesOrders,
    switchView
  } = useDashboard();

  const isGuest = !isStaff;
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const searchContainerRef = useRef(null);

  const activeRole = isAdmin ? 'ROLE_ADMIN' : isStaff ? 'ROLE_STAFF' : 'ROLE_USER';

  // Role Letter for Avatar
  const roleLetter = isAdmin ? 'A' : isStaff ? 'S' : 'G';
  const roleTitle = isAdmin ? 'Admin / CFO' : isStaff ? 'Staff / AR Maker' : 'Guest / Khách B2B';
  const roleColorBg = isAdmin ? 'bg-[#1868DF]' : isStaff ? 'bg-[#0284C7]' : 'bg-[#10B981]';
  const roleRingColor = isAdmin ? 'ring-blue-100' : isStaff ? 'ring-sky-100' : 'ring-emerald-100';

  // Instant Live Search Results (Invoices & Clients)
  const searchQuery = (globalSearch || '').trim().toLowerCase();
  const matchingInvoices = searchQuery.length > 0 ? invoices.filter(inv => 
    (inv.id || '').toLowerCase().includes(searchQuery) ||
    (inv.customer || inv.customerName || '').toLowerCase().includes(searchQuery) ||
    (inv.vaNumber || inv.virtualAccount || '').toLowerCase().includes(searchQuery) ||
    (inv.amount || '').toLowerCase().includes(searchQuery)
  ).slice(0, 5) : [];

  const matchingCustomers = searchQuery.length > 0 ? customers.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery) ||
    (c.email || '').toLowerCase().includes(searchQuery) ||
    (c.phone || '').toLowerCase().includes(searchQuery)
  ).slice(0, 3) : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0 select-none z-30 sticky top-0">
      {/* Left Area: Mobile menu toggle + Live Interactive Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md relative" ref={searchContainerRef}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Box */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={globalSearch}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setSearchFocused(true);
            }}
            placeholder="Search Invoices, clients, VA or amounts..."
            className="w-full pl-10 pr-9 py-2 text-xs bg-[#F8FAFC] hover:bg-slate-100/60 focus:bg-white border border-slate-200/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all duration-150 text-slate-800 placeholder:text-slate-400 font-medium"
          />

          {/* Clear Search Button */}
          {globalSearch && (
            <button
              onClick={() => {
                setGlobalSearch('');
                setSearchFocused(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown Popup */}
        {searchFocused && searchQuery.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-soft-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 text-xs">
            <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Kết quả tìm kiếm cho "{globalSearch}"</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                {matchingInvoices.length + matchingCustomers.length} tìm thấy
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {/* Invoices Group */}
              {matchingInvoices.length > 0 && (
                <div className="p-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Hóa Đơn & Quét Mã VietQR
                  </div>
                  {matchingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setSearchFocused(false);
                        if (switchView) switchView('invoices');
                      }}
                      className="p-2 rounded-xl hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {inv.id} • {inv.customer || inv.customerName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Hạn: {inv.dueDate} | VA: {inv.vaNumber || inv.virtualAccount || '90212345678901'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold font-mono text-slate-900">{inv.amount}</div>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          (inv.payment_status || inv.paymentStatus) === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {inv.payment_status || inv.paymentStatus || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Customers Group */}
              {matchingCustomers.length > 0 && (
                <div className="p-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Khách Hàng Doanh Nghiệp
                  </div>
                  {matchingCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSearchFocused(false);
                        if (switchView) switchView('customers');
                      }}
                      className="p-2 rounded-xl hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{c.email} • {c.phone}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        {c.totalSpent || '$12,400'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {matchingInvoices.length === 0 && matchingCustomers.length === 0 && (
                <div className="p-6 text-center text-slate-400">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">Không tìm thấy kết quả phù hợp</p>
                  <p className="text-[11px] mt-0.5">Thử tìm theo mã HĐ (INV-), tên khách hàng hoặc số tài khoản ảo.</p>
                </div>
              )}
            </div>

            {/* Bottom jump link */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => {
                  setSearchFocused(false);
                  if (switchView) switchView('invoices');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Xem danh sách đầy đủ trong phân hệ Hóa Đơn</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Area: + Quick Create, Language, Company Switch, Hexagon, Bell, Role Letter Avatar */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* + Quick Create Button */}
        <button
          onClick={() => setActiveModal('new-payment')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-blue-200 hover:border-blue-400 text-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Create</span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setLangDropdownOpen(!langDropdownOpen);
              setCompanyDropdownOpen(false);
              setNotificationsOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition"
          >
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-soft-lg border border-slate-100 py-1.5 z-50 text-xs">
              <button
                onClick={() => { setSelectedLanguage('English'); setLangDropdownOpen(false); }}
                className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${selectedLanguage === 'English' ? 'text-blue-600 font-bold' : 'text-slate-700'}`}
              >
                <span>English</span>
                {selectedLanguage === 'English' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { setSelectedLanguage('Tiếng Việt'); setLangDropdownOpen(false); }}
                className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${selectedLanguage === 'Tiếng Việt' ? 'text-blue-600 font-bold' : 'text-slate-700'}`}
              >
                <span>Tiếng Việt</span>
                {selectedLanguage === 'Tiếng Việt' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Company Switcher / RBAC Role Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setCompanyDropdownOpen(!companyDropdownOpen);
              setLangDropdownOpen(false);
              setNotificationsOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition"
          >
            <span>{isAdmin ? 'Company: Admin' : isStaff ? 'Company: Staff' : 'Company: Guest'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {companyDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-slate-100 p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Organization / Role
              </div>
              <button
                onClick={() => {
                  switchUserRole('ROLE_ADMIN');
                  setCompanyDropdownOpen(false);
                }}
                className={`w-full p-2 text-left rounded-lg transition flex items-center justify-between cursor-pointer ${
                  activeRole === 'ROLE_ADMIN' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1868DF] text-white font-black text-[11px] flex items-center justify-center">A</span>
                  <div>
                    <div className="font-semibold">Fortinvo Admin (A)</div>
                    <div className="text-[10px] text-slate-400">Full O2C & Maker-Checker</div>
                  </div>
                </div>
                {activeRole === 'ROLE_ADMIN' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                onClick={() => {
                  switchUserRole('ROLE_STAFF');
                  setCompanyDropdownOpen(false);
                }}
                className={`w-full p-2 text-left rounded-lg transition flex items-center justify-between cursor-pointer ${
                  activeRole === 'ROLE_STAFF' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white font-black text-[11px] flex items-center justify-center">S</span>
                  <div>
                    <div className="font-semibold">Fortinvo Staff (S)</div>
                    <div className="text-[10px] text-slate-400">Dunning & Invoicing Operations</div>
                  </div>
                </div>
                {activeRole === 'ROLE_STAFF' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                onClick={() => {
                  switchUserRole('ROLE_USER');
                  setCompanyDropdownOpen(false);
                }}
                className={`w-full p-2 text-left rounded-lg transition flex items-center justify-between cursor-pointer ${
                  activeRole === 'ROLE_USER' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981] text-white font-black text-[11px] flex items-center justify-center">G</span>
                  <div>
                    <div className="font-semibold">B2B Customer Guest (G)</div>
                    <div className="text-[10px] text-slate-400">Self-Service Portal & VietQR</div>
                  </div>
                </div>
                {activeRole === 'ROLE_USER' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Hexagon Settings Icon */}
        <button 
          title="Organization Settings"
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
        >
          <Hexagon className="w-4 h-4" />
        </button>

        {/* Notification Bell Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setCompanyDropdownOpen(false);
              setLangDropdownOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="relative text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-soft-lg border border-slate-100 p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 font-bold text-slate-900">
                <span>Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">2 new</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100/50">
                  <div className="font-semibold text-slate-800">VietQR Payment Received</div>
                  <div className="text-[10px] text-slate-500">Invoice #INV-2024-001 ($124,500) matched STP.</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100/50">
                  <div className="font-semibold text-slate-800">Maker-Checker Notice</div>
                  <div className="text-[10px] text-slate-500">Order SO-2026-002 pending approval.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* USER ROLE LETTER AVATAR: A for Admin, S for Staff, G for Guest */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setCompanyDropdownOpen(false);
              setLangDropdownOpen(false);
              setNotificationsOpen(false);
            }}
            title={`${roleTitle} (Nhấn để chuyển vai trò hoặc xem thông tin)`}
            className={`w-8 h-8 rounded-full ${roleColorBg} text-white font-black text-sm flex items-center justify-center shadow-xs cursor-pointer border-2 border-white ring-2 ${roleRingColor} hover:scale-105 transition-all select-none`}
          >
            {roleLetter}
          </button>

          {/* User Profile / Quick Role Switcher Popup */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-3 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className={`w-10 h-10 rounded-full ${roleColorBg} text-white font-black text-base flex items-center justify-center shadow-xs border-2 border-white ring-2 ${roleRingColor}`}>
                  {roleLetter}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{roleTitle}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
                    {currentUser?.email || 'user@debtmaster.vn'}
                  </div>
                </div>
              </div>

              {/* Instant Role Switching Quick Buttons */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chuyển nhanh vai trò:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      switchUserRole('ROLE_ADMIN');
                      setProfileDropdownOpen(false);
                    }}
                    className={`py-1.5 rounded-xl font-black text-xs flex flex-col items-center justify-center transition cursor-pointer border ${
                      isAdmin ? 'bg-[#1868DF] text-white border-blue-600 shadow-2xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    <span className="text-sm">A</span>
                    <span className="text-[9px] font-semibold">Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      switchUserRole('ROLE_STAFF');
                      setProfileDropdownOpen(false);
                    }}
                    className={`py-1.5 rounded-xl font-black text-xs flex flex-col items-center justify-center transition cursor-pointer border ${
                      isStaff && !isAdmin ? 'bg-[#0284C7] text-white border-sky-600 shadow-2xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    <span className="text-sm">S</span>
                    <span className="text-[9px] font-semibold">Staff</span>
                  </button>

                  <button
                    onClick={() => {
                      switchUserRole('ROLE_USER');
                      setProfileDropdownOpen(false);
                    }}
                    className={`py-1.5 rounded-xl font-black text-xs flex flex-col items-center justify-center transition cursor-pointer border ${
                      isGuest ? 'bg-[#10B981] text-white border-emerald-600 shadow-2xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    <span className="text-sm">G</span>
                    <span className="text-[9px] font-semibold">Guest</span>
                  </button>
                </div>
              </div>

              {/* Status info */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Trạng thái kết nối</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isBackendConnected ? 'API 8080 Live' : 'Local Sandbox'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
