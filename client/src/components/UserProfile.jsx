import "./UserProfile.css";
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserProfile({ userId, username, email, usertype, city, aboutMe }) {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState("/src/assets/react.svg");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [searched, setSearched] = useState(false);
    const [activeThreads, setActiveThreads] = useState([]);
    const [myBooks, setMyBooks] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!userId) return;
        fetch(`/api/books/owner/${userId}`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setMyBooks(data); })
            .catch(err => console.error(err));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        fetch(`/api/threads/user/${userId}`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setActiveThreads(data); })
            .catch(err => console.error(err));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        fetch(`/api/books/borrowed/${userId}`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setBorrowedBooks(data); })
            .catch(err => console.error(err));
    }, [userId]);

    function handleReturn(bookId) {
        if (!userId) return;

        fetch(`/api/books/return/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Book returned successfully") {
                    fetch(`/api/books/borrowed/${userId}`)
                        .then(res => res.json())
                        .then(data => { if (Array.isArray(data)) setBorrowedBooks(data); })
                        .catch(err => console.error(err));
                }
            })
            .catch(err => console.error(err));
    }

    async function handleDelete(id, userId) {
        if (!window.confirm('Delete this user?')) return;
        fetch(`/api/users/delete/${id}?deletedBy=${userId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'User not found') { alert('User not found or already deleted'); }
                else { alert('User deleted successfully'); setUsers(users.filter(u => u._id !== id)); }
            })
            .catch(err => { console.error('Delete error:', err); alert('Error deleting user'); });
    }

    function triggerUpload() { fileInputRef.current?.click(); }
    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
    }
    function handleSearch(e) {
        e.preventDefault();
        setSearched(true);
        fetch(`/api/users/search?search=${search}`).then(res => res.json()).then(data => setUsers(data)).catch(err => console.error(err));
        setSearch("");
    }

    return (
        <div className="profile-card">
            {/* Header */}
            <div className="profile-top">
                <div className="profile-avatar">
                    <span className="avatar-icon">
                        <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </span>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">
                        {username}
                        {usertype === 'admin' && <span className="admin-tag">Admin</span>}
                    </h2>
                    <p className="profile-email">{email}</p>
                    <p className="profile-city">{city || "Not set"}</p>
                </div>
            </div>

            

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
            />

            <div className="about-section">
                <h3>About Me</h3>
                <p className="about-text">
                    {aboutMe||"Nothing here yet. Add something in Edit Profile."}
                </p>
            </div>



            <div className="profile-actions">
                <Link to="/edit-profile" className="edit-profile-btn">Edit Profile</Link>
                <button className="upload-btn" onClick={triggerUpload}>Upload Image</button>
            </div>

            {/* My Books for Borrow */}
            <div className="profile-section">
                <h3 className="section-heading">My Books for Borrow</h3>
                {myBooks.length === 0 ? (
                    <p className="empty-message">You haven't uploaded any books yet.</p>
                ) : (
                    <div className="card-list">
                        {myBooks.map(book => (
                            <div
                                key={book._id}
                                className="list-card"
                                onClick={() => navigate("/home")}
                            >
                                <div className="list-card-main">
                                    <span className="list-card-title">{book.title}</span>
                                    <span className="list-card-sub">{book.category}</span>
                                </div>
                                <span className={`status-badge ${book.borrowed ? 'borrowed' : 'available'}`}>
                                    {book.borrowed ? 'Borrowed' : 'Available'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Currently Borrowed Books */}
            <div className="profile-section">
                <h3 className="section-heading">Borrowed Books</h3>
                {borrowedBooks.length === 0 ? (
                    <p className="empty-message">No books currently borrowed.</p>
                ) : (
                    <div className="card-list">
                        {borrowedBooks.map((book) => (
                            <div key={book._id} className="list-card borrowed-book-card">
                                <div className="list-card-main">
                                    <span className="list-card-title">{book.title}</span>
                                    <span className="list-card-sub">{book.author}</span>
                                    <button
                                        className="return-button"
                                        onClick={() => handleReturn(book._id)}
                                    >
                                        Return Book
                                    </button>
                                </div>
                                <span className="status-badge borrowed">Borrowed</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Active Threads */}
            <div className="profile-section">
                <h3 className="section-heading">My Active Threads</h3>
                {activeThreads.length === 0 ? (
                    <p className="empty-message">You haven't posted in any threads yet.</p>
                ) : (
                    <div className="card-list">
                        {activeThreads.map(thread => (
                            <div
                                key={thread._id}
                                className="list-card"
                                onClick={() => navigate("/threads", { state: { book: thread.book } })}
                            >
                                <div className="list-card-main">
                                    <span className="list-card-title">{thread.book?.title || "Unknown Book"}</span>
                                    <span className="list-card-sub">"{thread.content.slice(0, 60)}{thread.content.length > 60 ? '...' : ''}"</span>
                                </div>
                                <span className="list-card-date">{new Date(thread.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin section */}
            {usertype === 'admin' && (
                <div className="admin-section">
                    <h3>Search Users</h3>
                    <form onSubmit={handleSearch}>
                        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
                        <button type="submit">Search</button>
                    </form>
                    {searched && users.length === 0 && <p>No users found.</p>}
                    {users.length > 0 && (
                        <div className="users-list">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>City</th>
                                        <th>Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.city}</td>
                                            <td>{user.usertype}</td>
                                            <td><button onClick={() => handleDelete(user._id, userId)}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserProfile;