import RegisterForm from "../components/RegisterForm";
import React from "react";
import "./Register.css";

function Register({ onSuccess }) {

    return (
        <>
            
           <RegisterForm onSuccess={onSuccess} />
        </>
    );
}

export default Register;