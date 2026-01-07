import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from "./pages/EditProfile.jsx";
import {UserProvider} from "./UserContext.jsx";

function App() {
    return (
        <BrowserRouter>

            <UserProvider>

            <Navbar />

            <main style={{}}>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                </Routes>

            </main>

            </UserProvider>

        </BrowserRouter>
    );
}

export default App;