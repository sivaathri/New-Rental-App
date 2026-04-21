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
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-6 group">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:scale-110">
                  <step.icon size={28} />
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-px h-12 bg-gray-100 -translate-y-1/2"></div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-black uppercase tracking-wider">{step.title}</h4>
                <p className="text-[11px] text-gray-400 font-bold leading-tight max-w-[120px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
          <p>© 2026 Quick Services. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProcessSteps;
