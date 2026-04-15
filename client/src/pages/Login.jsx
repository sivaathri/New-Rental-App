import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
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
        localStorage.removeItem('token'); // Invalid token, clear it
      });
    }
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile) return alert('Enter mobile number');
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, { mobile });
      setOtpSent(true);
      alert('OTP Sent! Use 123456');
    } catch(err) {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
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
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-gray-500">
            {mode === 'login' 
              ? 'Log in to manage your vehicle listings' 
              : 'Sign up to start listing your rentals in Pondicherry'}
          </p>
        </div>
        
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input 
                type="tel" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                placeholder="Enter your 10-digit number" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all">
              {mode === 'login' ? 'Send OTP to Login' : 'Send OTP to Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
              />
              <p className="text-xs text-gray-500 mt-2">OTP has been sent to {mobile}. (Use 123456 for MVP)</p>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg transition-all">
              Verify & Proceed
            </button>
            <button 
              type="button" 
              onClick={() => setOtpSent(false)} 
              className="w-full text-blue-600 text-sm font-medium hover:underline mt-2">
              Change Mobile Number
            </button>
          </form>
        )}

        {!otpSent && (
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            {mode === 'login' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')} 
                  className="text-blue-600 font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-blue-600 font-semibold hover:underline">
                  Log in
                </button>
              </p>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
