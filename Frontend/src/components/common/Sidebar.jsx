import React from 'react';
import { 
  Home, 
  CreditCard, 
  Landmark, 
  Users, 
  Building2, 
  Package, 
  BarChart3, 
  Code, 
  Settings, 
  Palette,
  ChevronDown,
  X,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { CactusLogo } from '../icons/Icons';

export default function Sidebar() {
  const { 
    currentView, 
    switchView, 
    isTestMode, 
    toggleTestMode, 
    sidebarOpen, 
    setSidebarOpen 
  } = useDashboard();

  const navigation = [
    { id: 'home', name: 'Tổng quan (Home)', icon: Home },
    { id: 'payments', name: 'Thu nợ & Thanh toán', icon: CreditCard },
    { id: 'balances', name: 'Số dư nợ & Đối soát', icon: Landmark },
    { id: 'customers', name: 'Khách hàng nợ', icon: Users, subViews: ['customer-detail'] },
    { id: 'connected', name: 'Chi nhánh thu nợ', icon: Building2 },
    { id: 'products', name: 'Hợp đồng & Gói nợ', icon: Package },
    { id: 'reports', name: 'Báo cáo công nợ', icon: BarChart3 },
    { id: 'users', name: 'Phân quyền & Tài khoản', icon: ShieldCheck, badge: 'RBAC' },
  ];

  const secondaryNav = [
    { id: 'design-system', name: 'Design System & UI', icon: Palette },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 select-none transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          {/* Header / Workspace Switcher */}
          <div className="flex items-center justify-between mb-6 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition group">
            <div className="flex items-center gap-2.5">
              <CactusLogo className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  DebtMaster
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Quản Lý & Thu Hồi Nợ</span>
              </div>
            </div>
            
            {/* Mobile close button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Navigation Menu */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.subViews && item.subViews.includes(currentView));
              return (
                <button
                  key={item.id}
                  onClick={() => switchView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#F0EFFE] text-[#635BFF] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#635BFF]' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-[#635BFF]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary / Tools Section */}
          <div className="pt-6 mt-6 border-t border-slate-100 space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Resources
            </div>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => switchView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#F0EFFE] text-[#635BFF] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#635BFF]' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-[#635BFF]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer Controls: Test Data Switch & Settings */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            {/* Test Data Toggle */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-slate-50 transition">
              <span className="text-xs text-slate-600 font-medium">View test data</span>
              <button
                type="button"
                onClick={toggleTestMode}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isTestMode ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out transform ${
                    isTestMode ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Developers Link */}
            <button 
              onClick={() => alert("Developers API Docs:\nPublishable key: pk_demo_cactus_992182\nSecret key: sk_demo_cactus_••••••••••••")}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
            >
              <Code className="w-4 h-4 text-slate-400" />
              <span>Developers</span>
            </button>

            {/* Settings Link */}
            <button 
              onClick={() => switchView('design-system')}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
