import React from 'react';

/**
 * StatusBadge:
 * Clear, color-coded, readable badges matching the typography spec (13px, weight 500-600)
 */
export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'New':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] sm:text-[13px] font-semibold border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {status}
    </span>
  );
};

/**
 * Card:
 * Standardized container with 15-17px font headings, clean borders, and balanced padding
 */
export const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${noPadding ? '' : 'p-5 sm:p-6'} ${className}`}>
      {children}
    </div>
  );
};

/**
 * PageHeader:
 * 24-28px weight 700 title, 13-14px supporting description, optional badge and CTA actions
 */
export const PageHeader = ({ title, subtitle, badge, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div>
        {badge && (
          <span className="inline-block text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-crm-orange bg-crm-orangeLight px-2.5 py-0.5 rounded-md border border-orange-200 mb-1.5">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold text-crm-text tracking-tight leading-snug">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] sm:text-[14px] text-crm-muted mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">{action}</div>}
    </div>
  );
};

/**
 * PrimaryButton:
 * Orange background with white text, font-semibold (14px), 40-44px touch targets
 */
export const PrimaryButton = ({ children, onClick, disabled, loading, icon: Icon, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center px-4 py-2 sm:py-2.5 rounded-lg bg-crm-orange hover:bg-crm-orangeHover text-white text-[13px] sm:text-[14px] font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[42px] ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-1.5" />
      ) : null}
      {children}
    </button>
  );
};

/**
 * SecondaryButton:
 * White background with navy border, dark text, font-semibold (14px)
 */
export const SecondaryButton = ({ children, onClick, disabled, icon: Icon, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-4 py-2 sm:py-2.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 text-crm-text text-[13px] sm:text-[14px] font-semibold transition active:scale-[0.98] disabled:opacity-50 min-h-[40px] sm:min-h-[42px] ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-1.5 text-slate-500" />}
      {children}
    </button>
  );
};
