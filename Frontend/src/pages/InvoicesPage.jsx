import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Download, 
  Plus, 
  Check, 
  Copy, 
  Zap, 
  QrCode, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';

export default function InvoicesPage() {
  const { 
    invoices, 
    payInvoice, 
    o2cKpis, 
    t, 
    setActiveModal, 
    globalSearch, 
    setGlobalSearch 
  } = useDashboard();

  const [localSearch, setLocalSearch] = useState('');
  const [activeAgingFilter, setActiveAgingFilter] = useState('ALL');
  const [activePaymentStatus, setActivePaymentStatus] = useState('ALL');

  // VietQR Modal States
  const [selectedQRInvoice, setSelectedQRInvoice] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [webhookStep, setWebhookStep] = useState('idle');

  const activeSearchTerm = (globalSearch || localSearch || '').trim().toLowerCase();

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePaymentWebhook = async (invoiceId) => {
    setWebhookStep('simulating');
    setTimeout(async () => {
      await payInvoice(invoiceId);
      setWebhookStep('success');
      setTimeout(() => {
        setSelectedQRInvoice(null);
        setWebhookStep('idle');
      }, 1500);
    }, 2000);
  };

  // Aging match helper
  const matchesAging = (inv, bucket) => {
    if (bucket === 'ALL') return true;
    const stage = (inv.aging_stage || inv.agingStage || '').toUpperCase();
    if (bucket === '0-30') {
      return stage.includes('NOT_DUE') || stage.includes('0-30') || stage.includes('T-3') || stage.includes('3D') || stage.includes('T1') || stage.includes('PAID');
    }
    if (bucket === '31-60') {
      return stage.includes('31-60') || stage.includes('8D') || stage.includes('9D') || stage.includes('T2');
    }
    if (bucket === '61-90') {
      return stage.includes('61-90') || stage.includes('T3');
    }
    if (bucket === '91-120') {
      return stage.includes('91-120');
    }
    if (bucket === '>120') {
      return stage.includes('>120') || stage.includes('DEFAULT') || stage.includes('>30D') || stage.includes('NỢ XẤU');
    }
    return true;
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    // 1. Search Query
    if (activeSearchTerm) {
      const idMatch = (inv.id || '').toLowerCase().includes(activeSearchTerm);
      const custMatch = (inv.customer || inv.customerName || '').toLowerCase().includes(activeSearchTerm);
      const vaMatch = (inv.vaNumber || inv.virtualAccount || '').toLowerCase().includes(activeSearchTerm);
      const amtMatch = (inv.amount || '').toLowerCase().includes(activeSearchTerm);
      if (!idMatch && !custMatch && !vaMatch && !amtMatch) return false;
    }

    // 2. Aging Bucket Filter
    if (!matchesAging(inv, activeAgingFilter)) return false;

    // 3. Payment Status Filter
    if (activePaymentStatus !== 'ALL') {
      const ps = (inv.payment_status || inv.paymentStatus || '').toUpperCase();
      if (activePaymentStatus === 'PAID' && ps !== 'PAID') return false;
      if (activePaymentStatus === 'UNPAID' && ps !== 'UNPAID') return false;
      if (activePaymentStatus === 'PARTIALLY_PAID' && ps !== 'PARTIALLY_PAID') return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('invoicesTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('invoicesSub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('export')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('export')}</span>
          </button>

          <button 
            onClick={() => setActiveModal('new-payment')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1868DF] hover:bg-[#1255B8] text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('createInvoice')}</span>
          </button>
        </div>
      </div>

      {/* 5 AGING BUCKETS (HORIZONTAL PIPELINE) */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-soft-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>{t('agingPipelineTitle')}</span>
            <span className="text-blue-600 font-semibold normal-case text-xs bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {t('agingClickHint')}
            </span>
          </h3>

          {activeAgingFilter !== 'ALL' && (
            <button
              onClick={() => setActiveAgingFilter('ALL')}
              className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Xóa bộ lọc xô nợ ({activeAgingFilter})</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: '0-30', label: t('bucket0to30'), sub: 'Chưa đến hạn / Mới', amount: o2cKpis.currentAging0to30 || '8.950.000.000 ₫', pct: '62.7%' },
            { key: '31-60', label: t('bucket31to60'), sub: 'Quá hạn nhẹ Tier 1', amount: o2cKpis.aging31to60 || '3.120.000.000 ₫', pct: '21.8%' },
            { key: '61-90', label: t('bucket61to90'), sub: 'Cảnh báo Tier 2', amount: o2cKpis.aging61to90 || '1.450.000.000 ₫', pct: '10.2%' },
            { key: '91-120', label: t('bucket91to120'), sub: 'Nghiêm trọng Tier 3', amount: '520.000.000 ₫', pct: '3.6%' },
            { key: '>120', label: t('bucketOver120'), sub: 'Nợ xấu pháp lý', amount: o2cKpis.agingOver90 || '240.000.000 ₫', pct: '1.7%' },
          ].map((b) => {
            const isSelected = activeAgingFilter === b.key;
            return (
              <button
                key={b.key}
                onClick={() => setActiveAgingFilter(isSelected ? 'ALL' : b.key)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-200 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                    {b.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{b.pct}</span>
                </div>
                <div className="text-sm font-extrabold font-mono text-slate-900 mt-1.5">{b.amount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{b.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices List with Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto">
            {[
              { id: 'ALL', label: t('all') },
              { id: 'UNPAID', label: t('unpaid') },
              { id: 'PARTIALLY_PAID', label: t('partiallyPaid') },
              { id: 'PAID', label: t('paid') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePaymentStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activePaymentStatus === tab.id
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar inside invoices */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={globalSearch || localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setGlobalSearch(e.target.value);
                }}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition text-slate-800"
              />
              {(globalSearch || localSearch) && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setGlobalSearch('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">{t('invoiceId')}</th>
                <th className="p-4">{t('customerAndVA')}</th>
                <th className="p-4">{t('amount')}</th>
                <th className="p-4">{t('dueDate')}</th>
                <th className="p-4">TUỔI NỢ</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    {t('noDataMatch')}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold font-mono text-blue-600">{inv.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{inv.customer || inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        VA: <span className="text-blue-600 font-semibold">{inv.vaNumber || inv.virtualAccount}</span> ({inv.vaBank || 'VietinBank'})
                      </div>
                    </td>
                    <td className="p-4 font-bold font-mono text-slate-900">{inv.amount}</td>
                    <td className="p-4 text-slate-600 font-medium">{inv.dueDate}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono">
                        {inv.aging_stage || '0-30d'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        (inv.payment_status || inv.paymentStatus) === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : (inv.payment_status || inv.paymentStatus) === 'PARTIALLY_PAID'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          (inv.payment_status || inv.paymentStatus) === 'PAID' ? 'bg-emerald-500' : (inv.payment_status || inv.paymentStatus) === 'PARTIALLY_PAID' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span>{
                          (inv.payment_status || inv.paymentStatus) === 'PAID' ? t('paid') :
                          (inv.payment_status || inv.paymentStatus) === 'PARTIALLY_PAID' ? t('partiallyPaid') : t('unpaid')
                        }</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {(inv.payment_status || inv.paymentStatus) === 'PAID' ? (
                        <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã tất toán</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedQRInvoice(inv)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition cursor-pointer shadow-2xs"
                        >
                          {t('vietqrBtn')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer record counter */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-slate-400 text-xs text-right pr-6">
          {t('showing')} {filteredInvoices.length} / {invoices.length} {t('records')}
        </div>
      </div>

      {/* --- VIETQR MODAL DIALOG --- */}
      {selectedQRInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-soft-lg max-w-md w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cổng Thanh Toán VietQR B2B
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tự động gạch nợ tức thì qua Webhook ngân hàng
                </p>
              </div>
              <button
                onClick={() => setSelectedQRInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* QR Code Container */}
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                <img
                  src={`https://api.vietqr.io/image/970415-113366668888-compact2.jpg?amount=${
                    parseFloat((selectedQRInvoice.amount || '1000000').replace(/[^0-9]/g, '')) || 1000000
                  }&addInfo=${encodeURIComponent(selectedQRInvoice.id)}&accountName=DEBTMASTER%20CORP`}
                  alt="VietQR Code"
                  className="w-48 h-48 object-contain rounded-xl shadow-2xs"
                />
                <span className="text-[11px] font-bold text-blue-600 mt-2">
                  Quét mã trên mọi ứng dụng Ngân hàng & Ví điện tử
                </span>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">Số tài khoản ảo (VA):</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span>{selectedQRInvoice.vaNumber || '90212345678901'}</span>
                    <button
                      onClick={() => copyToClipboard(selectedQRInvoice.vaNumber || '90212345678901', 'va')}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {copiedField === 'va' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">{t('amount')}:</span>
                  <span className="font-extrabold text-blue-600 text-xs font-mono">
                    {selectedQRInvoice.amount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">Nội dung chuyển khoản:</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span>{selectedQRInvoice.id}</span>
                    <button
                      onClick={() => copyToClipboard(selectedQRInvoice.id, 'memo')}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {copiedField === 'memo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulating Webhook Button */}
              <div>
                <button
                  disabled={webhookStep !== 'idle'}
                  onClick={() => handleSimulatePaymentWebhook(selectedQRInvoice.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    webhookStep === 'idle'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-soft-xs'
                      : webhookStep === 'simulating'
                        ? 'bg-blue-100 text-blue-600 cursor-wait'
                        : 'bg-emerald-600 text-white'
                  }`}
                >
                  {webhookStep === 'idle' && (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Mô phỏng Chuyển khoản & Webhook STP (2 Giây)</span>
                    </>
                  )}
                  {webhookStep === 'simulating' && (
                    <span>Đang nhận tín hiệu ngân hàng & đối soát tự động...</span>
                  )}
                  {webhookStep === 'success' && (
                    <span>✓ Đã gạch nợ thành công vào Sổ cái MySQL!</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
