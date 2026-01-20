import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { MdArticle, MdAddCircle } from 'react-icons/md';
import { AuthContext } from '../../auth/AuthContext';
import '../../assets/css/Navbar.css';

function Navbar({ onAddPostClick, showAddForm, showSuccess }) {
    const { isLoggedIn, setIsLoggedIn, setToken } = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail'); // Also clear email
        setToken(null);
        setIsLoggedIn(false);
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
        <nav className="navbar">
            <Link to="/" className="navbar-title navbar-icon-link">
                <AiFillHome className="icon home-icon" />
                <span className="text">Home</span>
            </Link>
            
            {isLoggedIn ? (
                <>
                    {/* Show Add Post button only when form is closed and no success message */}
                    {!showAddForm && !showSuccess && (
                        <button onClick={onAddPostClick} className="navbar-link navbar-icon-link add-post-btn">
                            <MdAddCircle className="icon add-icon" />
                            <span className="text">Add Post</span>
                        </button>
                    )}
                    
                    {/* Show success message */}
                    {showSuccess && (
                        <div className="success-message-navbar">
                            <span className="success-text">✓ Successfully added!</span>
                        </div>
                    )}
                    
                    <Link to="/myPosts" className="navbar-link navbar-icon-link">
                        <MdArticle className="icon posts-icon" />
                        <span className="text">My Posts</span>
                    </Link>
                    <button onClick={handleLogoutClick} className="logout-btn">Logout</button>
                </>
            ) : (
                <>
                    <Link to="/myPosts" className="navbar-link navbar-icon-link">
                        <MdArticle className="icon posts-icon" />
                        <span className="text">My Posts</span>
                    </Link>
                </>
            )}
        </nav>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
            <div className="logout-modal-overlay">
                <div className="logout-modal">
                    <h3>Confirm Logout</h3>
                    <p>Are you sure you want to logout?</p>
                    <div className="logout-modal-buttons">
                        <button onClick={confirmLogout} className="confirm-btn">Yes, Logout</button>
                        <button onClick={cancelLogout} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default Navbar;