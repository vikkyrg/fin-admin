import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { contentService } from '../services/api';

const WebsiteManager = ({ section = 'home' }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    contentService.getPageContent(section)
      .then(res => {
        if (res.data?.data) {
          setContent(res.data.data.sections || {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [section]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await contentService.savePageContent(section, { sections: content });
      setMessage('Website CMS content successfully updated!');
    } catch (e) {
      alert('Failed to save website content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website CMS Management</h1>
        <p className="text-xs text-slate-500 mt-1">Manage public website headlines, hero banner texts, and key sections.</p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-xs">
          
          {/* Hero Banner CMS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b">Homepage Hero Banner</h3>
            
            <div>
              <label className="block font-bold text-slate-700 mb-1">Top Badge Pill</label>
              <input
                type="text"
                value={content?.hero?.badge || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content?.hero, badge: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Main Heading</label>
              <input
                type="text"
                value={content?.hero?.title || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content?.hero, title: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Subtitle</label>
              <textarea
                rows="3"
                value={content?.hero?.subtitle || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content?.hero, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold shadow-md transition flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              <span>{saving ? 'Saving Changes...' : 'Save CMS Content'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default WebsiteManager;
