import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddBook from "./pages/AddBook";
import UserSettings from "./pages/UserSettings";
import Threads from "./pages/Threads";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);

    return (
        <div className="siteContainer">
            <Nav user={user} setUser={setUser} />
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login onSuccess={setUser} />} />
                    <Route path="/register" element={<Register onSuccess={setUser} />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                    <Route path="/add-book" element={<AddBook/>}/>
                    <Route path="/edit-profile" element={<UserSettings user={user} setUser={setUser}/>}/>
                    <Route path="/threads" element={<Threads user={user} />}/>
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;