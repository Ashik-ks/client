import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddUser() {
    const tokenkey = new URLSearchParams(window.location.search).get('login');
    const id = new URLSearchParams(window.location.search).get('id');
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setMessage('Please select a valid image file (JPEG, PNG, GIF).');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setMessage('File size should be less than 2MB.');
                return;
            }
            setImage(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            setMessage('Please select an image file.');
            return;
        }

        try {
            const dataUrl = await readFileAsDataURL(image);
            await submitData(dataUrl);
        } catch (error) {
            console.error("Error reading files: ", error);
            setMessage('Failed to read the file.');
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const submitData = useCallback(async (dataUrl) => {
        const token = localStorage.getItem(tokenkey);

        if (!token) {
            setMessage('Authorization token not found.');
            return;
        }

        const add_data = {
            name,
            email,
            joiningDate,
            image: dataUrl,
        };

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3000/users',
                add_data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Show a success toast (non-blocking)
                toast.success(
                    <>
                        User added successfully!
                        <button
                            onClick={handleRedirect}
                            style={{
                                marginLeft: '10px',
                                padding: '2px 7px',
                                backgroundColor: '#d685df',  // Soft purple background
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',  // More rounded corners
                                fontSize: '14px',  // A more readable font size
                                cursor: 'pointer',  // Indicate that the button is clickable
                                transition: 'background-color 0.3s',  // Smooth background color transition on hover
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c074cc'} // Change color on hover
                            onMouseOut={(e) => e.target.style.backgroundColor = '#d685df'} // Revert to original color
                        >
                            OK
                        </button>

                    </>,
                    {
                        position: "top-center",
                        autoClose: false, // Don't auto close
                        hideProgressBar: true,
                        closeOnClick: false, // Don't close on click
                        pauseOnHover: true,
                    }
                );

                // Clear form state after user is added
                setName('');
                setEmail('');
                setJoiningDate('');
                setImage(null);
                document.getElementById('image').value = ''; // Reset the file input
            } else {
                setMessage(response.data.message || "User not added");
            }
        } catch (error) {
            console.error("Error submitting data: ", error);
            setMessage("An error occurred while adding the user.");
        } finally {
            setLoading(false);
        }
    }, [name, email, joiningDate, image, navigate]);

    const handleRedirect = () => {
        navigate(`/Admin?id=${id}&login=${tokenkey}`);
    };

    const prevpage = () => {
        navigate(`/Admin?id=${id}&login=${tokenkey}`);
    };

    return (
        <div className="adduserbody pt-3">
            <button onClick={prevpage} className='arrowbtn'>
                <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
            </button>

            <div className="container containerdiv ">
                <div className="row mt-3 pb-4 formingcontainer">
                    <div className="col  d-flex justify-content-end">
                        <img src="../../../public/adduser.jpg" alt="User Add" className="adduser-image" />
                    </div>
                    <div className="col mt-4">
                        <div className="form-container1">
                            <h2>User Form</h2>
                            <form id="userForm" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder='Enter Name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control adduseremail"
                                        placeholder='Enter Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image">Image:</label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="joiningdate">Joining Date:</label>
                                    <input
                                        type="date"
                                        id="joiningdate"
                                        name="joiningdate"
                                        className="form-control"
                                        value={joiningDate}
                                        onChange={(e) => setJoiningDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="adduserbtn mt-2" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                            {message && <p className={`text-${loading ? 'success' : 'danger'}`}>{message}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ToastContainer is now rendered here */}
            <ToastContainer
                className="toast-container-center"
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />

            <div className="container-fluid pt-4 pb-2 footer1">
                <div className="row">
                    <div className="col-2" />
                    <div className="col-2 d-flex flex-column   mt-3">
                        <div className="row text-decoration-underline ps-2 text-dark">Quick Links</div>
                        <div className="row">
                            <a href="/" className="text-dark text-decoration-none">
                                Home
                            </a>
                        </div>
                        <div className="row">
                            <a href="/features" className="text-dark text-decoration-none">
                                Features
                            </a>
                        </div>
                        <div className="row">
                            <a href="/pricing" className="text-dark text-decoration-none">
                                Pricing
                            </a>
                        </div>
                        <div className="row">
                            <a href="/support" className="text-dark text-decoration-none">
                                Support
                            </a>
                        </div>
                    </div>
                    <div className="col-2 d-flex flex-column   mt-3">
                        <div className="row text-decoration-underline ps-2 text-dark">Resources</div>
                        <div className="row">
                            <a href="/docs" className="text-dark text-decoration-none">
                                Documentation
                            </a>
                        </div>
                        <div className="row">
                            <a href="/api" className="text-dark text-decoration-none">
                                API Reference
                            </a>
                        </div>
                        <div className="row">
                            <a href="/faqs" className="text-dark text-decoration-none">
                                FAQs
                            </a>
                        </div>
                        <div className="row">
                            <a href="/guides" className="text-dark text-decoration-none">
                                User Guides
                            </a>
                        </div>
                    </div>
                    <div className="col-2 d-flex flex-column  mt-3">
                        <div className="row text-decoration-underline ps-2 text-dark">Legal</div>
                        <div className="row">
                            <a href="/privacy" className="text-dark text-decoration-none">
                                Privacy Policy
                            </a>
                        </div>
                        <div className="row">
                            <a href="/terms" className="text-dark text-decoration-none">
                                Terms of Service
                            </a>
                        </div>
                        <div className="row">
                            <a href="/blog" className="text-dark text-decoration-none">
                                Blog
                            </a>
                        </div>
                    </div>
                    <div className="col-2 d-flex flex-column   mt-3">
                        <div className="row text-decoration-underline ps-2 text-dark">Connect with Us</div>
                        <div className="row">
                            <a href="/contact" className="text-dark text-decoration-none">
                                Contact Us
                            </a>
                        </div>
                        <div className="row">
                            <a href="" className="text-dark text-decoration-none">
                                1-800-123-4567
                            </a>
                        </div>
                        <div className="row">
                            <a
                                href="mailto:support@yourcompany.com"
                                className="text-dark text-decoration-none"
                            >
                                support@yourcompany.com
                            </a>
                        </div>
                    </div>
                    <div className="col-2" />
                </div>
                <div className="row">
                    <div className="col-2" />
                    <div className="col border border-secondary border-top" />
                    <div className="col-2" />
                </div>
                <div className="row ">
                    <div className="col-2" />
                    <div className="col text-dark">
                        Copyright © [Year] [Your Company Name]. All rights reserved.
                    </div>
                    <div className="col-2" />
                </div>
            </div>
        </div>
    );
}

export default AddUser;
