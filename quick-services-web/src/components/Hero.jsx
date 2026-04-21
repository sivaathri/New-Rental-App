import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#FBFBFB]">
      {/* Background Cityscape Pattern (Simplified SVG) */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-[0.03] flex items-end justify-center">
        <svg width="1400" height="400" viewBox="0 0 1400 400" fill="currentColor">
          <rect x="100" y="200" width="80" height="200" />
          <rect x="200" y="150" width="100" height="250" />
          <rect x="320" y="250" width="60" height="150" />
          <rect x="400" y="100" width="120" height="300" />
          <rect x="550" y="220" width="90" height="180" />
          <rect x="660" y="180" width="80" height="220" />
          <rect x="760" y="120" width="110" height="280" />
          <rect x="890" y="240" width="70" height="160" />
          <rect x="980" y="160" width="130" height="240" />
          <rect x="1150" y="210" width="90" height="190" />
        </svg>
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Drive. Ride. <br />
              <span className="text-gray-900/40">Explore.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-md font-medium leading-relaxed">
              Find the perfect vehicle for your journey, anytime, anywhere.
            </p>
          </div>

          <div className="relative max-w-lg group">
            <div className="flex items-center bg-white rounded-full p-2 shadow-premium border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-black/5">
              <div className="pl-4 text-gray-400">
                <Search size={24} />
              </div>
              <input 
                type="text" 
                placeholder="Search your dream car..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-lg font-medium"
              />
              <button className="bg-black text-white p-4 rounded-full transition-transform hover:scale-105 active:scale-95">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Images */}
        <div className="relative h-[400px] lg:h-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center"
          >
            {/* White Car */}
            <motion.img 
              src="/assets/car-white.png" 
              alt="White Car" 
              className="w-[70%] lg:w-[80%] drop-shadow-2xl z-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => {
                e.target.src = 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/og.png'; // Fallback
              }}
            />
            
            {/* White Scooter */}
            <motion.img 
              src="/assets/scooter-white.png" 
              alt="White Scooter" 
              className="absolute -right-4 bottom-10 w-[40%] lg:w-[50%] drop-shadow-xl z-30"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
