import './UserProfile.css'



function UserProfile({ username, email }) {
    return (
        <div className="profile-card">
            <div className="profile-top">
                <div className="profile-avatar">
                    <span className="avatar-icon"><img src="/src/assets/react.svg" alt="Default Avatar" /></span>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">Hello, {username}</h2>
                    <p className="profile-email">{email}</p>
                </div>
            </div>
            <button className="upload-btn">Upload new Image</button>
            <a href="#" className="about-link">About Me</a>
        </div>
    );
}

export default UserProfile;