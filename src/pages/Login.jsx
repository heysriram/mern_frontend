import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async () => {

if(!email || !password){
alert("Please enter email and password")
return
}

try{

const res = await axios.post(
"https://mern-backend-ariu.onrender.com/reg/login",
{
email: email,
password: password
},
{
headers:{
"Content-Type":"application/json"
}
}
)

/* LOGIN SUCCESS */

if(res.data.email){

localStorage.setItem("email",res.data.email)

alert(res.data.message)

navigate("/chat")

}

}catch(error){

if(error.response){

alert(error.response.data.message)

}else{

console.log(error)
alert("Server not responding")

}

}

}

return(

<div className="login-container">

<div className="login-box">

<h2 className="login-title">Login</h2>

<input
className="login-input"
type="email"
placeholder="Enter email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="login-input"
type="password"
placeholder="Enter password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="login-btn"
onClick={handleLogin}
>
Login
</button>

<p className="signup-link">
Don't have an account?
<span onClick={()=>navigate("/signup")}> Sign Up</span>
</p>

</div>

</div>

)

}

export default Login