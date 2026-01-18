import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../Apis';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');  // Get token from URL
    const email = searchParams.get('email');  // Get email from URL
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        
        // Check password length
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters!");
            return;
        }
        
        try {
            const res = await api.post("/reset-password", {
                email: email,
                token: token,
                newPassword: newPassword
            });
            
            console.log("Reset password response:", res);
            setMessage("Password reset successfully! Redirecting to login...");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        } catch(error) {
            console.log("Reset password error:", error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data || 
                                "Failed to reset password. Link may be expired.";
            setError(errorMessage);
        }
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2 className="reset-password-title">Reset Password</h2>
                <p className="reset-password-subtitle">
                    Enter your new password
                </p>
                
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="input-group">
                        <input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='New Password'
                            className="reset-password-input"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm Password'
                            className="reset-password-input"
                            required
                        />
                    </div>
                    
                    {/* Success message */}
                    {message && <p className="success-message">{message}</p>}
                    
                    {/* Error message */}
                    {error && <p className="error-message">{error}</p>}
                    
                    <button type="submit" className="reset-password-btn">
                        Reset Password
                    </button>
                </form>
                
                <Link to="/login" className="back-to-login">
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}

export default ResetPassword;