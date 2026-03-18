import { useState } from "react";
import Form from "../components/Form.jsx";
import Profile from "../pages/Profile.jsx";

function Login({ onSuccess }) {
    const [user, setUser] = useState(null);

    function handleSuccess(userData) {
        setUser(userData);
        if (typeof onSuccess === 'function') {
            onSuccess(userData);
        }
    }

    return (
        <>
            {user ? (
                <Profile user={user} />
            ) : (
                <Form onSuccess={handleSuccess} />
            )}
        </>
    );
}
export default Login;