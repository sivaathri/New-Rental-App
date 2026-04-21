import React from 'react';
import { Bell, User, Car } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 rounded-xl">
            <Car size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight">Quick</span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">Services</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Vehicles', 'Bookings', 'About Us', 'Contact'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-semibold transition-colors ${
                link === 'Home' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="flex items-center gap-3 pl-4 pr-1 py-1 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all group">
            <span className="text-sm font-semibold text-gray-700">Login / Signup</span>
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <User size={20} />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
