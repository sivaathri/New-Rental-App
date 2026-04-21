import React from 'react';
import { LayoutGrid, Bike, Car, Bus, Truck, ShieldCheck, Banknote, Headset, Check } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: LayoutGrid, active: true },
  { id: 'bike', label: 'Bike', icon: Bike },
  { id: 'car', label: 'Car', icon: Car },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'minivan', label: 'Mini Van', icon: Truck },
];

const features = [
  { title: 'Best Price', desc: 'Get the best prices', icon: Banknote },
  { title: 'Trusted Service', desc: 'Safe and reliable rides', icon: ShieldCheck },
  { title: '24/7 Support', desc: 'We are here to help you', icon: Headset },
];

const DashboardOverview = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-10 mb-20 flex flex-col xl:flex-row gap-8">
      {/* Categories Wrapper */}
      <div className="flex-[1.2] bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-card flex items-center justify-between">
        {categories.map((cat) => (
          <button key={cat.id} className="flex flex-col items-center gap-4 group">
            <div className="relative">
              <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 ${
                cat.active 
                ? 'bg-black text-white shadow-xl scale-110' 
                : 'bg-white border border-gray-100 text-gray-300 group-hover:border-black group-hover:text-black'
              }`}>
                <cat.icon size={28} strokeWidth={cat.active ? 2.5 : 2} />
              </div>
              {cat.active && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                  <Check size={12} className="text-white" strokeWidth={5} />
                </div>
              )}
            </div>
            <span className={`text-[12px] font-[800] tracking-tight ${
              cat.active ? 'text-black font-[900]' : 'text-gray-400 group-hover:text-black transition-colors'
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Features Wrapper */}
      <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-card flex items-center justify-between">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-center gap-5">
            <div className="w-[64px] h-[64px] bg-[#FBFBFB] rounded-2xl flex items-center justify-center text-black border border-gray-50">
              <feature.icon size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-[800] text-black tracking-tight leading-tight">{feature.title}</span>
              <span className="text-[14px] text-gray-400 font-[500] tracking-tight">{feature.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
