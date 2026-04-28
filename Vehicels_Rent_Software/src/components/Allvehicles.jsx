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

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleVehicleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const handleCloseModal = () => {
        setSelectedVehicle(null);
    };

    useEffect(() => {
        if (selectedVehicle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedVehicle]);

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
                            <div 
                                key={v.id} 
                                onClick={() => handleVehicleClick(v)}
                                className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 p-3 xl:p-4 flex flex-row gap-3 xl:gap-4 h-[150px] xl:h-[170px] group cursor-pointer"
                            >
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

            {/* Vehicle Details Modal */}
            {selectedVehicle && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-10 pt-10 md:pt-20 overflow-y-auto custom-scrollbar">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
                        onClick={handleCloseModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-5xl bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-fit animate-in fade-in zoom-in duration-300 border border-gray-100">
                        
                        {/* Left Side: Vehicle Info & Features */}
                        <div className="w-full md:w-[55%] p-8 flex flex-col border-r border-gray-100">
                            {/* Type Badge */}
                            <div className="mb-4">
                                <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-sm font-medium border border-gray-100">
                                    {selectedVehicle.type}
                                </span>
                            </div>

                            {/* Title & Rating */}
                            <div className="mb-8">
                                <h2 className="text-[40px] font-bold text-black leading-tight mb-2">
                                    {selectedVehicle.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                        <span className="text-sm font-bold text-black">4.6</span>
                                        <svg className="w-3.5 h-3.5 text-black fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-400 text-sm">(120+ reviews)</span>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 flex items-center justify-center py-6 mb-8 mt-4">
                                <img 
                                    src={selectedVehicle.image.startsWith('http') ? selectedVehicle.image : `${API_URL}${selectedVehicle.image}`} 
                                    alt={selectedVehicle.name}
                                    className="w-[90%] h-auto object-contain mix-blend-multiply"
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 mb-12">
                                {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                                    selectedVehicle.images.slice(0, 4).map((img, idx) => (
                                        <div key={idx} className={`w-[85px] h-[75px] rounded-xl border p-2 flex items-center justify-center cursor-pointer transition-all ${idx === 0 ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-black'}`}>
                                            <img 
                                                src={img.startsWith('http') ? img : `${API_URL}${img}`} 
                                                className="w-full h-full object-contain mix-blend-multiply" 
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-[85px] h-[75px] rounded-xl border border-black ring-1 ring-black p-2 flex items-center justify-center cursor-pointer">
                                        <img 
                                            src={selectedVehicle.image.startsWith('http') ? selectedVehicle.image : `${API_URL}${selectedVehicle.image}`} 
                                            className="w-full h-full object-contain mix-blend-multiply" 
                                        />
                                    </div>
                                )}
                                <button className="w-[45px] h-[45px] rounded-full border border-gray-200 flex items-center justify-center self-center ml-2 hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Features Row */}
                            <div className="flex items-center justify-between pt-6 mt-auto border-t border-gray-50">
                                <div className="flex flex-col items-center gap-1.5 grayscale opacity-70">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3203/3203925.png" className="w-6 h-6 object-contain" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">{selectedVehicle.fuel_type}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 grayscale opacity-70">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3061/3061993.png" className="w-6 h-6 object-contain" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">{selectedVehicle.transmission_type || 'Manual'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 grayscale opacity-70">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1000/1000305.png" className="w-6 h-6 object-contain" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">{selectedVehicle.seating_capacity} Seats</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 grayscale opacity-70">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2800/2800164.png" className="w-6 h-6 object-contain" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">{selectedVehicle.type}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 grayscale opacity-70">
                                    <img src="https://cdn-icons-png.flaticon.com/512/910/910813.png" className="w-6 h-6 object-contain" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">AC</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 grayscale opacity-70">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1101/1101683.png" className="w-6 h-6 object-contain" />
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">Music System</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Booking & Price */}
                        <div className="w-full md:w-[45%] p-8 bg-[#fafafa]">
                            {/* Close Button Top Right */}
                            <button 
                                onClick={handleCloseModal}
                                className="absolute top-6 right-6 z-10 w-[42px] h-[42px] bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-black transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Price Header */}
                            <div className="mb-6 mt-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[32px] font-bold text-black">₹{selectedVehicle.price_per_day}</span>
                                    <span className="text-gray-400 font-medium font-['Plus_Jakarta_Sans']">/Day</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-gray-300 line-through font-medium">₹{Math.round(selectedVehicle.price_per_day * 1.33)}</span>
                                    <span className="text-[#34a853] text-sm font-bold">25% OFF</span>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white border border-gray-100 rounded-[20px] p-5 mb-4 shadow-sm">
                                <h4 className="text-[13px] font-bold text-black mb-3">Pick-up & Drop-off Location</h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-1">
                                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                        </div>
                                        <p className="text-[13px] font-medium text-gray-500 leading-relaxed pr-4">
                                            {selectedVehicle.pickup_location}
                                        </p>
                                    </div>
                                    <button className="text-xs font-bold text-black border-b border-black h-fit">Edit</button>
                                </div>
                            </div>

                            {/* Date Card */}
                            <div className="bg-white border border-gray-100 rounded-[20px] p-5 mb-4 shadow-sm">
                                <h4 className="text-[13px] font-bold text-black mb-4">Select Dates</h4>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pick-up Date</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-black">24 May 2024</span>
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Drop-off Date</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-black">26 May 2024</span>
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[13px] font-medium text-gray-500">Duration: <span className="text-black font-bold">2 Days</span></p>
                            </div>

                            {/* Price Summary Card */}
                            <div className="bg-white border border-gray-100 rounded-[20px] p-5 mb-4 shadow-sm">
                                <h4 className="text-[13px] font-bold text-black mb-4">Price Details</h4>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-gray-500 font-medium">₹{selectedVehicle.price_per_day} x 2 Days</span>
                                        <span className="text-black font-bold">₹{selectedVehicle.price_per_day * 2}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-[#34a853] font-medium">Discount (25%)</span>
                                        <span className="text-[#34a853] font-bold">- ₹{Math.round(selectedVehicle.price_per_day * 2 * 0.25)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-[15px] font-bold text-black">Total Amount</span>
                                    <span className="text-[18px] font-bold text-black">₹{Math.round(selectedVehicle.price_per_day * 2 * 0.75)}</span>
                                </div>
                            </div>

                            {/* Perks Card */}
                            <div className="bg-white border border-gray-100 rounded-[20px] p-5 mb-8 shadow-sm flex justify-between">
                                <div className="flex flex-col items-center gap-1.5 text-center">
                                    <div className="p-1.5 bg-gray-50 rounded-full border border-gray-100">
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <p className="text-[9px] font-bold text-black leading-tight">Free<br/>Cancellation</p>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 text-center">
                                    <div className="p-1.5 bg-gray-50 rounded-full border border-gray-100">
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-[9px] font-bold text-black leading-tight">No Hidden<br/>Charges</p>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 text-center">
                                    <div className="p-1.5 bg-gray-50 rounded-full border border-gray-100">
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <p className="text-[9px] font-bold text-black leading-tight">24/7<br/>Support</p>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-4">
                                <button className="flex-1 py-4.5 border border-gray-200 rounded-[15px] font-bold text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Save for Later
                                </button>
                                <a 
                                    href={`tel:${selectedVehicle.mobile_number}`}
                                    className="flex-[1.5] py-4.5 bg-black rounded-[15px] font-bold text-white hover:bg-[#222] transition-all flex flex-col items-center justify-center relative overflow-hidden group"
                                    onClick={async () => {
                                        try {
                                            await fetch(`${API_URL}/api/vehicles/log-call`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ 
                                                    userId: localStorage.getItem('userId'),
                                                    vehicleId: selectedVehicle.id 
                                                })
                                            });
                                        } catch(err) { console.error(err); }
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Book Now</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M3 12h18" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">₹{Math.round(selectedVehicle.price_per_day * 2 * 0.75)} for 2 days</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Allvehicles;
