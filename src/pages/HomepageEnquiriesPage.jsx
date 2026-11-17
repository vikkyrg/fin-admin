import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, 
  RefreshCw, Inbox, Phone, Mail, Calendar, MessageSquare, AlertCircle, X, ChevronDown
} from 'lucide-react';
import { enquiryService } from '../services/api';
import { ClickablePhone, ClickableEmail } from '../components/ContactActions';
import { useNotifications } from '../context/NotificationContext';
import { Card, PageHeader, StatusBadge } from '../components/common/UIComponents';
import EnquiryDetailsModal from '../components/EnquiryDetailsModal';
import MobileEnquiryCard from '../components/MobileEnquiryCard';

const LOAN_TYPE_LABELS = {
  'personal-loan': 'Personal Loan',
  'loan-against-securities': 'Loan Against Securities',
  'business-loan': 'Business Loan',
  'home-loan': 'Home Loan',
  'loan-against-property': 'Loan Against Property',
  'education-loan': 'Education Loan',
  'gold-loan': 'Gold Loan',
  'vehicle-loan': 'Vehicle Loan',
  'other': 'Other Advisory'
};

const HomepageEnquiriesPage = () => {
  const { markCategoryAsRead } = useNotifications();
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [counts, setCounts] = useState({ Total: 0, New: 0, Contacted: 0, 'In Progress': 0, Converted: 0, Closed: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loanType, setLoanType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Selected enquiry for details modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Clear unread badge when admin opens this page
  useEffect(() => {
    const openCutoffTime = new Date().toISOString();
    markCategoryAsRead('homepage', openCutoffTime);
  }, [markCategoryAsRead]);

  const fetchEnquiries = (page = 1) => {
    setLoading(true);
    enquiryService.getHomepageEnquiries({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status || undefined,
      loanType: loanType !== 'all' ? loanType : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }).then(res => {
      if (res.data?.success) {
        setEnquiries(res.data.data.enquiries);
        setPagination(res.data.data.pagination);
        setCounts(res.data.data.counts || {});
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries(1);
  }, [status, loanType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries(1);
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const res = await enquiryService.updateStatus(enquiryId, newStatus);
      if (res.data?.success) {
        setEnquiries(prev => prev.map(e => e._id === enquiryId ? { ...e, status: newStatus } : e));
        if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
          setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
        }
        setCounts(prev => ({
          ...prev,
          [selectedEnquiry?.status]: Math.max(0, (prev[selectedEnquiry?.status] || 1) - 1),
          [newStatus]: (prev[newStatus] || 0) + 1
        }));
      }
    } catch (e) {
      alert('Failed to update enquiry status');
    }
  };

  const handleAddNote = async (enquiryId, noteText) => {
    try {
      const res = await enquiryService.addNote(enquiryId, noteText);
      if (res.data?.success) {
        setSelectedEnquiry(res.data.data);
      }
    } catch (e) {
      alert('Failed to add note');
    }
  };

  const handleDelete = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await enquiryService.deleteEnquiry(enquiryId);
      setEnquiries(prev => prev.filter(e => e._id !== enquiryId));
      if (selectedEnquiry?._id === enquiryId) {
        setSelectedEnquiry(null);
      }
      setCounts(prev => ({
        ...prev,
        Total: Math.max(0, prev.Total - 1)
      }));
    } catch (e) {
      alert('Failed to delete enquiry');
    }
  };

  const hasActiveFilters = Boolean(startDate || endDate || status || loanType !== 'all' || search);

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* 1. Header */}
      <PageHeader
        title="Homepage Enquiries"
        subtitle="Manage leads submitted via the main FinAdvise homepage enquiry form."
        badge="Direct Lead Channel"
        action={
          <button
            onClick={() => fetchEnquiries(pagination.page)}
            className="inline-flex items-center px-3 py-2 bg-white border border-[#E4EAF2] hover:bg-slate-50 rounded-lg text-xs font-semibold text-crm-text transition shadow-xs min-h-[40px]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-crm-navy" />
            <span>Refresh</span>
          </button>
        }
      />

      {/* 2. Metric Summary Cards (2 per row on mobile, 5 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        <Card className="p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts.Total || 0}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">Homepage Hero</span>
        </Card>

        <Card className="p-3 sm:p-4 border-l-4 border-l-amber-500">
          <p className="text-[10px] sm:text-[11px] font-bold text-amber-600 uppercase tracking-wider">New Leads</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts.New || 0}</p>
          <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block truncate">Awaiting Callback</span>
        </Card>

        <Card className="p-3 sm:p-4 border-l-4 border-l-blue-500">
          <p className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider">Contacted</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts.Contacted || 0}</p>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block truncate">In Discussion</span>
        </Card>

        <Card className="p-3 sm:p-4 border-l-4 border-l-purple-500">
          <p className="text-[10px] sm:text-[11px] font-bold text-purple-600 uppercase tracking-wider">In Progress</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts['In Progress'] || 0}</p>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block truncate">Under Verification</span>
        </Card>

        <Card className="p-3 sm:p-4 border-l-4 border-l-emerald-500 col-span-2 sm:col-span-1">
          <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Converted</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts.Converted || 0}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block truncate">Sanctioned</span>
        </Card>
      </div>

      {/* 3. Search & Filter Bar */}
      <Card className="p-3 sm:p-4">
        {/* Mobile Search & Filter Trigger Bar */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-crm-navy min-h-[44px]"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center min-h-[44px] ${
              hasActiveFilters ? 'bg-crm-navy text-white border-crm-navy' : 'bg-slate-50 border-[#E4EAF2] text-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Filters on Mobile / Always visible on Desktop */}
        <div className={`mt-3 sm:mt-0 ${mobileFilterOpen ? 'block' : 'hidden sm:block'}`}>
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            
            <div className="hidden sm:block sm:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, mobile, email, ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-crm-navy"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block sm:hidden text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 sm:py-2 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-crm-navy min-h-[40px] sm:min-h-0"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block sm:hidden text-[10px] font-bold text-slate-500 uppercase mb-1">Loan Product</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-3 py-2 sm:py-2 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-crm-navy min-h-[40px] sm:min-h-0"
              >
                <option value="all">All Loan Types</option>
                {Object.entries(LOAN_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 sm:py-2 bg-crm-navy hover:bg-crm-navyDark text-white rounded-lg text-xs font-semibold shadow-xs transition min-h-[44px] sm:min-h-0"
              >
                Filter Leads
              </button>
            </div>

          </form>

          {/* Date Filter Row */}
          <div className="pt-3 mt-3 border-t border-[#E4EAF2] flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Date:
            </span>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs min-h-[36px]"
            />
            <span>to</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs min-h-[36px]"
            />
            <button
              type="button"
              onClick={() => fetchEnquiries(1)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-xs text-crm-text min-h-[36px]"
            >
              Apply
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setLoanType('all');
                  setStartDate('');
                  setEndDate('');
                  fetchEnquiries(1);
                }}
                className="text-xs text-red-500 hover:underline font-semibold ml-auto sm:ml-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 4. Enquiries Presentation: MOBILE CARDS (< 768px) & DESKTOP TABLE (>= 768px) */}
      
      {/* A. Mobile Cards Layout */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <Card className="p-8 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-crm-navy rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading homepage enquiries...</span>
          </Card>
        ) : enquiries.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-600">No enquiries found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Enquiries submitted from the homepage hero will appear here.</p>
          </Card>
        ) : (
          enquiries.map((enq) => (
            <MobileEnquiryCard
              key={enq._id}
              enquiry={enq}
              loanTypeLabel={LOAN_TYPE_LABELS[enq.loanType]}
              onViewDetails={setSelectedEnquiry}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* B. Desktop Table Layout */}
      <div className="hidden md:block">
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E4EAF2] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Enquiry ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Selected Loan Type</th>
                  <th className="py-3.5 px-4">Requirement / Message</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF2]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-crm-navy rounded-full animate-spin mx-auto mb-2"></div>
                      <span>Loading homepage enquiries...</span>
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-600">No homepage enquiries found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Enquiries submitted via the homepage hero form will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => (
                    <tr 
                      key={enq._id} 
                      onClick={() => setSelectedEnquiry(enq)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-crm-navy whitespace-nowrap">
                        {enq.enquiryId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-crm-text">{enq.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          <ClickablePhone phone={enq.mobileNumber} />
                        </div>
                        {enq.email && enq.email !== 'not-provided@finadvise.in' && (
                          <div className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate">
                            <ClickableEmail email={enq.email} />
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-crm-navy border border-blue-100">
                          {LOAN_TYPE_LABELS[enq.loanType] || enq.loanType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-slate-600 font-medium" title={enq.requirement || enq.loanDetails?.remarks}>
                          {enq.requirement || enq.loanDetails?.remarks || 'No message provided'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        <div className="text-[10px] text-slate-400">
                          {new Date(enq.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className="text-[11px] font-semibold px-2 py-1 rounded-md border border-[#E4EAF2] bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 text-crm-navy hover:bg-crm-navy hover:text-white font-semibold transition text-[11px]"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(enq._id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <Card noPadding className="p-3 border border-[#E4EAF2] flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-bold text-crm-text">{pagination.page}</span> of <span className="font-bold text-crm-text">{pagination.totalPages}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchEnquiries(pagination.page - 1)}
              className="p-2 sm:p-1.5 rounded-md border border-[#E4EAF2] bg-white hover:bg-slate-100 disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchEnquiries(pagination.page + 1)}
              className="p-2 sm:p-1.5 rounded-md border border-[#E4EAF2] bg-white hover:bg-slate-100 disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}

      {/* 5. Shared Reusable Enquiry Details Modal */}
      <EnquiryDetailsModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        isHomepage={true}
      />

    </div>
  );
};

export default HomepageEnquiriesPage;
