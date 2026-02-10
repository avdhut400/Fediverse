import React, { useState, useContext } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Left Side: Image */}
        <div className="col-md-6 d-none d-md-block">
          <div className="h-100 w-100 position-relative">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              alt="Login Cover"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
            <div className="position-absolute bottom-0 start-0 p-5 text-white">
              <h2 className="fw-bold display-6">Welcome Back!</h2>
              <p className="lead">Connect to the decentralized world.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <div className="p-4 p-md-5 shadow-lg bg-white rounded-4" style={{ maxWidth: "450px", width: "90%" }}>
            {/* Back Button */}
            <div className="mb-4">
              <button
                onClick={() => navigate("/")}
                className="btn btn-outline-secondary btn-sm"
              >
                &larr; Back to Home
              </button>
            </div>
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-2">Fediverse</h1>
              <p className="text-muted">Login to your account</p>
            </div>
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
                  className="form-control rounded-3"
                  placeholder="Username"
                  onChange={handleChange}
                  value={formData.username}
                  required
                />
                <label htmlFor="floatingUsername">Username</label>
                <div className="invalid-feedback">Please enter your username.</div>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="password"
                  id="floatingPassword"
                  name="password"
                  className="form-control rounded-3"
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
              <div className="text-end mb-4">
                <Link to="/forgot-password" className="text-decoration-none small text-muted">
                  Forgot Password?
                </Link>
              </div>
              <div className="d-grid gap-2 mb-3">
                <button
                  className="btn btn-primary btn-lg rounded-3"
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#4f9cff", borderColor: "#4f9cff" }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
              <div className="d-grid gap-2 mb-3">
                {/* Google Sign-In Button */}
                <button
                  className="btn btn-outline-primary w-100 mt-3"
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const result = await signInWithPopup(auth, googleProvider);
                      const user = result.user;
                      const firebaseIdToken = await user.getIdToken();
                      const res = await API.post("/api/auth/google", { token: firebaseIdToken });
                      login(res.data.token);
                      localStorage.setItem("username", res.data.user.username);
                      alert("Google login successful");
                      navigate("/");
                    } catch (err) {
                      console.error("Google login failed:", err);
                      alert("Google login failed");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: 20, marginRight: 8, verticalAlign: 'middle' }} />
                  Sign in with Google
                </button>
              </div>
              <div className="text-center">
                <p className="text-muted small">Don't have an account? <a href="/signup" className="text-decoration-none fw-bold" style={{ color: "#4f9cff" }}>Sign up</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Login;
