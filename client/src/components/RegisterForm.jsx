import "./RegisterForm.css";
import { useState, useRef } from "react";

function RegisterForm ({onSuccess}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState("");
    const fileInputRef = useRef(null);

    async function checkUserName(username) {
        try {
            const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
            if (!res.ok) { console.error("Username check failed:", res.status); return true; }
            const data = await res.json();
            return data.available;
        } catch (error) {
            console.error("Error checking username:", error);
            return true;
        }
    }

    function checkPassword(password) {
        const hasNumber = /\d/.test(password);
        return password.length >= 5 && hasNumber;
    }

    function checkEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function checkCity(city) {
        return city.value !== "" && /^[a-zA-Z\s]+$/.test(city.value);
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!allowed.includes(file.type)) {
            setImageError('Only image files are allowed (jpeg, jpg, png, gif, webp)');
            e.target.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setImageError('Image must be under 2MB.');
            e.target.value = '';
            return;
        }
        setImageError('');
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function checkUserInput(fields) {
        let valid = true;
        let username = fields[0];
        let email = fields[1];
        let password = fields[2];
        let confirmPassword = fields[3];
        let city = fields[4];

        if (!(await checkUserName(username.value))) {
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "Username already exists.";
            errorDiv.style.color = "red";
            username.parentNode.appendChild(errorDiv);
        }

        if (!checkEmail(email.value)) {
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "Please enter a valid email address.";
            errorDiv.style.color = "red";
            email.parentNode.appendChild(errorDiv);
        }

        if (!checkPassword(password.value)) {
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "Password must be at least 5 characters long and contain a number.";
            errorDiv.style.color = "red";
            password.parentNode.appendChild(errorDiv);
        }

        if (!checkCity(city)) {
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "City cannot be empty and must contain only letters and spaces.";
            errorDiv.style.color = "red";
            city.parentNode.appendChild(errorDiv);
        }

        if (password.value !== confirmPassword.value) {
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "Passwords do not match.";
            errorDiv.style.color = "red";
            confirmPassword.parentNode.appendChild(errorDiv);
        }

        return valid;
    }

    async function submitForm(event) {
        event.preventDefault();
        document.querySelectorAll(".error-message").forEach((e) => e.remove());

        const fields = [
            document.querySelector('input[type="text"]'),
            document.querySelector('input[type="email"]'),
            document.querySelectorAll('input[type="password"]')[0],
            document.querySelectorAll('input[type="password"]')[1],
            document.querySelector('input[name="city"]')
        ];

        fields.forEach((field) => {
            if (field.value === "") {
                const errorDiv = document.createElement("p");
                errorDiv.className = "error-message";
                errorDiv.textContent = "Please fill in all fields.";
                errorDiv.style.color = "red";
                field.parentNode.appendChild(errorDiv);
            }
        });

        if (!(await checkUserInput(fields))) return;

        // convert image to base64 if provided
        let imageBase64 = '';
        if (imageFile) {
            imageBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });
        }

        setLoading(true);
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, confirmPassword, city, image: imageBase64 })
            });

            const data = await response.json();
            if (response.status === 400) {
                const errorDiv = document.createElement("p");
                errorDiv.className = "error-message";
                errorDiv.textContent = data.message;
                errorDiv.style.color = "red";
                document.querySelector('input[type="email"]').parentNode.appendChild(errorDiv);
            } else if (response.status === 201) {
                onSuccess({
                    _id: data.id,
                    username: data.name,
                    email: data.email,
                    usertype: data.usertype,
                    city: data.city,
                    aboutMe: data.aboutMe || '',
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-wrapper">
            <div className="form-card">
                <h1 className="form-brand">BookPool</h1>
                <p className="form-subtitle">Create your account</p>

                {/* pfp picker */}
                <div className="avatar-upload-group">
                    <div className="avatar-preview" onClick={() => fileInputRef.current.click()}>
                        {imagePreview
                            ? <img src={imagePreview} alt="preview" />
                            : <span className="avatar-placeholder">＋<br/>Photo</span>
                        }
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    {imageError && <p className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{imageError}</p>}
                    <p className="avatar-hint">Profile photo (optional)</p>
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" placeholder="Enter your nickname" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a passcode" />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Type your password again" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter a city" />
                </div>
                <button className="submit-btn" onClick={submitForm} disabled={loading}>
                    {loading ? 'Loading...' : 'Submit & Login'}
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;