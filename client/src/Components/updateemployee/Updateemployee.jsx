import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function UpdateEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem(id);  // Retrieve token using a fixed key

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if token exists, and navigate to login if not
  useEffect(() => {
      if (!token) {
          navigate('/');  // Redirect to login if no token
      }
  }, [token, navigate]);

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              const response = await axios.get(`http://localhost:3000/users/${id}`, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });

              if (response.data && response.data.data) {
                  const { name, email, joiningDate, image } = response.data.data[0];
                  setName(name);
                  setEmail(email);
                  setJoiningDate(joiningDate);
                  setImage(image);
              } else {
                  setError('Failed to fetch user data.');
              }
          } catch (error) {
              setError('An error occurred while fetching the data.');
          } finally {
              setLoading(false);
          }
      };

      if (id) fetchData();
  }, [id]);

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setImageBase64(reader.result);
          };
          reader.readAsDataURL(file);
      } else {
          setImageBase64(image); // Keep the existing image if no new image is selected
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateEmail(email)) {
          alert("Please enter a valid email.");
          return;
      }

      setLoading(true);
      setError('');

      const body = {
          name,
          email,
          joiningDate,
          image: imageBase64,
      };

      try {
          const response = await axios.put(`http://localhost:3000/users/${id}`, body, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });

          if (response.status === 200) {
              alert("User updated successfully");
              navigate(`/employee?id=${id}`);
          } else {
              setError('Failed to update user. Please try again.');
          }
      } catch (error) {
          setError('An error occurred while updating the employee.');
      } finally {
          setLoading(false);
      }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return (
    <div className="adduser">
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <nav className="navbar d-flex justify-content-center ">
        <ul className="d-flex">
          <li className="nav-item list-unstyled">
            <button
              onClick={() => navigate(`/Employee?id=${id}`)}
              className="border-0 bg-transparent Home fs-5 fw-bold"
            >
              Home Page
            </button>
          </li>
        </ul>
      </nav>

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
              className="form-control"
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
              onChange={handleImageChange}
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
            />
          </div>

          <button type="submit" className="employeeupdatebtn mt-2">
            Submit
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <div className="container-fluid pt-4 pb-2 footer1">
        <div className="row">
          <div className="col-2" />
          <div className="col-2 d-flex flex-column mt-3">
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

          <div className="col-2 d-flex flex-column mt-3">
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
          <div className="col-2 d-flex flex-column mt-3">
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
          <div className="col-2 d-flex flex-column mt-3">
            <div className="row text-decoration-underline ps-2 text-dark">Connect with Us</div>
            <div className="row">
              <a href="/contact" className="text-dark text-decoration-none">
                Contact Us
              </a>
            </div>
            <div className="row">
              <a href="tel:1-800-123-4567" className="text-dark text-decoration-none">
                1-800-123-4567
              </a>
            </div>
            <div className="row">
              <a href="mailto:support@yourcompany.com" className="text-dark text-decoration-none">
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

        <div className="row">
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
