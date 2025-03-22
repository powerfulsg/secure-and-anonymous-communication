import { useState } from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext";

const useSignup=()=> {
  const [loading, setLoading]=useState(false);

  const { setAuthUser }=useAuthContext();

  const signup= async({username})=>{
    const sucess=handleInputErrors({username})

    if(!sucess) return;

    setLoading(true);
    try {
        const res=await fetch("/api/auth/signup",{
            method:"POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({username}),
        });

        const data= await res.json();

        if(data.error){
            throw new Error(data.error);
        }

        localStorage.setItem("chat-user",JSON.stringify(data))
        setAuthUser(data);

    } catch (err) {
        console.log("Error in useSignup: ",err.message);
        toast.error(err.message);
    }finally{
        setLoading(false);
    }
  };
  return {loading, signup};
};

export default useSignup;

function handleInputErrors({username}){
    if( !username ){
        toast.error('All the fields are required');
        return false;
    }
   
    
    return true;
}
