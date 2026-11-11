import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, ArrowRight, UserCheck, Crown, Stethoscope } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function AccessDeniedView({ 
  requiredRole = 'ROLE_ADMIN', 
  featureName = 'Phân hệ Nội bộ Quản trị',
  customMessage 
}) {
  const { currentUser, switchUserRole, switchView } = useDashboard();
  const currentRoleName = currentUser?.roles?.includes('ROLE_ADMIN')
    ? 'ROLE_ADMIN (Quản trị viên / CFO)'
    : currentUser?.roles?.includes('ROLE_STAFF')
      ? 'ROLE_STAFF (Nhân viên Kế toán / AR)'
      : 'ROLE_USER (Khách hàng B2B / Guest)';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-rose-200/80 shadow-xl shadow-rose-500/5 p-6 sm:p-8 text-center space-y-6">
        {/* Shield Icon Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            Lỗi 403 - Quyền Truy Cập Bị Từ Chối (Access Denied)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bạn Không Có Quyền Truy Cập Vào: <span className="text-rose-600">{featureName}</span>
          </h2>
        </div>

        {/* Detailed Explanation Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="font-semibold text-slate-500">Tài khoản hiện tại:</span>
            <span className="font-bold text-slate-900">{currentUser?.username} ({currentRoleName})</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="font-semibold text-slate-500">Yêu cầu quyền hạn:</span>
            <span className="font-bold text-rose-600 uppercase">{requiredRole}</span>
          </div>
          <p className="pt-1 text-slate-600 leading-relaxed">
            {customMessage || (
              requiredRole === 'ROLE_ADMIN'
                ? 'Theo chính sách kiểm soát nội bộ và nguyên tắc phân tách trách nhiệm (Segregation of Duties - SoD), chức năng này chỉ dành riêng cho Quản trị viên cấp cao (Admin / CFO / Trưởng bộ phận Tín dụng). Nhân viên (Staff) và Khách hàng (User/Guest) bị nghiêm cấm truy cập hoặc tự phê duyệt.'
                : 'Chức năng này dành cho Nhân viên nghiệp vụ (Staff) hoặc Quản trị viên (Admin). Khách hàng B2B (User/Guest) chỉ có quyền thao tác trên Cổng Dịch Vụ Khách Hàng (Hóa đơn, Quét VietQR, Cam kết PTP, Khiếu nại Dispute).'
            )}
          </p>
        </div>

        {/* Quick RBAC Switcher for pair-testing / testing demo */}
        <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2.5">
          <p className="text-[11px] font-bold text-indigo-900 flex items-center justify-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            Chuyển nhanh vai trò để kiểm thử quyền:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => switchUserRole('ROLE_ADMIN')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              Chuyển thành ADMIN (Toàn quyền)
            </button>
            <button
              onClick={() => switchUserRole('ROLE_STAFF')}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Chuyển thành STAFF (Nhân viên)
            </button>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchView(currentUser?.roles?.includes('ROLE_USER') && !currentUser?.roles?.includes('ROLE_STAFF') ? 'invoices' : 'home')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang được phép
          </button>
        </div>
      </div>
    </div>
  );
}
