import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Globe, Layout, Sparkles } from 'lucide-react';
import { contentService } from '../services/api';
import { Card, PageHeader, PrimaryButton } from '../components/common/UIComponents';

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
      setMessage('Website CMS content successfully saved!');
    } catch (e) {
      alert('Failed to save website content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Homepage CMS Content"
        subtitle="Manage public website copy, hero banner headlines, badge pill, and value propositions."
        badge="Content Management"
      />

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-crm-navy rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          
          {/* Hero Banner CMS */}
          <Card className="space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-[#E4EAF2]">
              <Layout className="w-4 h-4 text-crm-navy" />
              <h3 className="font-bold text-crm-text text-sm">Hero Banner Content</h3>
            </div>
            
            <div>
              <label className="block font-bold text-slate-700 mb-1">Top Highlight Badge</label>
              <input
                type="text"
                value={content?.hero?.badge || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content?.hero, badge: e.target.value }
                })}
                placeholder="e.g. 100% Impartial Financial Advice"
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
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
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Subtitle / Description</label>
              <textarea
                rows="3"
                value={content?.hero?.subtitle || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content?.hero, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none leading-relaxed"
              />
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <PrimaryButton type="submit" loading={saving} icon={Save}>
              Save CMS Changes
            </PrimaryButton>
          </div>

        </form>
      )}

    </div>
  );
};

export default WebsiteManager;
