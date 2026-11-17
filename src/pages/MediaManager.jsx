import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image, FileText, CheckCircle2, Search, Filter, Grid, List } from 'lucide-react';
import api, { contentService } from '../services/api';
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/common/UIComponents';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const fetchMedia = () => {
    setLoading(true);
    contentService.getMedia()
      .then(res => {
        if (res.data?.data) setMedia(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await contentService.uploadMedia(formData);
      fetchMedia();
    } catch (e) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media file?')) return;
    try {
      await contentService.deleteMedia(id);
      setMedia(prev => prev.filter(m => m._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  const filteredMedia = media.filter(item => 
    !search.trim() || item.originalName.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media & Document Library"
        subtitle="Upload and manage loan banners, partner logos, guidelines, and assets."
        badge="Asset Storage"
        action={
          <label className="inline-flex items-center justify-center px-4 py-2 bg-crm-orange hover:bg-crm-orangeHover text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
        }
      />

      {/* Filter and View Mode Toolbar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files by name..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-[#E4EAF2] rounded-lg text-xs focus:ring-2 focus:ring-crm-navy focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <span className="text-xs text-slate-500 mr-2 font-medium">
            {filteredMedia.length} files
          </span>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg border transition ${viewMode === 'grid' ? 'bg-crm-navy text-white border-crm-navy' : 'bg-white text-slate-600 border-[#E4EAF2] hover:bg-slate-50'}`}
            title="Grid View"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg border transition ${viewMode === 'list' ? 'bg-crm-navy text-white border-crm-navy' : 'bg-white text-slate-600 border-[#E4EAF2] hover:bg-slate-50'}`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-crm-navy rounded-full animate-spin"></div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 text-xs">
          <Image className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-600">No media assets found</p>
          <p className="text-[11px] mt-0.5">Click 'Upload Media' above to add images or documents.</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map(item => (
            <Card key={item._id} className="p-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="h-28 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-2 border border-slate-100">
                {item.mimeType?.startsWith('image') ? (
                  <img 
                    src={new URL(item.filePath, new URL(api.defaults.baseURL, window.location.origin).origin).href} 
                    alt={item.originalName} 
                    className="object-cover h-full w-full" 
                  />
                ) : (
                  <FileText className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <p className="text-[11px] font-semibold text-crm-text truncate" title={item.originalName}>
                {item.originalName}
              </p>
              <div className="mt-2 pt-2 border-t border-[#E4EAF2] flex items-center justify-between text-[10px] text-slate-400">
                <span>{(item.size / 1024).toFixed(0)} KB</span>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card noPadding className="overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E4EAF2] text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Uploaded Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4EAF2]">
              {filteredMedia.map(item => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 w-16">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {item.mimeType?.startsWith('image') ? (
                        <img 
                          src={new URL(item.filePath, new URL(api.defaults.baseURL, window.location.origin).origin).href} 
                          alt={item.originalName} 
                          className="object-cover w-full h-full" 
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-crm-text">{item.originalName}</td>
                  <td className="py-2.5 px-4 text-slate-500">{(item.size / 1024).toFixed(0)} KB</td>
                  <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                    {new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default MediaManager;
