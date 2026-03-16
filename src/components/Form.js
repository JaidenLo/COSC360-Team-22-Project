import '../styles/Form.css';
import { useState } from 'react';

// Validation does not implement regex or any advanced techniques, just checks if the fields are empty.

function Form({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState('');

    function submitForm(event) {
        event.preventDefault();

        document.querySelectorAll('.error-message').forEach((e) => e.remove());

        const fields = [
            document.querySelector('input[type="text"]'),
            document.querySelector('input[type="email"]'),
            document.querySelector('input[type="password"]'),
        ];

        fields.forEach((field) => {
            if (field.value === '') {
                const errorDiv = document.createElement('p');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Please fill in all fields.';
                errorDiv.style.color = 'red';
                field.parentNode.appendChild(errorDiv);
            }
        });

        if (username && email && password) {
            setLoading(true);
            setServerMessage('');

            // POST form data to server
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setLoading(false);
                    if (data.error) {
                        setServerMessage(data.error);
                    } else {
                        setServerMessage(data.message);
                        setTimeout(() => onSuccess({ username: data.username, email }), 800);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    // Fallback to form data if fetch fails
                    onSuccess({ username, email });
                    setLoading(false);
                });
        }
    }

    return (
        <div className="form-wrapper">
            <div className="form-card">
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
                <button className="submit-btn" onClick={submitForm} disabled={loading}>
                    {loading ? 'Loading...' : 'Submit & Login'}
                </button>
                {serverMessage && <p className="server-message">{serverMessage}</p>}
            </div>
        </div>
    );
}

export default Form;
