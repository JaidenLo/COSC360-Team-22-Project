import './Form.css'

function Form() {
    return (
        <div className="form-wrapper">
            <div className="form-card">
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" placeholder="Enter your nickname" />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Enter a passcode" />
                </div>
                <button className="submit-btn">Submit &amp; Login</button>
            </div>
        </div>
    );
}

export default Form;