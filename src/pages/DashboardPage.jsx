import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle2, Clock, AlertCircle, ArrowUpRight, 
  Layers, MessageSquare, TrendingUp, RefreshCw, Calendar,
  Building2, Briefcase, Home, ShieldCheck, ChevronRight
} from 'lucide-react';
import { dashboardService } from '../services/api';
import { ClickablePhone } from '../components/ContactActions';
import { useNotifications } from '../context/NotificationContext';
import NotificationBadge from '../components/NotificationBadge';
import { Card, PageHeader, StatusBadge } from '../components/common/UIComponents';
import MobileEnquiryCard from '../components/MobileEnquiryCard';

const LOAN_TYPE_LABELS = {
  'personal-loan': 'Personal Loan',
  'loan-against-securities': 'Loan Against Securities',
  'business-loan': 'Business Loan',
  'home-loan': 'Home Loan',
  'loan-against-property': 'Loan Against Property',
  'education-loan': 'Education Loan',
  'gold-loan': 'Gold Loan',
  'vehicle-loan': 'Vehicle Loan'
};

const LOAN_PRODUCTS_METRICS = [
  { name: 'Personal Loan', slug: 'personal-loan' },
  { name: 'Loan Against Securities', slug: 'loan-against-securities' },
  { name: 'Business Loan', slug: 'business-loan' },
  { name: 'Home Loan', slug: 'home-loan' },
  { name: 'Loan Against Property', slug: 'loan-against-property' },
  { name: 'Education Loan', slug: 'education-loan' },
  { name: 'Gold Loan', slug: 'gold-loan' },
  { name: 'Vehicle Loan', slug: 'vehicle-loan' },
];

