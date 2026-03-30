import "./UserProfile.css";
import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";

function UserProfile ({username, email , usertype, city, aboutMe}) {
    
    const [avatar, setAvatar] = useState("/src/assets/react.svg");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [searched, setSearched] = useState(false);
   
    const fileInputRef = useRef(null);
    async function handleViewProfile(userId){}
    

    async function handleDelete(userId) {
        if (!window.confirm('Delete this user? Admin')) return;

        fetch(`/api/users/delete/${userId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'User not found') {
                alert('User not found or already deleted');
            } else {
                alert('User deleted successfully');
                setUsers(users.filter(user => user._id !== userId));
            }
        })
        .catch(err => {
            console.error('Delete error:', err);
            alert('Error deleting user');
        });


    }
    
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
                    <p className="profile-city">City: {city || "Not set"}</p>
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
                <Link to="/edit-profile" className="edit-profile-btn">
                    Edit Profile
                </Link>
                <button className="upload-btn" onClick={triggerUpload}>
                    Upload new Image
                </button>
            </div>
            {/* display the search feature if the user is admin else does not show */}
            {usertype === 'admin' && (
            <div className="admin-section">
                <h3>Search Users</h3>

                {/* to search */}
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit">Search</button>
                </form>

                {/* if not result found return no user found */}
                {searched && users.length === 0 && (
                    <p>No users found.</p>
                )}

                {/* Show searched results */}
                {users.length > 0 && (
                    <div className="users-list">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>City</th>
                                    <th>Type</th>
                                    <th>Type of Action</th>
                                    <th>Power of Admin !</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.city}</td>
                                        <td>{user.usertype}</td>
                                        <td><button onCLick = {() => handleViewProfile(user._id)}>View User Profile</button></td>
                                        <td><button  onClick={() => handleDelete(user._id)}>Delete</button></td>
                                        
                                        
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
