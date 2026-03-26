import Form from "../components/Form.jsx";
import { useNavigate } from "react-router-dom";

function Login({ onSuccess }) {
    const navigate = useNavigate();

    function handleSuccess(userData) {
        if (typeof onSuccess === "function") {
            onSuccess(userData);
        }
        navigate("/profile");
    }

    return <Form onSuccess={handleSuccess} />;
}

export default Login;