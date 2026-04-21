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
    <footer className="bg-[#FBFBFB] border-t border-gray-100 pt-24 pb-40">
      <div className="container">
        <div className="bg-white border border-gray-100 rounded-[4rem] p-16 shadow-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative overflow-hidden">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-8 group">
              <div className="relative">
                <div className="w-[84px] h-[84px] bg-[#FBFBFB] rounded-full flex items-center justify-center border border-gray-50 group-hover:bg-black group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <step.icon size={36} strokeWidth={2.5} />
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[25%] -right-8 w-[1px] h-[40px] bg-gray-100"></div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[19px] font-[900] uppercase tracking-wide text-black leading-none">{step.title}</h4>
                <p className="text-[15px] text-[#999] font-[600] leading-snug max-w-[160px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-32 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] font-[900] uppercase tracking-[0.6em] text-[#ccc]">
          <p>© 2026 Quick Services. All rights reserved.</p>
          <div className="flex gap-20">
            <a href="#" className="hover:text-black transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-all">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProcessSteps;
