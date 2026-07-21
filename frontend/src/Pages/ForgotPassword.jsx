import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/forgot-password", {
        email,
      });

      setPopup({
        show: true,
        type: "success",
        message:
          response.data.message ||
          "Password reset link has been sent to your email.",
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );

      setPopup({
        show: true,
        type: "error",
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to send password reset email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopup({
      show: false,
      type: "success",
      message: "",
    });
  };

  return (
    <>
      <div className="container-fluid login-container">
        <div className="row min-vh-100">
          <div className="col-md-7 d-none d-md-flex login-image-section">
            <img
              src="https://readymadeui.com/signin-image.webp"
              alt="Forgot password"
              className="img-fluid login-image"
            />
          </div>

          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center bg-white">
            <div className="login-form-wrapper">
              <div className="mb-5">
                <h1 className="fw-bold mb-3">Forgot password</h1>

                <p className="text-secondary">
                  Enter your registered email address. We will send you a
                  password reset link.
                </p>
              </div>

              <form
                noValidate
                onSubmit={handleSubmit}
                className={validated ? "was-validated" : ""}
              >
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="form-label fw-semibold"
                  >
                    Email address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control form-control-lg login-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />

                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Sending link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {popup.show && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-body text-center p-4 p-md-5">
                  <div
                    className={`popup-icon mx-auto mb-3 ${
                      popup.type === "success"
                        ? "popup-success"
                        : "popup-error"
                    }`}
                  >
                    {popup.type === "success" ? "✓" : "!"}
                  </div>

                  <h4
                    className={`fw-bold ${
                      popup.type === "success"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {popup.type === "success"
                      ? "Email sent"
                      : "Request failed"}
                  </h4>

                  <p className="text-secondary mb-4">{popup.message}</p>

                  <button
                    type="button"
                    className={`btn w-100 ${
                      popup.type === "success"
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                    onClick={closePopup}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" />
        </>
      )}
    </>
  );
}

export default ForgotPassword;