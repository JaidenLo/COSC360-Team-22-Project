import BookCard from "./BookCard";
import "./UserProfile.css";
import React, {useRef, useState} from "react";

function UserProfile ({username, email , usertype}) {
    
    const [avatar, setAvatar] = useState("/src/assets/react.svg");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [searched, setSearched] = useState(false);
    const fileInputRef = useRef(null);

    
    function triggerUpload() {
        fileInputRef.current?.click();
    }

    
    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        
        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);

    }

    function handleSearch(e) {
        e.preventDefault();
        setSearched(true);

        fetch(`/api/users/search?search=${search}`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));

        setSearch("");
    }

    return (
        <div className="profile-card">
            <div className="profile-top">
                <div className="profile-avatar">
                    <span className="avatar-icon">
                        <img src={avatar} alt="Avatar" />
                    </span>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">Hello, {username}, {usertype === 'admin' && (
                            <span className="admin-tag">Admin</span>
                        )}</h2>
                    <p className="profile-email">{email}</p>

                    
                </div>
            </div>

            <button className="upload-btn" onClick={triggerUpload}>
                Upload new Image
            </button>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*"/>

            <a href="#" className="about-link">
                About Me
            </a>

                {usertype === 'admin' && (
                <div className="admin-section">
                    <h3>Search Users</h3>

                    {/* search bar */}
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by name, email or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit">Search</button>
                    </form>

                    {/* no results */}
                    {searched && users.length === 0 && (
                        <p>No users found.</p>
                    )}

                    {/* dynamic users table */}
                    {users.length > 0 && (
                        <div className="users-list">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>City</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.city}</td>
                                            <td>{user.usertype}</td>
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
