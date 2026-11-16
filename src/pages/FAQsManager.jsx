import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { contentService } from '../services/api';

const FAQsManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isNew, setIsNew] = useState(false);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">FAQ Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage FAQs appearing on the public homepage and knowledge centre.</p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setEditingFaq({ question: '', answer: '', category: 'General', isPublished: true });
          }}
          className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold shadow-md"
        >
          Add New FAQ
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 text-xs">
          {faqs.map(faq => (
            <div key={faq._id} className="p-4 flex items-start justify-between hover:bg-slate-50">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[10px] font-bold text-brand-blue uppercase bg-blue-50 px-2 py-0.5 rounded">
                  {faq.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{faq.answer}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { setIsNew(false); setEditingFaq(faq); }}
                  className="p-1.5 text-slate-500 hover:text-brand-blue"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">{isNew ? 'New FAQ' : 'Edit FAQ'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Answer</label>
                <textarea
                  rows="4"
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingFaq(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-blue text-white rounded-xl font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQsManager;
