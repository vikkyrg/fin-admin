import React, { useState, useEffect } from 'react';
import { Layers, Edit3, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { loanService } from '../services/api';

const LoansManager = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLoan, setEditingLoan] = useState(null);

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
      alert('Failed to toggle publish state');
    }
  };

  const handleSaveLoan = async (e) => {
    e.preventDefault();
    if (!editingLoan) return;
    try {
      const res = await loanService.updateLoan(editingLoan.slug, editingLoan);
      if (res.data?.success) {
        alert('Loan content updated successfully!');
        setEditingLoan(null);
        fetchLoans();
      }
    } catch (e) {
      alert('Failed to update loan');
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loan Products Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage all 7 loan categories, publish/unpublish from public website, and update indicative rates & details.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map(loan => (
            <div key={loan.slug} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    /{loan.slug}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    loan.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {loan.isPublished ? 'Published' : 'Unpublished (Draft)'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">{loan.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{loan.shortDescription}</p>

                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Indicative Rate:</span>
                    <span className="font-bold text-slate-900">{loan.indicativeInterestRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Tenure:</span>
                    <span className="font-semibold text-slate-700">{loan.maxTenure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantum:</span>
                    <span className="font-semibold text-slate-700">{loan.maxLoanAmount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setEditingLoan({ ...loan })}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-brand-blue font-bold hover:bg-brand-blue hover:text-white transition"
                >
                  Edit Content
                </button>
                <button
                  onClick={() => handleTogglePublish(loan.slug)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    loan.isPublished ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {loan.isPublished ? 'Unpublish' : 'Publish to Live'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT LOAN MODAL */}
      {editingLoan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Loan Content: {editingLoan.name}</h3>
              <button onClick={() => setEditingLoan(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLoan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Loan Title</label>
                <input
                  type="text"
                  value={editingLoan.name}
                  onChange={(e) => setEditingLoan({ ...editingLoan, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingLoan.tagline || ''}
                  onChange={(e) => setEditingLoan({ ...editingLoan, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Indicative Rate</label>
                  <input
                    type="text"
                    value={editingLoan.indicativeInterestRate || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, indicativeInterestRate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Tenure</label>
                  <input
                    type="text"
                    value={editingLoan.maxTenure || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, maxTenure: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Amount</label>
                  <input
                    type="text"
                    value={editingLoan.maxLoanAmount || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, maxLoanAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description (Cards)</label>
                <textarea
                  rows="2"
                  value={editingLoan.shortDescription || ''}
                  onChange={(e) => setEditingLoan({ ...editingLoan, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Detailed Description</label>
                <textarea
                  rows="5"
                  value={editingLoan.fullDescription || ''}
                  onChange={(e) => setEditingLoan({ ...editingLoan, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingLoan(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-blue text-white rounded-xl font-bold shadow-md"
                >
                  Save Loan Content
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default LoansManager;
