import React, { useEffect, useState } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "../styles/Chat.css";

/* API */

const API = "https://mern-backend-ariu.onrender.com";

/* FORMAT TIME */

const formatTime = (date)=>{
if(!date) return "";

const d = new Date(date);

return d.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});
};

/* FORMAT DATE */

const formatDate=(date)=>{

const d=new Date(date);

return d.toLocaleDateString();

};

function Chat(){

const loggedEmail = localStorage.getItem("email");

const [users,setUsers]=useState([]);
const [selectedUser,setSelectedUser]=useState(null);
const [messages,setMessages]=useState([]);
const [text,setText]=useState("");
const [profile,setProfile]=useState(null);

const [image,setImage]=useState(null);

const [profileOpen,setProfileOpen]=useState(false);
const [addFriendOpen,setAddFriendOpen]=useState(false);
const [pendingOpen,setPendingOpen]=useState(false);

const [friendEmail,setFriendEmail]=useState("");
const [pendingRequests,setPendingRequests]=useState([]);

const [search,setSearch]=useState("");
const [previewImage,setPreviewImage]=useState(null);

const [showEmoji,setShowEmoji]=useState(false);

const [reactions,setReactions]=useState({});

const defaultAvatar =
"https://cdn-icons-png.flaticon.com/512/149/149071.png";

/* EMOJI */

const addEmoji=(emoji)=>{
setText(prev=>prev+emoji.emoji);
};

/* FILE SELECT */

const handleFileChange=(e)=>{

const file=e.target.files[0];

if(file) setImage(file);

};

/* ENTER KEY SEND */

const handleKeyDown=(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();
sendMessage();

}

};

/* PROFILE */

useEffect(()=>{

axios.get(`${API}/reg/profile/${loggedEmail}`)
.then(res=>setProfile(res.data));

},[loggedEmail]);

/* FRIENDS */

useEffect(()=>{

axios.get(`${API}/reg/friends?email=${loggedEmail}`)
.then(res=>setUsers(res.data));

},[loggedEmail]);

/* PENDING */

useEffect(()=>{

axios.get(`${API}/reg/pending-friends?email=${loggedEmail}`)
.then(res=>setPendingRequests(res.data));

},[loggedEmail]);

/* LOAD CHAT */

const loadMessages=(user)=>{

setSelectedUser(user);

axios
.get(`${API}/messages/chat/${loggedEmail}/${user.email}`)
.then(res=>setMessages(res.data));

};

/* SEND MESSAGE */

const sendMessage=async()=>{

if((!text.trim() && !image) || !selectedUser) return;

const formData=new FormData();

formData.append("senderEmail",loggedEmail);
formData.append("receiverEmail",selectedUser.email);
formData.append("message",text);

if(image){
formData.append("media",image);
}

await axios.post(`${API}/messages/send`,formData);

setText("");
setImage(null);

loadMessages(selectedUser);

};

/* REACTION */

const addReaction=(index,emoji)=>{

setReactions(prev=>({
...prev,
[index]:emoji
}));

};

/* FILTER SEARCH */

const filteredMessages=messages.filter(msg=>
msg.message?.toLowerCase().includes(search.toLowerCase())
);

/* LOGOUT */

const logout=()=>{

localStorage.removeItem("email");
window.location.href="/";

};

return(

<div className="chat-container">

{/* SIDEBAR */}

<div className="sidebar">

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

<h2 className="title">Users</h2>

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

{/* SEARCH */}

<input
className="search-input"
placeholder="Search messages..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="messages">

{filteredMessages.map((msg,i)=>{

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
onClick={()=>setPreviewImage(`${API}/uploads/${msg.media}`)}
/>

)}

</div>

<div className="msg-time">
{formatTime(msg.createdAt)}
</div>

{/* REACTIONS */}

<div
key={i}
className={`message-container ${isMe ? "my-message" : "other-message"}`}
>

<div className="msg-content">

{msg.message}

{msg.media && (
<img
src={`${API}/uploads/${msg.media}`}
className="chat-image"
onClick={()=>setPreviewImage(`${API}/uploads/${msg.media}`)}
/>
)}

</div>

{/* REACTIONS */}

<div className="reaction-box">

<span onClick={()=>addReaction(i,"👍")}>👍</span>
<span onClick={()=>addReaction(i,"❤️")}>❤️</span>
<span onClick={()=>addReaction(i,"😂")}>😂</span>

</div>

{reactions[i] && (
<span className="reaction">{reactions[i]}</span>
)}

<div className="msg-time">
{formatTime(msg.createdAt)}
</div>

</div>

{reactions[i] && (
<span className="reaction">
{reactions[i]}
</span>
)}

</div>

)

})}

</div>

{/* INPUT */}

<div className="input-area">

<button
className="emoji-btn"
onClick={()=>setShowEmoji(!showEmoji)}
>
😊
</button>

{showEmoji &&(

<div className="emoji-box">

<EmojiPicker onEmojiClick={addEmoji}/>

</div>

)}

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

{/* IMAGE MODAL */}

{previewImage &&(

<div
className="image-modal"
onClick={()=>setPreviewImage(null)}
>

<img
src={previewImage}
className="modal-img"
/>

</div>

)}

</div>

);

}

export default Chat;