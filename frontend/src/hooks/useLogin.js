import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { json } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
  const [loading, setLoading]=useState(false);
  const {setAuthUser}=useAuthContext();

  const login=async (username, password)=>{

    const sucess=handleInputErrors({username,password})
    if(!sucess) return
    setLoading(true)
    try {
        const res = await fetch("/api/auth/login",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({username,password}),
        });

        const data=await res.json();

        if(data.error){
            throw new Error(data.error)
        }
        localStorage.setItem("chat-user",JSON.stringify(data));
        setAuthUser(data);
        toast.success("LoggedIn...");
    } catch (err) {
        toast.error(err.message);
    }finally{
        setLoading(false)
    }
  };
  return {loading, login};
}

export default useLogin;

function handleInputErrors({username,password}){
    
    if(!username && !password){
        toast.error("All field's are required");
        return false;
    }
    
    return true;
}
