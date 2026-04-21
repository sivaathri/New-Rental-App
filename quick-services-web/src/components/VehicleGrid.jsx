import React from 'react';
import { Heart, MapPin, Fuel, Users, ChevronRight } from 'lucide-react';

export const VehicleCard = ({ name, location, price, image, stats }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-card border border-gray-100 flex items-center gap-8 relative group transition-all hover:bg-[#fafafa]">
      {/* Favorite Button */}
      <button className="absolute top-6 right-6 z-10 text-gray-300 hover:text-red-500 transition-colors">
        <Heart size={20} strokeWidth={2} />
      </button>

      {/* Image Block */}
      <div className="w-[180px] h-[140px] flex-shrink-0 bg-white rounded-3xl p-4 flex items-center justify-center">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Detail Block */}
      <div className="flex-1 space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-[20px] font-[800] uppercase tracking-tight text-black">{name}</h3>
          <div className="flex items-start gap-1.5 text-gray-400">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-[13px] font-[500] leading-tight">{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Fuel size={16} className="text-gray-300" />
            <span className="text-[13px] font-[800] uppercase text-[#999]">Petrol</span>
          </div>
          {stats.seats && (
            <div className="flex items-center gap-2 text-gray-500">
              <Users size={16} className="text-gray-300" />
              <span className="text-[13px] font-[800] uppercase text-[#999]">{stats.seats} Seats</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-[900] text-black">₹{price}</span>
            <span className="text-[12px] font-[700] text-[#ccc] uppercase tracking-widest">/Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleGrid = () => {
  const nearby = [
    { id: 1, name: 'Swift', location: 'Saram, Brindavanam, Oulgar...', price: '1500', image: '/assets/car-white.png', stats: { fuel: 'Petrol' } },
    { id: 2, name: 'Vespa', location: "St Mary's Sacred Heart Hr Sec School...", price: '250', image: '/assets/scooter-white.png', stats: { fuel: 'Petrol' } },
  ];

  const allVehicles = [
    { id: 3, name: 'BMW (2020)', location: 'Kannagi Nagar, Villianur, Villupuram', price: '2500', image: '/assets/car-blue.png', stats: { fuel: 'Petrol', seats: 4 } },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-10 mb-24">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Nearby Vehicles */}
        <div className="lg:w-[65%] space-y-8">
          <h2 className="text-3xl font-[900] tracking-tight text-black">Nearby Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearby.map(v => (
              <VehicleCard key={v.id} {...v} />
            ))}
          </div>
        </div>

        {/* All Vehicles */}
        <div className="lg:w-[35%] space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-[900] tracking-tight text-black">All Vehicles</h2>
            <button className="flex items-center gap-1.5 text-[15px] font-[700] text-[#999] hover:text-black transition-all group">
              View all <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {allVehicles.map(v => (
              <VehicleCard key={v.id} {...v} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleGrid;
