import React from 'react';
import { Phone, MessageCircle, Calendar, Eye, Trash2, MapPin, IndianRupee } from 'lucide-react';
import { StatusBadge } from './common/UIComponents';

/**
 * MobileEnquiryCard:
 * Premium mobile card presentation for screens below 768px (sm/md).
 * Retains desktop table intact on larger viewports.
 */
const MobileEnquiryCard = ({
  enquiry,
  loanTypeLabel,
  onViewDetails,
  onStatusChange,
  onDelete
}) => {
  if (!enquiry) return null;

  // Format cleaned WhatsApp number (strip whitespace, ensure Indian country code)
  const cleanPhone = (enquiry.mobileNumber || '').replace(/\D/g, '');
  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello ${enquiry.fullName || 'Customer'}, greetings from FinAdvise Financial Advisory regarding your loan enquiry (${enquiry.enquiryId}).`
  )}`;

  return (
    <div 
      onClick={() => onViewDetails && onViewDetails(enquiry)}
      className="bg-white rounded-xl border border-[#E4EAF2] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-colors active:scale-[0.99] cursor-pointer space-y-3"
    >
      {/* Top Header: ID & Status */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-crm-navy bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100">
          {enquiry.enquiryId}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <StatusBadge status={enquiry.status} />
        </div>
      </div>

      {/* Customer Name & Loan Category */}
      <div>
        <h4 className="font-bold text-sm text-crm-text leading-tight">{enquiry.fullName}</h4>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {loanTypeLabel || enquiry.loanType}
          </span>
          {enquiry.city && (
            <span className="text-[11px] text-slate-400 flex items-center">
              • {enquiry.city}
            </span>
          )}
        </div>
      </div>

      {/* Quantum & Date Row */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Loan Quantum</span>
          <span className="font-bold text-crm-text text-sm">
            ₹{enquiry.requiredLoanAmount?.toLocaleString('en-IN') || 'Flexible'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Submitted</span>
          <span className="font-medium text-slate-600 text-xs">
            {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Requirement Preview if any */}
      {(enquiry.requirement || enquiry.loanDetails?.remarks) && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-white/50">
          "{enquiry.requirement || enquiry.loanDetails?.remarks}"
        </p>
      )}

      {/* Quick Action Footer */}
      <div 
        className="pt-2.5 border-t border-[#E4EAF2] flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(enquiry)}
          className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-crm-navy hover:bg-crm-navy hover:text-white font-semibold text-xs transition flex items-center justify-center min-h-[38px]"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          <span>Details</span>
        </button>

        {enquiry.mobileNumber && (
          <>
            <a
              href={`tel:${enquiry.mobileNumber}`}
              className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center min-h-[38px]"
              title="Call Client"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-blue-600" />
              <span>Call</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition flex items-center justify-center min-h-[38px]"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(enquiry._id)}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Delete Enquiry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileEnquiryCard;
