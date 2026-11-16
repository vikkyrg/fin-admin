import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { contentService } from '../services/api';

const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    contentService.getSettings()
      .then(res => {
        if (res.data?.data) setSettings(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await contentService.updateSettings(settings);
      setMessage('Company & system settings saved successfully!');
    } catch (e) {
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System & Company Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure company phone numbers, official address, and regulatory disclaimers.</p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Company Name</label>
          <input
            type="text"
            value={settings?.companyName || ''}
            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Tagline</label>
          <input
            type="text"
            value={settings?.tagline || ''}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
            <input
              type="text"
              value={settings?.contactPhone || ''}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Alternate Phone</label>
            <input
              type="text"
              value={settings?.alternatePhone || ''}
              onChange={(e) => setSettings({ ...settings, alternatePhone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
          <input
            type="email"
            value={settings?.contactEmail || ''}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Office Address</label>
          <textarea
            rows="2"
            value={settings?.officeAddress || ''}
            onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Working Hours</label>
          <input
            type="text"
            value={settings?.workingHours || ''}
            onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Financial Services Regulatory Disclaimer</label>
          <textarea
            rows="3"
            value={settings?.disclaimerText || ''}
            onChange={(e) => setSettings({ ...settings, disclaimerText: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold shadow-md transition flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            <span>Update System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
