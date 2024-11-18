import React, { useState, useEffect } from "react";
import { Navigate, useParams,useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function Singleview() {
  const { id } = useParams();  
  console.log("Received ID: ", id);  

  const { login } = useParams();

  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState(null);  // State to handle errors

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("API Response:", response.data);  // Log the entire response

        if (!response.data || !response.data.data) {
          throw new Error("Data not found");
        }

        const fetchedData = response.data.data;  // Get the data from the response
        console.log("Fetched Data:", fetchedData);

        setData(fetchedData);  // Set data to state

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);  // Set error state
      } finally {
        setLoading(false);  // End loading
      }
    };

    fetchData(); 
  }, [id]);

  const passtoken = () => {
    console.log("passtoken button clicked with ID:");
    navigate(`/Admin?id=${id}&login=${login}`);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // If no data is found
  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <>
      <div className="adduser">
        <div className="container-fluid m-0 p-0">
          <nav className="navbar d-flex justify-content-center">
            <ul className="mt-1">
              <button className="border-0 bg-transparent fs-5 fw-bold Home" onClick={passtoken}>Home</button>
            </ul>
          </nav>
        </div>

        <div className="container mt-5">
          <div className="row">
            <div className="col-3" />
            <div className="col-6 fs-2 fw-bold text-decoration-underline text-dark">
              Profile Details
            </div>
            <div className="col-3" />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-3" />
            <div
              className="col-6 profilesettings text-light d-flex d-flex flex-column  lh-lg text-dark">
              <div className="row d-flex flex-column justify-content-center align-items-center">
                <div className="col text-center mt-3">
                  {/* Correct image path */}
                  <img src={`http://localhost:3000/${data[0].image}`} className="singleusercontainerimg" alt="User" />
                </div>

                <div className="col  mb-4 mt-3 fs-4 fw-bold">
                  Name: {data[0].name
                  }
                </div>

                <div className="col fs-4 fw-bold  mb-4">
                  Email: {data[0].email}
                </div>

                <div className="col fs-4 fw-bold  mb-5">
                  Join Date: {data[0].joiningDate}
                </div>
              </div>
            </div>
            <div className="col-3" />
          </div>
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
    </>
  );
}