const DashboardPage = () => {
  const { unreadCounts, totalUnread, unreadHomepage, unreadLoans } = useNotifications();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    dashboardService.getStats()
      .then(res => {
        if (res.data?.success) {
          setStats(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-crm-navy rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-crm-muted font-medium">Aggregating live CRM metrics...</p>
      </div>
    );
  }

  const total = stats?.totalEnquiries || 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* 1. Page Header with Refresh Action */}
      <PageHeader
        title="Overview Dashboard"
        subtitle="Monitor loan enquiries, customer pipeline, and multi-channel advisory performance."
        action={
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center text-xs text-slate-500 font-medium px-2.5 py-1.5 bg-white rounded-lg border border-[#E4EAF2]">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              All-Time
            </span>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-2 bg-white border border-[#E4EAF2] hover:bg-slate-50 rounded-lg text-xs font-semibold text-crm-text transition shadow-xs disabled:opacity-50 min-h-[40px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-crm-navy ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        }
      />

      {/* 2. Primary KPI Cards Grid (2 cards per row on mobile, 6 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        
        {/* Card 1: Total Enquiries */}
        <Card className="p-3.5 sm:p-5 relative hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Total Enquiries</p>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hidden xs:block">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-3xl font-bold text-crm-text tracking-tight">{total}</p>
            {totalUnread > 0 && <NotificationBadge count={totalUnread} />}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">
            {totalUnread > 0 ? `${totalUnread} unread` : 'All channels'}
          </p>
        </Card>

        {/* Card 2: Homepage Leads */}
        <Card className="p-3.5 sm:p-5 relative border-l-4 border-l-emerald-500 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider truncate">Homepage</p>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hidden xs:block">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-3xl font-bold text-crm-text tracking-tight">
              {stats?.totalHomepageEnquiries || 0}
            </p>
            {unreadHomepage > 0 && <NotificationBadge count={unreadHomepage} />}
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-1 truncate">
            {unreadHomepage > 0 ? `${unreadHomepage} unread` : 'Homepage leads'}
          </p>
        </Card>

        {/* Card 3: New Enquiries */}
        <Card className="p-3.5 sm:p-5 relative border-l-4 border-l-amber-500 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider truncate">New Leads</p>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hidden xs:block">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-3xl font-bold text-crm-text tracking-tight">
              {stats?.newEnquiries || 0}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-700 font-semibold mt-1 truncate">
            Awaiting first call
          </p>
        </Card>

        {/* Card 4: Contacted */}
        <Card className="p-3.5 sm:p-5 relative border-l-4 border-l-blue-500 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider truncate">Contacted</p>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hidden xs:block">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-3xl font-bold text-crm-text tracking-tight">
              {stats?.contactedEnquiries || 0}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold mt-1 truncate">
            In discussion
          </p>
        </Card>

        {/* Card 5: In Progress */}
        <Card className="p-3.5 sm:p-5 relative border-l-4 border-l-purple-500 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-bold text-purple-700 uppercase tracking-wider truncate">In Progress</p>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hidden xs:block">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-3xl font-bold text-crm-text tracking-tight">
              {stats?.inProgressEnquiries || 0}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-purple-700 font-semibold mt-1 truncate">
            Underwriting
          </p>
        </Card>

        {/* Card 6: Converted */}
        <Card className="p-3.5 sm:p-5 relative border-l-4 border-l-emerald-600 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-wider truncate">Converted</p>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hidden xs:block">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-3xl font-bold text-crm-text tracking-tight">
              {stats?.convertedEnquiries || 0}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-1 truncate">
            Disbursed
          </p>
        </Card>

      </div>

      {/* 3. Analytics & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Left Column: Recent Enquiries (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-crm-text">Recent Customer Enquiries</h2>
              <p className="text-[11px] text-crm-muted">Real-time incoming loan applications across all channels</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-crm-navy hover:underline flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Mobile Cards for Recent Enquiries (< 768px) */}
          <div className="block md:hidden space-y-3">
            {stats?.recentEnquiries?.length === 0 ? (
              <Card className="p-6 text-center text-slate-400 text-xs">
                No recent enquiries found.
              </Card>
            ) : (
              stats?.recentEnquiries?.map((enq) => (
                <MobileEnquiryCard
                  key={enq._id}
                  enquiry={enq}
                  loanTypeLabel={LOAN_TYPE_LABELS[enq.loanType]}
                  onViewDetails={() => {
                    const isHome = enq.source === 'homepage' || enq.source === 'Homepage';
                    window.location.href = isHome ? '/admin/enquiries' : `/admin/enquiries/${enq.loanType}`;
                  }}
                />
              ))
            )}
          </div>

          {/* Desktop Table for Recent Enquiries (>= 768px) */}
          <div className="hidden md:block">
            <Card noPadding className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E4EAF2] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Enquiry ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Loan Category</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4EAF2]">
                    {stats?.recentEnquiries?.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                          No enquiry records found.
                        </td>
                      </tr>
                    ) : (
                      stats?.recentEnquiries?.map((enq) => {
                        const isHome = enq.source === 'homepage' || enq.source === 'Homepage';
                        const linkTarget = isHome ? '/admin/enquiries' : `/admin/enquiries/${enq.loanType}`;
                        return (
                          <tr key={enq._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-crm-navy whitespace-nowrap">
                              <Link to={linkTarget} className="hover:underline">
                                {enq.enquiryId}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-crm-text">{enq.fullName}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                <ClickablePhone phone={enq.mobileNumber} />
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-medium text-slate-700">
                                {LOAN_TYPE_LABELS[enq.loanType] || enq.loanType}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-crm-text whitespace-nowrap">
                              ₹{enq.requiredLoanAmount?.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                              {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <StatusBadge status={enq.status} />
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <Link
                                to={linkTarget}
                                className="text-xs font-semibold text-crm-navy hover:text-crm-orange transition"
                              >
                                Manage
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Loan Enquiry Distribution Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4EAF2]">
              <div>
                <h3 className="text-sm font-bold text-crm-text">Enquiry Distribution</h3>
                <p className="text-xs text-crm-muted">Total counts by all 8 loan categories</p>
              </div>
              <span className="text-xs font-bold text-crm-navy px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">
                8 Queues
              </span>
            </div>

            <div className="mt-4 space-y-2.5 sm:space-y-3">
              {LOAN_PRODUCTS_METRICS.map(product => {
                const countObj = stats?.enquiriesByProduct?.find(p => p._id === product.slug);
                const count = countObj?.count || 0;
                const unread = unreadCounts[product.slug] || 0;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <Link
                    key={product.slug}
                    to={`/admin/enquiries/${product.slug}`}
                    className="block p-2 sm:p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-[#E4EAF2] group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0 pr-2">
                        <span className="font-semibold text-crm-text truncate group-hover:text-crm-navy">
                          {product.name}
                        </span>
                        {unread > 0 && <NotificationBadge count={unread} />}
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <span className="font-bold text-crm-text">{count}</span>
                        <span className="text-[10px] text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-crm-navy group-hover:bg-crm-orange transition-all duration-300 rounded-full"
                        style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Quick System Highlights Card */}
          <Card className="bg-gradient-to-br from-[#10345F] to-[#174F8F] text-white border-0 shadow-sm">
            <h4 className="font-bold text-sm text-white mb-1">Financial Advisory System</h4>
            <p className="text-xs text-blue-200 leading-relaxed mb-4">
              FinAdvise automated lead routing ensures zero delay in customer callbacks and underwriting workflows.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-xs">
                <span className="text-blue-200 block text-[11px]">Active Products</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{stats?.totalLoans || 7} Loans</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-xs">
                <span className="text-blue-200 block text-[11px]">Security Level</span>
                <span className="text-lg font-bold text-white mt-0.5 block">256-Bit</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
