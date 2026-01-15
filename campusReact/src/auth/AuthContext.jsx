import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        
        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
            console.log("User is logged in!");
        } else {
            console.log("User is NOT logged in");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, setIsLoggedIn, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};