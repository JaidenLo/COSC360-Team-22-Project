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
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Redirects to /login if user is not logged in
function ProtectedRoute({ user, children }) {
    if (!user ) return <Navigate to="/login" replace />;
    return children;
}

// 404 page
function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Page not found.</p>
            <a href="/home" style={{ color: '#4CAF50', fontSize: '1rem' }}>← Back to Home</a>
        </div>
    );
}

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
                    {/* Public routes */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login onSuccess={handleSetUser} />} />
                    <Route path="/register" element={<Register onSuccess={handleSetUser} />} />
                    <Route path="/home" element={<Home user={user} />} />

                    {/* Protected routes, now require login */}
                    <Route path="/profile" element={
                        <ProtectedRoute user={user}>
                            <Profile user={user} />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-book" element={
                        <ProtectedRoute user={user}>
                            <AddBook user={user} />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-book" element={
                        <ProtectedRoute user={user}>
                            <EditBook user={user} />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-profile" element={
                        <ProtectedRoute user={user}>
                            <UserSettings user={user} setUser={handleSetUser} />
                        </ProtectedRoute>
                    } />
                    <Route path="/threads" element={
                        <ProtectedRoute user={user}>
                            <Threads user={user} />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin-dashboard" element={
                        <ProtectedRoute user={user}>
                            <AdminDashboard userId={user?._id} usertype={user?.usertype} />
                        </ProtectedRoute>
                    } />

                    {/* 404 catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;