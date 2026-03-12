import React, { useState } from "react";
import axios from "axios";
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

function Signup(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleSignup = async () => {

try{

const res = await axios.post("https://mern-backend-ariu.onrender.com/reg/create",{
name,
email,
password
})

if(res.data.email){

alert("Signup Successful")
navigate("/")

}else{

alert("Signup failed")

}

}catch(err){

alert("Signup failed")

}

}

return(

<div className="signup-container">

<div className="signup-box">

<h2 className="signup-title">Create Account</h2>

<input
className="signup-input"
type="text"
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
className="signup-input"
type="email"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="signup-input"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="signup-btn"
onClick={handleSignup}
>
Sign Up
</button>

<p className="login-link">
Already have an account? 
<span onClick={()=>navigate("/")}> Login</span>
</p>

</div>

</div>

)

}

export default Signup