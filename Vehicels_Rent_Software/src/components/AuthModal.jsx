import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';

const AuthModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP

    const API_URL = API_BASE_URL;

    // Reset state when switching tabs
    useEffect(() => {
        setError('');
        setStep(1);
    }, [activeTab]);

    const handleSendOtp = async () => {
        if (!mobile) {
            setError('Please enter your mobile number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile })
            });

            const data = await response.json();

            if (response.ok) {
                setStep(2);
                alert('OTP sent! Use 123456');
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onClose();
                window.location.reload();
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!fullName || !mobile) {
            setError('Please enter both name and mobile');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, full_name: fullName })
            });

            const data = await response.json();

            if (response.ok) {
                setStep(2);
                alert('Account created! OTP sent.');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-['Plus_Jakarta_Sans']">
            <div className="bg-white w-full max-w-[480px] rounded-[32px] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="p-8 pt-12 text-center">
                    <h2 className="text-[28px] font-[800] text-black mb-2">Welcome Back!</h2>
                    <p className="text-gray-500 text-[15px] mb-8 font-medium">Login to continue your journey</p>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[13px] font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 mb-10 relative">
                        <button 
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-4 text-[16px] font-bold transition-colors ${activeTab === 'login' ? 'text-black' : 'text-gray-400'}`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-4 text-[16px] font-bold transition-colors ${activeTab === 'signup' ? 'text-black' : 'text-gray-400'}`}
                        >
                            Sign Up
                        </button>
                        {/* Active Indicator Line */}
                        <div 
                            className={`absolute bottom-0 left-0 h-[3px] bg-black transition-all duration-300 ${activeTab === 'login' ? 'w-1/2 translate-x-0' : 'w-1/2 translate-x-full'}`}
                        ></div>
                    </div>

                    {/* Form Fields */}
                    <div className="text-left space-y-6">
                        {step === 1 ? (
                            <>
                                {activeTab === 'signup' && (
                                    <div>
                                        <label className="block text-[14px] font-bold text-black mb-2 px-1">Full Name</label>
                                        <div className="relative group">
                                            <input 
                                                type="text" 
                                                placeholder="Enter your full name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full h-[58px] bg-white border border-gray-100 rounded-2xl px-5 text-[15px] font-medium outline-hidden focus:border-black transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[14px] font-bold text-black mb-2 px-1">Mobile Number</label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            placeholder="Enter your mobile number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            className="w-full h-[58px] bg-white border border-gray-100 rounded-2xl px-5 pr-12 text-[15px] font-medium outline-hidden focus:border-black transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-[14px] font-bold text-black mb-2 px-1">Enter OTP</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        placeholder="Enter the 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full h-[58px] bg-white border border-gray-100 rounded-2xl px-5 text-[15px] font-medium outline-hidden focus:border-black transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 mt-2 px-1">We've sent a code to {mobile}</p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button 
                            onClick={step === 2 ? handleVerifyOtp : (activeTab === 'login' ? handleSendOtp : handleRegister)}
                            disabled={loading}
                            className={`w-full h-[64px] bg-black text-white rounded-2xl font-bold text-[17px] shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.01] transition-all transform active:scale-95 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                step === 2 ? 'Verify & Login' : (activeTab === 'login' ? 'Send OTP' : 'Sign Up')
                            )}
                        </button>

                        {step === 2 && (
                            <div className="text-center">
                                <button 
                                    onClick={() => setStep(1)}
                                    className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors"
                                >
                                    Change Mobile Number
                                </button>
                            </div>
                        )}

                        {/* Switch Link */}
                        <div className="text-center mt-10">
                            <p className="text-[14px] text-gray-500 font-medium">
                                {activeTab === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button 
                                    type="button"
                                    onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                                    className="text-black font-extrabold hover:underline"
                                >
                                    {activeTab === 'login' ? 'Sign Up' : 'Login'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
