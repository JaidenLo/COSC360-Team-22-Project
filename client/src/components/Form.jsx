import "./Form.css";
import { useState } from "react";

function Form ({onSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading] = useState(false);

    function addError(field, message) {
        const errorDiv = document.createElement("p");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;
        errorDiv.style.color = "red";
        field.parentNode.appendChild(errorDiv);
    }

    async function submitForm(event) {
        event.preventDefault();
        document.querySelectorAll(".error-message").forEach((e) => e.remove());

        const fields = [document.querySelector('input[type="email"]'), document.querySelector('input[type="password"]')];

        fields.forEach((field) => {
            if (field.value === "") {
                const errorDiv = document.createElement("p");
                errorDiv.className = "error-message";
                errorDiv.textContent = "Please fill in all fields.";
                errorDiv.style.color = "red";
                field.parentNode.appendChild(errorDiv);
            }
        });

        if (!email || !password) return;

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 404) {
            addError(document.querySelector('input[type="email"]'), "User not found.");
        } else if (response.status === 400) {
            addError(document.querySelector('input[type="password"]'), "Incorrect password.");
        } else if (response.status === 200) {
            onSuccess({
                _id: data.id,
                username: data.name,
                email: data.email,
                city: data.city,
                usertype: data.usertype,
                aboutMe: data.aboutMe
            });
        }
    }

    return (
        <div className="form-wrapper">
            <div className="form-card">
                <h1 className="form-brand">BookPool</h1>
                <p className="form-subtitle">Sign in to your account</p>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a passcode" />
                </div>
                <button className="submit-btn" onClick={submitForm} disabled={loading}>
                    {loading ? 'Loading...' : 'Submit & Login'}
                </button>
            </div>
        </div>
    );
}

export default Form;