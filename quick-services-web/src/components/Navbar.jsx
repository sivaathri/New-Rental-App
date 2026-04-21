import React from 'react';
import { Bell, User, Car } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-[80px] px-10">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-[45px] h-[45px] bg-black rounded-full flex items-center justify-center shadow-lg">
            <Car size={26} className="text-white" fill="white" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[26px] font-[700] tracking-tight leading-[0.8] mb-1">Quick</span>
            <span className="text-[10px] uppercase font-[700] tracking-[0.5em] text-[#999] leading-none">Services</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-12">
          <div className="relative flex flex-col items-center">
            <a href="#" className="text-[15px] font-[800] text-black">Home</a>
            <div className="absolute -bottom-[28px] w-full h-[2.5px] bg-black"></div>
          </div>
          <a href="#" className="text-[15px] font-[500] text-[#999] hover:text-black transition-colors">Vehicles</a>
          <a href="#" className="text-[15px] font-[500] text-[#999] hover:text-black transition-colors">Bookings</a>
          <a href="#" className="text-[15px] font-[500] text-[#999] hover:text-black transition-colors">About Us</a>
          <a href="#" className="text-[15px] font-[500] text-[#999] hover:text-black transition-colors">Contact</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="relative w-[48px] h-[48px] border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Bell size={24} className="text-[#333]" />
            <span className="absolute top-[10px] right-[10px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="flex items-center gap-3 pl-1 pr-6 py-1 bg-white border border-gray-200 rounded-full hover:shadow-sm transition-all group">
            <div className="w-[44px] h-[44px] bg-black text-white rounded-full flex items-center justify-center">
              <User size={24} fill="white" />
            </div>
            <span className="text-[15px] font-[600] text-[#333]">Login / Signup</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
