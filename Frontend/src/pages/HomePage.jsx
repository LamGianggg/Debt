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
  ShieldAlert, 
  QrCode, 
  Building2, 
  FileText, 
  Check, 
  X, 
  ExternalLink, 
  Scale, 
  Landmark, 
  TrendingUp, 
  Search, 
  Lock, 
  Crown, 
  Stethoscope, 
  User, 
  Copy, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  FileCheck, 
  Send, 
  PieChart, 
  BellRing,
  DollarSign,
  Receipt,
  Users,
  ChevronDown
} from 'lucide-react';
import AccessDeniedView from '../components/common/AccessDeniedView';
import { useDashboard } from '../context/DashboardContext';

export default function HomePage({ initialTab = 'overview' }) {
  const { 
    timeframe, 
    setTimeframe, 
    isAdmin, 
    isStaff, 
    currentUser, 
    isBackendConnected, 
    refreshData, 
    salesOrders, 
    approveOrderCredit, 
    invoices, 
    payInvoice, 
    dunningWorklist, 
    sendDunningReminder, 
    ptpList, 
    disputesList, 
    resolveDispute, 
    makerCheckerApprovals, 
    processMakerChecker, 
    o2cKpis, 
    reconciliations, 
    applyDeMinimis, 
    switchUserRole,
    globalSearch,
    setGlobalSearch
  } = useDashboard();

  const isGuest = !isStaff;
  const defaultTab = isGuest ? (['invoices', 'ptp_disputes', 'overview'].includes(initialTab) ? initialTab : 'invoices') : initialTab;
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Search & Filter States
  const [localSearch, setLocalSearch] = useState('');
  const activeSearchTerm = (globalSearch || localSearch || '').trim();
  const [activeAgingFilter, setActiveAgingFilter] = useState('ALL');
  const [projectBannerVisible, setProjectBannerVisible] = useState(true);

  // VietQR Paywall Modal States
  const [selectedQRInvoice, setSelectedQRInvoice] = useState(null);
  const [selectedBank, setSelectedBank] = useState('CTG');
  const [copiedField, setCopiedField] = useState(null);
  const [webhookStep, setWebhookStep] = useState('idle');

  React.useEffect(() => {
    if (initialTab) {
      if (isGuest && !['invoices', 'ptp_disputes', 'overview'].includes(initialTab)) {
        setActiveTab('invoices');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab, isGuest]);

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

  // Filtered invoices (connected with global search)
  const filteredInvoices = invoices.filter(inv => {
    const q = activeSearchTerm.toLowerCase();
    const matchesSearch = !q || (
      (inv.id || '').toLowerCase().includes(q) ||
      (inv.customer || inv.customerName || '').toLowerCase().includes(q) ||
      (inv.vaNumber || inv.virtualAccount || '').toLowerCase().includes(q) ||
      (inv.amount || '').toLowerCase().includes(q)
    );
    
    if (!matchesSearch) return false;
    if (activeAgingFilter === 'ALL') return true;
    if (activeAgingFilter === '0-30') return (inv.aging_stage || inv.deliveryStatus || '').includes('0-30') || inv.agingStage === '0-30';
    if (activeAgingFilter === '31-60') return (inv.aging_stage || inv.deliveryStatus || '').includes('31-60') || inv.agingStage === '31-60';
    if (activeAgingFilter === '61-90') return (inv.aging_stage || inv.deliveryStatus || '').includes('61-90') || inv.agingStage === '61-90';
    if (activeAgingFilter === '91-120') return (inv.aging_stage || inv.deliveryStatus || '').includes('91-120') || inv.agingStage === '91-120';
    if (activeAgingFilter === '>120') return (inv.aging_stage || inv.deliveryStatus || '').includes('>120') || (inv.aging_stage || '').includes('Nợ xấu');
    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* 1. HEADER TITLE SECTION (FORTINVO EXACT STYLE) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Monitor revenue, track outstanding invoices, and take action faster.
          </p>
        </div>

        {/* View / Tab Selector Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Fortinvo Dashboard
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            5 Xô Tuổi Nợ & VietQR
          </button>
          {!isGuest && (
            <>
              <button
                onClick={() => setActiveTab('credit')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'credit'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Tín Dụng & Đơn SO
              </button>
              <button
                onClick={() => setActiveTab('maker_checker')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'maker_checker'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                Maker-Checker
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- TAB 1: OVERVIEW DASHBOARD (EXACT FORTINVO SCREENSHOT REPLICATION) --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
                    Total Revenue
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
                    Upcoming Payment
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
                    Overdue Amount
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
                    Paid This Month
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
                  onClick={() => setActiveTab('invoices')}
                  className="px-4 py-2 bg-[#1868DF] hover:bg-[#1255B8] text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Invoice</span>
                </button>

                <button
                  onClick={() => {
                    alert('Hệ thống nhắc nợ tự động (Email/ZNS) đã được kích hoạt cho các khoản sắp đến hạn!');
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
                >
                  Send Reminder
                </button>

                <button
                  onClick={() => {
                    const firstUnpaid = invoices.find(i => (i.payment_status || i.paymentStatus) !== 'PAID');
                    if (firstUnpaid) setSelectedQRInvoice(firstUnpaid);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
                >
                  Record Payment
                </button>
              </div>

              <div>
                <button 
                  onClick={() => alert('Bộ lọc khoảng thời gian: 30 ngày gần nhất')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-medium rounded-xl flex items-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Choose Date</span>
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. PAYMENT OVERVIEW SECTION (SIDE-BY-SIDE CHARTS: LINE CHART & DONUT CHART) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-soft-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Payment Overview
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* LEFT CHART: REVENUE TREND (LINE CHART) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
                      REVENUE TREND
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

                    {/* Horizontal Guideline lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Gradient Area Fill under Curve */}
                    <path
                      d="M 20 120 C 70 125, 110 90, 160 105 C 210 120, 240 75, 290 85 C 340 95, 380 60, 430 45 C 460 35, 480 30, 480 30 L 480 160 L 20 160 Z"
                      fill="url(#fortinvoBlueFill)"
                    />

                    {/* Smooth Bezier Line */}
                    <path
                      d="M 20 120 C 70 125, 110 90, 160 105 C 210 120, 240 75, 290 85 C 340 95, 380 60, 430 45 C 460 35, 480 30, 480 30"
                      fill="none"
                      stroke="#1868DF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive Data Nodes */}
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
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold fill-slate-800"
                        >
                          {dot.val}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-3 px-2 border-t border-slate-100">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>

              {/* RIGHT CHART: 73% COLLECTED MULTI-SEGMENT DONUT CHART */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80">
                {/* Donut SVG */}
                <div className="relative w-40 h-40 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                    />

                    {/* Segment 1: Purple - Revenue (35%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="10"
                      strokeDasharray="83.5 155.2"
                      strokeDashoffset="0"
                    />

                    {/* Segment 2: Magenta - Upcoming (20%) */}
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

                    {/* Segment 3: Amber - Overdue (10%) */}
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

                    {/* Segment 4: Blue - Paid (28%) */}
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

                  {/* Donut Hole Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">
                      73%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                      Collected
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-2 text-xs w-full max-w-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                      <span className="text-slate-500">Revenue</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">$124,500</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D946EF] shrink-0" />
                      <span className="text-slate-500">Upcoming</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">$32,400</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                      <span className="text-slate-500">Overdue Amount</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">$8,200</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1868DF] shrink-0" />
                      <span className="text-slate-500">Paid</span>
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
                  onClick={() => alert('Mở trợ lý lập kế hoạch O2C tự động')}
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
                  Recent Invoices
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track latest billing statuses and 1-click VietQR instant payments
                </p>
              </div>

              <button
                onClick={() => setActiveTab('invoices')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Invoices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="p-4">INVOICE ID</th>
                    <th className="p-4">CLIENT</th>
                    <th className="p-4">DUE DATE</th>
                    <th className="p-4">AMOUNT</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 'INV-2024-001', client: 'Global Solutions', dueDate: 'Oct 24, 2024', amount: '$1,250.00', status: 'PAID' },
                    { id: 'INV-2024-002', client: 'Acro Corp Vietnam', dueDate: 'Nov 12, 2024', amount: '$3,400.00', status: 'UPCOMING' },
                    { id: 'INV-2024-003', client: 'Alpha Tech Holdings', dueDate: 'Oct 05, 2024', amount: '$820.00', status: 'OVERDUE' },
                    { id: 'INV-2024-004', client: 'Nexus Logistics Hub', dueDate: 'Nov 01, 2024', amount: '$4,100.00', status: 'PAID' },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold font-mono text-blue-600">
                        {row.id}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{row.client}</div>
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
                          row.status === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : row.status === 'UPCOMING'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === 'PAID' ? 'bg-emerald-500' : row.status === 'UPCOMING' ? 'bg-blue-500' : 'bg-rose-500'
                          }`} />
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedQRInvoice({
                              id: row.id,
                              customer: row.client,
                              amount: row.amount,
                              vaBank: 'VietinBank',
                              vaNumber: '90212345678901'
                            });
                          }}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-xs transition cursor-pointer"
                        >
                          VietQR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: INVOICES & 5 AGING BUCKETS --- */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* 5 AGING BUCKETS (HORIZONTAL PIPELINE) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Phân Phối 5 Xô Tuổi Nợ (Aging Buckets Pipeline)</span>
                  <span className="text-blue-600 font-semibold normal-case text-xs bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Bấm vào từng xô nợ để lọc tức thì ↗
                  </span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: '0-30', label: '0-30 Ngày', sub: 'Chưa đến hạn / Mới', amount: o2cKpis.currentAging0to30 || '8.950.000.000 ₫', color: 'emerald', pct: '62.7%' },
                { key: '31-60', label: '31-60 Ngày', sub: 'Quá hạn nhẹ Tier 1', amount: o2cKpis.aging31to60 || '3.120.000.000 ₫', color: 'amber', pct: '21.8%' },
                { key: '61-90', label: '61-90 Ngày', sub: 'Cảnh báo Tier 2', amount: o2cKpis.aging61to90 || '1.450.000.000 ₫', color: 'orange', pct: '10.2%' },
                { key: '91-120', label: '91-120 Ngày', sub: 'Nghiêm trọng Tier 3', amount: '520.000.000 ₫', color: 'rose', pct: '3.6%' },
                { key: '>120', label: '> 120 Ngày', sub: 'Nợ xấu pháp lý', amount: o2cKpis.agingOver90 || '240.000.000 ₫', color: 'red', pct: '1.7%' },
              ].map((b) => (
                <button
                  key={b.key}
                  onClick={() => setActiveAgingFilter(activeAgingFilter === b.key ? 'ALL' : b.key)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    activeAgingFilter === b.key
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-100 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800">{b.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{b.pct}</span>
                  </div>
                  <div className="text-sm font-extrabold font-mono text-slate-900 mt-1.5">{b.amount}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{b.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Invoices List with Search */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Danh Sách Hóa Đơn ({filteredInvoices.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tích hợp tài khoản ảo Virtual Account và thanh toán 1-chạm VietQR
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activeSearchTerm && (
                  <button
                    onClick={() => {
                      setLocalSearch('');
                      setGlobalSearch('');
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 cursor-pointer"
                  >
                    <span>Tìm: "{activeSearchTerm}"</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {activeAgingFilter !== 'ALL' && (
                  <button
                    onClick={() => setActiveAgingFilter('ALL')}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 cursor-pointer"
                  >
                    <span>Lọc: {activeAgingFilter}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={globalSearch || localSearch}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      setGlobalSearch(e.target.value);
                    }}
                    placeholder="Tìm hóa đơn, khách hàng..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500"
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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="p-4">MÃ HÓA ĐƠN</th>
                    <th className="p-4">KHÁCH HÀNG & VA</th>
                    <th className="p-4">SỐ TIỀN</th>
                    <th className="p-4">HẠN THANH TOÁN</th>
                    <th className="p-4">TRẠNG THÁI</th>
                    <th className="p-4 text-right">THANH TOÁN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold font-mono text-blue-600">{inv.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{inv.customer || inv.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          VA: <span className="text-blue-600 font-semibold">{inv.vaNumber || inv.virtualAccount}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold font-mono text-slate-900">{inv.amount}</td>
                      <td className="p-4 text-slate-600 font-medium">{inv.dueDate}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          (inv.payment_status || inv.paymentStatus) === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${(inv.payment_status || inv.paymentStatus) === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{inv.payment_status || inv.paymentStatus}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedQRInvoice(inv)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition cursor-pointer shadow-2xs"
                        >
                          Quét VietQR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: CREDIT RISK & SALES ORDERS (INTERNAL) --- */}
      {activeTab === 'credit' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-soft-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Thẩm Định Rủi Ro Tín Dụng & Đơn Hàng (SO)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kiểm soát trần tín dụng tự động trước khi xuất kho giao hàng
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">MÃ ĐƠN SO</th>
                  <th className="p-4">KHÁCH HÀNG</th>
                  <th className="p-4">GIÁ TRỊ ĐƠN</th>
                  <th className="p-4">HẠN MỨC CÒN LẠI</th>
                  <th className="p-4">TRẠNG THÁI</th>
                  <th className="p-4 text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesOrders.map((so) => (
                  <tr key={so.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold font-mono text-blue-600">{so.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{so.customer || so.customerName}</td>
                    <td className="p-4 font-bold font-mono text-slate-900">{so.amount || so.orderAmount}</td>
                    <td className="p-4 font-mono text-slate-600">{so.availableCredit || so.creditLimit}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        so.creditStatus === 'PASS' || so.status === 'APPROVED_RESERVED' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {so.creditStatus || so.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <button
                          onClick={() => {
                            approveOrderCredit(so.id);
                            alert(`Admin đã phê duyệt đơn ${so.id}!`);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                        >
                          Duyệt Đơn
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">Chờ Admin Duyệt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: MAKER-CHECKER ADMIN --- */}
      {activeTab === 'maker_checker' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-soft-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Hàng Chờ Phê Duyệt Kiểm Soát Maker-Checker (SoD)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">MÃ YÊU CẦU</th>
                  <th className="p-4">LOẠI NGHIỆP VỤ</th>
                  <th className="p-4">NGƯỜI ĐỀ XUẤT (MAKER)</th>
                  <th className="p-4">LÝ DO & GIẢI TRÌNH</th>
                  <th className="p-4 text-right">QUYẾT ĐỊNH (CHECKER)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {makerCheckerApprovals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold font-mono text-blue-600">{req.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{req.type}</td>
                    <td className="p-4 text-slate-600">{req.maker}</td>
                    <td className="p-4 text-slate-700 max-w-xs">{req.reason || req.description}</td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              processMakerChecker(req.id, 'APPROVED');
                              alert(`Đã phê duyệt yêu cầu ${req.id}!`);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 transition cursor-pointer"
                          >
                            Phê Duyệt
                          </button>
                          <button
                            onClick={() => {
                              processMakerChecker(req.id, 'REJECTED');
                              alert(`Đã từ chối yêu cầu ${req.id}!`);
                            }}
                            className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs hover:bg-rose-700 transition cursor-pointer"
                          >
                            Từ Chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-amber-600 text-[11px] font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Chỉ CFO / Admin có quyền Checker
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
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
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {copiedField === 'va' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">Số tiền cần trả:</span>
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
                      className="text-blue-600 hover:text-blue-700"
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
