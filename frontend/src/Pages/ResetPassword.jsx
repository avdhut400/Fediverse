import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../utils/api";
import "./Login.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPopup({
        show: true,
        type: "error",
        message: "Password and confirm password do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        `/api/auth/reset-password/${token}`,
        formData
      );

      setPopup({
        show: true,
        type: "success",
        message:
          response.data.message ||
          "Your password has been reset successfully.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );

      setPopup({
        show: true,
        type: "error",
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to reset password.",
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
              alt="Reset password"
              className="img-fluid login-image"
            />
          </div>

          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center bg-white">
            <div className="login-form-wrapper">
              <div className="mb-5">
                <h1 className="fw-bold mb-3">Reset password</h1>

                <p className="text-secondary">
                  Enter and confirm your new password.
                </p>
              </div>

              <form
                noValidate
                onSubmit={handleSubmit}
                className={validated ? "was-validated" : ""}
              >
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                  >
                    New password
                  </label>

                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-control form-control-lg login-input password-input"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                    <div className="invalid-feedback">
                      Password must contain at least 6 characters.
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label fw-semibold"
                  >
                    Confirm password
                  </label>

                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control form-control-lg login-input password-input"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>

                    <div className="invalid-feedback">
                      Please confirm your new password.
                    </div>
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
                      Resetting password...
                    </>
                  ) : (
                    "Reset password"
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
                      ? "Password reset"
                      : "Reset failed"}
                  </h4>

                  <p className="text-secondary mb-4">{popup.message}</p>

                  {popup.type === "error" && (
                    <button
                      type="button"
                      className="btn btn-danger w-100"
                      onClick={closePopup}
                    >
                      Try again
                    </button>
                  )}
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

export default ResetPassword;