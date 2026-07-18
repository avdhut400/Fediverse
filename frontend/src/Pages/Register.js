import React, { useState } from "react";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "error",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const closePopup = () => {
    setPopup({
      show: false,
      type: "error",
      message: "",
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/api/auth/register", formData);

      setPopup({
        show: true,
        type: "success",
        message:
          response.data?.message ||
          "Your account has been created successfully.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(
        "Signup error:",
        err.response?.data || err.message
      );

      setPopup({
        show: true,
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Background glow */}
      <div className="signup-glow signup-glow-one" />
      <div className="signup-glow signup-glow-two" />

      <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div className="signup-card">
          <div className="text-center mb-4">
            <div className="signup-logo mx-auto mb-3">
              🌐
            </div>

            <h1 className="signup-title">
              Create Account
            </h1>

            <p className="signup-subtitle mb-0">
              Join Fediverse and connect with the world
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSignup}
            className={validated ? "was-validated" : ""}
          >
            {/* Username */}
            <div className="mb-3">
              <label
                htmlFor="signupUsername"
                className="signup-label"
              >
                Username
              </label>

              <div className="signup-input-group">
                <span className="signup-input-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </span>

                <input
                  type="text"
                  name="username"
                  id="signupUsername"
                  className="form-control signup-input"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                  required
                />

                <div className="invalid-feedback">
                  Username must contain between 3 and 30 characters.
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label
                htmlFor="signupEmail"
                className="signup-label"
              >
                Email address
              </label>

              <div className="signup-input-group">
                <span className="signup-input-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 7-8.99 5.73a2 2 0 0 1-2.02 0L2 7" />
                    <rect
                      x="2"
                      y="4"
                      width="20"
                      height="16"
                      rx="2"
                    />
                  </svg>
                </span>

                <input
                  type="email"
                  name="email"
                  id="signupEmail"
                  className="form-control signup-input"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

                <div className="invalid-feedback">
                  Please enter a valid email address.
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="signupPassword"
                className="signup-label"
              >
                Password
              </label>

              <div className="signup-input-group">
                <span className="signup-input-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                    />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="signupPassword"
                  className="form-control signup-input signup-password-input"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={64}
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowPassword((currentValue) => !currentValue)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 9 4 10 8a11.8 11.8 0 0 1-2 4.2" />
                      <path d="M6.6 6.6C4.5 8 3.2 10 2 12c1.7 4 5 8 10 8 1.6 0 3-.4 4.3-1" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>

                <div className="invalid-feedback">
                  Password must contain between 8 and 64 characters.
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn signup-submit-button w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="signup-login-text text-center mb-0">
              Already have an account?

              <Link
                to="/login"
                className="signup-login-link ms-1"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Success/Error popup */}
      {popup.show && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content signup-popup border-0">
                <div className="modal-body text-center p-4">
                  <div
                    className={`signup-popup-icon mx-auto mb-3 ${
                      popup.type === "success"
                        ? "signup-popup-success"
                        : "signup-popup-error"
                    }`}
                  >
                    {popup.type === "success" ? "✓" : "!"}
                  </div>

                  <h4 className="text-white fw-bold mb-2">
                    {popup.type === "success"
                      ? "Account Created"
                      : "Signup Failed"}
                  </h4>

                  <p className="signup-popup-message mb-4">
                    {popup.message}
                  </p>

                  {popup.type === "error" && (
                    <button
                      type="button"
                      className="btn btn-danger w-100 rounded-pill"
                      onClick={closePopup}
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default Signup;

