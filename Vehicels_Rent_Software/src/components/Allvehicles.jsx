import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';

const Allvehicles = ({ searchQuery, activeCategory, filters }) => {
    const [vehicles, setVehicles] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = API_BASE_URL;

    const fetchFavorites = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_URL}/api/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setUserFavorites(result.data.map(f => f.id));
            }
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${API_URL}/api/vehicles/public/approved`);
                const result = await response.json();
                if (result.success) {
                    setVehicles(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
        fetchFavorites();
    }, []);

    const handleToggleFavorite = async (e, vehicleId) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to add to favorites");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/favorites/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vehicleId })
            });
            const result = await response.json();
            if (result.success) {
                if (result.isFavorite) {
                    setUserFavorites(prev => [...prev, vehicleId]);
                } else {
                    setUserFavorites(prev => prev.filter(id => id !== vehicleId));
                }
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    const filteredVehicles = vehicles
        .filter(v => {
            // Search Query Filter
            const matchesSearch = !searchQuery || 
                                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (v.pickup_location && v.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Category Filter (from top bar)
            const vehicleType = (v.type || "").trim().toLowerCase();
            const categoryType = (activeCategory || "").trim().toLowerCase();
            const matchesCategory = categoryType === 'all' || vehicleType === categoryType;

            // Advanced Filters (from drawer)
            const matchesDrawerType = filters.type === 'All' || vehicleType === filters.type.toLowerCase();
            
            const matchesLocation = !filters.location || 
                                    (v.pickup_location && v.pickup_location.toLowerCase().includes(filters.location.toLowerCase()));
            
            const price = parseInt(v.price_per_day, 10);
            const matchesPrice = price >= filters.minPrice && (filters.maxPrice === '5000+' ? true : price <= parseInt(filters.maxPrice, 10));
            
            const matchesFuel = filters.fuelType === 'All' || 
                                (v.fuel_type && v.fuel_type.toLowerCase() === filters.fuelType.toLowerCase());
            
            const matchesTransmission = filters.transmission === 'All' || 
                                        (v.transmission && v.transmission.toLowerCase() === filters.transmission.toLowerCase());
            
            const vSeats = parseInt(v.seating_capacity, 10) || 4;
            let matchesSeats = true;
            if (filters.seats !== 'All') {
                if (filters.seats === '7+') {
                    matchesSeats = vSeats >= 7;
                } else {
                    matchesSeats = vSeats === parseInt(filters.seats, 10);
                }
            }

            return matchesSearch && matchesCategory && matchesDrawerType && matchesLocation && matchesPrice && matchesFuel && matchesTransmission && matchesSeats;
        })
        .sort((a, b) => {
            if (filters.sortBy === 'Price: Low to High') {
                return parseInt(a.price_per_day, 10) - parseInt(b.price_per_day, 10);
            }
            if (filters.sortBy === 'Price: High to Low') {
                return parseInt(b.price_per_day, 10) - parseInt(a.price_per_day, 10);
            }
            return 0; // Recommended / Default
        });

    useEffect(() => {
        console.log("Filters Applied:", filters);
        console.log("Filtered List Size:", filteredVehicles.length);
    }, [filters, activeCategory, searchQuery, vehicles]);

    if (loading) return (
        <div className="max-w-[1240px] mx-auto px-6 py-20 text-center text-gray-500 font-medium">
            Loading vehicles...
        </div>
    );

    return (
        <section className="w-full px-4 sm:px-8 py-12 font-['Plus_Jakarta_Sans']">
            <div className="bg-white rounded-[32px] p-10 border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-[32px] font-[800] text-black tracking-tight">{activeCategory} Vehicles</h2>
                </div>

                {/* Main Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                    {filteredVehicles.length === 0 ? (
                        <p className="text-gray-400 text-center py-10 col-span-full">No vehicles found matching your criteria.</p>
                    ) : (
                        filteredVehicles.map((v) => (
                            <div key={v.id} className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-3 xl:p-4 flex flex-row gap-3 xl:gap-4 h-[150px] xl:h-[170px] group cursor-pointer">
                                {/* Left side: Vehicle Image */}
                                <div className="w-[110px] xl:w-[130px] h-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={v.image.startsWith('http') ? v.image : `${API_URL}${v.image}`} 
                                        alt={v.name} 
                                        className="w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Right side: Vehicle Details */}
                                <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                                    {/* Title & Favorite */}
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-[16px] xl:text-[18px] font-extrabold text-[#111] uppercase tracking-tight truncate pr-2">
                                            {v.name}
                                        </h3>
                                        <button 
                                            className={`${userFavorites.includes(v.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors flex-shrink-0 mt-0.5`}
                                            onClick={(e) => handleToggleFavorite(e, v.id)}
                                        >
                                            <svg 
                                                className="w-5 h-5 xl:w-[22px] xl:h-[22px]" 
                                                viewBox="0 0 24 24" 
                                                fill={userFavorites.includes(v.id) ? "currentColor" : "none"} 
                                                stroke="currentColor" 
                                                strokeWidth="1.5" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {/* Location */}
                                    <div className="flex items-start gap-1.5 text-[#888] mt-1 mb-auto">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] xl:w-4 xl:h-4 mt-[3px] flex-shrink-0">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <p className="text-[12px] xl:text-[13px] leading-[1.4] font-medium line-clamp-2">
                                            {v.pickup_location || 'Not specified'}
                                        </p>
                                    </div>

                                    {/* Specs & Price Row */}
                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex items-center gap-2 xl:gap-3 text-[#888] pb-[2px]">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-[13px] h-[13px] xl:w-[15px] xl:h-[15px] opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19.77,7.23,17,4.46V3a1,1,0,0,0-1-1H4A1,1,0,0,0,3,3V19a3,3,0,0,0,3,3H15a3,3,0,0,0,3-3V11.41l2.77-2.77a1,1,0,0,0,0-1.41ZM7,20a1,1,0,1,1,1-1A1,1,0,0,1,7,20Zm7-1a1,1,0,0,1-1,1H9V18h4a1,1,0,0,1,1,1ZM15,16H6V4h9Zm2-4.59L15.59,10,16.29,9.29l1.41,1.41a1,1,0,0,0,1.41,0l.71-.71,1,1Z" />
                                                </svg>
                                                <span className="text-[11px] xl:text-[12px] font-semibold">{v.fuel_type || 'Petrol'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-[13px] h-[13px] xl:w-[15px] xl:h-[15px] opacity-80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                    <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                                                    <path d="M3 20h18" />
                                                    <path d="M5 20v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                                                    <path d="M8 14V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
                                                </svg>
                                                <span className="text-[11px] xl:text-[12px] font-semibold">{v.seating_capacity || 4} Seats</span>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-[2px]">
                                            <span className="text-[17px] xl:text-[20px] font-extrabold text-[#111]">₹{parseInt(v.price_per_day, 10)}</span>
                                            <span className="text-[11px] xl:text-[12px] text-[#888] font-semibold">/Day</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Allvehicles;
