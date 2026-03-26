import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register({ onSuccess }) {
    const navigate = useNavigate();

    function handleSuccess(userData) {
        if (typeof onSuccess === "function") {
            onSuccess(userData);
        }
        navigate("/profile");
    }

    return <RegisterForm onSuccess={handleSuccess} />;
}

export default Register;