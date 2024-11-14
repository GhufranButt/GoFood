import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  var navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    serverError: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // New state variable for password visibility
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formIsValid) return;

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      console.log("response ---->", response);
      console.log("data---->", data);

      if (response.status === 200) {
        setSuccessMessage("User logged in successfully!");
        setErrors({});
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/");
        }, 2000);
        setCredentials({
          email: "",
          password: "",
        });
      } else if (response.status === 400) {
        if (data.message === "User does not exist. Please sign up.") {
          setErrors((prevState) => ({
            ...prevState,
            serverError: "User does not exist. Please sign up.",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            serverError: data.message || "An error occurred. Please try again.",
          }));
        }
      } else if (response.status === 401) {
        setErrors((prevState) => ({
          ...prevState,
          serverError: data.message || "Invalid password. Please try again.",
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          serverError: "An unexpected error occurred.",
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
    setSuccessMessage("");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
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

          {/* Password field with eye button */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={onChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility} // Toggle password visibility
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
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
          <Link to="/signUp" className="m-3 btn btn-danger">
            Want to Signup?
          </Link>
        </form>

        {/* Success message with icon */}
        {successMessage && (
          <div className="alert alert-success mt-3">
            <FaCheckCircle className="me-2" />
            {successMessage}
          </div>
        )}
      </div>
    </>
  );
}
