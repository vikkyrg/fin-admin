import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-brand-blueDark flex flex-col justify-center items-center px-4 sm:px-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md bg-brand-blue border border-navy-700 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-white text-brand-blue flex items-center justify-center font-extrabold text-xl mx-auto shadow-lg">
            FA
          </div>
          <h1 className="text-2xl font-black text-brand-white tracking-tight">FinAdvise Admin Portal</h1>
          <p className="text-xs text-blue-200">Authorized Financial Advisory Staff Access Only</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-blue-100 mb-1.5">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-blue-300 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@finadviseloans.com"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-100 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-blue-300 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-brand-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-brand-white font-bold text-sm transition shadow-lg shadow-brand-orange/20 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-blue-200 flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-green mr-1.5" />
          <span>Secured with JWT & bcrypt password hashing</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;