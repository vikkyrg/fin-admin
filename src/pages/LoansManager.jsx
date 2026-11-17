import React, { useState, useEffect } from 'react';
import { Layers, Edit3, Check, X, ShieldAlert, Sparkles, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { loanService } from '../services/api';
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

const LoansManager = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLoan, setEditingLoan] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchLoans = () => {
    setLoading(true);
    loanService.getAllLoans()
      .then(res => {
        if (res.data?.success) setLoans(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleTogglePublish = async (slug) => {
    try {
      const res = await loanService.togglePublish(slug);
      if (res.data?.success) {
        setLoans(prev => prev.map(l => l.slug === slug ? { ...l, isPublished: res.data.data.isPublished } : l));
      }
    } catch (e) {
      alert('Failed to toggle publish status');
    }
  };

  const handleSaveLoan = async (e) => {
    e.preventDefault();
    if (!editingLoan) return;
    setSaving(true);
    try {
      const res = await loanService.updateLoan(editingLoan.slug, editingLoan);
      if (res.data?.success) {
        setEditingLoan(null);
        fetchLoans();
      }
    } catch (e) {
      alert('Failed to update loan product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <PageHeader
        title="Loan Products Management"
        subtitle="Manage all 7 loan categories, publish/unpublish from the live portal, and update indicative rates & details."
        badge="Catalogue Management"
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-crm-navy rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loans.map(loan => (
            <Card key={loan.slug} className="flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                    /{loan.slug}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    loan.isPublished 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {loan.isPublished ? '● Published' : '○ Draft (Hidden)'}
                  </span>
                </div>

                <h3 className="font-bold text-crm-text text-base mb-1">{loan.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{loan.shortDescription}</p>

                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-[#E4EAF2]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Indicative Rate:</span>
                    <span className="font-bold text-crm-text">{loan.indicativeInterestRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Tenure:</span>
                    <span className="font-semibold text-slate-700">{loan.maxTenure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Loan Quantum:</span>
                    <span className="font-semibold text-slate-700">{loan.maxLoanAmount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E4EAF2] flex items-center justify-between text-xs">
                <button
                  onClick={() => setEditingLoan({ ...loan })}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-crm-navy font-semibold hover:bg-crm-navy hover:text-white transition"
                >
                  Edit Content
                </button>
                <button
                  onClick={() => handleTogglePublish(loan.slug)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition border ${
                    loan.isPublished 
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {loan.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* EDIT LOAN MODAL */}
      {editingLoan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-[#E2E8F0] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70 flex-shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-crm-text">
                  Edit Loan Product: <span className="text-crm-navy">{editingLoan.name}</span>
                </h3>
                <p className="text-xs text-crm-muted">Update rates, tenure, quantum, and website descriptions</p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingLoan(null)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="editLoanForm" onSubmit={handleSaveLoan} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-[13px]">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Product Title</label>
                <input
                  type="text"
                  value={editingLoan.name}
                  onChange={(e) => setEditingLoan({ ...editingLoan, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Tagline</label>
                <input
                  type="text"
                  value={editingLoan.tagline || ''}
                  onChange={(e) => setEditingLoan({ ...editingLoan, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Indicative Interest Rate</label>
                  <input
                    type="text"
                    value={editingLoan.indicativeInterestRate || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, indicativeInterestRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Max Tenure</label>
                  <input
                    type="text"
                    value={editingLoan.maxTenure || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, maxTenure: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Max Amount / Quantum</label>
                  <input
                    type="text"
                    value={editingLoan.maxLoanAmount || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, maxLoanAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Short Description (Cards & Previews)</label>
                <textarea
                  rows="2"
                  value={editingLoan.shortDescription || ''}
                  onChange={(e) => setEditingLoan({ ...editingLoan, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 text-xs sm:text-[13px]">Full Detailed Product Description</label>
                <textarea
                  rows="5"
                  value={editingLoan.fullDescription || ''}
                  onChange={(e) => setEditingLoan({ ...editingLoan, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-[13px] text-crm-text font-medium focus:bg-white focus:ring-2 focus:ring-crm-navy focus:outline-none leading-relaxed transition"
                  required
                />
              </div>
            </form>

            {/* Sticky Modal Footer with always-visible Save Button */}
            <div className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-end space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditingLoan(null)}
                className="px-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-100 text-xs sm:text-[13.5px] font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editLoanForm"
                disabled={saving}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#F7901E] hover:bg-[#DE7A10] text-white text-xs sm:text-[13.5px] font-bold shadow-md shadow-orange-500/20 transition active:scale-[0.98] disabled:opacity-50 min-h-[40px]"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Save Loan Content
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LoansManager;
