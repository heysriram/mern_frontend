import React,{useEffect,useState} from "react"
import axios from "axios"
import "../styles/profile.css"
import {useNavigate} from "react-router-dom"

const LOCAL_API = "http://localhost:5000"
const LIVE_API = "https://mern-backend-ariu.onrender.com"
const API = LIVE_API

function Profile(){

const navigate = useNavigate()

const email = localStorage.getItem("email")

const [user,setUser] = useState({})
const [name,setName] = useState("")
const [image,setImage] = useState(null)


/* LOAD PROFILE */

useEffect(()=>{

axios
.get(`${API}/reg/profile/${email}`)
.then(res=>{
setUser(res.data)
setName(res.data.name)
})

},[email])


/* UPDATE NAME */

const updateName = async()=>{

await axios.put(`${API}/reg/update-name`,{
email,
name
})

alert("Name updated")

}


/* UPLOAD IMAGE */

const uploadImage = async()=>{

console.log('Uploading image:', image)

const formData = new FormData()

formData.append("email",email)
formData.append("image",image)

await axios.post(
`${API}/reg/upload-image`,
formData
)

window.location.reload()

}


/* LOGOUT */

const logout = ()=>{

localStorage.removeItem("email")
navigate("/")

}


return(

<div className="profile-container">

<div className="profile-card">

<h2>My Profile</h2>

<img
className="profile-avatar"
src={
user.profileImage
? `${API}/uploads/${user.profileImage}`
: "https://via.placeholder.com/120"
}
/>

<input
type="file"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button onClick={uploadImage}>
Upload Image
</button>


<label>Name</label>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<button onClick={updateName}>
Update Name
</button>


<label>Email</label>
<p>{user.email}</p>


<button
className="logout-btn"
onClick={logout}
>
Logout
</button>

</div>

</div>

)

}

export default Profile