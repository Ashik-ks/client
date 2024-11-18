import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Resetpassword() {
    // Getting the query parameters from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    console.log("id:", id);

    // Retrieving the token from localStorage using a key like 'authToken'
    const token = localStorage.getItem(id); // You should use 'authToken' or the appropriate key
    console.log("Token:", token);

    const navigate = useNavigate(); // Initialize navigate for redirecting

    // State to handle form data
    const [password, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // States to handle password visibility toggle
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Toggle the visibility of the current password
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Toggle the visibility of the new password
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    // Handle the form submit for password reset
    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        // Validate that current password and new password don't match
        if (password === newpassword) {
            setError("New password cannot be the same as current password.");
            return; // Prevent form submission
        }

        // Prepare the data to send in the PUT request
        const dataToSubmit = { password, newpassword };
        console.log(dataToSubmit ,"jjj")

        // Check if token exists
        if (!token) {
            setError("No token found, please log in.");
            return;
        }

        setLoading(true); // Show loading state

        try {
            // Send PUT request to reset password
            const response = await axios.put(
                `http://localhost:3000/passwordreset/${id}`,
                dataToSubmit,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log("Response after password reset: ", response.data);

            // Check if the server returned a success status
            if (response.status === 200) {
                // Show success message from server or default message
                setSuccess(response.data.message || "Password reset successful!");
                setTimeout(() => {
                    navigate('/'); // Redirect to the home page after success
                }, 1500); // Delay to show success message
            } else {
                // If the response is not successful, display the error message from the server
                setError(response.data.message || "Error resetting password.");
            }
        } catch (error) {
            // Handle any errors during the request
            console.error("Error resetting password:", error);

            // Check for specific server errors and display appropriate messages
            if (error.response && error.response.data) {
                setError(error.response.data.message || "An error occurred while resetting the password.");
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="reset-password-container">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Reset Your Password</h2>
                    <p className="text-center text-muted mb-4">
                        Follow the instructions to create a strong password.
                    </p>

                    {/* Display error or success message */}
                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleProfileSubmit}>
                        {/* Password Tips Section */}
                        <div className="password-tips mb-4">
                            <h5 className="text-primary">Choose a Strong Password</h5>
                            <ul>
                                <li><strong>Don't reuse passwords</strong> from other accounts.</li>
                                <li><strong>At least 8 characters</strong>: Use a minimum of 8 characters.</li>
                                <li><strong>Avoid obvious passwords</strong>: Don't use names or common phrases.</li>
                                <li><strong>Be cautious of staying signed in</strong> on shared devices.</li>
                            </ul>
                        </div>

                        {/* Current Password Input */}
                        <div className="mb-3 coolinput1">
                            <label htmlFor="resetpassword" className="coolinputlabeltext">
                                Current Password:
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"} // Toggle between text and password
                                    id="resetpassword"
                                    name="password"
                                    className="coolinputinput1"
                                    placeholder="Enter Current Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle border-0 bg-white position-absolute end-1 top-50 translate-middle-y"
                                    onClick={togglePasswordVisibility}
                                    style={{ right: '10px' }} // Adjust positioning if needed
                                >
                                    <i
                                        className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} // Conditionally render eye icon
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                        </div>

                        {/* New Password Input */}
                        <div className="mb-3 coolinput1">
                            <label htmlFor="newpassword" className="coolinputlabeltext">
                                New Password:
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showNewPassword ? "text" : "password"} // Toggle between text and password
                                    id="newpassword"
                                    name="new-password"
                                    className="coolinputinput1"
                                    placeholder="Enter New Password"
                                    value={newpassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle border-0 bg-white position-absolute end-1 top-50 translate-middle-y"
                                    onClick={toggleNewPasswordVisibility}
                                    style={{ right: '10px' }} // Adjust positioning if needed
                                >
                                    <i
                                        className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} // Conditionally render eye icon
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
