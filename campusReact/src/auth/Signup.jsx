import React from 'react'
import api from '../Apis';
import axios from 'axios';
import { useState } from 'react';

function Signup() {

    const [email,setEmail] = useState("");
    const[password,setPassword] = useState("");

  
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post("/Signup",{
                email: email,
                password:password
            });
              console.log("Full response:", res);   
            alert("Registration seccesfully");
        }catch(error){
            alert("registaration failed");
        }
    }


  return (
    <div>
        <form onSubmit={handleSubmit}>
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
            <button type = "submit">Signup</button>

        </form>
    </div>
  );
}

export default Signup