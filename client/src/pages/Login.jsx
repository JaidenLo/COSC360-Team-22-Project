import { useState } from "react";
import Form from "../components/Form.jsx";
import UserProfile from "../components/UserProfile.jsx";

function Login({ onSuccess }) {
    const [user, setUser] = useState(null);

    function handleSuccess(userData) {
        setUser(userData);
        onSuccess(userData);
    }

    return (
        <>
            {user ? (
                <UserProfile username={user.username} email={user.email} />
            ) : (
                <Form onSuccess={handleSuccess} />
            )}
        </>
    );
}
export default Login;