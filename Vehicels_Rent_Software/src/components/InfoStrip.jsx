import React, { useState, useEffect } from 'react';
import './InfoStrip.css';

const InfoStrip = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const API_URL = 'http://localhost:5000'; // Adjust as needed

    useEffect(() => {
        fetch(`${API_URL}/api/admin/vehicles/master`)
            .then(res => res.json())
            .then(data => {
                if (data.vehicles) {
                    setCategories(data.vehicles);
                }
            })
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    return (
        <section className="info-strip-container">
            <div className="info-strip-panel left-panel">
                <div 
                    className={`vehicle-type ${activeCategory === 'All' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('All')}
                >
                    <div className={`icon-wrapper ${activeCategory === 'All' ? 'active' : ''}`}>
                        {/* 3x3 Dot Grid Icon - Enlarged */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="5" r="2.5" />
                            <circle cx="12" cy="5" r="2.5" />
                            <circle cx="19" cy="5" r="2.5" />
                            <circle cx="5" cy="12" r="2.5" />
                            <circle cx="12" cy="12" r="2.5" />
                            <circle cx="19" cy="12" r="2.5" />
                            <circle cx="5" cy="19" r="2.5" />
                            <circle cx="12" cy="19" r="2.5" />
                            <circle cx="19" cy="19" r="2.5" />
                        </svg>
                        
                        {activeCategory === 'All' && (
                            <div className="active-tick-bundle">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        )}
                    </div>
                    <span>All</span>
                </div>

                {categories.map((cat) => (
                    <div 
                        key={cat.id} 
                        className={`vehicle-type ${activeCategory === cat.name ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.name)}
                    >
                        <div className={`icon-wrapper ${activeCategory === cat.name ? 'active' : ''}`}>
                            {cat.image_url ? (
                                <img 
                                    src={`${API_URL}${cat.image_url}`} 
                                    alt={cat.name} 
                                    className={`category-icon ${activeCategory === cat.name ? 'active' : ''}`}
                                />
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3" />
                                </svg>
                            )}
                            {activeCategory === cat.name && (
                                <div className="active-tick-bundle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span>{cat.name}</span>
                    </div>
                ))}
            </div>

            <div className="info-strip-panel right-panel">
                <div className="feature-item">
                    <div className="feature-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <h4>Best Price</h4>
                        <p>Get the best prices</p>
                    </div>
                </div>
                <div className="feature-divider"></div>
                <div className="feature-item">
                    <div className="feature-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <polyline points="9 12 11 14 15 10"></polyline>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <h4>Trusted Service</h4>
                        <p>Safe and reliable rides</p>
                    </div>
                </div>
                <div className="feature-divider"></div>
                <div className="feature-item">
                    <div className="feature-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <h4>24/7 Support</h4>
                        <p>We are here to help you</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoStrip;
