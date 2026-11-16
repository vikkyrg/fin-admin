import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Eye, EyeOff, Search } from 'lucide-react';
import { blogService } from '../services/api';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const fetchBlogs = () => {
    setLoading(true);
    blogService.getBlogs()
      .then(res => {
        if (res.data?.success) setBlogs(res.data.data.blogs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const res = await blogService.togglePublish(id);
      if (res.data?.success) {
        setBlogs(prev => prev.map(b => b._id === id ? { ...b, isPublished: res.data.data.isPublished } : b));
      }
    } catch (e) {
      alert('Failed to toggle publish status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogService.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (e) {
      alert('Failed to delete blog');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isNew) {
        await blogService.createBlog(editingBlog);
      } else {
        await blogService.updateBlog(editingBlog._id, editingBlog);
      }
      setEditingBlog(null);
      setIsNew(false);
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save blog');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blog & Article Management</h1>
          <p className="text-xs text-slate-500 mt-1">Publish financial guides, credit score awareness, and rate updates.</p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setEditingBlog({
              title: '',
              slug: '',
              category: 'Loan Guidance',
              author: 'Financial Advisory Desk',
              summary: '',
              content: '',
              readTime: '5 min read',
              isPublished: true
            });
          }}
          className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.map(blog => (
              <tr key={blog._id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                  {blog.title}
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-blue-50 text-brand-blue font-bold px-2 py-0.5 rounded text-[10px]">
                    {blog.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{blog.author}</td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleTogglePublish(blog._id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      blog.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => { setIsNew(false); setEditingBlog(blog); }}
                    className="p-1 text-slate-600 hover:text-brand-blue"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT / CREATE BLOG MODAL */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="text-base font-bold text-slate-900">
              {isNew ? 'Create New Article' : 'Edit Article'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="Loan Guidance">Loan Guidance</option>
                    <option value="Credit Score & CIBIL">Credit Score & CIBIL</option>
                    <option value="Interest Rates & EMIs">Interest Rates & EMIs</option>
                    <option value="Financial Planning">Financial Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editingBlog.author}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Summary *</label>
                <textarea
                  rows="2"
                  required
                  value={editingBlog.summary}
                  onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content (Markdown Supported) *</label>
                <textarea
                  rows="8"
                  required
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-blue text-white rounded-xl font-bold"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogsManager;
