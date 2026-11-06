import React from 'react';

export default function StatusBadge({ children, type = 'success', className = '' }) {
  const normType = (type || '').toLowerCase();

  let colorClasses = 'bg-[#DEF7EC] text-[#03543F]'; // default green

  if (['success', 'succeeded', 'paid', 'enabled', 'active'].includes(normType)) {
    colorClasses = 'bg-[#DEF7EC] text-[#03543F]';
  } else if (['blue', 'primary'].includes(normType)) {
    colorClasses = 'bg-[#E0EAFF] text-[#3559E0]';
  } else if (['pending', 'in transit', 'needs info', 'warning'].includes(normType)) {
    colorClasses = 'bg-[#FEF08A] text-[#854D0E]';
  } else if (['failed', 'error', 'delinquent', 'danger', 'restricted'].includes(normType)) {
    colorClasses = 'bg-[#FEE2E2] text-[#991B1B]';
  } else if (['neutral', 'refunded', 'inactive', 'archived'].includes(normType)) {
    colorClasses = 'bg-[#F1F5F9] text-[#475569]';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-tight ${colorClasses} ${className}`}>
      {children}
    </span>
  );
}
