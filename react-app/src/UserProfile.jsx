import BookCard from "./BookCard";
import "./UserProfile.css";
import React, {useRef, useState} from "react";

function UserProfile ({username, email}) {
    // keep track of the chosen avatar URL (default or data URL)
    const [avatar, setAvatar] = useState("/src/assets/react.svg");
    const fileInputRef = useRef(null);

    // open the hidden file input when the button is clicked
    function triggerUpload() {
        fileInputRef.current?.click();
    }

    // handle the actual file selection
    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        // preview locally by reading as a data URL
        const reader = new FileReader();
        reader.onload = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);

        // upload the file to the server
        const form = new FormData();
        form.append('avatar', file);
        fetch('/api/avatar', {
            method: 'POST',
            body: form
        })
            .then(res => res.json())
            .then(payload => {
                // server returns the URL where it stored the avatar
                if (payload.avatar) {
                    setAvatar(payload.avatar);
                }
            })
            .catch(err => {
                console.error('upload failed', err);
            });
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

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
            />

            <a href="#" className="about-link">
                About Me
            </a>
        </div>
    );
}

export default UserProfile;
