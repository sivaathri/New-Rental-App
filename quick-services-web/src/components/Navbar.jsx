import React from 'react';
import { Bell, User, Car } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-[100px] px-10">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] bg-black rounded-full flex items-center justify-center shadow-lg">
            <Car size={28} className="text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[30px] font-[900] tracking-tighter leading-[0.8] mb-1 uppercase">Quick</span>
            <span className="text-[11px] uppercase font-[700] tracking-[0.5em] text-gray-400 leading-none">Services</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-14">
          <div className="relative flex flex-col items-center">
            <a href="#" className="text-[17px] font-[800] text-black">Home</a>
            <div className="absolute -bottom-[38px] w-full h-[3px] bg-black rounded-full"></div>
          </div>
          <a href="#" className="text-[17px] font-[600] text-gray-400 hover:text-black transition-all">Vehicles</a>
          <a href="#" className="text-[17px] font-[600] text-gray-400 hover:text-black transition-all">Bookings</a>
          <a href="#" className="text-[17px] font-[600] text-gray-400 hover:text-black transition-all">About Us</a>
          <a href="#" className="text-[17px] font-[600] text-gray-400 hover:text-black transition-all">Contact</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-8">
          <button className="relative w-[56px] h-[56px] bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
            <Bell size={26} className="text-black" strokeWidth={2.5} />
            <span className="absolute top-[14px] right-[14px] w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="flex items-center gap-4 pl-1.5 pr-10 py-2 bg-white border border-gray-200 rounded-full hover:shadow-xl transition-all group">
            <div className="w-[48px] h-[48px] bg-black text-white rounded-full flex items-center justify-center shadow-lg">
              <User size={26} fill="white" />
            </div>
            <span className="text-[17px] font-[800] text-black">Login / Signup</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
