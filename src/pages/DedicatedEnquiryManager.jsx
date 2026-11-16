import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Eye, CheckCircle2, 
  Trash2, X, AlertCircle, Clock, Calendar, MessageSquare, Send 
} from 'lucide-react';
import { enquiryService } from '../services/api';

const LOAN_TITLES = {
  'personal-loan': 'Personal Loan',
  'loan-against-securities': 'Loan Against Securities',
  'business-loan': 'Business Loan',
  'home-loan': 'Home Loan',
  'loan-against-property': 'Loan Against Property',
  'education-loan': 'Education Loan',
  'gold-loan': 'Gold Loan'
};

const DedicatedEnquiryManager = ({ loanType }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected enquiry for details modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
    setUpdatingStatus(true);
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
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEnquiry) return;
    try {
      const res = await enquiryService.addNote(selectedEnquiry._id, newNote.trim());
      if (res.data?.success) {
        setSelectedEnquiry(res.data.data);
        setNewNote('');
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

  return (
    <div className="space-y-6">
      
      {/* Title & Product Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
            Dedicated Enquiry Management
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            {loanTitle} Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly displays enquiries submitted under category: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{loanType}</code>
          </p>
        </div>

        {/* Status Count Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-slate-700">
            Total: {pagination.total}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 font-bold text-amber-700">
            New: {counts['New'] || 0}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 font-bold text-blue-700">
            Contacted: {counts['Contacted'] || 0}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-bold text-emerald-700">
            Converted: {counts['Converted'] || 0}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile, ID, city..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
              title="Start Date"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
              title="End Date"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-brand-blue hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition"
            >
              Apply Filter
            </button>
          </div>

        </form>
      </div>

      {/* Main Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
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
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-brand-blue mb-2"></div>
                    <p>Loading enquiries for {loanTitle}...</p>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No {loanTitle} enquiries found.</p>
                    <p className="text-[11px] mt-1">Submissions matching this category will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-brand-blue">{enq.enquiryId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{enq.fullName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{enq.mobileNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600">{enq.email}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{enq.city}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ₹{enq.requiredLoanAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                          enq.status === 'New' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          enq.status === 'Contacted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          enq.status === 'In Progress' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                          enq.status === 'Converted' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white font-bold transition text-[11px]"
                      >
                        View Full Details
                      </button>
                      <button
                        onClick={() => handleDelete(enq._id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
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

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing page <span className="font-bold text-slate-800">{pagination.page}</span> of <span className="font-bold text-slate-800">{pagination.totalPages}</span> ({pagination.total} total enquiries)
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchEnquiries(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchEnquiries(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FULL ENQUIRY DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded">
                  {loanTitle} Application
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedEnquiry.fullName} ({selectedEnquiry.enquiryId})
                </h3>
                <p className="text-xs text-slate-400">
                  Received on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Update Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">Enquiry Status</p>
                <p className="text-[11px] text-slate-400">Change status to keep team in sync</p>
              </div>
              <select
                value={selectedEnquiry.status}
                onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Common Customer Details Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-slate-500">Mobile:</span>
                  <p className="font-bold text-slate-900">{selectedEnquiry.mobileNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>
                  <p className="font-bold text-slate-900">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <span className="text-slate-500">City / Location:</span>
                  <p className="font-bold text-slate-900">{selectedEnquiry.city}</p>
                </div>
                <div>
                  <span className="text-slate-500">Required Loan Amount:</span>
                  <p className="font-black text-brand-blue text-sm">
                    ₹{selectedEnquiry.requiredLoanAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Product-Specific Form Fields */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {loanTitle} - Specific Submitted Fields
              </h4>
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-xs space-y-2">
                {loanType === 'personal-loan' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Employment Type:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.employmentType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Net Monthly Income:</span>
                      <p className="font-bold text-slate-900">
                        ₹{selectedEnquiry.loanDetails?.monthlyIncome?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {loanType === 'loan-against-securities' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Pledged Security Type:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.securityType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Approximate Portfolio Value:</span>
                      <p className="font-bold text-slate-900">
                        ₹{selectedEnquiry.loanDetails?.approximateInvestmentValue?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {loanType === 'business-loan' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Business Type:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.businessType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Business Vintage:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.businessVintage || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Annual Turnover:</span>
                      <p className="font-bold text-slate-900">
                        ₹{selectedEnquiry.loanDetails?.annualTurnover?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {loanType === 'home-loan' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Property Valuation:</span>
                      <p className="font-bold text-slate-900">
                        ₹{selectedEnquiry.loanDetails?.propertyValue?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Property Location:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.propertyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Employment Profile:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.employmentType || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {loanType === 'loan-against-property' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500">Property Category:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.propertyType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Property Location:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.propertyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Property Valuation:</span>
                      <p className="font-bold text-slate-900">
                        ₹{selectedEnquiry.loanDetails?.propertyValue?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {loanType === 'education-loan' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Course / Degree:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.courseName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Institution / University:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.institutionName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Study Location:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.studyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Total Education Cost:</span>
                      <p className="font-bold text-slate-900">
                        ₹{selectedEnquiry.loanDetails?.educationExpenses?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {loanType === 'gold-loan' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Approx. Gold Weight:</span>
                      <p className="font-bold text-slate-900">
                        {selectedEnquiry.loanDetails?.approximateGoldWeight} Grams
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Purity:</span>
                      <p className="font-bold text-slate-900">{selectedEnquiry.loanDetails?.goldPurity || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Internal Advisory Notes</h4>
              
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add internal note (e.g. called client, docs verified...)"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition flex items-center"
                >
                  <Send className="w-3 h-3 mr-1" />
                  <span>Add Note</span>
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedEnquiry.adminNotes?.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No notes added yet.</p>
                ) : (
                  selectedEnquiry.adminNotes?.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <p className="text-slate-800 font-medium">{note.note}</p>
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                        <span>By {note.addedBy}</span>
                        <span>{new Date(note.addedAt).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DedicatedEnquiryManager;
