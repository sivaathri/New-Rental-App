import React from 'react';
import './Hero.css';
import heroBg from '../assets/3.png';

const Hero = () => {
    return (
        <section className="hero-section" style={{ backgroundImage: `url("${heroBg}")` }}>
            <div className="hero-content">
                <h1 className="hero-title">
                    Drive. Ride.<br />Explore.
                </h1>
                <p className="hero-subtitle">
                    Find the perfect vehicle for your<br />
                    journey, anytime, anywhere.
                </p>
                
                <div className="search-bar-wrapper">
                    <div className="search-bar">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search your dream car..." />
                    </div>
                    <button className="filter-button" aria-label="Filter">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="2" y1="6" x2="22" y2="6" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <line x1="2" y1="18" x2="22" y2="18" />
                            <circle cx="17" cy="6" r="2.5" fill="#141414" stroke="white" strokeWidth="1.5" />
                            <circle cx="9" cy="12" r="2.5" fill="#141414" stroke="white" strokeWidth="1.5" />
                            <circle cx="15" cy="18" r="2.5" fill="#141414" stroke="white" strokeWidth="1.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
