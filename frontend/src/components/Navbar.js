import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

export const Navbar = () => {
  let history = useHistory();

  const logout = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  let location = useLocation(); //Using useLocation() to highlight Home and About buttons in Navbar according to the URL
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          iNotebook
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                to="/about"
              >
                About
              </Link>
            </li>
          </ul>

          {!localStorage.getItem("authToken") ? (
            <>
              <Link
                className="btn btn-outline-primary mx-2"
                to="/login"
                type="submit"
              >
                Login
              </Link>
              <Link
                className="btn btn-outline-success"
                to="/signup"
                type="submit"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              className="btn btn-outline-primary"
              type="submit"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
