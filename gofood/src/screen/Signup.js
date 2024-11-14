import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    fullName: "",
    email: "",
    geoLocation: "",
    password: "",
  });

  var navigate = useNavigate();

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    geoLocation: "",
    password: "",
    serverError: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({ ...errors, serverError: "" });

    let formIsValid = true;
    if (!validateEmail(credentials.email)) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Please enter a valid email address",
      }));
      formIsValid = false;
    }

    if (!validatePassword(credentials.password)) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password must be at least 8 characters long",
      }));
      formIsValid = false;
    }

    if (!credentials.fullName) {
      setErrors((prevState) => ({
        ...prevState,
        fullName: "Full name is required",
      }));
      formIsValid = false;
    }

    if (!credentials.geoLocation) {
      setErrors((prevState) => ({
        ...prevState,
        geoLocation: "GeoLocation/Address is required",
      }));
      formIsValid = false;
    }

    if (!formIsValid) return;

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/registerUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");
        setErrors({});
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 1000);
        setCredentials({
          fullName: "",
          email: "",
          geoLocation: "",
          password: "",
        });
      } else if (response.status === 500) {
        setErrors((prevState) => ({
          ...prevState,
          serverError:
            "User already exists. Please try with a different email or full name.",
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          serverError: data.message || "Failed to register user",
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors((prevState) => ({
        ...prevState,
        serverError: "Failed to connect to server. Please try again later.",
      }));
    }
  };

  const onChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });

    setErrors((prevState) => ({
      ...prevState,
      [event.target.name]: "",
      serverError: "",
    }));
    setSuccessMessage(""); // Clear success message when fields change
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={credentials.fullName}
              onChange={onChange}
            />
            {errors.fullName && (
              <div className="text-danger">{errors.fullName}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="geoLocation" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              name="geoLocation"
              value={credentials.geoLocation}
              onChange={onChange}
            />
            {errors.geoLocation && (
              <div className="text-danger">{errors.geoLocation}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={onChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                {/* Toggle eye icon */}
              </button>
            </div>
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>
          {errors.serverError && (
            <div className="text-danger mb-3">{errors.serverError}</div>
          )}
          <button type="submit" className="m-3 btn btn-success">
            Submit
          </button>
          <Link to="/login" className="m-3 btn btn-danger">
            Already a User?
          </Link>
        </form>

        {/* Success message */}
        {successMessage && (
          <div
            className="alert alert-success alert-dismissible fade show mt-3 d-flex align-items-center"
            role="alert"
          >
            <FaCheckCircle className="me-2" size={24} />{" "}
            {/* Adding the icon with a size */}
            <span>{successMessage}</span>
            <button
              type="button"
              className="btn-close ms-auto" // Bootstrap close button class
              onClick={() => setSuccessMessage("")} // Clear the message on button click
              aria-label="Close"
            ></button>
          </div>
        )}
      </div>
    </>
  );
}
