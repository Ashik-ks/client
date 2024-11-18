import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading
        console.log("Login button clicked...", email, password);

        const data = { email, password };

        try {
            const response = await axios.post('http://localhost:3000/login', data, {
                headers: {
                    'Content-Type': "application/json",
                },
            });

            if (response.status !== 200) {
                alert(response.data.message || "An error occurred");
                return;
            }

            const { token, tokenId, loginCount, userTypes } = response.data.data;
            console.log("Parsed response:", response.data);

            localStorage.setItem(tokenId, token); // Store the token
            console.log("Token stored successfully.");

            if (loginCount === 0) {
                navigate(`/resetpassword?id=${tokenId}`);
            } else if (userTypes === 'Admin') {
                alert("Admin login successful");
                navigate(`/Admin?id=${tokenId}&login=${tokenId}`);
            } else if (userTypes === 'Employee') {
                alert("Employee login successful");
                navigate(`/Employee?id=${tokenId}`);
            } else {
                alert("Unknown user type. Please contact support.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during login.");
        } finally {
            setLoading(false); // End loading
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="index">
            <div className="indexbody">
                <div className="animated slideInLeft" id="square">
                    <div className="animated bounceInUp" id="leftSquare">
                        <div className="animated bounceInUp" id="circle">
                            <img
                                className="brand img-responsive"
                                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/827672/branding.png"
                                alt="Brand Logo"
                            />
                        </div>
                        <h2 id="title">Welcome to Divider</h2>
                        <h3 id="subtitle">You are moments away from your first adventure.</h3>
                    </div>
                    <div className="animated bounceInDown" id="rightSquare">
                        <div id="container">
                            <h1 className="signup text-center">User Login and Management</h1>
                            <form className="text-center" onSubmit={login}>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control border-0 shadow-sm bg-body rounded mb-3 emaillogin"
                                    placeholder="Enter Your Email"
                                    required
                                />
                                <div className="passwordlogin d-flex border-0 shadow-sm bg-body rounded position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control border-0"
                                        placeholder="Enter Your Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="passwordhidden border-0 bg-white position-absolute end-0 top-50 translate-middle-y"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                                    </button>
                                </div>

                                <div className="mb-3 mt-2">
                                    <button type="button" className="forgetpass text-start">
                                        <Link to="/email-verification" className="forgetpasslink">Forgot Your Password?</Link>
                                    </button>
                                </div>
                                <input
                                    type="submit"
                                    value={loading ? "Logging in..." : "Login"}
                                    className="loginbtn"
                                    disabled={loading}
                                />
                            </form>
                            <h3 id="footer" className="text-center mt-3">
                                By continuing you agree to our{" "}
                                <span id="terms" onClick={() => alert("Terms and Conditions")}>
                                    terms &amp; conditions.
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
