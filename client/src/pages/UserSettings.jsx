import React, { useState } from "react";

function UserSettings({ user, setUser }) {
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [city, setCity] = useState(user?.city || "");
    const [aboutMe, setAboutMe] = useState(user?.aboutMe || "");
    const [password, setPassword] = useState("");

    console.log("PROFILE USER:", user);

    if (!user) {
        return <p>Please login first.</p>;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const userId = user?._id || user?.id;

            if (!userId) {
                throw new Error("User ID is missing");
            }

            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    city,
                    aboutMe,
                    password,
                }),
            });

            const text = await res.text();
            console.log("Raw update response:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Server did not return JSON");
            }

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }


            setUser({
                _id: data._id,
                id: data._id,
                username: data.name,
                email: data.email,
                city: data.city || "",
                usertype: data.usertype,
                aboutMe: data.aboutMe || "",
            });

            alert("Profile updated successfully");
        } catch (err) {
            console.error("Update error:", err);
            alert(err.message || "Error updating profile");
        }
    }

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>

            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>City: </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <label>About Me:</label>
                    <textarea
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        rows="5"
                        placeholder="Write something about yourself..."
                    />
                </div>

                <div className="form-row">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default UserSettings;