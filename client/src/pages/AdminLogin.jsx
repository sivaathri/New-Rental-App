import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://192.168.0.157:5000/api/auth/admin-login', credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess();
    } catch (err) {
      setError('System Access Denied: Invalid Master Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-['Inter', sans-serif]">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight italic">
              Quick1 <span className="text-blue-500">MASTER</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-medium tracking-wide uppercase">
              Administrative Gateway
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Admin ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={credentials.id}
                  onChange={(e) => setCredentials({...credentials, id: e.target.value})}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 text-white font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="Enter ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 text-white font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-blue-600/20 disabled:grayscale"
            >
              {loading ? 'Validating Link...' : 'ESTABLISH ACCESS'}
            </button>
          </form>

          <div className="mt-10 text-center opacity-40">
             <p className="text-[10px] text-white font-medium uppercase tracking-[0.3em]">
               Quick1 Network • V4.0.2
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
