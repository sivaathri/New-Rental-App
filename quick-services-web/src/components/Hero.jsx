import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-[180px] pb-40 overflow-hidden bg-white">
      {/* Background Cityscape - Matching the silver/gray line art */}
      <div className="absolute top-[200px] inset-x-0 w-full opacity-10 pointer-events-none flex justify-center">
        <svg width="1600" height="400" viewBox="0 0 1600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 380 L100 380 L100 280 L180 280 L180 380 L250 380 L250 320 L320 320 L320 380 L400 380 L400 150 L500 150 L500 380 L600 380 L600 250 L680 250 L680 380 L760 380 L760 180 L860 180 L860 380 L940 380 L940 300 L1020 300 L1020 380 L1100 380 L1100 220 L1200 220 L1200 380 L1300 380 L1300 270 L1380 270 L1380 380 L1600 380" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M0 395 C400 395, 800 350, 1600 395" stroke="#F3F4F6" strokeWidth="2" />
          <path d="M0 410 C400 410, 800 365, 1600 410" stroke="#F9FAFB" strokeWidth="4" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          
          {/* Left Content */}
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <h1 className="text-[100px] font-black tracking-tight leading-[1] text-black">
                Drive. Ride.<br />
                Explore.
              </h1>
              <p className="text-[22px] font-medium text-gray-400 max-w-sm leading-relaxed antialiased">
                Find the perfect vehicle for your journey, anytime, anywhere.
              </p>
            </div>

            {/* Search Section - Exactly matching the capsule + separate circle */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-[450px] flex items-center bg-white border border-gray-100 rounded-full h-[80px] px-8 shadow-[0_15px_45px_rgba(0,0,0,0.03)] border-white/50 ring-1 ring-gray-100/50">
                <Search size={28} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search your dream car..."
                  className="w-full bg-transparent px-5 text-[20px] font-medium text-[#333] outline-none placeholder:text-gray-300"
                />
              </div>
              <button className="w-[80px] h-[80px] bg-black text-white flex items-center justify-center rounded-3xl shadow-xl hover:scale-105 transition-all">
                <SlidersHorizontal size={28} />
              </button>
            </div>
          </div>

          {/* Right Content - Visuals */}
          <div className="flex-1 relative w-full h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* White Swift Car */}
              <motion.img 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                src="/assets/car-white.png" 
                className="w-[85%] z-20 drop-shadow-[0_40px_60px_rgba(0,0,0,0.12)] translate-x-12"
              />
              {/* White Scooter */}
              <motion.img 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                src="/assets/scooter-white.png" 
                className="absolute left-[5%] bottom-0 w-[55%] z-30 drop-shadow-[0_40px_60px_rgba(0,0,0,0.08)] translate-y-12"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
