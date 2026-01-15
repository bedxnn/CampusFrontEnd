import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';

function Navbar() {
    const { isLoggedIn, setIsLoggedIn, setToken } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsLoggedIn(false);
        alert("Logged out!");
    };

    return (
        <nav style={{ padding: '20px', background: '#333', color: 'white' }}>
            <h2 style={{ display: 'inline', marginRight: '20px' }}>My App</h2>
            
            {isLoggedIn ? (
                // Show this if logged in
                <button onClick={handleLogout}>Logout</button>
            ) : (
                // Show this if nottttt logged in
                <span>Please login</span>
            )}
        </nav>
    );
}

export default Navbar;