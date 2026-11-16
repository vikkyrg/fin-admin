import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image, FileText, CheckCircle2 } from 'lucide-react';
import api, { contentService } from '../services/api';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Media & Document Library</h1>
          <p className="text-xs text-slate-500 mt-1">Upload loan banners, partner logos, or loan guidelines.</p>
        </div>

        <label className="px-4 py-2 bg-brand-blue hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center">
          <Upload className="w-4 h-4 mr-1.5" />
          <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
          <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue"></div>
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
          <Image className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p>No media files uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map(item => (
            <div key={item._id} className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                {item.mimeType?.startsWith('image') ? (
                  <img src={new URL(item.filePath, new URL(api.defaults.baseURL, window.location.origin).origin).href} alt={item.originalName} className="object-cover h-full w-full" />
                ) : (
                  <FileText className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-800 truncate">{item.originalName}</p>
              <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-slate-400">
                <span>{(item.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
