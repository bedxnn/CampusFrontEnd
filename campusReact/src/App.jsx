import { Routes, Route } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from './auth/AuthContext';
import Signup from "./auth/Signup"
import Login from "./auth/Login"
import Navbar from "./assets/components/Navbar"
import './assets/css/Navbar.css'; 
import Welcome from "./assets/pages/Welcome"; 
import Home from "./assets/pages/Home";
import Profile from "./assets/pages/Profile";
import MyPosts from "./assets/pages/MyPosts";
import ProtectedRoute from './auth/ProtectedRoute';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import './assets/css/Login.css';
import './assets/css/Signup.css';
import './assets/css/Welcome.css';
import './assets/css/ForgotPassword.css';
import './assets/css/ResetPassword.css';
import './assets/css/AddPost.css';
import './assets/css/Home.css';
import './assets/css/Myposts.css';
import './assets/css/Chat.css';

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ADD THIS
  const { isLoggedIn } = useContext(AuthContext);

  // ADD THIS FUNCTION
  const handlePostSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      {/* Pass showSuccess to Navbar */}
      {isLoggedIn && (
        <Navbar 
          onAddPostClick={() => setShowAddForm(true)} 
          showAddForm={showAddForm}
          showSuccess={showSuccess}
        />
      )}
      
      <Routes>
   
        <Route path="/welcome" element={<Welcome />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home 
                showForm={showAddForm} 
                setShowForm={setShowAddForm}
                onPostSuccess={handlePostSuccess}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/myPosts" 
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  )
}

export default App