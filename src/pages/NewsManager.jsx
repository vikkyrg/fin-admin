import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Newspaper, X } from 'lucide-react';
import { contentService } from '../services/api';
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchNews = () => {
    contentService.getNews()
      .then(res => {
        if (res.data?.data) setNews(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await contentService.createNews(editingNews);
      } else {
        await contentService.updateNews(editingNews._id, editingNews);
      }
      setEditingNews(null);
      setIsNew(false);
      fetchNews();
    } catch (e) {
      alert('Failed to save news article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news release?')) return;
    try {
      await contentService.deleteNews(id);
      setNews(prev => prev.filter(n => n._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="News & Press Releases"
        subtitle="Manage market updates, financial advisory news, and regulatory rate announcements."
        badge="Media Releases"
        action={
          <PrimaryButton
            icon={Plus}
            onClick={() => {
              setIsNew(true);
              setEditingNews({ title: '', source: 'Financial Desk', summary: '', content: '', isPublished: true });
            }}
          >
            Add Article
          </PrimaryButton>
        }
      />

      <Card noPadding className="overflow-hidden">
        <div className="divide-y divide-[#E4EAF2] text-xs">
          {news.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No news articles found. Click 'Add Article' above.
            </div>
          ) : (
            news.map(item => (
              <div key={item._id} className="p-4 sm:p-5 flex items-start justify-between hover:bg-slate-50/80 transition-colors">
                <div className="space-y-1.5 max-w-3xl pr-4">
                  <span className="font-bold text-[10px] text-crm-navy uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {item.source}
                  </span>
                  <h4 className="font-bold text-crm-text text-sm">{item.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.summary}</p>
                </div>
                <div className="flex space-x-1.5 flex-shrink-0">
                  <button 
                    onClick={() => { setIsNew(false); setEditingNews(item); }} 
                    className="p-1.5 text-slate-500 hover:text-crm-navy hover:bg-slate-100 rounded-lg transition"
                    title="Edit Article"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {editingNews && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs shadow-2xl border border-[#E4EAF2]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4EAF2]">
              <h3 className="text-sm font-bold text-crm-text">{isNew ? 'New Press Release' : 'Edit Press Release'}</h3>
              <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Source / Desk</label>
                <input
                  type="text"
                  value={editingNews.source}
                  onChange={(e) => setEditingNews({ ...editingNews, source: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Summary (1-2 sentences)</label>
                <textarea
                  rows="2"
                  required
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Full Article Text</label>
                <textarea
                  rows="4"
                  required
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none leading-relaxed"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <SecondaryButton onClick={() => setEditingNews(null)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" loading={saving}>
                  Save Article
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
