import React from 'react';

/**
 * WhatsApp-style unread notification badge
 * - Circular / pill badge
 * - Vibrant orange-red background (#EF4444 to #F97316 gradient)
 * - White bold font (11-12px)
 * - Shows 99+ if count > 99
 * - Hidden if count is 0 or falsy
 */
const NotificationBadge = ({ count, className = '' }) => {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span
      className={`inline-flex items-center justify-center font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 shadow-sm animate-in fade-in zoom-in duration-200 ${
        displayCount === '99+'
          ? 'px-2 py-0.5 min-w-[24px] h-[20px] text-[10px] rounded-full'
          : 'w-[20px] h-[20px] text-[11px] rounded-full'
      } ${className}`}
      title={`${count} unread ${count === 1 ? 'enquiry' : 'enquiries'}`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
