import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Loader2, AlertCircle, Key } from 'lucide-react';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@devforge.io');
  const [password, setPassword] = useState('Admin@DevForge2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('Access Denied: This account is not recognized as a platform administrator.');
        }
      } else {
        setError(res.message || 'Invalid administrator credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Platform Admin Console</h1>
          <p className="text-xs text-slate-400">
            Secure administrative access for platform ownership & governance
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 text-red-300 text-xs rounded-xl flex items-center gap-2 border border-red-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@devforge.io"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Unlock Admin Console</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-900 text-center">
          <p className="text-[11px] text-slate-500">
            Default credentials initialized during seed: <br />
            <span className="font-mono text-slate-400">admin@devforge.io / Admin@DevForge2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
