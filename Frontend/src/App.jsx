import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import TestModeBanner from './components/common/TestModeBanner';
import Modal from './components/common/Modal';

// Pages
import HomePage from './pages/HomePage';
import PaymentsPage from './pages/PaymentsPage';
import BalancesPage from './pages/BalancesPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ConnectedAccountsPage from './pages/ConnectedAccountsPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import DesignSystemPage from './pages/DesignSystemPage';
import UsersPage from './pages/UsersPage';

function DashboardContent() {
  const { 
    currentView, 
    isTestMode, 
    toggleTestMode, 
    activeModal, 
    setActiveModal,
    addTransaction,
    exportData,
    customers
  } = useDashboard();

  // Create payment modal state
  const [payAmount, setPayAmount] = useState('49.00');
  const [payCustomer, setPayCustomer] = useState(customers[0]?.name || 'Jane Diaz');
  const [payDesc, setPayDesc] = useState('Medical Consultation Fee');
  const [paySuccess, setPaySuccess] = useState(false);

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
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'payments':
        return <PaymentsPage />;
      case 'balances':
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
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#0F172A]">
      {/* Test Mode Alert Top Banner */}
      <TestModeBanner isTestMode={isTestMode} onToggle={toggleTestMode} />

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
              <label className="block text-slate-700 font-medium mb-1">Charge Amount (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF] text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Khách nợ / Doanh nghiệp thanh toán *</label>
              <select
                value={payCustomer}
                onChange={(e) => setPayCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF] bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Nội dung nợ / Khoản thanh toán</label>
              <input
                type="text"
                value={payDesc}
                onChange={(e) => setPayDesc(e.target.value)}
                placeholder="Ví dụ: Thanh toán đợt 2 - Hợp đồng nợ số HD-2026/08"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#635BFF]"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-500">Hình thức thanh toán</p>
              <p className="font-semibold text-slate-800 text-xs mt-0.5">Chuyển khoản Ngân hàng / Thẻ ủy quyền</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold rounded-lg shadow-xs transition"
              >
                Submit Charge
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Global Modal: Export */}
      <Modal
        isOpen={activeModal === 'export'}
        onClose={() => setActiveModal(null)}
        title="Export Financial Dataset"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Select your preferred export format for general ledger reporting directly from the Backend server:
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => { exportData('csv'); setActiveModal(null); }}
              className="w-full p-3 border border-slate-200 rounded-lg text-left hover:border-[#635BFF] hover:bg-indigo-50/20 transition flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">Comma-Separated Values (.csv)</p>
                <p className="text-[11px] text-slate-400">Direct streaming from /api/transactions/export/csv</p>
              </div>
              <span className="text-[#635BFF] font-semibold text-xs">Download</span>
            </button>

            <button 
              onClick={() => { exportData('json'); setActiveModal(null); }}
              className="w-full p-3 border border-slate-200 rounded-lg text-left hover:border-[#635BFF] hover:bg-indigo-50/20 transition flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">JavaScript Object Notation (.json)</p>
                <p className="text-[11px] text-slate-400">Structured data with full metadata from /api/transactions/export/json</p>
              </div>
              <span className="text-[#635BFF] font-semibold text-xs">Download</span>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
