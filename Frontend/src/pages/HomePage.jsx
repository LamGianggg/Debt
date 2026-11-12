import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar, 
  Download, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Clock, 
  QrCode, 
  FileText, 
  Check, 
  X, 
  ExternalLink, 
  Search, 
  Sparkles, 
  ArrowRight, 
  DollarSign,
  Receipt,
  Copy,
  Zap
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function HomePage() {
  const { 
    timeframe, 
    setTimeframe, 
    isAdmin, 
    isStaff, 
    invoices, 
    payInvoice, 
    o2cKpis, 
    switchView,
    t
  } = useDashboard();

  const [projectBannerVisible, setProjectBannerVisible] = useState(true);

  // VietQR Paywall Modal States
  const [selectedQRInvoice, setSelectedQRInvoice] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [webhookStep, setWebhookStep] = useState('idle');

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

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. HEADER TITLE SECTION (FORTINVO EXACT STYLE) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {t('overviewTitle')}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {t('overviewSub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => switchView('invoices')}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl border border-blue-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>{t('viewAllInvoices')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TOP 4 METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* CARD 1: TOTAL REVENUE (VIBRANT ROYAL BLUE #1868DF) */}
        <div className="bg-[#1868DF] text-white p-5 md:p-6 rounded-2xl shadow-soft-sm flex flex-col justify-between relative overflow-hidden group transition-all duration-200 hover:shadow-soft-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white/90">
                {t('totalRevenue')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight font-sans">
              $124,500
            </div>
            <div className="text-[11px] text-white/70 mt-0.5">
              ({o2cKpis.totalReceivables || '14.280.000.000 ₫'} AR Ledger)
            </div>
          </div>

          <div className="mt-4 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>12%</span>
            </span>
          </div>
        </div>

        {/* CARD 2: UPCOMING PAYMENT (WHITE) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-soft-xs flex flex-col justify-between transition-all duration-200 hover:shadow-soft-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {t('upcomingPayment')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              $32,400
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Hạn thanh toán trong 7 ngày tới
            </div>
          </div>

          <div className="mt-4 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full">
              <ArrowDownRight className="w-3 h-3" />
              <span>12%</span>
            </span>
          </div>
        </div>

        {/* CARD 3: OVERDUE AMOUNT (WHITE) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-soft-xs flex flex-col justify-between transition-all duration-200 hover:shadow-soft-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {t('overdueAmount')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              $8,200
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {o2cKpis.agingOver90 || '4 Hóa đơn quá hạn > 30d'}
            </div>
          </div>

          <div className="mt-4 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              <span>12%</span>
            </span>
          </div>
        </div>

        {/* CARD 4: PAID THIS MONTH (WHITE) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-soft-xs flex flex-col justify-between transition-all duration-200 hover:shadow-soft-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {t('paidThisMonth')}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              $45,800
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Tỷ lệ gạch nợ tự động STP 92.8%
            </div>
          </div>

          <div className="mt-4 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              <span>12%</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700">Quick Actions</div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => switchView('invoices')}
              className="px-4 py-2 bg-[#1868DF] hover:bg-[#1255B8] text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('createInvoice')}</span>
            </button>

            <button
              onClick={() => switchView('dunning')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            >
              {t('sendReminder')}
            </button>

            <button
              onClick={() => {
                const firstUnpaid = invoices.find(i => (i.payment_status || i.paymentStatus) !== 'PAID');
                if (firstUnpaid) setSelectedQRInvoice(firstUnpaid);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            >
              {t('recordPayment')}
            </button>
          </div>
        </div>
      </div>

      {/* 4. PAYMENT OVERVIEW SECTION (SIDE-BY-SIDE CHARTS) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-soft-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          {t('paymentOverview')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT CHART: REVENUE TREND (LINE CHART) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
                  {t('revenueTrend')}
                </span>
                <span className="text-2xl font-extrabold text-slate-900 font-sans">
                  $124,500
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/60">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>12% vs last month</span>
              </span>
            </div>

            {/* SVG Bezier Line Chart */}
            <div className="relative h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fortinvoBlueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1868DF" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#1868DF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                <path
                  d="M 20 120 C 70 125, 110 90, 160 105 C 210 120, 240 75, 290 85 C 340 95, 380 60, 430 45 C 460 35, 480 30, 480 30 L 480 160 L 20 160 Z"
                  fill="url(#fortinvoBlueFill)"
                />

                <path
                  d="M 20 120 C 70 125, 110 90, 160 105 C 210 120, 240 75, 290 85 C 340 95, 380 60, 430 45 C 460 35, 480 30, 480 30"
                  fill="none"
                  stroke="#1868DF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {[
                  { cx: 20, cy: 120, val: '$85k' },
                  { cx: 100, cy: 110, val: '$92k' },
                  { cx: 180, cy: 105, val: '$98k' },
                  { cx: 260, cy: 85, val: '$106k' },
                  { cx: 340, cy: 75, val: '$114k' },
                  { cx: 420, cy: 45, val: '$120k' },
                  { cx: 480, cy: 30, val: '$124.5k' },
                ].map((dot, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={dot.cx}
                      cy={dot.cy}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#1868DF"
                      strokeWidth="2.5"
                      className="transition-transform group-hover:scale-150"
                    />
                    <text
                      x={dot.cx}
                      y={dot.cy - 10}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {dot.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* RIGHT CHART: COLLECTION BREAKDOWN (DONUT CHART) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="10"
                  strokeDasharray="83.5 155.3"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#D946EF"
                  strokeWidth="10"
                  strokeDasharray="47.7 191"
                  strokeDashoffset="-83.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  strokeDasharray="23.8 214.9"
                  strokeDashoffset="-131.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#1868DF"
                  strokeWidth="10"
                  strokeDasharray="66.8 171.9"
                  strokeDashoffset="-155"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">
                  73%
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                  {t('collectedRate')}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs w-full max-w-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                  <span className="text-slate-500">{t('totalRevenue')}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">$124,500</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D946EF] shrink-0" />
                  <span className="text-slate-500">{t('upcomingPayment')}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">$32,400</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                  <span className="text-slate-500">{t('overdueAmount')}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">$8,200</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1868DF] shrink-0" />
                  <span className="text-slate-500">{t('paidThisMonth')}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">$45,800</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. NOTICE BANNER ("Start a Project Brief") */}
      {projectBannerVisible && (
        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white rounded-2xl border border-blue-100/80 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Start a Project Brief</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us what you need and find the right talent for your project or automated O2C workflow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => switchView('invoices')}
              className="px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => setProjectBannerVisible(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. RECENT INVOICES TABLE (FORTINVO EXACT COLUMNS) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('recentInvoicesTitle')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('recentInvoicesSub')}
            </p>
          </div>

          <button
            onClick={() => switchView('invoices')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAllInvoices')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">{t('invoiceId')}</th>
                <th className="p-4">{t('client')}</th>
                <th className="p-4">{t('dueDate')}</th>
                <th className="p-4">{t('amount')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInvoices.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold font-mono text-blue-600">
                    {row.id}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{row.customer || row.customerName}</div>
                    <div className="text-[10px] text-slate-400">VietinBank Virtual Account</div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">
                    {row.dueDate}
                  </td>
                  <td className="p-4 font-bold font-mono text-slate-900">
                    {row.amount}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      (row.payment_status || row.paymentStatus) === 'PAID' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : (row.payment_status || row.paymentStatus) === 'PARTIALLY_PAID'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (row.payment_status || row.paymentStatus) === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      <span>{
                        (row.payment_status || row.paymentStatus) === 'PAID' ? t('paid') :
                        (row.payment_status || row.paymentStatus) === 'PARTIALLY_PAID' ? t('partiallyPaid') : t('unpaid')
                      }</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {(row.payment_status || row.paymentStatus) === 'PAID' ? (
                      <span className="text-emerald-600 font-bold text-xs">Đã thu</span>
                    ) : (
                      <button
                        onClick={() => setSelectedQRInvoice(row)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-xs transition cursor-pointer"
                      >
                        {t('vietqrBtn')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
