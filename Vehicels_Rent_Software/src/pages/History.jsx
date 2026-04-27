import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/profile/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.history) {
                    setHistory(result.history);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="pt-40 flex items-center justify-center font-['Plus_Jakarta_Sans']">
            <div className="text-[18px] font-bold text-gray-400 animate-pulse">Loading history...</div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 px-8 font-['Plus_Jakarta_Sans'] bg-gray-50 min-h-screen">
            <div className="max-w-[1000px] mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-[32px] font-[800] text-black tracking-tight">Your Activity History</h1>
                        <p className="text-gray-500 font-medium mt-1">Track vehicles you've contacted or viewed</p>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-20 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <h2 className="text-[20px] font-extrabold text-black mb-2">No activity yet</h2>
                        <p className="text-gray-400 font-medium">Vehicles you contact for booking will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-6 group cursor-default"
                            >
                                {/* Vehicle Image */}
                                <div className="w-24 h-24 bg-gray-50 rounded-[18px] overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-50">
                                    {item.image ? (
                                        <img 
                                            src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`} 
                                            alt={item.vehicle_name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                                                {item.vehicle_type}
                                            </span>
                                            <span className="text-[12px] font-bold text-gray-400">
                                                {formatDate(item.created_at)}
                                            </span>
                                        </div>
                                        <h3 className="text-[18px] font-extrabold text-black leading-tight group-hover:text-black transition-colors">
                                            {item.vehicle_name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5 text-gray-500 text-[13px] font-medium">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                {item.pickup_location}
                                            </div>
                                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                            <div>₹{parseInt(item.price_per_day)}/Day</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-[13px] font-bold border border-green-100 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            Contacted
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
