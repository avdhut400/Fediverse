




// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();
//   const isLoggedIn = !!localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
//       <Link className="navbar-brand" to="/">Photoflux</Link>

//       <div className="collapse navbar-collapse">
//         <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//           {isLoggedIn && (
//             <>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/">Home</Link>
//               </li>
//                <li className="nav-item">
//                 <Link className="nav-link" to="/feed">Feed</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/post">Post</Link>
//               </li>
//               {/* <li className="nav-item">
//                 <Link className="nav-link" to="/users">Users</Link>
//               </li> */}
//               {/* <li className="nav-item">
//                 <Link className="nav-link" to="/remote-follow">Remote Follow</Link>
//               </li> */}
//               <li className="nav-item">
//                 <Link className="nav-link" to={`/followers/${username}`}>profile</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/remote-search">Remote Search</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/local-users">Local Users</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to={`/users/${username}/outbox`}>My Outbox</Link>
//               </li>
//               {/* <li className="nav-item">
//                 <Link className="nav-link" to={`/image`}>imaga</Link>
//               </li> */}
//             </>
//           )}
//         </ul>
//         {isLoggedIn ? (
//           <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
//         ) : (
//           <>
//             <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
//             <Link className="btn btn-outline-success" to="/signup">Sign Up</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Demo Avatar Fallback
  const DEMO_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ47hpKa1cmIps_YOLfoS92KzBldAuchoQzcQ&s";

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn && username) {
        try {
          const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
          const headers = {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          };
          const res = await axios.get(`${baseUrl}/users/${username}`, { headers });
          setUser(res.data);
        } catch (error) {
          console.error("Error fetching user for navbar:", error);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn, username]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top shadow-sm">
      <div className="container-fluid px-3">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span style={{ fontSize: "1.3rem" }}>📸</span>
          <span className="ms-2">Photoflux</span>
        </Link>

        {/* Toggle button (IMPORTANT for mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/feed">Feed</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/post">Post</Link>
                </li>
                {/* Profile Link Removed from here */}
                <li className="nav-item">
                  <Link className="nav-link" to="/remote-search">
                    Remote Search
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/local-users">
                    Local Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/users/${username}/outbox`}>
                    My Outbox
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth actions */}
          {isLoggedIn ? (
            <div className="d-flex align-items-center position-relative" ref={dropdownRef}>
              <div
                className="d-flex align-items-center gap-2 cursor-pointer"
                onClick={toggleDropdown}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="rounded-circle overflow-hidden border border-2 border-light"
                  style={{ width: "40px", height: "40px" }}
                >
                  <img
                    src={user?.icon?.url || DEMO_AVATAR}
                    alt={user?.username || "User"}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = DEMO_AVATAR; }}
                  />
                </div>
                {/* Optional: Show username on larger screens if desired, but avatar alone is cleaner */}
                {/* <span className="text-white d-none d-lg-block">{user?.username || username}</span> */}
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  className="position-absolute end-0 mt-2 bg-white rounded shadow-lg overflow-hidden"
                  style={{ top: "100%", minWidth: "200px", zIndex: 1050 }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold text-dark">{user?.name || user?.username || username}</p>
                    <small className="text-muted">@{user?.preferredUsername || username}</small>
                  </div>
                  <Link
                    to={`/profile/${username}`}
                    className="d-block px-3 py-2 text-decoration-none text-dark hover-bg-light"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUserCircle className="me-2" /> My Profile
                  </Link>
                  <Link
                    to={`/settings`}
                    className="d-block px-3 py-2 text-decoration-none text-dark hover-bg-light"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaCog className="me-2" /> Settings
                  </Link>
                  <div className="border-top">
                    <button
                      onClick={handleLogout}
                      className="w-100 text-start px-3 py-2 border-0 bg-transparent text-danger hover-bg-light"
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex auth-buttons gap-3">
              <Link className="btn btn-login" to="/login">
                Login
              </Link>

              <Link className="btn btn-signup" to="/signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;


