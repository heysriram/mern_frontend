import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Chat.css";

/* API URLs */

const LOCAL_API = "http://localhost:5000";
const LIVE_API = "https://mern-backend-ariu.onrender.com";

/* SWITCH API - Always use LIVE_API for development testing */

const API = LIVE_API;

/* FORMAT TIME */

const formatTime = (date)=>{
if(!date) return "";

const d = new Date(date);

return d.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

};

function Chat(){

const loggedEmail = localStorage.getItem("email");

const [users,setUsers] = useState([]);
const [selectedUser,setSelectedUser] = useState(null);
const [messages,setMessages] = useState([]);
const [text,setText] = useState("");
const [profile,setProfile] = useState(null);

const [image,setImage] = useState(null);

const [profileOpen,setProfileOpen] = useState(false);
const [addFriendOpen,setAddFriendOpen] = useState(false);
const [pendingOpen,setPendingOpen] = useState(false);

const [friendEmail,setFriendEmail] = useState("");
const [pendingRequests,setPendingRequests] = useState([]);

const defaultAvatar =
"https://cdn-icons-png.flaticon.com/512/149/149071.png";

/* FILE SELECT */

const handleFileChange=(e)=>{

const file=e.target.files[0];

if(file){
setImage(file);
}

};

/* ENTER KEY SEND */

const handleKeyDown=(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();
sendMessage();

}

};

/* LOAD PROFILE */

useEffect(()=>{

axios.get(`${API}/reg/profile/${loggedEmail}`)
.then(res=>{
console.log("Profile loaded:",res.data);
setProfile(res.data);
})
.catch(err=>{
console.error("Profile load error:",err.response?.data || err.message);
});

},[loggedEmail]);

/* LOAD FRIENDS */

useEffect(()=>{

axios.get(`${API}/reg/friends?email=${loggedEmail}`)
.then(res=>{
console.log("Friends loaded:",res.data);
setUsers(res.data);
})
.catch(err=>{
console.error("Friends load error:",err.response?.data || err.message);
});

},[loggedEmail]);

/* LOAD PENDING REQUESTS */

useEffect(()=>{

axios.get(`${API}/reg/pending-friends?email=${loggedEmail}`)
.then(res=>{
console.log("Pending requests loaded:",res.data);
setPendingRequests(res.data);
})
.catch(err=>{
console.error("Pending requests load error:",err.response?.data || err.message);
});

},[loggedEmail]);

/* LOAD CHAT */

const loadMessages=(user)=>{

setSelectedUser(user);

axios
.get(`${API}/messages/chat/${loggedEmail}/${user.email}`)
.then(res=>{
console.log("Messages loaded:",res.data);
setMessages(res.data);
})
.catch(err=>{
console.error("Load messages error:",err.response?.data || err.message);
console.log("API URL used:",`${API}/messages/chat/${loggedEmail}/${user.email}`);
});

};

/* SEND FRIEND REQUEST */

const sendFriendRequest=async()=>{

if(!friendEmail.trim()) return alert("Enter friend's email");

try{

await axios.post(`${API}/reg/send-friend/${friendEmail}`,{
userEmail:loggedEmail
});

alert("Friend request sent");

setFriendEmail("");

}catch(err){

alert("Error sending request");

}

};

/* ACCEPT FRIEND REQUEST */

const acceptFriendRequest=async(email)=>{

try{

await axios.post(`${API}/reg/accept-friend/${email}`,{
userEmail:loggedEmail
});

alert("Friend request accepted");

}catch(err){

alert("Error accepting request");

}

};

/* SEND MESSAGE */

const sendMessage=async()=>{

if((!text.trim() && !image) || !selectedUser) return;

try{

const formData=new FormData();

formData.append("senderEmail",loggedEmail);
formData.append("receiverEmail",selectedUser.email);
formData.append("message",text);

if(image){
formData.append("file",image);
}

const response = await axios.post(`${API}/messages/send`,formData,{
headers:{
"Content-Type":"multipart/form-data"
}
});

console.log("Message sent:",response.data);

setText("");
setImage(null);

loadMessages(selectedUser);

}catch(err){

console.error("Message send error:",err.response?.data || err.message);
alert("Error sending message: " + (err.response?.data?.message || err.message));

}

};

