import React from 'react';
import { Phone, Mail, MessageCircle, ExternalLink } from 'lucide-react';

/**
 * Normalizes an Indian phone number to E.164 without leading zeros or duplicate country codes.
 * e.g., "09876543210" -> "919876543210", "+91 9876543210" -> "919876543210", "9876543210" -> "919876543210"
 */
export const normalizeIndianPhone = (rawNumber = '') => {
  if (!rawNumber) return '';
  const digits = String(rawNumber).replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
};

/**
 * Clickable Phone Link with tel: protocol
 */
export const ClickablePhone = ({ phone, className = '', showIcon = true }) => {
  if (!phone) return <span className="text-slate-400">N/A</span>;

  const normalized = normalizeIndianPhone(phone);
  const telHref = normalized ? `tel:+${normalized}` : `tel:${phone}`;

  return (
    <a
      href={telHref}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center text-brand-blue hover:text-blue-800 hover:underline transition font-semibold group cursor-pointer ${className}`}
      title={`Call ${phone}`}
    >
      {showIcon && <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-500 group-hover:text-blue-700 flex-shrink-0" />}
      <span>{phone}</span>
    </a>
  );
};

/**
 * Clickable Email Link with mailto: protocol
 */
export const ClickableEmail = ({ email, className = '', showIcon = true }) => {
  if (!email || email === 'not-provided@finadvise.in') {
    return <span className="text-slate-400">Not Provided</span>;
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center text-brand-blue hover:text-blue-800 hover:underline transition font-medium group cursor-pointer truncate max-w-full ${className}`}
      title={`Email ${email}`}
    >
      {showIcon && <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-500 group-hover:text-blue-700 flex-shrink-0" />}
      <span className="truncate">{email}</span>
    </a>
  );
};

/**
 * Quick Contact Action Buttons Bar for Details Modals (Call, WhatsApp, Email)
 */
export const QuickContactActions = ({ phone, email, customerName = 'Customer', className = '' }) => {
  const normalizedPhone = normalizeIndianPhone(phone);
  const hasValidPhone = Boolean(normalizedPhone && normalizedPhone.length >= 10);
  const hasValidEmail = Boolean(email && email !== 'not-provided@finadvise.in' && email.includes('@'));

  const telHref = hasValidPhone ? `tel:+${normalizedPhone}` : null;
  const whatsappHref = hasValidPhone 
    ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(`Hello ${customerName}, greetings from FinAdvise Loan Consultancy regarding your loan enquiry.`)}`
    : null;
  const mailtoHref = hasValidEmail 
    ? `mailto:${email}?subject=${encodeURIComponent(`FinAdvise Loan Advisory - Regarding your loan enquiry`)}`
    : null;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 pt-2 ${className}`}>
      {/* Call Customer */}
      {telHref ? (
        <a
          href={telHref}
          className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs active:scale-95"
          title={`Call ${phone}`}
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          <span>Call Customer</span>
        </a>
      ) : (
        <button
          disabled
          className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 cursor-not-allowed"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          <span>No Phone</span>
        </button>
      )}

      {/* WhatsApp Customer */}
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs active:scale-95"
          title={`Chat with ${customerName} on WhatsApp`}
        >
          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
          <span>WhatsApp</span>
        </a>
      ) : null}

      {/* Send Email */}
      {mailtoHref ? (
        <a
          href={mailtoHref}
          className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs active:scale-95"
          title={`Send email to ${email}`}
        >
          <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          <span>Send Email</span>
        </a>
      ) : null}
    </div>
  );
};
