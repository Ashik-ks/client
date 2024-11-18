import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Forgetpassword() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log("token : ", token);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const body = {
        newpassword: newPassword,
        confirmpassword: confirmPassword
    };

    // Function to handle the password reset
    const forgotPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(
                `http://localhost:3000/reset-password`,
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log("Password reset result: ", response.data);

            if (response.status === 200) {
                setSuccess("Password reset successful!");
                setTimeout(() => {
                    navigate('/'); // Redirect to the home page after success
                }, 1500);
            } else {
                setError(response.data.message || "Error resetting password");
            }
        } catch (error) {
            setError("An error occurred while resetting the password.");
            console.error("Error resetting password:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="container forgetpasswordcontainer">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-12 col-md-6 col-lg-4 bg-light shadow-sm p-3 mb-5 bg-body rounded">
                    <h1 className="text-center mb-4">Reset Your Password</h1>
                    <p className="text-center mb-4">
                        If you have forgotten your password, please enter your new password below to reset it.
                        Make sure it is something secure and easy to remember!
                    </p>
                    <form onSubmit={forgotPassword} className="reset-password-form d-flex flex-column">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        {/* New Password Field */}
                        <div className="mb-3">
                            <label htmlFor="forgotNewpassword" className="resetformtext ms-3">New Password</label>
                            <div className="password-container position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="forgotNewpassword"
                                    name="new-password"
                                    className="forgetpassdiv ms-3"
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="passwordtogglebtn border-0 bg-white position-absolute end-1 top-50 translate-middle-y"
                                    onClick={togglePasswordVisibility}
                                    style={{ right: '10px' }}
                                >
                                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-3">
                            <label htmlFor="confirmpassword" className="resetformtext ms-3">Confirm Password</label>
                            <div className="password-container position-relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmpassword"
                                    name="confirm-password"
                                    className="forgetpassdiv ms-3"
                                    placeholder="Enter Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="passwordtogglebtn border-0 bg-white position-absolute end-1 top-50 translate-middle-y"
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{ right: '10px' }}
                                >
                                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn mt-3 ms-3 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
