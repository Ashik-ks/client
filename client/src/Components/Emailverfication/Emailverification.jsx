import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmailVerification() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const emailverify = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const body = { email };

        try {
            console.log("emailverify function called");
            const response = await axios.post('http://localhost:3000/forgot-password', body, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log("Response:", response);

            if (response.status === 200) {
                alert("Email verified successfully");
                navigate(`/`);
            } else {
                alert(`Failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            const message = error.response?.data?.message || "An error occurred while verifying email";
            alert(message);
        }
    };

    return (
        <>
            <div className="verification-body">
                <div className="container d-flex align-items-center justify-content-center vh-100">
                    <div className="col-md-4 form-container">
                        <h1 className="text-center form-title">Email Verification</h1>
                        <p className="text-center">
                            We’ve sent a verification email to <strong>example@example.com</strong>.
                            Please check your inbox and click the link to verify your email.
                        </p>
                        <form id="verification-form" className="mb-4" onSubmit={emailverify}>
                            <label htmlFor="forgotemail" className="fs-6 fw-bold forgotemail">
                                Enter Your Email:
                            </label>
                            <input
                                type="email"
                                id="forgotemail"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                required=""
                            />
                            <button type="submit" className="verifybtn mt-3">
                                Verify Email
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
