import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";
import "../styles/login.css";

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);

const [error, setError] = useState("");
const handleLogin = async () => {

    setLoading(true);

    setError("");

    try {

        const response = await api.post("/login", {

           email: email,

            password: password

        });

        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/dashboard");

    }

    catch (err) {

        if (err.response) {

            setError(err.response.data.message);

        }

        else {

            setError("Server connection failed.");

        }

    }

    finally {

        setLoading(false);

    }

};

    return (

        <div className="login-container">

            <div className="background-circle circle1"></div>
            <div className="background-circle circle2"></div>

            <div className="login-card">

                <div className="logo">

                    <div className="logo-icon">
                        SD
                    </div>

                    <h1>SmartDesk</h1>

                    <p>IT Ticket Management System</p>

                </div>

                <div className="input-group">

                    <FaUser className="icon"/>

                   <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>

                </div>

                <div className="input-group">

                    <FaLock className="icon"/>

                   <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>

                    {
                        showPassword ?

                        <FaEyeSlash
                            className="eye"
                            onClick={() => setShowPassword(false)}
                        />

                        :

                        <FaEye
                            className="eye"
                            onClick={() => setShowPassword(true)}
                        />
                    }

                </div>
                    {
    error &&

    <p className="error">

        {error}

    </p>

}
                <button
    onClick={handleLogin}
>

    {loading ? "Logging in..." : "Login"}

</button>

            </div>

        </div>

    );

}

export default Login;