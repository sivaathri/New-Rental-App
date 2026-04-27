import React from 'react';
import './InfoStrip.css';

const InfoStrip = () => {
    return (
        <section className="info-strip-container">
            <div className="info-strip-panel left-panel">
                <div className="vehicle-type active">
                    <div className="icon-wrapper active">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="10" height="7"></rect>
                            <rect x="14" y="3" width="10" height="7"></rect>
                            <rect x="14" y="14" width="10" height="7"></rect>
                            <rect x="3" y="14" width="10" height="7"></rect>
                        </svg>
                        <div className="active-tick">
                            <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <span>All</span>
                </div>
                <div className="vehicle-type">
                    <div className="icon-wrapper">
                        {/* Bike SVG placeholder */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="5.5" cy="17.5" r="3.5" />
                            <circle cx="18.5" cy="17.5" r="3.5" />
                            <path d="M15 6a1 1 0 100-2 1 1 0 000 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                        </svg>
                    </div>
                    <span>Bike</span>
                </div>
                <div className="vehicle-type">
                    <div className="icon-wrapper">
                        {/* Car SVG placeholder */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m-7 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0" />
                        </svg>
                    </div>
                    <span>Car</span>
                </div>
                <div className="vehicle-type">
                    <div className="icon-wrapper">
                        {/* Bus SVG placeholder */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M2 17h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
                            <path d="M6 21v2M18 21v2" />
                            <circle cx="7" cy="17" r="1" />
                            <circle cx="17" cy="17" r="1" />
                            <path d="M2 11h20" />
                        </svg>
                    </div>
                    <span>Bus</span>
                </div>
                <div className="vehicle-type">
                    <div className="icon-wrapper">
                        {/* Minivan SVG placeholder */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 18H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2m14 6h2a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-6.5l-3.5-4H7a2 2 0 0 0-2 2v6m14 3a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-7 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0" />
                        </svg>
                    </div>
                    <span>Mini Van</span>
                </div>
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
