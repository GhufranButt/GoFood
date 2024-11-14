import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screen/Home";
import Login from "./screen/Login";
import Signup from "./screen/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css"; // Your custom CSS

function App() {
  const [darkMode, setDarkMode] = useState(false); // State to manage dark mode

  // Effect to toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bootstrap-dark-mode"); // Add dark mode class
    } else {
      document.body.classList.remove("bootstrap-dark-mode"); // Remove dark mode class
    }
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <div>
        <header className="p-3">
          <button onClick={toggleDarkMode} className="btn btn-secondary">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
