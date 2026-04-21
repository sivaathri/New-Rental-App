import React from 'react';
import { Bell, User, Car } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-[100px] px-10">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] bg-black rounded-full flex items-center justify-center shadow-lg">
            <Car size={26} className="text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-extrabold tracking-tight leading-[0.8] mb-1">Quick</span>
            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gray-400 leading-none">Services</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="relative flex flex-col items-center">
            <a href="#" className="text-[16px] font-bold text-black group transition-all">Home</a>
            <div className="absolute -bottom-[38px] w-full h-[2.5px] bg-black"></div>
          </div>
          <a href="#" className="text-[16px] font-medium text-gray-400 hover:text-black transition-colors">Vehicles</a>
          <a href="#" className="text-[16px] font-medium text-gray-400 hover:text-black transition-colors">Bookings</a>
          <a href="#" className="text-[16px] font-medium text-gray-400 hover:text-black transition-colors">About Us</a>
          <a href="#" className="text-[16px] font-medium text-gray-400 hover:text-black transition-colors">Contact</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="relative w-[52px] h-[52px] border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <Bell size={24} className="text-black" />
            <span className="absolute top-[12px] right-[12px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="flex items-center gap-3 pl-1.5 pr-8 py-1.5 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all group">
            <div className="w-[45px] h-[45px] bg-black text-white rounded-full flex items-center justify-center">
              <User size={24} fill="white" />
            </div>
            <span className="text-[16px] font-bold text-black">Login / Signup</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