/* LOGOUT */

const logout=()=>{

localStorage.removeItem("email");
window.location.href="/";

};

return(

<div className="chat-container">

{/* SIDEBAR */}

<div className="sidebar">

{/* PROFILE SECTION */}

<div className="profile-section">

<div
className="profile-logo"
onClick={()=>setProfileOpen(!profileOpen)}
>

<img
src={
profile?.profileImage
? `${API}/uploads/${profile.profileImage}`
: defaultAvatar
}
className="profile-logo-img"
/>

{pendingRequests.length>0 &&(

<span className="pending-badge">
{pendingRequests.length}
</span>

)}

</div>

<button
className="add-friend-btn"
onClick={()=>setAddFriendOpen(!addFriendOpen)}
>
+
</button>

<button
className="pending-btn"
onClick={()=>setPendingOpen(!pendingOpen)}
>
📩
</button>

</div>

{/* PROFILE POPUP */}

{profileOpen && profile &&(

<div className="profile-box">

<img
src={
profile?.profileImage
? `${API}/uploads/${profile.profileImage}`
: defaultAvatar
}
className="profile-img"
/>

<h3>{profile.name}</h3>
<p>{profile.email}</p>

<button
className="profile-btn"
onClick={()=>window.location.href="/profile"}
>
Edit Profile
</button>

<button
className="logout-btn"
onClick={logout}
>
Logout
</button>

</div>

)}

<h2 className="title">Users</h2>

{/* USERS */}

{users.map((user,i)=>(

<div
key={i}
className="user"
onClick={()=>loadMessages(user)}
>

<img
src={
user?.profileImage
? `${API}/uploads/${user.profileImage}`
: defaultAvatar
}
className="user-avatar"
/>

{user.name}

</div>

))}

{/* ADD FRIEND */}

{addFriendOpen &&(

<div className="add-friend">

<input
type="email"
placeholder="Friend email"
value={friendEmail}
onChange={(e)=>setFriendEmail(e.target.value)}
className="friend-input"
/>

<button
className="friend-btn"
onClick={sendFriendRequest}
>
Add
</button>

</div>

)}

{/* PENDING FRIEND REQUESTS */}

{pendingOpen &&(

<div className="pending-list">

{pendingRequests.length===0 ?(

<p>No requests</p>

):( 

pendingRequests.map((req,i)=>(

<div key={i} className="pending-item">

<span>{req.email}</span>

<button
className="accept-btn"
onClick={()=>acceptFriendRequest(req.email)}
>
Accept
</button>

</div>

))

)}

</div>

)}

</div>

{/* CHAT AREA */}

<div className="chat-area">

{selectedUser ?(

<>

<div className="chat-header">

<img
src={
selectedUser?.profileImage
? `${API}/uploads/${selectedUser.profileImage}`
: defaultAvatar
}
className="friend-logo-img"
/>

Chat with {selectedUser.name}

</div>

<div className="messages">

{messages.map((msg,i)=>{

const isMe=msg.senderEmail===loggedEmail;

return(

<div
key={i}
className={isMe?"my-message":"other-message"}
>

<div className="msg-content">

{msg.message}

{msg.media &&(

<img
src={`${API}/uploads/${msg.media}`}
className="chat-image"
/>

)}

</div>

<div className="msg-time">

{formatTime(msg.createdAt)}

</div>

</div>

)

})}

</div>

<div className="input-area">

<input
className="chat-input"
value={text}
onChange={(e)=>setText(e.target.value)}
onKeyDown={handleKeyDown}
placeholder="Type message..."
/>

<input
type="file"
id="fileInput"
accept="image/*"
style={{display:"none"}}
onChange={handleFileChange}
/>

<button
className="file-btn"
onClick={()=>document.getElementById("fileInput").click()}
>
+
</button>

{image &&(

<div className="preview">

<img
src={URL.createObjectURL(image)}
className="preview-img"
/>

<button
className="remove-preview"
onClick={()=>setImage(null)}
>
x
</button>

</div>

)}

<button
className="send-btn"
onClick={sendMessage}
>
Send
</button>

</div>

</>

):( 

<div className="no-chat">
Select a user to start chatting
</div>

)}

</div>

</div>

);

}

export default Chat;