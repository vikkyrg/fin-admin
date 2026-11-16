import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle2, Clock, AlertCircle, ArrowUpRight, 
  Layers, FileText, ChevronRight, TrendingUp, Sparkles, Filter 
} from 'lucide-react';
import { dashboardService } from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(res => {
        if (res.data?.success) {
          setStats(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  const LOAN_TYPE_LABELS = {
    'personal-loan': 'Personal Loan',
    'loan-against-securities': 'Loan Against Securities',
    'business-loan': 'Business Loan',
    'home-loan': 'Home Loan',
    'loan-against-property': 'Loan Against Property',
    'education-loan': 'Education Loan',
    'gold-loan': 'Gold Loan'
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time statistics fetched from MongoDB for all 7 loan categories.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.totalEnquiries || 0}</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Across 7 Products</span>
        </div>

        {/* New */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">New (Unassigned)</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.newEnquiries || 0}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Requires First Call</span>
        </div>

        {/* Contacted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Contacted</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.contactedEnquiries || 0}</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Initial Call Complete</span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-indigo-500">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">In Progress</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.inProgressEnquiries || 0}</p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Underwriting with Bank</span>
        </div>

        {/* Converted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Converted</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.convertedEnquiries || 0}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Sanctioned & Disbursed</span>
        </div>

      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Customer Inquiries</h2>
              <p className="text-xs text-slate-400">Latest loan applications received across website</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Enquiry ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentEnquiries?.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-bold text-brand-blue">{enq.enquiryId}</td>
                    <td className="py-3 font-semibold text-slate-800">
                      <div>{enq.fullName}</div>
                      <div className="text-[10px] text-slate-400">{enq.city}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-700">
                        {LOAN_TYPE_LABELS[enq.loanType] || enq.loanType}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      ₹{enq.requiredLoanAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        enq.status === 'New' ? 'bg-amber-100 text-amber-800' :
                        enq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                        enq.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                        enq.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/enquiries/${enq.loanType}`}
                        className="text-xs font-bold text-brand-blue hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Product Links (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enquiry Queues by Product
            </h3>
            <div className="space-y-1.5">
              {[
                { name: 'Personal Loan', slug: 'personal-loan' },
                { name: 'Loan Against Securities', slug: 'loan-against-securities' },
                { name: 'Business Loan', slug: 'business-loan' },
                { name: 'Home Loan', slug: 'home-loan' },
                { name: 'Loan Against Property', slug: 'loan-against-property' },
                { name: 'Education Loan', slug: 'education-loan' },
                { name: 'Gold Loan', slug: 'gold-loan' },
              ].map(product => {
                const countObj = stats?.enquiriesByProduct?.find(p => p._id === product.slug);
                return (
                  <Link
                    key={product.slug}
                    to={`/admin/enquiries/${product.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 text-xs"
                  >
                    <span className="font-semibold text-slate-700">{product.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-900">
                      {countObj?.count || 0}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-brand-blue text-white rounded-2xl p-6 shadow-md space-y-4">
            <h4 className="font-bold text-sm">System CMS Highlights</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-slate-300">Loan Categories</p>
                <p className="text-xl font-bold text-white mt-1">{stats?.totalLoans || 7}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-slate-300">Published Blogs</p>
                <p className="text-xl font-bold text-white mt-1">{stats?.publishedBlogs || 0}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
