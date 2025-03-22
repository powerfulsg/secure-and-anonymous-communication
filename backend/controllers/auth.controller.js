import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { json } from "express";

export const signup=async (req,res)=>{
    try {
        const{username }=req.body;
        // if(password !== confirmPassword){
        //     console.log(password,confirmPassword);
        //     return res.status(400).json({error:"Password don't match"});
        // }

        const user= await User.findOne({username});

        if(user){
            return res.status(400).json({error:"Username already exists"});
        }

        //Hash passwrod here 
        // const salt=await bcrypt.genSalt(10);
        // const hashPassword=await bcrypt.hash(password,salt);
// 
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		// const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        
        const newUser=new User({
            // name:name,
            username:username,
            // password: hashPassword,
            // gender:gender,
            profilePic: boyProfilePic
        });
        // console.log(name);
        console.log(newUser);

        if(newUser){
            // Generate JWT token here
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                // name:newUser.name,
                username:newUser.username,
                profilePic:newUser.profilePic,
            })
        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    } catch (err) {
        console.log("Error in signup controller: ",err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const login=async (req,res)=>{
    try{
        const {username}=req.body;
        const user=await User.findOne({username});

        if(!user ){
            console.log("user:",user);
            return res.status(400).json({error:"Invalid Username"});
        }

        generateTokenAndSetCookie(user.id,res);

        res.status(200).json({
            _id:user._id,
            name:user.name,
            username:user.username,
            profilePic: user.profilePic
        });
    }catch (err) {
        console.log("Error in login controller: ",err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

// export const login=async (req,res)=>{
//     try{
//         const {username, password}=req.body;
//         const user=await User.findOne({username});
//         const isPasswordCorrect=await bcrypt.compare(password,user.password || '');

//         if(!user || !isPasswordCorrect){
//             console.log("user:",user);
//             console.log("password match:",isPasswordCorrect);
//             return res.status(400).json({error:"Invalid Username or password"});
//         }

//         generateTokenAndSetCookie(user.id,res);

//         res.status(200).json({
//             _id:user._id,
//             name:user.name,
//             username:user.username,
//             profilePic: user.profilePic
//         });
//     }catch (err) {
//         console.log("Error in login controller: ",err.message);
//         res.status(500).json({error:"Internal Server Error"});
//     }
// }

export const logout=async (req,res)=>{
    try {
        const {authUser}= req.body;
        await User.findByIdAndDelete(authUser._id);
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Logout successfully"});
    } catch (err) {
        console.log("Error in logout controller:",err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}