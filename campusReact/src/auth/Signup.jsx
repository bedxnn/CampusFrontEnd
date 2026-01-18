import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Apis';
import '../assets/css/Signup.css';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [error, setError] = useState("");  
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");  

        try {
            const res = await api.post("/Signup", {
                email: email,
                password: password
            });
            
            setShowVerification(true);
            
        } catch(error) {
            console.log("Signup error:", error);
            
           
            const errorMessage = error.response?.data?.message || 
                                error.response?.data || 
                                "Registration failed. Please try again.";
            setError(errorMessage); 
        }
    }
    
    const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
        const res = await api.post("/verify-code", {  
            email: email,
            code: verificationCode
        });
        
        console.log("Verification response:", res);
        navigate("/login");
        
    } catch(error) {
        console.log("Verification error:", error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data || 
                            "Invalid verification code";
        setError(errorMessage);
    }
}

const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    
    try {
        const res = await api.post("/resend-code", {  
            email: email
        });
        
        console.log("Resend response:", res);
        setResendMessage("New verification code sent!");
        setTimeout(() => setResendMessage(""), 3000);
        
    } catch(error) {
        console.log("Resend error:", error);
        setError("Failed to resend code. Try again.");
    }
}
    return (
        <div className="signup-container">
            <div className="signup-card">
                {!showVerification ? (
                 
                    <>
                        <h2 className="signup-title">Create Account</h2>
                        <p className="signup-subtitle">Sign up to get started</p>
                        
                        <form onSubmit={handleSubmit} className="signup-form">
                            <div className="input-group">
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email'
                                    className="signup-input"
                                    required
                                />
                            </div>
                            
                            <div className="input-group">
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                    className="signup-input"
                                    required
                                />
                            </div>
                       
                            {error && <p className="error-message">{error}</p>}
                            
                            <button type="submit" className="signup-btn">Sign Up</button>
                        </form>
                        
                        <p className="login-link">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </>
                ) : (
                  
                    <>
                        <h2 className="signup-title">Verify Email</h2>
                        <p className="signup-subtitle">
                            Enter the verification code sent to {email}
                        </p>
                        
                        <form onSubmit={handleVerify} className="signup-form">
                            <div className="input-group">
                                <input 
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder='Verification Code'
                                    className="signup-input"
                                    required
                                />
                            </div>
                            
                            {/* Show messages */}
                            {error && <p className="error-message">{error}</p>}
                            {resendMessage && <p className="success-message">{resendMessage}</p>}
                            
                            <button type="submit" className="signup-btn">Verify</button>
                        </form>
                        
                        <button 
                            onClick={handleResendCode} 
                            className="resend-btn"
                        >
                            Resend Code
                        </button>
                        
                        <button 
                            onClick={() => setShowVerification(false)} 
                            className="back-btn"
                        >
                            ← Back to Signup
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Signup;