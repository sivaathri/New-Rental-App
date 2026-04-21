import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import bgImage from '../assets/bg.png';

const Hero = () => {
  return (
    <section className="relative min-h-[550px] flex items-center pt-[100px] overflow-hidden bg-white">
      {/* Background Image - Width decreased further to 75% as requested */}
      <div 
        className="absolute inset-0 z-0 bg-[length:65%_auto] bg-[position:right_center] bg-no-repeat opacity-100 pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="container relative z-10 flex flex-col justify-end min-h-[400px] pb-10 items-start">
        
        {/* Search Section */}
        <div className="flex items-center gap-5 w-full max-w-[550px] -ml-30">
          <div className="flex-1 flex items-center bg-white border border-gray-100 rounded-full h-[64px] px-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
            <Search size={28} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search your dream car..."
              className="w-full bg-transparent px-5 text-[20px] text-black outline-none placeholder:text-gray-500"
            />
          </div>
          <button className="w-[54px] h-[54px] bg-black text-white flex items-center justify-center rounded-[2.2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all">
            <SlidersHorizontal size={24} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
