import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import UserSettings from "./pages/UserSettings";
import Threads from "./pages/Threads";
import "./App.css";

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    function handleSetUser(userData) {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
        setUser(userData);
    }

    return (
        <div className="siteContainer">
            <Nav user={user} setUser={handleSetUser} />
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login onSuccess={handleSetUser} />} />
                    <Route path="/register" element={<Register onSuccess={handleSetUser} />} />
                    <Route path="/home" element={<Home user={user} />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                    <Route path="/add-book" element={<AddBook user={user} />} />
                    <Route path="/edit-book" element={<EditBook user={user} />} />
                    <Route path="/edit-profile" element={<UserSettings user={user} setUser={handleSetUser} />} />
                    <Route path="/threads" element={<Threads user={user} />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;