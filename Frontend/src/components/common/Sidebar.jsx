import React from 'react';
import { 
  LayoutDashboard,
  FileText, 
  Users, 
  Package, 
  Receipt,
  CreditCard, 
  Wallet,
  BarChart2,
  ChevronDown,
  X,
  ShieldCheck,
  QrCode,
  BellRing,
  Scale,
  Lock,
  Crown,
  Stethoscope,
  Sparkles,
  Layers,
  Settings
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function Sidebar() {
  const { 
    currentView, 
    switchView, 
    sidebarOpen, 
    setSidebarOpen,
    isBackendConnected,
    currentUser,
    switchUserRole,
    t
  } = useDashboard();

  const isAdmin = !!(currentUser?.roles && currentUser.roles.includes('ROLE_ADMIN'));
  const isStaff = !!(currentUser?.roles && (currentUser.roles.includes('ROLE_STAFF') || currentUser.roles.includes('ROLE_ADMIN')));
  const isGuest = !isStaff;

  // Fortinvo Nav Menu items mapped to views
  const navigationItems = isGuest ? [
    { id: 'home', name: t('dashboard'), icon: LayoutDashboard },
    { id: 'invoices', name: t('invoices'), icon: FileText, badge: 'VietQR' },
    { id: 'ptp_disputes', name: t('ptpDisputes'), icon: Scale },
    { id: 'payments', name: t('paymentsReceived'), icon: CreditCard },
  ] : [
    { id: 'home', name: t('dashboard'), icon: LayoutDashboard },
    { id: 'invoices', name: t('invoices'), icon: FileText, badge: 'VietQR' },
    { id: 'customers', name: t('customers'), icon: Users },
    { id: 'products', name: t('items'), icon: Package },
    { id: 'credit', name: t('salesReceipts'), icon: Receipt },
    { id: 'payments', name: t('paymentsReceived'), icon: CreditCard },
    { id: 'expenses', name: t('expenses'), icon: Wallet },
    { id: 'reports', name: t('reports'), icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 select-none transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          {/* Fortinvo Logo Header */}
          <div className="flex items-center justify-between mb-6 px-2 py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-xs shadow-blue-500/30">
                F
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Fortinvo
                </span>
                <span className="block text-[9px] font-semibold text-slate-400 tracking-wider -mt-1 uppercase">
                  DebtMaster O2C
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation Menu */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (switchView) switchView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin / Staff Additional O2C Sub-modules */}
          {!isGuest && (
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                O2C Modules
              </div>
              <button
                onClick={() => {
                  if (switchView) switchView('dunning');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  currentView === 'dunning'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BellRing className="w-4 h-4 text-slate-400" />
                  <span>{t('dunningWorklist')}</span>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">T-3..T+30</span>
              </button>

              <button
                onClick={() => {
                  if (switchView) switchView('maker_checker');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  currentView === 'maker_checker'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>{t('makerChecker')}</span>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">SoD</span>
              </button>
            </div>
          )}

          {/* Footer User & Role Profile Widget */}
          <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Role
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-indigo-100 text-indigo-700' : isStaff ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isAdmin ? 'ADMIN' : isStaff ? 'STAFF' : 'GUEST'}
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-slate-800 truncate">
                {currentUser?.email || 'admin@fortinvo.io'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isBackendConnected ? 'API 8080 Connected' : 'Local Mock Mode'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
