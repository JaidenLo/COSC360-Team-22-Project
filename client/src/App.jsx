import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddBook from "./pages/AddBook";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);

    return (
        <div>
            <Nav user={user} setUser={setUser} />

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login onSuccess={setUser} />} />
                <Route path="/register" element={<Register onSuccess={setUser} />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/add-book" element={<AddBook/>}/>
            </Routes>

            <Footer />
        </div>
    );
}

export default App;