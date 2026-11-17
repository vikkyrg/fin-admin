import React, { useState } from 'react';
import { 
  X, Send, Phone, Mail, MessageCircle, Calendar, MapPin, 
  IndianRupee, Briefcase, FileText, CheckCircle2, Clock
} from 'lucide-react';
import { ClickablePhone, ClickableEmail, QuickContactActions } from './ContactActions';
import { StatusBadge } from './common/UIComponents';

const EnquiryDetailsModal = ({
  enquiry,
  onClose,
  onStatusChange,
  onAddNote,
  loanTitle = 'Loan',
  isHomepage = false
}) => {
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  if (!enquiry) return null;

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      await onAddNote(enquiry._id, newNote.trim());
      setNewNote('');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto animate-in fade-in duration-150 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Drawer (Full or near-full height bottom sheet) / Desktop Centered Card */}
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E4EAF2] h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-200">
        
        {/* Sticky Modal Header */}
        <div className="px-5 py-4 border-b border-[#E4EAF2] flex items-center justify-between bg-slate-50/80 sticky top-0 z-10 flex-shrink-0">
          <div className="min-w-0 pr-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-crm-navy bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                {isHomepage ? 'Homepage Enquiry' : `${loanTitle} Application`}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                {enquiry.enquiryId}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-crm-text mt-1 truncate">
              {enquiry.fullName}
            </h3>
            <p className="text-[11px] text-slate-400">
              Submitted on {new Date(enquiry.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Status Update Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E4EAF2] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-crm-text">Application Status</p>
              <span className="text-[10px] text-slate-400">Update pipeline state</span>
            </div>
            <select
              value={enquiry.status}
              onChange={(e) => onStatusChange(enquiry._id, e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E4EAF2] bg-white font-semibold text-xs text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-navy cursor-pointer shadow-xs min-h-[44px]"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Customer Information Grid */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Customer Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/70 p-4 rounded-xl border border-[#E4EAF2]">
              <div>
                <span className="text-slate-500 block mb-0.5">Mobile Phone:</span>
                <ClickablePhone phone={enquiry.mobileNumber} className="text-xs font-bold" />
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Email Address:</span>
                <ClickableEmail email={enquiry.email} className="text-xs font-bold" />
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">City / Location:</span>
                <p className="font-semibold text-crm-text">{enquiry.city || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Required Loan Amount:</span>
                <p className="font-bold text-crm-navy text-sm">
                  ₹{enquiry.requiredLoanAmount?.toLocaleString('en-IN') || 'Flexible'}
                </p>
              </div>
            </div>

            {/* Quick Contact Actions (Call, WhatsApp, Email) */}
            <QuickContactActions 
              phone={enquiry.mobileNumber} 
              email={enquiry.email} 
              customerName={enquiry.fullName}
            />
          </div>

          {/* Homepage Requirement or Specific Loan Form Details */}
          {isHomepage ? (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Submitted Requirement & Message
              </h4>
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-crm-text leading-relaxed">
                {enquiry.requirement || enquiry.loanDetails?.remarks || 'No detailed message provided by customer.'}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {loanTitle} - Specific Submitted Details
              </h4>
              <div className="bg-blue-50/40 border border-blue-100/80 rounded-xl p-4 space-y-2.5">
                {enquiry.loanType === 'personal-loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Employment Type:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.employmentType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Monthly Net Income:</span>
                      <p className="font-bold text-crm-text">
                        ₹{enquiry.loanDetails?.monthlyIncome?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'loan-against-securities' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Pledged Securities:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.securityType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Portfolio Valuation:</span>
                      <p className="font-bold text-crm-text">
                        ₹{enquiry.loanDetails?.approximateInvestmentValue?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'business-loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Constitution:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.businessType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Vintage:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.businessVintage || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Annual Turnover:</span>
                      <p className="font-bold text-crm-text">
                        ₹{enquiry.loanDetails?.annualTurnover?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'home-loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Property Value:</span>
                      <p className="font-bold text-crm-text">
                        ₹{enquiry.loanDetails?.propertyValue?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Property Location:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.propertyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Employment:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.employmentType || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'loan-against-property' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Property Type:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.propertyType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.propertyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Estimated Value:</span>
                      <p className="font-bold text-crm-text">
                        ₹{enquiry.loanDetails?.propertyValue?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'education-loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Course / Degree:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.courseName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">University / College:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.institutionName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Study Destination:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.studyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Estimated Cost:</span>
                      <p className="font-bold text-crm-text">
                        ₹{enquiry.loanDetails?.educationExpenses?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'gold-loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Gold Weight:</span>
                      <p className="font-bold text-crm-text">
                        {enquiry.loanDetails?.approximateGoldWeight} Grams
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Gold Purity:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.goldPurity || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {enquiry.loanType === 'vehicle-loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Vehicle Type:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.vehicleType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Model:</span>
                      <p className="font-bold text-crm-text">{enquiry.loanDetails?.vehicleModel || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">On-Road Budget:</span>
                      <p className="font-bold text-crm-text">
                        {enquiry.loanDetails?.onRoadPrice ? `₹${enquiry.loanDetails.onRoadPrice.toLocaleString('en-IN')}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Internal Advisory Notes */}
          <div className="space-y-3 pt-2 border-t border-[#E4EAF2]">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Internal Advisory Notes
            </h4>
            
            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log call outcome or doc check..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-crm-navy min-h-[40px]"
              />
              <button
                type="submit"
                disabled={savingNote || !newNote.trim()}
                className="px-4 py-2 bg-crm-navy text-white rounded-xl text-xs font-semibold hover:bg-crm-navyDark transition flex items-center justify-center disabled:opacity-50 min-h-[40px]"
              >
                <Send className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </form>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {!enquiry.adminNotes || enquiry.adminNotes.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No advisory notes recorded yet.</p>
              ) : (
                enquiry.adminNotes.map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-[#E4EAF2] text-xs">
                    <p className="text-crm-text font-medium">{note.note}</p>
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>By {note.addedBy}</span>
                      <span>{new Date(note.addedAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer */}
        <div className="px-5 py-3 border-t border-[#E4EAF2] flex justify-end bg-slate-50/80 sticky bottom-0 z-10 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white border border-[#E4EAF2] hover:bg-slate-100 text-crm-text font-semibold text-xs transition min-h-[44px]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default EnquiryDetailsModal;
