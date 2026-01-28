import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from "./pages/EditProfile.jsx";
import {UserProvider} from "./UserProvider.jsx";
import Feed from "./pages/Feed.jsx";
import {ThemeProvider} from "./provider/ThemeProvider.jsx";

function App() {
    return (
        <BrowserRouter>

            <ThemeProvider>

                <UserProvider>

                <Navbar />

                <main style={{}}>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/feed" element={<Feed />} />
                    </Routes>

                </main>

                </UserProvider>

            </ThemeProvider>

        </BrowserRouter>
    );
}

export default App;