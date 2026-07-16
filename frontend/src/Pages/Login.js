
// import React, { useState, useContext } from "react";
// import API from "../utils/api";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// function Login() {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [validated, setValidated] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     // Bootstrap validation check
//     if (!form.checkValidity()) {
//       e.stopPropagation();
//       setValidated(true);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await API.post("/api/auth/login", formData);
//       login(res.data.token);
//       localStorage.setItem("username", res.data.user.username);
//       alert("Login successful");
//       navigate("/");
//     } catch (err) {
//       console.error("Login failed:", err.response?.data || err.message);
//       alert(
//         err.response?.data?.error || "Login failed. Please check credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page d-flex align-items-center justify-content-center">
//       <div className="login-card shadow">
//         <h2 className="text-center fs-4 fs-md-3 mb-4">
//           🌐 Welcome to{" "}
//           <span className="gradient-text">Fediverse</span>
//         </h2>

//         <form
//           noValidate
//           className={`needs-validation ${validated ? "was-validated" : ""}`}
//           onSubmit={handleLogin}
//         >
//           {/* Username */}
//           <div className="form-floating mb-3">
//             <input
//               type="text"
//               id="floatingUsername"
//               name="username"
//               className="form-control"
//               placeholder="Username"
//               onChange={handleChange}
//               value={formData.username}
//               required
//             />
//             <label htmlFor="floatingUsername">Username</label>
//             <div className="invalid-feedback">Please enter your username.</div>
//           </div>

//           {/* Password */}
//           <div className="form-floating mb-4">
//             <input
//               type="password"
//               id="floatingPassword"
//               name="password"
//               className="form-control"
//               placeholder="Password"
//               onChange={handleChange}
//               value={formData.password}
//               required
//             />
//             <label htmlFor="floatingPassword">Password</label>
//             <div className="invalid-feedback">
//               Please enter your password.
//             </div>
//           </div>

//           <button
//             className="btn btn-login-main w-100"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );

// }

// export default Login;


import React, { useContext, useState } from "react";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "error",
    message: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", formData);

      login(response.data.token);

      localStorage.setItem(
        "username",
        response.data.user?.username || formData.username
      );

      setPopup({
        show: true,
        type: "success",
        message: "You have logged in successfully.",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data || error.message
      );

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed. Please check your username and password.";

      setPopup({
        show: true,
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid login-container">
        <div className="row min-vh-100">
          {/* Left image */}
          <div className="col-md-7 d-none d-md-flex login-image-section">
            <img
              src="https://readymadeui.com/signin-image.webp"
              alt="Fediverse login"
              className="img-fluid login-image"
            />
          </div>

          {/* Right login form */}
          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center bg-white">
            <div className="login-form-wrapper">
              <div className="mb-5">
                <h1 className="fw-bold mb-3">Sign in</h1>

                <p className="text-secondary">
                  Don&apos;t have an account?
                  <Link
                    to="/signup"
                    className="text-primary fw-semibold text-decoration-none ms-1"
                  >
                    Register here
                  </Link>
                </p>
              </div>

              <form
                noValidate
                onSubmit={handleLogin}
                className={validated ? "was-validated" : ""}
              >
                {/* Username */}
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="form-label fw-semibold"
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control form-control-lg login-input"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />

                  <div className="invalid-feedback">
                    Please enter your username.
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                  >
                    Password
                  </label>

                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-control form-control-lg login-input password-input"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      minLength={3}
                      maxLength={10}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 9 4 10 8a11.8 11.8 0 0 1-2 4.2" />
                          <path d="M6.6 6.6C4.5 8 3.2 10 2 12c1.7 4 5 8 10 8 1.6 0 3-.4 4.3-1" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
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

                {/* Remember and forgot password */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="form-check-input"
                    />

                    <label
                      htmlFor="remember"
                      className="form-check-label text-secondary"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-primary fw-semibold text-decoration-none small"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login button */}
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
                      Logging in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="d-flex align-items-center gap-3 my-4">
                <hr className="flex-grow-1" />
                <span className="text-secondary small">or(coming soon)</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Social buttons */}
              <div className="row g-3">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 social-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      className="me-2"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.2c0-.7-.06-1.2-.2-1.72H12v3.34h5.37a4.6 4.6 0 0 1-1.99 3.02v2.2h3.23c1.9-1.75 2.74-4.32 2.74-6.84Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 21.7c2.62 0 4.82-.86 6.43-2.35l-3.23-2.2c-.88.6-2.02.96-3.2.96-2.52 0-4.65-1.7-5.42-4.02H3.25v2.27A9.7 9.7 0 0 0 12 21.7Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.58 14.09a5.87 5.87 0 0 1 0-3.76V8.06H3.25a9.72 9.72 0 0 0 0 8.3l3.33-2.27Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 6.3c1.43 0 2.7.49 3.71 1.44l2.79-2.78A9.35 9.35 0 0 0 12 2.7a9.7 9.7 0 0 0-8.75 5.36l3.33 2.27C7.35 8 9.48 6.3 12 6.3Z"
                      />
                    </svg>
                    Google
                  </button>
                </div>

                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 social-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="me-2"
                    >
                      <path d="M16.37 12.76c-.03-2.9 2.37-4.31 2.48-4.38-1.36-2-3.48-2.27-4.23-2.29-1.78-.19-3.51 1.07-4.42 1.07-.93 0-2.33-1.05-3.84-1.02-1.94.03-3.76 1.16-4.76 2.91-2.05 3.55-.52 8.76 1.44 11.63.98 1.4 2.12 2.96 3.63 2.9 1.47-.06 2.02-.93 3.79-.93 1.76 0 2.27.93 3.8.9 1.59-.03 2.59-1.41 3.53-2.82 1.13-1.61 1.58-3.2 1.6-3.28-.04-.01-3-.16-3.02-3.69ZM13.46 4.2c.79-.99 1.33-2.33 1.18-3.7-1.14.05-2.56.79-3.38 1.76-.73.85-1.38 2.24-1.21 3.56 1.29.1 2.61-.65 3.41-1.62Z" />
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
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
                      ? "Login successful"
                      : "Login failed"}
                  </h4>

                  <p className="text-secondary mb-4">
                    {popup.message}
                  </p>

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

export default Login;