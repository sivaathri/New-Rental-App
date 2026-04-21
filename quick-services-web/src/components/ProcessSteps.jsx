import React from 'react';
import { Search, CalendarDays, Bike, ShieldCheck } from 'lucide-react';

const steps = [
  { title: 'Search Vehicle', desc: 'Choose your favorite vehicle', icon: Search },
  { title: 'Book & Pay', desc: 'Select date, book & make payment', icon: CalendarDays },
  { title: 'Enjoy Ride', desc: 'Pick up the vehicle and enjoy your ride', icon: Bike },
  { title: 'Return & Relax', desc: 'Return the vehicle and relax', icon: ShieldCheck },
];

const ProcessSteps = () => {
  return (
    <footer className="bg-[#FBFBFB] border-t border-gray-100 pt-20 pb-32">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative overflow-hidden">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-6 group">
              <div className="relative">
                <div className="w-[64px] h-[64px] bg-[#FBFBFB] rounded-full flex items-center justify-center border border-gray-50 group-hover:bg-black group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <step.icon size={26} />
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[25%] -right-8 w-[1px] h-[32px] bg-gray-100"></div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[16px] font-[800] uppercase tracking-wide text-black leading-none">{step.title}</h4>
                <p className="text-[13px] text-gray-400 font-[500] leading-snug max-w-[140px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-[800] uppercase tracking-[0.4em] text-gray-300">
          <p>© 2026 Quick Services. All rights reserved.</p>
          <div className="flex gap-16">
            <a href="#" className="hover:text-black transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProcessSteps;
