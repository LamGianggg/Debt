import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  RotateCcw,
  Percent,
  Calendar
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function ReportsPage() {
  const { setActiveModal } = useDashboard();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Báo Cáo Phân Tích & Đối Soát Công Nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đối soát dòng tiền thu hồi, doanh thu định kỳ từ hợp đồng nợ, tỷ lệ nợ xấu và báo cáo tài chính.
          </p>
        </div>

        <button 
          onClick={() => setActiveModal('export')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Doanh thu Định kỳ Hợp đồng Nợ</span>
            <TrendingUp className="w-4 h-4 text-[#635BFF]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            $14,290.00
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            +8.4% tăng trưởng thu hồi nợ
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Giá trị Thu hồi TB / Đợt</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            $68.40
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tổng cộng 1,878 giao dịch thành công
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tỷ lệ Nợ xấu / Trì hoãn</span>
            <RotateCcw className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            0.8%
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            Nằm dưới ngưỡng an toàn 2.0%
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tỷ lệ Tranh chấp & Rủi ro Pháp lý</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            0.04%
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            Hồ sơ pháp lý đạt chuẩn an toàn cao
          </p>
        </div>
      </div>

      {/* Available Statements & Exports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <FileText className="w-4 h-4 text-[#635BFF]" />
              <span>Biên Bản Đối Soát Công Nợ Tháng</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bảng kê chi tiết các khoản đã thu, phí xử lý nợ, hoàn trả và điều chỉnh công nợ.
            </p>
          </div>
          <button 
            onClick={() => alert("Đang tải Biên bản Đối soát Công nợ (PDF)...")}
            className="mt-4 w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition text-center"
          >
            Tải PDF
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <FileText className="w-4 h-4 text-[#635BFF]" />
              <span>Xuất Dữ Liệu Sổ Cái Kế Toán</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu giao dịch công nợ chuẩn hóa định dạng kết nối phần mềm kế toán (MISA, FAST, SAP).
            </p>
          </div>
          <button 
            onClick={() => alert("Đang xuất Sổ cái Công nợ (CSV)...")}
            className="mt-4 w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition text-center"
          >
            Tải CSV
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <FileText className="w-4 h-4 text-[#635BFF]" />
              <span>Hồ Sơ Dự Phòng Nợ & Thuế</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Báo cáo trích lập dự phòng nợ phải thu khó đòi và tổng hợp quyết toán định kỳ.
            </p>
          </div>
          <button 
            onClick={() => alert("Đang trích xuất Báo cáo Dự phòng Nợ...")}
            className="mt-4 w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition text-center"
          >
            Xem báo cáo nợ
          </button>
        </div>
      </div>
    </div>
  );
}
