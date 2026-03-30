import "./RegisterForm.css";


import { useState} from "react";

function RegisterForm ({onSuccess}) {
        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const [city, setCity] = useState("");




    //termpory to check if the user input is valid

    function checkUserName(username) {
        // find it in the database or server 
        return true;
    }

    function checkPassword(password) {
        // check if the password is at least 5 characters long and contains a number
        const hasNumber = /\d/.test(password);
        return password.length >= 5 && hasNumber;
    }

    function checkEmail(email) {
        // check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function checkCity(city){
       return city.value !== "" && /^[a-zA-Z\s]+$/.test(city.value);
    }

    function checkUserInput(fields){
        let valid = true;
        let username = fields[0];
        let email = fields[1];
        let password = fields[2];
        let city = fields[3];
        if (!checkUserName(username.value)){
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "Username already exists.";
            errorDiv.style.color = "red";
            username.parentNode.appendChild(errorDiv);
        } 

        if(!checkEmail(email.value)){
            valid = false;
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message";
            errorDiv.textContent = "Please enter a valid email address.";
            errorDiv.style.color = "red";
            email.parentNode.appendChild(errorDiv);
        }

        if( !checkPassword(password.value)){
            valid = false;
            const errorDiv = document.createElement("p");   
            errorDiv.className = "error-message";
            errorDiv.textContent = "Password must be at least 5 characters long and contain a number.";
            errorDiv.style.color = "red";
            password.parentNode.appendChild(errorDiv);
        }

        //to check city only contains letters and spaces and is not empty
        
        if(!checkCity(city)){
            valid = false;
            const errorDiv = document.createElement("p");   
            errorDiv.className = "error-message";
            errorDiv.textContent = "City cannot be empty and must contain only letters and spaces.";
            errorDiv.style.color = "red";
            city.parentNode.appendChild(errorDiv);
        }


        return valid;
    }


    async function submitForm (event) {
        
        event.preventDefault();

        document.querySelectorAll(".error-message").forEach((e) => e.remove());

        const fields = [
            document.querySelector('input[type="text"]'), 
            document.querySelector('input[type="email"]'), 
            document.querySelector('input[type="password"]'),
            document.querySelector('input[name="city"]')
            ];

        fields.forEach((field) => {
            if (field.value === "" ) {
                const errorDiv = document.createElement("p");
                errorDiv.className = "error-message";
                errorDiv.textContent = "Please fill in all fields.";
                errorDiv.style.color = "red";
                field.parentNode.appendChild(errorDiv);
            }
            
        });

        if (!checkUserInput(fields)) return;

        setLoading(true);
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, city })
            });
            const data = await response.json();
            if (response.status === 400) {
                alert("Error 400");
                const errorDiv = document.createElement("p");
                errorDiv.className = "error-message";
                errorDiv.textContent = data.message;
                errorDiv.style.color = "red";
                document.querySelector('input[type="email"]').parentNode.appendChild(errorDiv);
            } else if (response.status === 201) {
                onSuccess({
                    username: data.name,
                    email: data.email,
                    usertype: data.usertype,
                    city: '',
                    aboutMe: '',
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