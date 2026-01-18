import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Apis';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        
        try {
            const res = await api.post("/forgot-password", {
                email: email
            });
            
            setMessage("Password reset link sent to your email!");
            setEmail("");
            
        } catch(error) {
            console.log("Forgot password error:", error);
            setError("Failed to send reset link. Please try again.");
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2 className="forgot-password-title">Forgot Password?</h2>
                <p className="forgot-password-subtitle">
                    Enter your email and we'll send you a reset link
                </p>
                
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="input-group">
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            className="forgot-password-input"
                            required
                        />
                    </div>
                    
                 
                    {message && <p className="success-message">{message}</p>}
                    
                 
                    {error && <p className="error-message">{error}</p>}
                    
                    <button type="submit" className="forgot-password-btn">
                        Send Reset Link
                    </button>
                </form>
                
                <Link to="/login" className="back-to-login">
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}

export default ForgotPassword;