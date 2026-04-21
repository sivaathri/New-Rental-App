import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-[180px] pb-32 overflow-hidden bg-white">
      {/* Background Cityscape - Very subtle line art style */}
      <div className="absolute top-[280px] inset-x-0 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full fill-current text-gray-400">
          <path d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,181.3C960,213,1056,267,1152,266.7C1248,267,1344,213,1392,186.7L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-10 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <h1 className="text-[96px] font-[800] tracking-tight leading-[1] text-black">
              Drive. Ride.<br />
              Explore.
            </h1>
            <p className="text-[20px] font-[400] text-[#999] max-w-sm leading-relaxed">
              Find the perfect vehicle for your journey, anytime, anywhere.
            </p>
          </div>

          <div className="max-w-xl">
            <div className="bg-white border border-gray-100 rounded-full p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center group">
              <Search size={24} className="ml-5 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search your dream car..."
                className="w-full bg-transparent px-5 py-4 text-[18px] font-[500] text-[#333] outline-none placeholder:text-gray-300"
              />
              <button className="w-[56px] h-[56px] bg-black text-white flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                <SlidersHorizontal size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Vehicle Visuals */}
        <div className="flex-1 relative w-full h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* White Car */}
            <motion.img 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              src="/assets/car-white.png" 
              className="w-[85%] z-10 drop-shadow-[0_20px_60px_rgba(0,0,0,0.1)] translate-x-12"
            />
            {/* White Scooter */}
            <motion.img 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              src="/assets/scooter-white.png" 
              className="absolute left-0 bottom-[10%] w-[55%] z-20 drop-shadow-[0_20px_60px_rgba(0,0,0,0.1)] -translate-x-12 translate-y-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
