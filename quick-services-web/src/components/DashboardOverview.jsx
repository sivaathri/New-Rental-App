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
    <div className="container mb-24 flex flex-col xl:flex-row gap-10">
      <div className="flex-[1.3] bg-white border border-gray-100 rounded-[3rem] p-12 shadow-card flex items-center justify-between">
        {categories.map((cat) => (
          <button key={cat.id} className="flex flex-col items-center gap-6 group">
            <div className="relative">
              <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center transition-all duration-500 border ${
                cat.active 
                ? 'bg-black border-black text-white shadow-[0_25px_50px_rgba(0,0,0,0.25)] scale-110' 
                : 'bg-white border-gray-100 text-gray-200 group-hover:border-black group-hover:text-black'
              }`}>
                <cat.icon size={36} strokeWidth={3} />
              </div>
              {cat.active && (
                <div className="absolute -top-1 -right-1 w-9 h-9 bg-black border-4 border-white rounded-full flex items-center justify-center shadow-2xl">
                  <Check size={18} className="text-white" strokeWidth={5} />
                </div>
              )}
            </div>
            <span className={`text-[15px] font-[900] uppercase tracking-[0.1em] ${
              cat.active ? 'text-black' : 'text-[#ccc] transition-colors group-hover:text-black'
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-[3rem] p-12 shadow-card flex items-center justify-between">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-center gap-6">
            <div className="w-[72px] h-[72px] bg-[#FBFBFB] rounded-full flex items-center justify-center text-black border border-gray-50 group-hover:bg-black group-hover:text-white transition-all">
              <feature.icon size={32} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[19px] font-[900] text-black tracking-tighter leading-tight">{feature.title}</span>
              <span className="text-[15px] text-[#999] font-[600] tracking-tight">{feature.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
