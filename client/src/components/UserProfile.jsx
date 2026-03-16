import BookCard from "./BookCard";
import "./UserProfile.css";
import React, {useRef, useState} from "react";

function UserProfile ({username, email}) {
    
    const [avatar, setAvatar] = useState("/src/assets/react.svg");
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

    return (
        <div className="profile-card">
            <div className="profile-top">
                <div className="profile-avatar">
                    <span className="avatar-icon">
                        <img src={avatar} alt="Avatar" />
                    </span>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">Hello, {username}</h2>
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
        </div>
    );
}

export default UserProfile;
