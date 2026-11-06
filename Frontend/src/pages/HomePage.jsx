import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  Filter, 
  Plus, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Repeat
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import StatusBadge from '../components/common/StatusBadge';

export default function HomePage() {
  const { 
    timeframe, 
    setTimeframe, 
    transactions, 
    setSelectedTransaction,
    switchView,
    setActiveModal,
    overviewMetrics
  } = useDashboard();

  // Metrics calculation
  const totalVolume = overviewMetrics?.totalVolume || "$128,490.00";
  const netRevenue = overviewMetrics?.netRevenue || "$96,210.00";
  const activeSubs = overviewMetrics?.activeSubscriptions || "942";
  const totalCustomers = overviewMetrics?.totalCustomers || "1,482";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Heading & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tổng Quan Quản Lý Công Nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi dòng tiền thu hồi nợ, tổng dư nợ khách hàng, các khoản nợ quá hạn và tiến độ thanh toán.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 flex items-center text-xs font-medium text-slate-600">
            {['today', '7d', '30d', '12m'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md transition ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tf === 'today' ? 'Hôm nay' : tf === '7d' ? '7 ngày' : tf === '30d' ? '30 ngày' : '12 tháng'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setActiveModal('new-payment')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#635BFF] hover:bg-[#5851EA] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo phiếu thu nợ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Gross volume</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalVolume}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2%</span>
            <span className="text-slate-400 font-normal ml-1">vs previous period</span>
          </div>
        </div>

        {/* Net Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Net volume from sales</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {netRevenue}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+11.8%</span>
            <span className="text-slate-400 font-normal ml-1">vs previous period</span>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active subscriptions</span>
            <Repeat className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {activeSubs}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.4%</span>
            <span className="text-slate-400 font-normal ml-1">recurring growth</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tổng khách hàng / Hồ sơ nợ</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalCustomers}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24</span>
            <span className="text-slate-400 font-normal ml-1">this month</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Revenue Graph */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Volume Over Time</h2>
            <p className="text-xs text-slate-500">Daily transaction volume (USD)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#635BFF] bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              Avg $4,283 / day
            </span>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="h-56 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#635BFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#635BFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

            {/* Area fill */}
            <path
              d="M0,150 C80,120 140,80 200,95 C280,115 340,50 420,70 C500,90 580,30 680,45 C740,55 780,20 800,25 L800,200 L0,200 Z"
              fill="url(#chartGrad)"
            />

            {/* Spline stroke */}
            <path
              d="M0,150 C80,120 140,80 200,95 C280,115 340,50 420,70 C500,90 580,30 680,45 C740,55 780,20 800,25"
              fill="none"
              stroke="#635BFF"
              strokeWidth="2.5"
            />

            {/* Accent Points */}
            <circle cx="200" cy="95" r="4" fill="#635BFF" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="420" cy="70" r="4" fill="#635BFF" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="680" cy="45" r="4" fill="#635BFF" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="800" cy="25" r="4" fill="#635BFF" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100">
          <span>Sep 01</span>
          <span>Sep 05</span>
          <span>Sep 09</span>
          <span>Sep 13</span>
          <span>Sep 17</span>
          <span>Sep 21</span>
          <span>Sep 25</span>
          <span>Today</span>
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500">Các giao dịch thanh toán công nợ và tất toán nợ định kỳ gần nhất</p>
          </div>
          <button
            onClick={() => switchView('payments')}
            className="text-xs font-semibold text-[#635BFF] hover:text-[#5851EA] flex items-center gap-1 transition"
          >
            <span>View all payments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-6">Amount</th>
                <th className="py-2.5 px-6">Status</th>
                <th className="py-2.5 px-6">Customer</th>
                <th className="py-2.5 px-6">Payment Method</th>
                <th className="py-2.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {transactions.slice(0, 5).map((tx) => (
                <tr 
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="table-row-hover cursor-pointer"
                >
                  <td className="py-3 px-6 font-semibold text-slate-900">
                    {tx.amount}
                  </td>
                  <td className="py-3 px-6">
                    <StatusBadge type={tx.statusType}>
                      {tx.status} {tx.status === 'Succeeded' && '✓'}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-6 text-slate-700 font-medium">
                    {tx.customer}
                  </td>
                  <td className="py-3 px-6 text-slate-500 font-mono text-[11px]">
                    {tx.method}
                  </td>
                  <td className="py-3 px-6 text-slate-500">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
