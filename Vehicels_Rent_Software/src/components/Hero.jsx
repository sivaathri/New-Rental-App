import React from 'react';
import './Hero.css';
import heroBg from '../assets/19187-Picsart-AiImageEnhancer(1).png';

const Hero = () => {
    return (
        <section className="hero-section" style={{ backgroundImage: `url("${heroBg}")` }}>
            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" placeholder="Search your dream car..." />
                </div>
                <button className="filter-button" aria-label="Filter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                        <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
                        <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
                        <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default Hero;
