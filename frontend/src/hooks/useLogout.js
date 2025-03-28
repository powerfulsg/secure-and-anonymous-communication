import { useState } from "react"
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout =() =>{

    const [loading, setLoading]= useState(false);
    const {setAuthUser, authUser}=useAuthContext();

    const logout= async ()=>{
        setLoading(true);

        try {
            
            const res=await fetch("/api/auth/logout",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({authUser})
            });

            const data=await res.json();
            if(data.error){
                throw new Error(data.error);
            }


            localStorage.removeItem('chat-user');
            setAuthUser(null);

            toast.success("Logout Successfull");

        } catch (err) {
            toast.error(err.message);
        }finally{
            setLoading(false);
        }
    };
    return { loading, logout};

}

export default useLogout;