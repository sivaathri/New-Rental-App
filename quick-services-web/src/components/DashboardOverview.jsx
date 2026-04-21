import React from 'react';
import { LayoutGrid, Bike, Car, Bus, Truck, ShieldCheck, Banknote, Headset } from 'lucide-react';

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
    <div className="container py-12 grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Categories */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-white flex flex-wrap items-center justify-between gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex flex-col items-center gap-3 group px-4 py-2 transition-all"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              cat.active 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-black'
            }`}>
              <cat.icon size={28} />
              {cat.active && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-black rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              cat.active ? 'text-black' : 'text-gray-400'
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Features */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-white flex items-center justify-between gap-8 overflow-x-auto">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-center gap-4 min-w-fit">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black">
              <feature.icon size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black">{feature.title}</span>
              <span className="text-[11px] text-gray-400 font-medium">{feature.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
