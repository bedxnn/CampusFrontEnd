import React, { useState } from 'react'
import api from '../Apis';

function Login() {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");

    const handleLogin = async (e) =>{
        e.preventDefault();
        
        try{
            const res = await api.post("/Login",{
                email:email,
                password:password
            
            });
              localStorage.setItem('token', res.data.token);
                console.log("Token saved!");
  
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