import React, { useEffect } from 'react';
import './FilterDrawer.css';

const FilterDrawer = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`filter-backdrop ${isOpen ? 'show' : ''}`} 
                onClick={onClose}
            ></div>

            {/* Side Drawer */}
            <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
                <div className="filter-drawer-content">
                    {/* Header */}
                    <div className="filter-header">
                        <div className="header-left">
                            <svg className="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            <h3>Filter</h3>
                        </div>
                        <div className="header-right">
                            <button className="reset-btn">Reset All</button>
                            <button className="close-btn" onClick={onClose}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="filter-body">
                        {/* Vehicle Type */}
                        <div className="filter-group">
                            <label>Vehicle Type</label>
                            <div className="filter-options">
                                <button className="option-btn active">All</button>
                                <button className="option-btn">Bike</button>
                                <button className="option-btn">Car</button>
                                <button className="option-btn">Bus</button>
                                <button className="option-btn">Mini Van</button>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="filter-group">
                            <label>
                                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                Location
                            </label>
                            <div className="location-input-wrapper">
                                <input type="text" placeholder="Enter location" />
                                <svg className="target-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <label>Price Range</label>
                            <div className="price-labels">
                                <span>₹250</span>
                                <span>₹5000+</span>
                            </div>
                            <div className="range-slider-mock">
                                <div className="slider-track"></div>
                                <div className="slider-thumb left"></div>
                                <div className="slider-thumb right"></div>
                            </div>
                            <div className="price-inputs">
                                <div className="price-input">
                                    <span>₹</span>
                                    <input type="text" defaultValue="250" />
                                </div>
                                <span className="to-text">to</span>
                                <div className="price-input">
                                    <span>₹</span>
                                    <input type="text" defaultValue="5000+" />
                                </div>
                            </div>
                        </div>

                        {/* Fuel Type */}
                        <div className="filter-group">
                            <label>
                                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 13.2V21a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7.8a2 2 0 0 0-.6-1.4L13.4 4.8a2 2 0 0 0-2.8 0L3.6 11.8a2 2 0 0 0-.6 1.4z" />
                                </svg>
                                Fuel Type
                            </label>
                            <div className="filter-options">
                                <button className="option-btn active">All</button>
                                <button className="option-btn">Petrol</button>
                                <button className="option-btn">Diesel</button>
                                <button className="option-btn">Electric</button>
                                <button className="option-btn">CNG</button>
                                <button className="option-btn">Hybrid</button>
                            </div>
                        </div>

                        {/* Transmission */}
                        <div className="filter-group">
                            <label>Transmission</label>
                            <div className="filter-options">
                                <button className="option-btn active">All</button>
                                <button className="option-btn">Manual</button>
                                <button className="option-btn">Automatic</button>
                            </div>
                        </div>

                        {/* Seats */}
                        <div className="filter-group">
                            <label>Seats</label>
                            <div className="filter-options">
                                <button className="option-btn active">All</button>
                                <button className="option-btn">2</button>
                                <button className="option-btn">4</button>
                                <button className="option-btn">6</button>
                                <button className="option-btn">7+</button>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="filter-group">
                            <label>Sort By</label>
                            <div className="sort-input-wrapper">
                                <select>
                                    <option>Recommended</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                                <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="filter-footer">
                        <button className="apply-btn" onClick={onClose}>Apply Filter</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterDrawer;
