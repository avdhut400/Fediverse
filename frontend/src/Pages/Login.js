
import React, { useState, useContext, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");
    const error = params.get("error");

    if (error) {
      alert(`Authentication failed: ${error}`);
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token);
        localStorage.setItem("username", user.username);
        alert("Google login successful!");
        navigate("/");
      } catch (err) {
        console.error("Error processing Google login:", err);
        alert("Error processing login response");
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Bootstrap validation check
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", formData);
      login(res.data.token);
      localStorage.setItem("username", res.data.user.username);
      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);

      if (err.response?.status === 403 && err.response?.data?.error?.includes("Email not verified")) {
        alert("Your email is not verified. Redirecting to verification...");
        navigate("/signup"); // Redirect to signup to resend OTP
        return;
      }

      alert(
        err.response?.data?.error || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="login-card shadow">
        <h2 className="text-center fs-4 fs-md-3 mb-4">
          🌐 Welcome to{" "}
          <span className="gradient-text">Fediverse</span>
        </h2>

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleLogin}
        >
          {/* Username */}
          <div className="form-floating mb-3">
            <input
              type="text"
              id="floatingUsername"
              name="username"
              className="form-control"
              placeholder="Username"
              onChange={handleChange}
              value={formData.username}
              required
            />
            <label htmlFor="floatingUsername">Username</label>
            <div className="invalid-feedback">Please enter your username.</div>
          </div>

          {/* Password */}
          <div className="form-floating mb-4">
            <input
              type="password"
              id="floatingPassword"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
            <div className="invalid-feedback">
              Please enter your password.
            </div>
          </div>

          <button
            className="btn btn-login-main w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="my-3 text-center">
            <span className="text-muted">or</span>
          </div>

          <button
            className="btn btn-outline-secondary w-100"
            type="button"
            onClick={handleGoogleLogin}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              style={{ width: "16px", marginRight: "8px" }}
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );

}

export default Login;
