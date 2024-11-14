import React from "react";
import { Link } from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  console.log("---->", value);
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function Navbar() {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    console.log("Access token found in cookies:", accessToken);
  } else {
    console.log("Access token not found in cookies.");
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fs-5 py-3">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">
            GoFood
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className="nav-link active fs-4 "
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {accessToken ? (
                <li className="nav-item">
                  <Link
                    className="nav-link active fs-4 "
                    aria-current="page"
                    to="/my-orders"
                  >
                    My Orders
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
            <div className="d-flex">
              {!accessToken && (
                <>
                  <Link className="btn bg-white text-dark mx-1" to="/login">
                    Login
                  </Link>

                  <Link className="btn bg-white text-dark mx-1" to="/SignUp">
                    SignUp
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
