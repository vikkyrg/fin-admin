import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { contentService } from '../services/api';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [isNew, setIsNew] = useState(false);

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
      alert('Failed to save news');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await contentService.deleteNews(id);
      setNews(prev => prev.filter(n => n._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">News & Press Releases</h1>
          <p className="text-xs text-slate-500 mt-1">Manage financial desk updates, regulatory notifications, and industry news.</p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setEditingNews({ title: '', source: 'Financial Desk', summary: '', content: '', isPublished: true });
          }}
          className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold shadow-md"
        >
          Add News Article
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y text-xs">
        {news.map(item => (
          <div key={item._id} className="p-4 flex items-start justify-between hover:bg-slate-50">
            <div>
              <span className="font-bold text-[10px] text-brand-blue uppercase">{item.source}</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{item.title}</h4>
              <p className="text-slate-500 text-xs mt-1 max-w-2xl">{item.summary}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { setIsNew(false); setEditingNews(item); }} className="text-slate-500 hover:text-brand-blue">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingNews && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">{isNew ? 'New Press Article' : 'Edit Press Article'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Source / Desk</label>
                <input
                  type="text"
                  value={editingNews.source}
                  onChange={(e) => setEditingNews({ ...editingNews, source: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Summary</label>
                <textarea
                  rows="2"
                  required
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Full Content</label>
                <textarea
                  rows="4"
                  required
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingNews(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
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

export default NewsManager;
