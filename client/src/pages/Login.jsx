import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Smartphone, Lock } from 'lucide-react';

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
    <div className="min-h-screen relative flex items-center justify-center p-0 overflow-hidden font-['Inter', sans-serif]">
      {/* Background Image - Mountain Landscape */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center px-10 md:px-20 py-20">
        
        {/* Left Section - Welcome Back */}
        <div className="w-full md:w-3/5 text-white mb-16 md:mb-0 pr-0 md:pr-10">
          <h1 className="text-7xl font-bold leading-tight mb-8">
            Welcome<br/>Back
          </h1>
          <p className="text-lg opacity-80 max-w-md leading-relaxed mb-10">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using
          </p>
          
          <div className="flex gap-6">
            <SocialIcon>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/></svg>
            </SocialIcon>
            <SocialIcon>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </SocialIcon>
            <SocialIcon>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </SocialIcon>
            <SocialIcon>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </SocialIcon>
          </div>
        </div>

        {/* Right Section - Sign In Form */}
        <div className="w-full md:w-[400px]">
          <div className="text-white mb-8">
            <h2 className="text-5xl font-bold">Sign in</h2>
          </div>

          <div className="space-y-6">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white text-[14px] font-medium block">Mobile Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-[45px] bg-white border-none outline-none px-4 text-[#252f40] font-medium focus:ring-4 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                   <input type="checkbox" id="remember" className="w-4 h-4 border-none accent-orange-600" />
                   <label htmlFor="remember" className="text-white text-[14px] font-medium">Remember Me</label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-[50px] bg-[#cc4b1f] hover:bg-[#b0401a] text-white font-bold text-[16px] transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Sending...' : 'Sign in now'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-white text-[14px] font-medium block">Verification Code (OTP)</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-[45px] bg-white border-none outline-none px-4 text-[#252f40] font-medium tracking-[0.5em] focus:ring-4 focus:ring-orange-500/20 transition-all font-bold"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-[50px] bg-[#cc4b1f] hover:bg-[#b0401a] text-white font-bold text-[16px] transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Verifying...' : 'Authorize Signature'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => setOtpSent(false)} className="text-white text-[14px] font-medium underline opacity-80 hover:opacity-100 italic">Modify Identification</button>
                </div>
              </form>
            )}

            <div className="text-white pt-2">
               <a href="#" className="text-[14px] font-medium opacity-80 hover:opacity-100 hover:underline">Lost your password?</a>
            </div>

            <div className="mt-16 text-center text-white/60 text-[12px] leading-relaxed">
              By clicking on "Sign in now" you agree to<br/>
              <span className="text-white opacity-100 hover:underline cursor-pointer">Terms of Service</span> | <span className="text-white opacity-100 hover:underline cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ children }) {
  return (
    <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer">
      {children}
    </div>
  );
}
