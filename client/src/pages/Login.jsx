import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Smartphone, ArrowRight, Star, Globe, ShieldCheck } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE}/profile/progress`, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then(res => {
        if (res.data.step === 7) navigate('/dashboard');
        else navigate('/register');
      })
      .catch(() => localStorage.removeItem('token'));
    }
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, { mobile });
      setOtpSent(true);
    } catch(err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { mobile, otp });
      const token = res.data.token;
      localStorage.setItem('token', token);
      const pr = await axios.get(`${API_BASE}/profile/progress`, { headers: { Authorization: `Bearer ${token}` } });
      if (pr.data.step === 7) navigate('/dashboard');
      else navigate('/register');
    } catch(err) {
      alert('Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-slate-100 relative z-10 min-h-[750px]">
        
        {/* Left Area - Branding & Experience */}
        <div className="lg:w-[45%] relative bg-slate-900 overflow-hidden hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105"
            alt="Luxury Car"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          <div className="absolute top-12 left-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <Globe className="text-slate-900" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">PONDY RENTALS</h1>
                <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.3em]">Owner Network</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-16 left-12 right-12 space-y-8">
            <div className="space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <h3 className="text-4xl font-premium text-white leading-tight italic">
                “Transforming my vehicle into a high-yield asset was the smartest move for my financial independence.”
              </h3>
            </div>
            
            <div className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-lg font-black text-white italic">Senthil Kumar</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Master fleet owner • 12 Vehicles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area - Advanced Login Form */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full space-y-12">
            
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                Owner <span className="text-blue-600">Portal</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Unlock the full potential of your fleet. Secure, transparent, and built for growth.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="space-y-3">
                  <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block">Authentication Number</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Smartphone size={20} />
                    </div>
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-[1.5rem] px-6 py-5 pl-14 text-slate-900 font-black text-lg transition-all outline-none shadow-sm group-hover:border-slate-200" 
                      placeholder="98765 43210" 
                      value={mobile} 
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Shield className="text-blue-600 shrink-0" size={18} />
                  <p className="text-xs font-bold text-slate-500 leading-normal">
                    By continuing, you agree to our <span className="text-slate-900 underline pointer-events-auto cursor-pointer">Terms of Service</span> and secure data policy.
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || mobile.length < 10}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10">{loading ? 'Initiating...' : 'Authorize Login'}</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 text-center lg:text-left">
                 <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pin Verification</label>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-[0.65rem] font-black text-blue-600 uppercase tracking-[0.1em] hover:underline">Change Mobile</button>
                  </div>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-[1.5rem] px-6 py-6 text-slate-900 font-black text-3xl tracking-[0.8em] text-center transition-all outline-none shadow-sm" 
                    placeholder="••••••" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                  />
                  <div className="p-3 bg-blue-50 rounded-xl inline-block mx-auto lg:mx-0">
                    <p className="text-[0.6rem] text-blue-600 uppercase font-black tracking-[0.2em]">Secure Debug OTP: 123456</p>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || otp.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 group"
                >
                  {loading ? 'Validating...' : 'Verify Access'}
                  <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
                </button>
              </form>
            )}

            <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-900">2.4k+</p>
                <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest leading-none">Registered Owners</p>
              </div>
              <div className="space-y-1 flex flex-col items-end lg:items-start text-right lg:text-left">
                <p className="text-xl font-black text-slate-900">₹45M+</p>
                <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest leading-none">Owner Earnings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
