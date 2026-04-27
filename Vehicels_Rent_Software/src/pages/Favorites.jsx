import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.success) {
                    setFavorites(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleToggleFavorite = async (vehicleId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/favorites/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vehicleId })
            });
            const result = await response.json();
            if (result.success && !result.isFavorite) {
                setFavorites(prev => prev.filter(v => v.id !== vehicleId));
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    if (loading) return (
        <div className="pt-40 flex items-center justify-center font-['Plus_Jakarta_Sans']">
            <div className="text-[18px] font-bold text-gray-400 animate-pulse">Loading favorites...</div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 px-8 font-['Plus_Jakarta_Sans'] bg-gray-50 min-h-screen">
            <div className="max-w-[1240px] mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-[36px] font-[800] text-black tracking-tight leading-tight">Your Favourites</h1>
                    <p className="text-gray-500 font-medium mt-1">Vehicles you've saved for later</p>
                </div>

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm max-w-[800px] mx-auto">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-12 h-12 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <h2 className="text-[24px] font-extrabold text-black mb-3">Your list is empty</h2>
                        <p className="text-gray-400 font-medium mb-10 max-w-[400px] mx-auto">Click the heart icon on any vehicle card to save it here for quick access.</p>
                        <a href="/" className="px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-all inline-block shadow-lg shadow-black/10">Browse Vehicles</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((v) => (
                            <div key={v.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 p-6 flex flex-col group relative overflow-hidden">
                                {/* Badge */}
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
                                        {v.type}
                                    </span>
                                </div>

                                {/* Favorite Toggle */}
                                <button 
                                    className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-md hover:scale-110 transition-all border border-white/50"
                                    onClick={() => handleToggleFavorite(v.id)}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>

                                {/* Image */}
                                <div className="h-[180px] w-full flex items-center justify-center p-4 mb-4 relative">
                                    <div className="absolute inset-0 bg-gray-50 rounded-[24px] scale-95 opacity-50"></div>
                                    <img 
                                        src={v.image.startsWith('http') ? v.image : `${API_BASE_URL}${v.image}`} 
                                        alt={v.name} 
                                        className="max-w-full max-h-full object-contain relative z-1 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-[20px] font-[800] text-black mb-2 uppercase tracking-tight truncate">{v.name}</h3>
                                    <div className="flex items-center gap-4 text-gray-400 text-[14px] font-bold uppercase tracking-wider mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                            {v.fuel_type}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                            {v.transmission_type}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Price / Day</span>
                                        <span className="text-[22px] font-[900] text-black">₹{parseInt(v.price_per_day)}</span>
                                    </div>
                                    <button className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-[14px] shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">Rent Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
