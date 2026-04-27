import React, { useState } from 'react';

const Contact = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="pt-32 pb-20 px-8 font-['Plus_Jakarta_Sans'] bg-gray-50 min-h-screen">
            <div className="max-w-[1240px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side: Info */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-10 duration-700">
                        <div>
                            <h1 className="text-[56px] font-[800] text-black leading-tight tracking-tight mb-6">
                                Get in touch<br />
                                <span className="text-gray-400">with our team.</span>
                            </h1>
                            <p className="text-gray-500 text-[18px] font-medium leading-relaxed">
                                Have questions? We're here to help. Reach out to us through any of these channels.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                    <p className="text-[18px] font-[800] text-black">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                    <p className="text-[18px] font-[800] text-black">hello@quickservices.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                                    <p className="text-[18px] font-[800] text-black">123, Tech Hub, Pondicherry, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-gray-200/50 animate-in fade-in slide-in-from-right-10 duration-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[14px] font-bold text-black mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name"
                                    className="w-full h-[58px] bg-gray-50 border border-gray-100 rounded-2xl px-5 text-[15px] font-medium outline-none focus:border-black transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-black mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="w-full h-[58px] bg-gray-50 border border-gray-100 rounded-2xl px-5 text-[15px] font-medium outline-none focus:border-black transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-black mb-2">Message</label>
                                <textarea 
                                    placeholder="How can we help you?"
                                    className="w-full h-[150px] bg-gray-50 border border-gray-100 rounded-2xl p-5 text-[15px] font-medium outline-none focus:border-black transition-all resize-none"
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                className="w-full h-[64px] bg-black text-white rounded-2xl font-bold text-[17px] hover:scale-[1.01] transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                disabled={submitted}
                            >
                                {submitted ? (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <polyline points="3 7 6 10 11 4" />
                                        </svg>
                                        Message Sent
                                    </>
                                ) : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
