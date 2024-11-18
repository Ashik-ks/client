import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const tokenData = queryParams.get('login');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false); 
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); 
  const [isPageBlurred, setIsPageBlurred] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem(tokenData);
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        setUsers(response.data.data || []);  // Set users to state
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);  // End loading
      }
    };

    fetchUsers();
  }, [tokenData]); 

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const dataToSubmit = { password, newpassword };
  
    try {
        // Get the token from localStorage
        const token = localStorage.getItem(id);  // Ensure the key used is correct
        if (!token) {
            console.error("Token is missing, please log in again.");
            alert("You need to log in again. Token is missing.");
            return;
        }
  
        // Send the PUT request to reset the password
        const response = await axios.put(`http://localhost:3000/passwordreset/${id}`, dataToSubmit, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
  
        // Check if the server responded successfully
        if (response.status === 200) {
            // Display success message if available
            const successMessage = response.data.message || 'Password reset successfully!';
            alert(successMessage); // Show the success message from the server

            // Navigate to the home page after success
            navigate(`/`); 
        } else {
            // If the response status is not 200, show the message from the server
            const errorMessage = response.data.message || 'Password reset failed. Please try again.';
            alert(errorMessage);
        }
    } catch (error) {
        console.error("Error resetting password:", error);

        // Handle specific error cases based on error response from server
        if (error.response) {
            // If the error has a response from the server, use that message
            const errorMessage = error.response.data.message || 'An error occurred while resetting the password.';
            alert(errorMessage);
        } else {
            // If no response from server, show a generic error message
            alert("An error occurred while resetting the password.");
        }
    }
};


  useEffect(() => {
    if (showLogoutConfirmation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showLogoutConfirmation]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true); 
    setIsPageBlurred(true); 
  };
  
  const cancelLogout = () => {
    setShowLogoutConfirmation(false); 
    setIsPageBlurred(false); 
  };
  

  const confirmLogout = () => {
    localStorage.removeItem(tokenData); 
    navigate('/'); 
  };

  const singleview = (_id) => {
    navigate(`/singleview/${_id}/${tokenData}`);
  };

  const deleteUser = async (userId) => {
    const token = localStorage.getItem(tokenData);
  
    try {
      const response = await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert("User deleted successfully");
        navigate(0);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleEditForm = () => {
    setIsEditing(!isEditing);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prevState => !prevState);
  };

  return (
    <div className={`adduser1`}>
      <div className="container-fluid adminpage">
        <nav className="sidebar">
          <ul>
            <div className="logo fs-4 fw-bold mt-4 mb-4 text-decoration-underline">UMS Admin</div>
            <li className="pt-2">Dashboard</li>
            <li className="active">
              <button id="fetchvalue1" onClick={() => console.log("Filter button clicked")}>Users</button>
            </li>
            <li>
              <Link to={`/Adduser?id=${id}&login=${tokenData}`} className="settings text-light text-decoration-none">Add Users</Link>
            </li>
            <li>
              <button
                className="settings border-0"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
              >
                <span className="settings text-light">Settings</span>
              </button>
              <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5 id="offcanvasRightLabel" className="fs-5 fw-bold text-dark text-decoration-underline mt-3 ms-4">Profile Settings</h5>
                  <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                  <button className="btn1" onClick={toggleEditForm}>
                    {isEditing ? (
                      "Cancel"
                    ) : (
                      <>
                        Reset Your Password <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <form onSubmit={handlePasswordReset} className="resetform">
                     <div className="mb-3 coolinput">
  <label htmlFor="resetpassword" className="coolinputlabeltext">Current Password:</label>
  <div className="password-container position-relative">
    <input
      type={showPassword ? "text" : "password"} // Toggle between text and password input
      id="resetpassword"
      name="password"
      className="coolinputinput"
      placeholder="Enter Current password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button
      type="button"
      className="passwordtogglebtn border-0 bg-white position-absolute end-1 top-50 translate-middle-y"
      onClick={togglePasswordVisibility}
      style={{ right: '10px' }} // Adjust this value as needed
    >
      <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
    </button>
  </div>
</div>

<div className="mb-3 coolinput">
  <label htmlFor="newpassword" className="coolinputlabeltext">New Password:</label>
  <div className="password-container position-relative">
    <input
      type={showNewPassword ? "text" : "password"}
      id="newpassword"
      name="newpassword"
      className="coolinputinput"
      placeholder="Enter New Password"
      value={newpassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
    />
    <button
      type="button"
      className="password-toggle border-0 bg-white position-absolute end-1 top-50 translate-middle-y"
      onClick={toggleNewPasswordVisibility}
      style={{ right: '10px' }} // Adjust spacing as necessary
    >
      <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
    </button>
  </div>
</div>


                      <button type="submit" className="Btn mt-2">Submit</button>
                    </form>
                  )}
                </div>
              </div>
            </li>
            {/* Logout Button */}
            <li>
              <button onClick={handleLogout} className="settings border-0 text-light">Logout</button>
            </li>
          </ul>
        </nav>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirmation && (
          <div className="logout-modal">
            <div className="logout-modal-content">
              <h5>Are you sure you want to log out?</h5>
              <div className="modal-actions">
                <button className="btn" onClick={confirmLogout}>Yes</button>
                <button className="btn" onClick={cancelLogout}>No</button>
              </div>
            </div>
          </div>
        )}

        <main>
          <ul className="adminul">
            <input type="text" placeholder="Search..." className="admintextbox" />
          </ul>
          <div className="row fs-2 fw-bold text-decoration-underline mb-3 ms-4 text-dark" id="heading1">
            Users List
          </div>
          <div className="userlist text-dark">
            {loading ? (
              <p>Loading...</p>
            ) : users.length > 0 ? (
              users.map(user => (
                <div className="user-card shadow-sm p-3 mb-4 bg-light rounded" key={user._id}>
                  <div className="user-card-content">
                    {user.image && (
                      <img src={`http://localhost:3000/${user.image}`} alt={user.name} className="admincontainerimg"/>
                    )}
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                    <div className="user-actions">
                      <button className="btn" onClick={() => singleview(user._id)}>
                        View
                      </button>
                      <button className="btn" onClick={() => deleteUser(user._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </main>
      </div>
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

