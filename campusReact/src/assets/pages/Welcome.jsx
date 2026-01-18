import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

function Welcome() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // If user is already logged in, redirect to home
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Welcome to Lost and Found App</h1>
                <p className="welcome-subtitle">Post, Enjoy and Explore</p>
                
                <div className="auth-buttons">
                    <Link to="/login" className="auth-btn login-btn">
                        Login
                    </Link>
                    <Link to="/signup" className="auth-btn signup-btn">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Welcome;