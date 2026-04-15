import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutGrid, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE}/profile/progress`, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then(res => {
        if (res.data.step === 7) {
          navigate('/dashboard');
        } else {
          navigate('/register');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) return alert('Enter a valid 10-digit mobile number');
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, { mobile });
      setOtpSent(true);
    } catch(err) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Enter the OTP');
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { mobile, otp });
      const token = res.data.token;
      localStorage.setItem('token', token);
      
      const progressRes = await axios.get(`${API_BASE}/profile/progress`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (progressRes.data.step === 7) {
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
    } catch(err) {
      alert('Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Plus_Jakarta_Sans']">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Section - Image & Quote */}
        <div className="md:w-[40%] relative bg-slate-900 overflow-hidden hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" 
            alt="Rental Vehicle" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
             <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center shadow-lg">
                <LayoutGrid size={20} className="text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight">Pondy Rentals</span>
          </div>

          <div className="absolute bottom-12 left-8 right-8 text-white">
            <h3 className="text-2xl font-bold leading-tight mb-4 italic">
              “My car went from sitting in the garage to generating ₹30,000 every month.”
            </h3>
            <div>
              <p className="font-bold text-lg">Senthil Kumar</p>
              <p className="text-white/60 text-sm">Platinum Fleet Owner</p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-[400px] mx-auto w-full">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight">
                Welcome back to Nucleus
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Build your design system effortlessly with our powerful component library.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    className="w-full border-2 border-slate-100 focus:border-[#7C3AED] rounded-xl px-4 py-3 text-slate-900 font-semibold transition-all outline-none" 
                    placeholder="58963284" 
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={rememberMe} 
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                    <span className="text-sm font-semibold text-slate-500">Remember sign in details</span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 mt-2"
                >
                  {loading ? 'Sending...' : 'Log in'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">OTP Verification</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    className="w-full border-2 border-slate-100 focus:border-[#7C3AED] rounded-xl px-4 py-3 text-slate-900 font-bold tracking-[1em] text-center transition-all outline-none" 
                    placeholder="••••••" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                  />
                  <p className="text-[10px] text-slate-400 mt-2 text-center uppercase font-bold tracking-widest">OTP: 123456</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                  {loading ? 'Verifying...' : 'Verify Now'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)}
                  className="w-full text-slate-500 text-sm font-bold hover:underline"
                >
                  Change mobile number
                </button>
              </form>
            )}

            {!otpSent && (
              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-8">
                  <div className="border-t border-slate-100 w-full" />
                  <span className="absolute bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
                </div>

                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-3 border border-slate-100 mb-6">
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>

                <p className="text-center text-sm font-semibold text-slate-500">
                  Don't have an account? {' '}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-[#7C3AED] hover:underline">
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
