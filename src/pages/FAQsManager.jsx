import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, HelpCircle, X } from 'lucide-react';
import { contentService } from '../services/api';
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

const FAQsManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = () => {
    contentService.getFAQs()
      .then(res => {
        if (res.data?.data) setFaqs(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await contentService.createFAQ(editingFaq);
      } else {
        await contentService.updateFAQ(editingFaq._id, editingFaq);
      }
      setEditingFaq(null);
      setIsNew(false);
      fetchFaqs();
    } catch (e) {
      alert('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete FAQ?')) return;
    try {
      await contentService.deleteFAQ(id);
      setFaqs(prev => prev.filter(f => f._id !== id));
    } catch (e) {
      alert('Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ Management"
        subtitle="Manage frequently asked questions appearing across the public portal and knowledge centre."
        badge="Knowledge Base"
        action={
          <PrimaryButton
            icon={Plus}
            onClick={() => {
              setIsNew(true);
              setEditingFaq({ question: '', answer: '', category: 'General', isPublished: true });
            }}
          >
            Add New FAQ
          </PrimaryButton>
        }
      />

      <Card noPadding className="overflow-hidden">
        <div className="divide-y divide-[#E4EAF2] text-xs">
          {faqs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No FAQs found. Click 'Add New FAQ' above.
            </div>
          ) : (
            faqs.map(faq => (
              <div key={faq._id} className="p-4 sm:p-5 flex items-start justify-between hover:bg-slate-50/80 transition-colors">
                <div className="space-y-1.5 max-w-3xl pr-4">
                  <span className="text-[10px] font-bold text-crm-navy uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {faq.category}
                  </span>
                  <h4 className="font-bold text-crm-text text-sm">{faq.question}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{faq.answer}</p>
                </div>
                <div className="flex space-x-1.5 flex-shrink-0">
                  <button
                    onClick={() => { setIsNew(false); setEditingFaq(faq); }}
                    className="p-1.5 text-slate-500 hover:text-crm-navy hover:bg-slate-100 rounded-lg transition"
                    title="Edit FAQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs shadow-2xl border border-[#E4EAF2]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4EAF2]">
              <h3 className="text-sm font-bold text-crm-text">{isNew ? 'New FAQ' : 'Edit FAQ'}</h3>
              <button onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Answer</label>
                <textarea
                  rows="4"
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none leading-relaxed"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <SecondaryButton onClick={() => setEditingFaq(null)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" loading={saving}>
                  Save FAQ
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQsManager;
