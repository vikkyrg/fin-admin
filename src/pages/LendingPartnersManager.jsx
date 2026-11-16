import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { contentService } from '../services/api';

const LendingPartnersManager = () => {
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [isNew, setIsNew] = useState(false);

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
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      await contentService.deletePartner(id);
      setPartners(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lending Partners Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage verified bank & NBFC institutional tie-ups.</p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setEditingPartner({ name: '', category: 'Private Bank', description: '', isActive: true });
          }}
          className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold shadow-md"
        >
          Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {partners.map(p => (
          <div key={p._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                {p.category}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-2">{p.name}</h3>
              <p className="text-slate-500 text-xs mt-1">{p.description}</p>
            </div>
            <div className="pt-4 border-t mt-4 flex items-center justify-between">
              <span className="text-emerald-600 font-bold text-[10px]">Active Partner</span>
              <div className="flex space-x-2">
                <button onClick={() => { setIsNew(false); setEditingPartner(p); }} className="text-slate-500 hover:text-brand-blue">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">{isNew ? 'New Partner' : 'Edit Partner'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Partner Name</label>
                <input
                  type="text"
                  required
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={editingPartner.category}
                  onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="Public Sector Bank">Public Sector Bank</option>
                  <option value="Private Bank">Private Bank</option>
                  <option value="NBFC">NBFC</option>
                  <option value="Housing Finance Company">Housing Finance Company</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editingPartner.description || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingPartner(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
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

export default LendingPartnersManager;
