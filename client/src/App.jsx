import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);  

    return (
        <div>
            <Nav user={user} setUser={setUser} />
            <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login onSuccess={setUser} />} />      
                <Route path="/register" element={<Register onSuccess={setUser} />} />   
            </Routes>
            <Footer />
        </div>
    );
}
export default App;