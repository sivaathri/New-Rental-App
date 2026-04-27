import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import AuthModal from './AuthModal';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        
        // Close dropdown when clicking outside
        const handleClickOutside = (e) => {
            if (isDropdownOpen && !e.target.closest('.user-profile-btn-container')) {
                setIsDropdownOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowLogoutModal(false);
        window.location.reload();
    };

    const handleProfileClick = () => {
        if (user) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            setIsAuthModalOpen(true);
        }
    };

    const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : '';

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    {/* Logo Section */}
                    <div className="navbar-left">
                        <Link to="/" className="logo-container">
                            <div className="logo-icon-container">
                                <svg className="car-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                </svg>
                            </div>
                            <div className="brand-text">
                                <span className="brand-name">Quick</span>
                                <span className="brand-subname">SERVICES</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="navbar-center">
                        <ul className="nav-links">
                            <li className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
                                <Link to="/">Home</Link>
                                {currentPath === '/' && <div className="active-indicator"></div>}
                            </li>
                            <li className={`nav-item ${currentPath === '/vehicles' ? 'active' : ''}`}>
                                <Link to="#vehicles">Vehicles</Link>
                                {currentPath === '/vehicles' && <div className="active-indicator"></div>}
                            </li>
                            <li className={`nav-item ${currentPath === '/about' ? 'active' : ''}`}>
                                <Link to="/about">About Us</Link>
                                {currentPath === '/about' && <div className="active-indicator"></div>}
                            </li>
                            <li className={`nav-item ${currentPath === '/contact' ? 'active' : ''}`}>
                                <Link to="/contact">Contact</Link>
                                {currentPath === '/contact' && <div className="active-indicator"></div>}
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

                        <div className="user-profile-btn-container relative">
                            <button 
                                className={`user-profile-btn ${isDropdownOpen ? 'active' : ''}`}
                                onClick={handleProfileClick}
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

                            {/* Dropdown Menu */}
                            {user && isDropdownOpen && (
                                <div className="user-dropdown-menu">
                                    <div className="dropdown-header">
                                        <p className="dropdown-user-name">{user.full_name}</p>
                                        <p className="dropdown-user-id">ID: {user.unique_id}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <ul className="dropdown-list">
                                        <li className="dropdown-item">
                                            <Link to="/profile" onClick={() => setIsDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <span>Profile</span>
                                            </Link>
                                        </li>
                                        <li className="dropdown-item">
                                            <Link to="/favorites" onClick={() => setIsDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                                <span>Favourites</span>
                                            </Link>
                                        </li>
                                        <li className="dropdown-item">
                                            <Link to="/history" onClick={() => setIsDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span>History</span>
                                            </Link>
                                        </li>
                                        <li className="dropdown-item">
                                            <Link to="/notifications" onClick={() => setIsDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                </svg>
                                                <span>Notification</span>
                                            </Link>
                                        </li>
                                        <li className="dropdown-item">
                                            <Link to="/settings" onClick={() => setIsDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="3" />
                                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                                </svg>
                                                <span>Settings</span>
                                            </Link>
                                        </li>
                                        <li className="dropdown-item logout" onClick={handleLogout}>
                                            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            <span>Logout</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">
                        <div className="logout-modal-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <h3>Logout</h3>
                        <p>Are you sure you want to logout? You will need to verify your number again to access your account.</p>
                        <div className="logout-modal-actions">
                            <button className="modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="modal-confirm-btn" onClick={confirmLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
