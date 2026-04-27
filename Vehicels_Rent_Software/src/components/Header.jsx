import React, { useState, useEffect } from 'react';
import './Header.css';
import AuthModal from './AuthModal';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : '';

    return (
        <>
            <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    {/* Logo Section */}
                    <div className="navbar-left">
                        <div className="logo-container">
                            <div className="logo-icon-container">
                                <svg className="car-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                </svg>
                            </div>
                            <div className="brand-text">
                                <span className="brand-name">Quick</span>
                                <span className="brand-subname">SERVICES</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="navbar-center">
                        <ul className="nav-links">
                            <li className="nav-item active">
                                <a href="#">Home</a>
                                <div className="active-indicator"></div>
                            </li>
                            <li className="nav-item">
                                <a href="#">Vehicles</a>
                            </li>
                            <li className="nav-item">
                                <a href="#">Bookings</a>
                            </li>
                            <li className="nav-item">
                                <a href="#">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a href="#">Contact</a>
                            </li>
                        </ul>
                    </nav>

                    {/* Right Buttons Section */}
                    <div className="navbar-right">
                        <button className="notification-btn">
                            <svg className="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span className="notification-dot"></span>
                        </button>

                        <button 
                            className="user-profile-btn"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            <div className="user-icon-container">
                                {user ? (
                                    <span className="user-initial-icon">{userInitial}</span>
                                ) : (
                                    <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                            </div>
                            <span className="user-btn-text">
                                {user ? user.full_name : 'Login / Signup'}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />
        </>
    );
};

export default Header;
