import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../Apis';
import { AuthContext } from './AuthContext';
import '../assets/css/Login.css';

function Login() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const navigate = useNavigate();

    const {setIsLoggedIn, setToken} = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/Login", {
                email: email,
                password: password
            });

            // Store both access and refresh tokens
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            setToken(res.data.accessToken);
            setIsLoggedIn(true);
            navigate("/");

        } catch(error) {
            console.log("Login error", error);
            alert("Login failed");
        }
    }
    
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Login to your account</p>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            className="login-input"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            className="login-input"
                            required
                        />
                    </div>
                    
                    <Link to="/forgot-password" className="forgot-password-link">
                        Forgot Password?
                    </Link>
                    
                    <button type="submit" className="login-btn">Login</button>
                </form>
                
                <p className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login