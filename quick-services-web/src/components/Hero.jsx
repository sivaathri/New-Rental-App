import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import bgImage from '../assets/bg.png';

const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center pt-[100px] overflow-hidden bg-white">
      {/* Background Image - Only showing on the right half */}
      <div 
        className="absolute inset-y-0 right-0 w-1/2 z-0 bg-contain bg-right bg-no-repeat opacity-100 pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="flex-1 space-y-12 py-20">
            <div className="space-y-6">
              <h1 className="text-[100px] lg:text-[100px] font-[600] tracking-[0.02em] leading-[1.1] text-black uppercase">
                Drive Ride<br />
                Explore
              </h1>
              <p className="text-[22px] font-medium text-gray-400 max-w-sm leading-relaxed">
                Find the perfect vehicle for your journey, anytime, anywhere.
              </p>
            </div>

            {/* Search Section */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-[450px] flex items-center bg-white border border-gray-100 rounded-full h-[80px] px-8 shadow-premium">
                <Search size={28} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search your dream car..."
                  className="w-full bg-transparent px-5 text-[20px] font-semibold text-black outline-none placeholder:text-gray-200"
                />
              </div>
              <button className="w-[80px] h-[80px] bg-black text-white flex items-center justify-center rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                <SlidersHorizontal size={32} />
              </button>
            </div>
          </div>

          {/* Right side spacer */}
          <div className="flex-1 lg:block hidden" />

        </div>
      </div>
    </section>
  );
};

export default Hero;
