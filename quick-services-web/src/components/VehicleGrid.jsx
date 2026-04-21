import React from 'react';
import { Heart, MapPin, Fuel, Users, ChevronRight } from 'lucide-react';

export const VehicleCard = ({ name, location, price, image, stats }) => {
  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-card border border-gray-100 flex items-center gap-10 relative group transition-all hover:bg-[#fafafa]">
      <button className="absolute top-8 right-8 z-10 text-gray-300 hover:text-red-500 transition-colors">
        <Heart size={24} strokeWidth={2.5} />
      </button>

      <div className="w-[200px] h-[160px] flex-shrink-0 bg-white rounded-[2rem] p-6 flex items-center justify-center">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
        />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-[900] uppercase tracking-tight text-black">{name}</h3>
          <div className="flex items-start gap-2 text-gray-400">
            <MapPin size={20} className="mt-0.5 flex-shrink-0" />
            <span className="text-[15px] font-[600] leading-tight">{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 text-[#999]">
            <Fuel size={22} strokeWidth={2.5} />
            <span className="text-[14px] font-[800] uppercase tracking-wider">Petrol</span>
          </div>
          {stats.seats && (
            <div className="flex items-center gap-3 text-[#999]">
              <Users size={22} strokeWidth={2.5} />
              <span className="text-[14px] font-[800] uppercase tracking-wider">{stats.seats} Seats</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-[900] text-black">₹{price}</span>
            <span className="text-[14px] font-[800] text-[#ccc] uppercase tracking-[0.2em]">/Day</span>
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
    <section className="container mb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-[65%] space-y-12">
          <h2 className="text-4xl font-[900] tracking-tight text-black">Nearby Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {nearby.map(v => (
              <VehicleCard key={v.id} {...v} />
            ))}
          </div>
        </div>

        <div className="lg:w-[35%] space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-[900] tracking-tight text-black">All Vehicles</h2>
            <button className="flex items-center gap-2 text-[16px] font-[800] text-[#999] hover:text-black transition-all">
              View all <ChevronRight size={22} strokeWidth={3} />
            </button>
          </div>
          <div className="flex flex-col gap-8">
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
