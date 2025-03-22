import  { useState } from 'react'
// import GenderCheckbox from './GenderCheckbox';
// import { Link } from 'react-router-dom';
import useSignup from '../../hooks/useSignup';

const Login = () => {

    const [inputs, setInputes]=useState({
        // name:"",
        username:"",
        // password:"",
        // confirmPassword:"",
        // gender:"",
    });

    const { loading, signup}=useSignup();

    // const handleCheckboxChange=(gender)=>{
    //     setInputes({...inputs,gender});
    // }

    const handleSubmit=async (e) =>{
        e.preventDefault();
        await signup(inputs);
    }

  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding dackdrop-filter ackdrop-filter backdrop-blur-lg bg-opacity-0'>
            <h1 className='text-3x1 font-semibold text-center text-gray-300'>
                Login to 
                <span className='text-blue-500'> Anonymous</span>
            </h1>

            <form onSubmit={handleSubmit}>
                {/* <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Full Name</span>
                    </label>
                    <input type="text" placeholder='John Deo' className='w-full input input-bordered h-10' value={inputs.name} onChange={(e)=>setInputes({...inputs,name:e.target.value})}/>
                </div> */}

                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Username</span>
                    </label>
                    <input type="text" placeholder='johndeo' className='w-full input input-bordered h-10' value={inputs.username} onChange={(e)=>setInputes({...inputs,username:e.target.value})} />
                </div>
{/* 
                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Password</span>
                    </label>
                    
                    <input type="password" placeholder='password' className='w-full input input-bordered h-10' value={inputs.password} onChange={(e)=>setInputes({...inputs,password:e.target.value})} />
                </div>

                <div>
                    <label className='label p-2'>
                        <span className='text-base label-text'>Confirm password</span>
                    </label>
                    
                    <input type="password" placeholder='confirm password' className='w-full mb-2 input input-bordered h-10' value={inputs.confirmPassword} onChange={(e)=>setInputes({...inputs,confirmPassword:e.target.value})} />
                </div>

                <GenderCheckbox onCheckBoxChange={handleCheckboxChange} selectedGender={inputs.gender}/>

                <Link to="/login" className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                    Already have an account?
                </Link> */}

                <div>
                    <button className='btn btn-block btn-sm mt-2 border-slate-700' disabled={loading}>
                        {loading ? <span className='loading loading-spinner'></span> : "Login"}
                    </button>
                </div>
            </form>
        </div>
      
    </div>
  )
}

export default Login;
