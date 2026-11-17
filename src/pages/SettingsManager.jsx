import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Building, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { contentService } from '../services/api';
import { Card, PageHeader, PrimaryButton } from '../components/common/UIComponents';

const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
    setMessage('');
    try {
      await contentService.updateSettings(settings);
      setMessage('Company & system settings saved successfully!');
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-crm-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="System & Company Settings"
        subtitle="Configure company identity, contact numbers, official office address, and compliance disclaimers."
        badge="Global Configuration"
      />

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        
        {/* Section 1: Company Profile */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-[#E4EAF2]">
            <Building className="w-4 h-4 text-crm-navy" />
            <h3 className="font-bold text-crm-text text-sm">Company Identification</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={settings?.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings?.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Contact Information */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-[#E4EAF2]">
            <Phone className="w-4 h-4 text-crm-navy" />
            <h3 className="font-bold text-crm-text text-sm">Official Contact Channels</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Helpdesk Phone</label>
              <input
                type="text"
                value={settings?.contactPhone || ''}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alternate Phone / WhatsApp</label>
              <input
                type="text"
                value={settings?.alternatePhone || ''}
                onChange={(e) => setSettings({ ...settings, alternatePhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Advisory Email</label>
              <input
                type="email"
                value={settings?.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Office Address</label>
              <textarea
                rows="2"
                value={settings?.officeAddress || ''}
                onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Working Hours</label>
              <input
                type="text"
                value={settings?.workingHours || ''}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Compliance & Legal */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-[#E4EAF2]">
            <ShieldCheck className="w-4 h-4 text-crm-navy" />
            <h3 className="font-bold text-crm-text text-sm">Regulatory Compliance & Disclaimer</h3>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mandatory Financial Advisory Disclaimer</label>
            <textarea
              rows="3"
              value={settings?.disclaimerText || ''}
              onChange={(e) => setSettings({ ...settings, disclaimerText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none leading-relaxed"
            />
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <PrimaryButton type="submit" loading={saving} icon={Save}>
            Save All Settings
          </PrimaryButton>
        </div>

      </form>
    </div>
  );
};

export default SettingsManager;
