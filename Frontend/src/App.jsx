import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import TestModeBanner from './components/common/TestModeBanner';
import AccessDeniedView from './components/common/AccessDeniedView';
import Modal from './components/common/Modal';
import { Crown, Stethoscope, User, ShieldAlert, Lock } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import CreditPage from './pages/CreditPage';
import DunningPage from './pages/DunningPage';
import MakerCheckerPage from './pages/MakerCheckerPage';
import PtpDisputesPage from './pages/PtpDisputesPage';
import PaymentsPage from './pages/PaymentsPage';
import BalancesPage from './pages/BalancesPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ConnectedAccountsPage from './pages/ConnectedAccountsPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import DesignSystemPage from './pages/DesignSystemPage';
import UsersPage from './pages/UsersPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠
            </div>
            <h2 className="text-lg font-bold text-slate-900">Đã xảy ra lỗi giao diện</h2>
            <p className="text-xs text-slate-500">
              {this.state.error?.message || 'Có lỗi phát sinh trong quá trình hiển thị giao diện.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function DashboardContent() {
  const { 
    currentView, 
    isTestMode, 
    toggleTestMode, 
    activeModal, 
    setActiveModal,
    addTransaction,
    exportData,
    customers,
    currentUser,
    isAdmin,
    isStaff,
    t
  } = useDashboard();

  // Create payment modal state
  const [payAmount, setPayAmount] = useState('49.00');
  const [payCustomer, setPayCustomer] = useState(customers[0]?.name || 'Jane Diaz');
  const [payDesc, setPayDesc] = useState('Medical Consultation Fee');
  const [paySuccess, setPaySuccess] = useState(false);

  const isGuest = !isStaff;

  const handleCreatePaymentSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(payAmount) || 10.0;
    const fee = (num * 0.029 + 0.3).toFixed(2);
    const net = (num - fee).toFixed(2);

    const newTx = {
      id: `ch_3N${Math.random().toString(36).substring(2, 10)}`,
      amount: `$${num.toFixed(2)} USD`,
      gross: `$${num.toFixed(2)} USD`,
      fee: `-$${fee} USD`,
      net: `$${net} USD`,
      status: 'Succeeded',
      statusType: 'success',
      customer: payCustomer,
      customerEmail: `${payCustomer.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      method: 'Visa •••• 4242',
      date: 'Just now',
      rawAmount: num,
      description: payDesc
    };

    await addTransaction(newTx);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setActiveModal(null);
    }, 1200);
  };

  const renderActivePage = () => {
    // --- 1. RBAC GUARDS FOR GUEST / ROLE_USER ---
    if (isGuest) {
      if (['credit', 'dunning', 'expenses', 'balances', 'bank_recon', 'maker_checker'].includes(currentView)) {
        return (
          <AccessDeniedView 
            requiredRole="ROLE_STAFF hoặc ROLE_ADMIN"
            featureName={`Phân hệ nội bộ: ${
              currentView === 'credit' ? 'Đơn hàng & Thẩm định rủi ro Tín dụng' :
              currentView === 'dunning' ? 'Bàn thu nợ đa tầng nội bộ' :
              currentView === 'expenses' || currentView === 'balances' ? 'Chi phí & Quản lý Sổ quỹ' :
              'Hàng chờ Maker-Checker Admin'
            }`}
            customMessage="Khách hàng B2B (User/Guest) không có quyền xem quy trình thẩm định tín dụng, đôn đốc nợ hoặc chi phí & sổ quỹ giải ngân nội bộ. Bạn chỉ có quyền tự phục vụ trên phân hệ 'Hóa đơn & VietQR' và 'Cam kết PTP & Khiếu nại'."
          />
        );
      }
      if (['customers', 'customer-detail', 'reports', 'users', 'connected'].includes(currentView)) {
        return (
          <AccessDeniedView 
            requiredRole="ROLE_STAFF hoặc ROLE_ADMIN"
            featureName={`Vận hành nội bộ: ${currentView}`}
            customMessage="Khu vực này chứa dữ liệu tài chính nội bộ. Khách hàng B2B chỉ có quyền xem hóa đơn và lịch sử thanh toán của công ty mình."
          />
        );
      }
    }

    // --- 2. RBAC GUARDS FOR STAFF (Non-Admin) ---
    if (!isAdmin && currentView === 'users') {
      return (
        <AccessDeniedView 
          requiredRole="ROLE_ADMIN"
          featureName="Quản trị Người Dùng & Phân Quyền (RBAC)"
          customMessage="Theo nguyên tắc kiểm soát nội bộ và phân tách nhiệm vụ (Segregation of Duties - SoD), chỉ Quản trị viên cấp cao (ROLE_ADMIN) mới có quyền tạo tài khoản và phân quyền hệ thống."
        />
      );
    }

    // --- 3. RENDER ALLOWED VIEWS ---
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'credit':
        return <CreditPage />;
      case 'dunning':
        return <DunningPage />;
      case 'ptp_disputes':
        return <PtpDisputesPage />;
      case 'maker_checker':
        return <MakerCheckerPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'expenses':
      case 'balances':
      case 'bank_recon':
        return <BalancesPage />;
      case 'customers':
        return <CustomersPage />;
      case 'customer-detail':
        return <CustomerDetailPage />;
      case 'connected':
        return <ConnectedAccountsPage />;
      case 'products':
        return <ProductsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'design-system':
        return <DesignSystemPage />;
      default:
        return isGuest ? <InvoicesPage /> : <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Test Mode Alert Top Banner */}
      <TestModeBanner isTestMode={isTestMode} onToggle={toggleTestMode} />

      {/* RBAC Visual Status Indicator Banner */}
      <div className={`px-4 py-1.5 text-[11px] font-semibold flex items-center justify-between border-b transition-colors ${
        isAdmin 
          ? 'bg-blue-50/90 text-blue-900 border-blue-100' 
          : isStaff 
            ? 'bg-sky-50 text-sky-900 border-sky-100' 
            : 'bg-emerald-50 text-emerald-900 border-emerald-100'
      }`}>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Crown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          ) : isStaff ? (
            <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <span>
            {isAdmin && t('adminRole')}
            {isStaff && !isAdmin && t('staffRole')}
            {isGuest && t('guestRole')}
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200/60 shadow-2xs">
          {isAdmin ? t('fullAuth') : isStaff ? t('makerAuth') : t('guestSandbox')}
        </span>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-theme(spacing.0))]">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
          <Topbar />
          <main className="flex-1 pb-16">
            {renderActivePage()}
          </main>
        </div>
      </div>

      {/* Global Modal: Create Payment */}
      <Modal
        isOpen={activeModal === 'new-payment'}
        onClose={() => setActiveModal(null)}
        title="Create New Payment Charge"
        maxWidth="max-w-md"
      >
        {paySuccess ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <h4 className="text-base font-bold text-slate-900">Payment Charged Successfully!</h4>
            <p className="text-xs text-slate-500">Record saved to MySQL database ledger.</p>
          </div>
        ) : (
          <form onSubmit={handleCreatePaymentSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Customer
              </label>
              <select
                value={payCustomer}
                onChange={(e) => setPayCustomer(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Description / Memo
              </label>
              <input
                type="text"
                value={payDesc}
                onChange={(e) => setPayDesc(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5851EA] rounded-lg transition shadow-xs"
              >
                Charge Payment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ErrorBoundary>
  );
}
