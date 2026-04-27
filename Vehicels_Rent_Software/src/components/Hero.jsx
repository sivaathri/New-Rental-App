import React from 'react';
import './Hero.css';
import heroBg from '../assets/3.png';

const Hero = ({ searchQuery, setSearchQuery, setIsFilterOpen, isFilterOpen }) => {
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
                        <input 
                            type="text" 
                            placeholder="Search your dream car..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        className={`filter-button ${isFilterOpen ? 'active' : ''}`} 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        aria-label="Filter"
                    >
                        {isFilterOpen ? (
                            <div className="filter-close-wrapper">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="21" x2="4" y2="14" />
                                <line x1="4" y1="10" x2="4" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12" y2="3" />
                                <line x1="20" y1="21" x2="20" y2="16" />
                                <line x1="20" y1="12" x2="20" y2="3" />
                                <line x1="2" y1="14" x2="6" y2="14" />
                                <line x1="10" y1="8" x2="14" y2="8" />
                                <line x1="18" y1="16" x2="22" y2="16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
