

// import React, { useState } from "react";
// import API from "../utils/api";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: "",
//   });
//   const [validated, setValidated] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     // Bootstrap validation
//     if (!form.checkValidity()) {
//       e.stopPropagation();
//       setValidated(true);
//       return;
//     }

//     try {
//       await API.post("/api/auth/register", formData);
//       alert("Signup successful");
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Signup failed");
//     }
//   };

//   return (
//     <div className="login-page d-flex align-items-center justify-content-center">
//       <div className="login-card shadow">
//         <h2 className="text-center mb-4 fs-4 fs-md-3">
//           🌐 Join <span className="gradient-text">Fediverse</span>
//         </h2>

//         <form
//           noValidate
//           className={`needs-validation ${validated ? "was-validated" : ""}`}
//           onSubmit={handleSignup}
//         >
//           {/* Username */}
//           <div className="form-floating mb-3">
//             <input
//               type="text"
//               name="username"
//               id="floatingUsername"
//               className="form-control"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="floatingUsername">Username</label>
//             <div className="invalid-feedback">Please enter a username.</div>
//           </div>

//           {/* Email */}
//           <div className="form-floating mb-3">
//             <input
//               type="email"
//               name="email"
//               id="floatingEmail"
//               className="form-control"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="floatingEmail">Email address</label>
//             <div className="invalid-feedback">Please enter a valid email.</div>
//           </div>

//           {/* Password */}
//           <div className="form-floating mb-4">
//             <input
//               type="password"
//               name="password"
//               id="floatingPassword"
//               className="form-control"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="floatingPassword">Password</label>
//             <div className="invalid-feedback">
//               Please enter a password.
//             </div>
//           </div>

//           <button className="btn btn-login-main w-100" type="submit">
//             Create Account
//           </button>

//           {/* Login link */}
//           <p className="text-center mt-3 mb-0 small">
//             Already have an account?{" "}
//             <a href="/login" className="fw-semibold text-decoration-none">
//               Login
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );

// }

// export default Signup;
import React, { useState } from "react";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
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

      const response = await API.post(
        "/api/auth/register",
        formData
      );

      alert(
        response.data?.message ||
          "Signup successful"
      );

      navigate("/login");
    } catch (err) {
      console.error(
        "Signup error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="login-card shadow">
        <h2 className="text-center mb-4 fs-4 fs-md-3">
          🌐 Join{" "}
          <span className="gradient-text">
            Fediverse
          </span>
        </h2>

        <form
          noValidate
          className={`needs-validation ${
            validated ? "was-validated" : ""
          }`}
          onSubmit={handleSignup}
        >
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

            <label htmlFor="floatingUsername">
              Username
            </label>

            <div className="invalid-feedback">
              Please enter a username.
            </div>
          </div>

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

            <label htmlFor="floatingEmail">
              Email address
            </label>

            <div className="invalid-feedback">
              Please enter a valid email.
            </div>
          </div>

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

            <label htmlFor="floatingPassword">
              Password
            </label>

            <div className="invalid-feedback">
              Please enter a password.
            </div>
          </div>

          <button
            className="btn btn-login-main w-100"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <p className="text-center mt-3 mb-0 small">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold text-decoration-none"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;