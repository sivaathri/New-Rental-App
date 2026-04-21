import React from 'react';
import { Heart, MapPin, Fuel, Users, ChevronRight } from 'lucide-react';

export const VehicleCard = ({ name, location, price, image, type, stats, horizontal = false }) => {
  return (
    <div className={`bg-white rounded-[2rem] p-6 shadow-card border border-white group transition-all hover:shadow-2xl ${
      horizontal ? 'flex items-center gap-6' : 'flex flex-col gap-4'
    }`}>
      <div className={`relative ${horizontal ? 'w-1/2' : 'w-full'} aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center p-4`}>
        <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-bold uppercase tracking-tight">{name}</h3>
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin size={14} />
              <span className="text-[11px] font-medium leading-tight">{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Fuel size={14} />
            <span className="text-[11px] font-bold">{stats.fuel || 'Petrol'}</span>
          </div>
          {stats.seats && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Users size={14} />
              <span className="text-[11px] font-bold">{stats.seats} Seats</span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-black">₹{price}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/Day</span>
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
    <section className="container py-8 space-y-12 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Nearby Vehicles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">Nearby Vehicles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearby.map(v => (
              <VehicleCard key={v.id} {...v} />
            ))}
          </div>
        </div>

        {/* All Vehicles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">All Vehicles</h2>
            <button className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-black transition-colors">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {allVehicles.map(v => (
              <VehicleCard key={v.id} {...v} horizontal={true} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleGrid;
