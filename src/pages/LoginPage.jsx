import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@finadviseloans.com');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2342] flex flex-col justify-center items-center px-4 sm:px-6 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#174F8F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-crm-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#10345F] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white text-crm-navy flex items-center justify-center font-black text-xl mx-auto shadow-md">
            FA
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">FinAdvise CRM</h1>
            <p className="text-xs text-blue-200 mt-1">Financial Advisory Management Portal</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-blue-100 mb-1.5">Staff Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@finadviseloans.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-crm-navy focus:border-crm-navy transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-100 mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-crm-navy focus:border-crm-navy transition font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-crm-orange hover:bg-crm-orangeHover text-white font-semibold text-xs transition shadow-md flex items-center justify-center disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span className="flex items-center">
                <span>Sign In to CRM</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-blue-200/80 flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
          <span>Enterprise 256-bit encrypted authentication</span>
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        FinAdvise Financial Advisory Platform &copy; 2026
      </div>

    </div>
  );
};

export default LoginPage;
