import React from 'react';
import { Bell, User, Car } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-[100px] px-10">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] bg-black rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
            <Car size={28} className="text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-extrabold tracking-tighter leading-[0.8] mb-1">Quick</span>
            <span className="text-[11px] uppercase font-bold tracking-[0.5em] text-gray-400 leading-none">Services</span>
          </div>
        </div>

        {/* Navigation Links - Refined for "Satisfying" typography */}
        <div className="hidden lg:flex items-center gap-14">
          <div className="relative flex flex-col items-center">
            <a href="#" className="text-[17px] font-bold text-black tracking-tight">Home</a>
            <div className="absolute -bottom-[38px] w-full h-[3px] bg-black rounded-full"></div>
          </div>
          <a href="#" className="text-[17px] font-semibold text-[#555] hover:text-black transition-all tracking-tight">Vehicles</a>
          <a href="#" className="text-[17px] font-semibold text-[#555] hover:text-black transition-all tracking-tight">Bookings</a>
          <a href="#" className="text-[17px] font-semibold text-[#555] hover:text-black transition-all tracking-tight">About Us</a>
          <a href="#" className="text-[17px] font-semibold text-[#555] hover:text-black transition-all tracking-tight">Contact</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-8">
          <button className="relative w-[56px] h-[56px] bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm group">
            <Bell size={26} className="text-black group-hover:scale-110 transition-transform" />
            <span className="absolute top-[14px] right-[14px] w-3 h-3 bg-[#FF4B4B] rounded-full border-2 border-white"></span>
          </button>
          
          <button className="flex items-center gap-4 pl-1.5 pr-10 py-2.5 bg-white border border-gray-100 rounded-full hover:shadow-xl transition-all group">
            <div className="w-[48px] h-[48px] bg-black text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <User size={26} fill="white" />
            </div>
            <span className="text-[17px] font-extrabold text-black">Login / Signup</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
