import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building, ShieldCheck, X } from 'lucide-react';
import { contentService } from '../services/api';
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

const LendingPartnersManager = () => {
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPartners = () => {
    contentService.getPartners()
      .then(res => {
        if (res.data?.data) setPartners(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await contentService.createPartner(editingPartner);
      } else {
        await contentService.updatePartner(editingPartner._id, editingPartner);
      }
      setEditingPartner(null);
      setIsNew(false);
      fetchPartners();
    } catch (e) {
      alert('Failed to save lending partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner record?')) return;
    try {
      await contentService.deletePartner(id);
      setPartners(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lending Partners Management"
        subtitle="Manage verified bank, NBFC, and institutional tie-ups displayed on the public platform."
        badge="Institutional Network"
        action={
          <PrimaryButton
            icon={Plus}
            onClick={() => {
              setIsNew(true);
              setEditingPartner({ name: '', category: 'Private Bank', description: '', isActive: true });
            }}
          >
            Add Partner
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {partners.map(p => (
          <Card key={p._id} className="flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-crm-navy bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {p.category}
                </span>
                <span className="text-emerald-700 bg-emerald-50 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  Active
                </span>
              </div>
              <h3 className="font-bold text-crm-text text-sm mt-2.5">{p.name}</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{p.description || 'Institutional lending partner.'}</p>
            </div>
            
            <div className="pt-3 border-t border-[#E4EAF2] mt-4 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Tie-up Active</span>
              <div className="flex space-x-1.5">
                <button 
                  onClick={() => { setIsNew(false); setEditingPartner(p); }} 
                  className="p-1.5 text-slate-500 hover:text-crm-navy hover:bg-slate-50 rounded-lg transition"
                  title="Edit Partner"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(p._id)} 
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Partner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs shadow-2xl border border-[#E4EAF2]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4EAF2]">
              <h3 className="text-sm font-bold text-crm-text">{isNew ? 'New Lending Partner' : 'Edit Partner'}</h3>
              <button onClick={() => setEditingPartner(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Partner Entity Name</label>
                <input
                  type="text"
                  required
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={editingPartner.category}
                  onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                >
                  <option value="Public Sector Bank">Public Sector Bank</option>
                  <option value="Private Bank">Private Bank</option>
                  <option value="NBFC">NBFC</option>
                  <option value="Housing Finance Company">Housing Finance Company</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Description / Notes</label>
                <textarea
                  rows="3"
                  value={editingPartner.description || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E4EAF2] rounded-xl text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <SecondaryButton onClick={() => setEditingPartner(null)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" loading={saving}>
                  Save Partner
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendingPartnersManager;
