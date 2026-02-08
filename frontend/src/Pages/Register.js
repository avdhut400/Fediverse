
import React, { useState, useContext, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register"); // 'register' or 'verify'
  const [validated, setValidated] = useState(false);
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
        alert("Google registration successful!");
        navigate("/");
      } catch (err) {
        console.error("Error processing Google registration:", err);
        alert("Error processing registration response");
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Bootstrap validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const { data } = await API.post("/api/auth/register", formData);
      if (data.next === "Verify_OTP") {
        setStep("verify");
        alert("OTP sent to your email!");
      } else {
        alert("Signup successful");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data?.error || "Signup failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/verify-otp", { email: formData.email, otp });
      alert("Verification successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="login-card shadow">
        <h2 className="text-center mb-4 fs-4 fs-md-3">
          {step === "verify" ? "Verify OTP" : <>🌐 Join <span className="gradient-text">Fediverse</span></>}
        </h2>

        {step === "register" ? (
          <>
            <form
              noValidate
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              onSubmit={handleSignup}
            >
              {/* Username */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="username"
                  id="floatingUsername"
                  className="form-control"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingUsername">Username</label>
                <div className="invalid-feedback">Please enter a username.</div>
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  name="email"
                  id="floatingEmail"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingEmail">Email address</label>
                <div className="invalid-feedback">Please enter a valid email.</div>
              </div>

              {/* Password */}
              <div className="form-floating mb-4">
                <input
                  type="password"
                  name="password"
                  id="floatingPassword"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">Please enter a password.</div>
              </div>

              <button className="btn btn-login-main w-100" type="submit">
                Create Account
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
                Sign up with Google
              </button>

              {/* Login link */}
              <p className="text-center mt-3 mb-0 small">
                Already have an account?{" "}
                <a href="/login" className="fw-semibold text-decoration-none">
                  Login
                </a>
              </p>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="otp"
                id="floatingOtp"
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <label htmlFor="floatingOtp">Enter OTP</label>
            </div>
            <button className="btn btn-success w-100" type="submit">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
