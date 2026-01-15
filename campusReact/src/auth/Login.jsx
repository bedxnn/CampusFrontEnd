import React, { useState,useContext } from 'react'
import api from '../Apis';
import { AuthContext } from './AuthContext';

function Login() {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");

    const{setIsLoggedIn, setToken} = useContext(AuthContext);

    const handleLogin = async (e) =>{
        e.preventDefault();
        
        try{
            const res = await api.post("/Login",{
                email:email,
                password:password
            
            });
              localStorage.setItem('token', res.data.token);

              setToken(res.data.token);
              setIsLoggedIn(true);
            
  
            alert("logged in succesfully");
        }catch(error){
            alert("login failed");
        }
    }
  return (
    <div>
        <form onSubmit={handleLogin}>
            <input 
            type = "email"
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='email'
            />
            <input 
            type = "password"
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='password'
            />
            <button type = "submit">Login</button>
            </form>
    </div>
  )
}

export default Login