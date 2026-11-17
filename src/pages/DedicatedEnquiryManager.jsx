import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, 
  RefreshCw, Inbox, Phone, Mail, Calendar, UserCheck, X
} from 'lucide-react';
import { enquiryService } from '../services/api';
import { ClickablePhone, ClickableEmail } from '../components/ContactActions';
import { useNotifications } from '../context/NotificationContext';
import { Card, PageHeader, StatusBadge } from '../components/common/UIComponents';
import EnquiryDetailsModal from '../components/EnquiryDetailsModal';
import MobileEnquiryCard from '../components/MobileEnquiryCard';

const LOAN_TITLES = {
  'personal-loan': 'Personal Loan',
  'loan-against-securities': 'Loan Against Securities',
  'business-loan': 'Business Loan',
  'home-loan': 'Home Loan',
  'loan-against-property': 'Loan Against Property',
  'education-loan': 'Education Loan',
  'gold-loan': 'Gold Loan',
  'vehicle-loan': 'Vehicle Loan'
};

const DedicatedEnquiryManager = ({ loanType }) => {
  const { markCategoryAsRead } = useNotifications();
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Selected enquiry for details modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Mark enquiries as read when admin opens this category page
  useEffect(() => {
    if (loanType) {
      const openCutoffTime = new Date().toISOString();
      markCategoryAsRead(loanType, openCutoffTime);
    }
  }, [loanType, markCategoryAsRead]);

  const fetchEnquiries = (page = 1) => {
    setLoading(true);
    enquiryService.getEnquiriesByLoanType(loanType, {
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status || undefined,
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
  }, [loanType, status]);

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
      }
    } catch (e) {
      alert('Failed to update status');
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
      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        setSelectedEnquiry(null);
      }
    } catch (e) {
      alert('Failed to delete enquiry');
    }
  };

  const loanTitle = LOAN_TITLES[loanType] || 'Loan';
  const hasActiveFilters = Boolean(startDate || endDate || status || search);

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* 1. Header Banner */}
      <PageHeader
        title={`${loanTitle} Enquiries`}
        subtitle={`Dedicated enquiry queue strictly for category: ${loanType}`}
        badge="Product Advisory Pipeline"
        action={
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-[#E4EAF2]">
              <span>Total: <strong className="text-crm-navy">{pagination.total}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700">New: <strong>{counts['New'] || 0}</strong></span>
            </div>
            <button
              onClick={() => fetchEnquiries(pagination.page)}
              className="inline-flex items-center px-3 py-2 bg-white border border-[#E4EAF2] hover:bg-slate-50 rounded-lg text-xs font-semibold text-crm-text transition shadow-xs min-h-[40px]"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-crm-navy" />
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      {/* 2. Metric Pills (Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <Card className="p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{pagination.total}</p>
        </Card>
        <Card className="p-3 sm:p-4 border-l-4 border-l-amber-500">
          <p className="text-[10px] sm:text-[11px] font-bold text-amber-600 uppercase tracking-wider">New Leads</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts['New'] || 0}</p>
        </Card>
        <Card className="p-3 sm:p-4 border-l-4 border-l-blue-500">
          <p className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider">Contacted</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts['Contacted'] || 0}</p>
        </Card>
        <Card className="p-3 sm:p-4 border-l-4 border-l-emerald-500">
          <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Converted</p>
          <p className="text-xl sm:text-2xl font-bold text-crm-text mt-1">{counts['Converted'] || 0}</p>
        </Card>
      </div>

      {/* 3. Filter & Search Bar with Mobile Toggle */}
      <Card className="p-3 sm:p-4">
        {/* Mobile Search & Filter Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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

        {/* Collapsible Filter Panel on Mobile / Inline on Desktop */}
        <div className={`mt-3 sm:mt-0 ${mobileFilterOpen ? 'block' : 'hidden sm:block'}`}>
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            
            <div className="hidden sm:block sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, mobile, ID, city..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-crm-navy"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block sm:hidden text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-crm-navy min-h-[40px] sm:min-h-0"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs min-h-[36px]"
                title="Start Date"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs min-h-[36px]"
                title="End Date"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 sm:py-2 bg-crm-navy hover:bg-crm-navyDark text-white font-semibold text-xs rounded-lg shadow-xs transition min-h-[44px] sm:min-h-0"
              >
                Apply Filter
              </button>
            </div>

          </form>

          {hasActiveFilters && (
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setStartDate('');
                  setEndDate('');
                  fetchEnquiries(1);
                }}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* 4. Main Enquiries: MOBILE CARDS (< 768px) & DESKTOP TABLE (>= 768px) */}
      
      {/* A. Mobile Cards Layout */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <Card className="p-8 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-crm-navy rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading enquiries for {loanTitle}...</p>
          </Card>
        ) : enquiries.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No {loanTitle} enquiries found.</p>
            <p className="text-[11px] mt-0.5 text-slate-400">Applications submitted from this loan page will appear here.</p>
          </Card>
        ) : (
          enquiries.map((enq) => (
            <MobileEnquiryCard
              key={enq._id}
              enquiry={enq}
              loanTypeLabel={loanTitle}
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
                  <th className="py-3 px-4">Enquiry ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Required Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF2]">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-crm-navy rounded-full animate-spin mx-auto mb-2"></div>
                      <p>Loading enquiries for {loanTitle}...</p>
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400">
                      <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No {loanTitle} enquiries found.</p>
                      <p className="text-[11px] mt-0.5 text-slate-400">Applications submitted from this loan page will appear here.</p>
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
                      <td className="py-3.5 px-4 font-semibold text-crm-text">{enq.fullName}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        <ClickablePhone phone={enq.mobileNumber} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                        <ClickableEmail email={enq.email} />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">{enq.city}</td>
                      <td className="py-3.5 px-4 font-bold text-crm-text whitespace-nowrap">
                        ₹{enq.requiredLoanAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
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
                          className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
        loanTitle={loanTitle}
        isHomepage={false}
      />

    </div>
  );
};

export default DedicatedEnquiryManager;
