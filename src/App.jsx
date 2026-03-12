import { BrowserRouter,Routes,Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile"
function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/signup" element={<Signup/>}/>
<Route path="/chat" element={<Chat/>}/>
<Route path="/profile" element={<Profile/>}/>

</Routes>

</BrowserRouter>

)

}

export default App