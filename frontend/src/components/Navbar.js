




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
//     <nav className="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top shadow-sm">
//       <div className="container-fluid px-3">
//         {/* Brand */}
//         <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
//           <span style={{ fontSize: "1.3rem" }}>📸</span>
//           <span className="ms-2">Photoflux</span>
//         </Link>

//         {/* Toggle button (IMPORTANT for mobile) */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarContent"
//           aria-controls="navbarContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar content */}
//         <div className="collapse navbar-collapse" id="navbarContent">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             {isLoggedIn && (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/">Home</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/feed">Feed</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/post">Post</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to={`/followers/${username}`}>
//                     Profile
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/remote-search">
//                     Remote Search
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/local-users">
//                     Local Users
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to={`/users/${username}/outbox`}>
//                     My Outbox
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>

//           {/* Auth actions */}
//           {isLoggedIn ? (
//             <button
//               onClick={handleLogout}
//               className="btn btn-outline-light"
//             >
//               Logout
//             </button>
//           ) : (
//             <div className="d-flex auth-buttons gap-3">
//               <Link className="btn btn-login" to="/login">
//                 Login
//               </Link>

//               <Link className="btn btn-signup" to="/signup">
//                 Sign Up
//               </Link>
//             </div>

//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;









// import React, { useEffect, useState } from "react";
// import {
//   Link,
//   NavLink,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import {
//   FaBars,
//   FaHome,
//   FaImages,
//   FaPlus,
//   FaSearch,
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaTimes,
//   FaUserFriends,
// } from "react-icons/fa";

// import {
//   MdDynamicFeed,
//   MdExplore,
// } from "react-icons/md";

// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [menuOpen, setMenuOpen] = useState(false);

//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   const isLoggedIn = Boolean(token);

//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");

//     setMenuOpen(false);
//     navigate("/login");
//   };

//   const getNavLinkClass = ({ isActive }) =>
//     `photoflux-nav-link ${
//       isActive ? "photoflux-nav-active" : ""
//     }`;

//   return (
//     <nav className="photoflux-navbar">
//       <div className="photoflux-navbar-container">
//         {/* Brand */}
//         <Link
//           className="photoflux-brand"
//           to={isLoggedIn ? "/" : "/login"}
//           onClick={() => setMenuOpen(false)}
//         >
//           <span className="photoflux-brand-icon">
//             P
//           </span>

//           <div className="photoflux-brand-text">
//             <strong>PhotoFlux</strong>
//             <small>Fediverse</small>
//           </div>
//         </Link>

//         {/* Desktop navigation */}
//         {isLoggedIn && (
//           <div className="photoflux-desktop-nav">
//             <NavLink
//               className={getNavLinkClass}
//               to="/"
//               end
//             >
//               <FaHome />
//               <span>Home</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/feed"
//             >
//               <MdDynamicFeed />
//               <span>Feed</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/local-users"
//             >
//               <MdExplore />
//               <span>Discover</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/remote-search"
//             >
//               <FaSearch />
//               <span>Remote</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/followers/${username}`}
//             >
//               <FaUserFriends />
//               <span>Connections</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/users/${username}/outbox`}
//             >
//               <FaImages />
//               <span>Outbox</span>
//             </NavLink>
//           </div>
//         )}

//         {/* Right side actions */}
//         <div className="photoflux-navbar-actions">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/post"
//                 className="photoflux-create-button"
//               >
//                 <FaPlus />
//                 <span>Create</span>
//               </Link>

//               <div className="photoflux-user-area">
//                 <Link
//                   to={`/followers/${username}`}
//                   className="photoflux-user-profile"
//                 >
//                   <div className="photoflux-user-avatar">
//                     {username
//                       ?.charAt(0)
//                       .toUpperCase() || "U"}
//                   </div>

//                   <div className="photoflux-user-text">
//                     <strong>
//                       {username || "User"}
//                     </strong>
//                     <small>My profile</small>
//                   </div>
//                 </Link>

//                 <button
//                   type="button"
//                   className="photoflux-logout-button"
//                   onClick={handleLogout}
//                   aria-label="Logout"
//                   title="Logout"
//                 >
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="photoflux-auth-actions">
//               <Link
//                 to="/login"
//                 className="photoflux-login-button"
//               >
//                 <FaSignInAlt />
//                 Login
//               </Link>

//               <Link
//                 to="/signup"
//                 className="photoflux-signup-button"
//               >
//                 Sign up
//               </Link>
//             </div>
//           )}

//           {/* Mobile toggle */}
//           {isLoggedIn && (
//             <button
//               type="button"
//               className="photoflux-menu-button"
//               onClick={() =>
//                 setMenuOpen((current) => !current)
//               }
//               aria-label="Toggle navigation"
//               aria-expanded={menuOpen}
//             >
//               {menuOpen ? <FaTimes /> : <FaBars />}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Mobile navigation */}
//       {isLoggedIn && (
//         <div
//           className={`photoflux-mobile-menu ${
//             menuOpen
//               ? "photoflux-mobile-menu-open"
//               : ""
//           }`}
//         >
//           <div className="photoflux-mobile-user">
//             <div className="photoflux-user-avatar">
//               {username
//                 ?.charAt(0)
//                 .toUpperCase() || "U"}
//             </div>

//             <div>
//               <strong>@{username}</strong>
//               <small>PhotoFlux account</small>
//             </div>
//           </div>

//           <div className="photoflux-mobile-links">
//             <NavLink
//               className={getNavLinkClass}
//               to="/"
//               end
//             >
//               <FaHome />
//               Home
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/feed"
//             >
//               <MdDynamicFeed />
//               Feed
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/post"
//             >
//               <FaPlus />
//               Create post
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/local-users"
//             >
//               <MdExplore />
//               Local users
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/remote-search"
//             >
//               <FaSearch />
//               Remote search
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/followers/${username}`}
//             >
//               <FaUserFriends />
//               Followers & following
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/users/${username}/outbox`}
//             >
//               <FaImages />
//               My outbox
//             </NavLink>
//           </div>

//           <button
//             type="button"
//             className="photoflux-mobile-logout"
//             onClick={handleLogout}
//           >
//             <FaSignOutAlt />
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;
















// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Link,
//   NavLink,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import {
//   FaBars,
//   FaHome,
//   FaImages,
//   FaPlus,
//   FaSearch,
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaTimes,
//   FaUserFriends,
// } from "react-icons/fa";

// import {
//   MdDynamicFeed,
//   MdExplore,
// } from "react-icons/md";

// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profilePic, setProfilePic] = useState("");

//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   const apiUrl = process.env.REACT_APP_API_URL;

//   const isLoggedIn = Boolean(token);

//   const addCacheBuster = (url) => {
//     if (!url) return "";

//     const cleanUrl = String(url)
//       .replace(
//         /([?&])v=\d+(&|$)/,
//         "$1"
//       )
//       .replace(/[?&]$/, "");

//     const separator = cleanUrl.includes("?")
//       ? "&"
//       : "?";

//     return `${cleanUrl}${separator}v=${Date.now()}`;
//   };

//   /*
//    * Page route change झाल्यावर mobile menu close.
//    */
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location.pathname]);

//   /*
//    * Refresh झाल्यावर profile picture backend मधून fetch.
//    */
//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       if (!token || !apiUrl) {
//         setProfilePic("");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${apiUrl}/api/users/me`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );

//         const imageUrl =
//           response.data?.profilePic?.url ||
//           response.data?.user?.profilePic?.url ||
//           response.data?.profilePic ||
//           "";

//         if (imageUrl) {
//           setProfilePic(
//             addCacheBuster(imageUrl)
//           );

//           localStorage.setItem(
//             "profilePic",
//             imageUrl
//           );
//         } else {
//           setProfilePic("");
//           localStorage.removeItem("profilePic");
//         }
//       } catch (error) {
//         console.error(
//           "Navbar profile fetch failed:",
//           error.response?.data ||
//             error.message
//         );

//         const savedImage =
//           localStorage.getItem("profilePic");

//         if (savedImage) {
//           setProfilePic(
//             addCacheBuster(savedImage)
//           );
//         } else {
//           setProfilePic("");
//         }
//       }
//     };

//     fetchProfilePicture();
//   }, [token, apiUrl, username]);

//   /*
//    * FollowersPage मधून profile picture update झाल्यावर
//    * Navbar लगेच update होईल.
//    */
//   useEffect(() => {
//     const handleProfilePictureUpdated = (
//       event
//     ) => {
//       const newImageUrl = event.detail;

//       if (!newImageUrl) return;

//       localStorage.setItem(
//         "profilePic",
//         newImageUrl
//       );

//       setProfilePic(
//         addCacheBuster(newImageUrl)
//       );
//     };

//     window.addEventListener(
//       "profile-picture-updated",
//       handleProfilePictureUpdated
//     );

//     return () => {
//       window.removeEventListener(
//         "profile-picture-updated",
//         handleProfilePictureUpdated
//       );
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//     localStorage.removeItem("profilePic");

//     setProfilePic("");
//     setMenuOpen(false);

//     navigate("/login");
//   };

//   const getNavLinkClass = ({
//     isActive,
//   }) =>
//     `photoflux-nav-link ${
//       isActive
//         ? "photoflux-nav-active"
//         : ""
//     }`;

//   const getInitial = () =>
//     username
//       ?.trim()
//       ?.charAt(0)
//       ?.toUpperCase() || "U";

//   const renderUserAvatar = () => {
//     if (profilePic) {
//       return (
//         <img
//           src={profilePic}
//           alt={`${username} profile`}
//           onError={() => {
//             const savedImage =
//               localStorage.getItem(
//                 "profilePic"
//               );

//             if (
//               savedImage &&
//               !profilePic.includes(savedImage)
//             ) {
//               setProfilePic(
//                 addCacheBuster(savedImage)
//               );
//             } else {
//               setProfilePic("");
//             }
//           }}
//         />
//       );
//     }

//     return <span>{getInitial()}</span>;
//   };

//   return (
//     <nav className="photoflux-navbar">
//       <div className="photoflux-navbar-container">
//         {/* Brand */}

//         <Link
//           className="photoflux-brand"
//           to={isLoggedIn ? "/" : "/login"}
//           onClick={() => setMenuOpen(false)}
//         >
//           <span className="photoflux-brand-icon">
//             P
//           </span>

//           <div className="photoflux-brand-text">
//             <strong>PhotoFlux</strong>
//             <small>Fediverse</small>
//           </div>
//         </Link>

//         {/* Desktop navigation */}

//         {isLoggedIn && (
//           <div className="photoflux-desktop-nav">
//             <NavLink
//               className={getNavLinkClass}
//               to="/"
//               end
//             >
//               <FaHome />
//               <span>Home</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/feed"
//             >
//               <MdDynamicFeed />
//               <span>Feed</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/local-users"
//             >
//               <MdExplore />
//               <span>Discover</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/remote-search"
//             >
//               <FaSearch />
//               <span>Remote</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/followers/${username}`}
//             >
//               <FaUserFriends />
//               <span>Connections</span>
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/users/${username}/outbox`}
//             >
//               <FaImages />
//               <span>Outbox</span>
//             </NavLink>
//           </div>
//         )}

//         {/* Right side actions */}

//         <div className="photoflux-navbar-actions">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/post"
//                 className="photoflux-create-button"
//               >
//                 <FaPlus />
//                 <span>Create</span>
//               </Link>

//               <div className="photoflux-user-area">
//                 <Link
//                   to={`/followers/${username}`}
//                   className="photoflux-user-profile"
//                 >
//                   <div className="photoflux-user-avatar">
//                     {renderUserAvatar()}
//                   </div>

//                   <div className="photoflux-user-text">
//                     <strong>
//                       {username || "User"}
//                     </strong>

//                     <small>
//                       My profile
//                     </small>
//                   </div>
//                 </Link>

//                 <button
//                   type="button"
//                   className="photoflux-logout-button"
//                   onClick={handleLogout}
//                   aria-label="Logout"
//                   title="Logout"
//                 >
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="photoflux-auth-actions">
//               <Link
//                 to="/login"
//                 className="photoflux-login-button"
//               >
//                 <FaSignInAlt />
//                 Login
//               </Link>

//               <Link
//                 to="/signup"
//                 className="photoflux-signup-button"
//               >
//                 Sign up
//               </Link>
//             </div>
//           )}

//           {/* Mobile toggle */}

//           {isLoggedIn && (
//             <button
//               type="button"
//               className="photoflux-menu-button"
//               onClick={() =>
//                 setMenuOpen(
//                   (current) => !current
//                 )
//               }
//               aria-label="Toggle navigation"
//               aria-expanded={menuOpen}
//             >
//               {menuOpen ? (
//                 <FaTimes />
//               ) : (
//                 <FaBars />
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Mobile navigation */}

//       {isLoggedIn && (
//         <div
//           className={`photoflux-mobile-menu ${
//             menuOpen
//               ? "photoflux-mobile-menu-open"
//               : ""
//           }`}
//         >
//           <Link
//             to={`/followers/${username}`}
//             className="photoflux-mobile-user"
//           >
//             <div className="photoflux-user-avatar">
//               {renderUserAvatar()}
//             </div>

//             <div>
//               <strong>
//                 @{username}
//               </strong>

//               <small>
//                 PhotoFlux account
//               </small>
//             </div>
//           </Link>

//           <div className="photoflux-mobile-links">
//             <NavLink
//               className={getNavLinkClass}
//               to="/"
//               end
//             >
//               <FaHome />
//               Home
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/feed"
//             >
//               <MdDynamicFeed />
//               Feed
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/post"
//             >
//               <FaPlus />
//               Create post
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/local-users"
//             >
//               <MdExplore />
//               Local users
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to="/remote-search"
//             >
//               <FaSearch />
//               Remote search
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/followers/${username}`}
//             >
//               <FaUserFriends />
//               Followers & following
//             </NavLink>

//             <NavLink
//               className={getNavLinkClass}
//               to={`/users/${username}/outbox`}
//             >
//               <FaImages />
//               My outbox
//             </NavLink>
//           </div>

//           <button
//             type="button"
//             className="photoflux-mobile-logout"
//             onClick={handleLogout}
//           >
//             <FaSignOutAlt />
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;


















import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaImages,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaUserFriends,
} from "react-icons/fa";

import {
  MdDynamicFeed,
  MdExplore,
} from "react-icons/md";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const apiUrl = process.env.REACT_APP_API_URL;

  const isLoggedIn = Boolean(token);

  const addCacheBuster = (url) => {
    if (!url) return "";

    const cleanUrl = String(url)
      .replace(/([?&])v=\d+(&|$)/, "$1")
      .replace(/[?&]$/, "");

    const separator = cleanUrl.includes("?")
      ? "&"
      : "?";

    return `${cleanUrl}${separator}v=${Date.now()}`;
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!token || !apiUrl) {
        setProfilePic("");
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const imageUrl =
          response.data?.profilePic?.url ||
          response.data?.user?.profilePic?.url ||
          response.data?.profilePic ||
          "";

        if (imageUrl) {
          setProfilePic(addCacheBuster(imageUrl));
          localStorage.setItem("profilePic", imageUrl);
        } else {
          setProfilePic("");
          localStorage.removeItem("profilePic");
        }
      } catch (error) {
        console.error(
          "Navbar profile fetch failed:",
          error.response?.data || error.message
        );

        const savedImage =
          localStorage.getItem("profilePic");

        if (savedImage) {
          setProfilePic(addCacheBuster(savedImage));
        } else {
          setProfilePic("");
        }
      }
    };

    fetchProfilePicture();
  }, [token, apiUrl, username]);

  useEffect(() => {
    const handleProfilePictureUpdated = (event) => {
      const newImageUrl = event.detail;

      if (!newImageUrl) return;

      localStorage.setItem(
        "profilePic",
        newImageUrl
      );

      setProfilePic(
        addCacheBuster(newImageUrl)
      );
    };

    window.addEventListener(
      "profile-picture-updated",
      handleProfilePictureUpdated
    );

    return () => {
      window.removeEventListener(
        "profile-picture-updated",
        handleProfilePictureUpdated
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");

    setProfilePic("");
    setMenuOpen(false);

    navigate("/login");
  };

  const getInitial = () =>
    username?.trim()?.charAt(0)?.toUpperCase() || "U";

  const renderUserAvatar = () => {
    if (profilePic) {
      return (
        <img
          src={profilePic}
          alt={`${username || "User"} profile`}
          onError={() => {
            setProfilePic("");
          }}
        />
      );
    }

    return <span>{getInitial()}</span>;
  };

  const getNavClass = ({ isActive }) =>
    `photoflux-pill-link ${
      isActive ? "photoflux-pill-link-active" : ""
    }`;

  const DesktopNavText = ({ children }) => (
    <span className="photoflux-link-animation">
      <span className="photoflux-link-first">
        {children}
      </span>

      <span className="photoflux-link-second">
        {children}
      </span>
    </span>
  );

  return (
    <header className="photoflux-navbar-wrapper">
      <nav className="photoflux-pill-navbar">
        {/* Logo */}
        <Link
          to={isLoggedIn ? "/" : "/login"}
          className="photoflux-pill-logo"
          aria-label="PhotoFlux home"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="4.706"
              cy="16"
              r="4.706"
              fill="currentColor"
            />

            <circle
              cx="16.001"
              cy="4.706"
              r="4.706"
              fill="currentColor"
            />

            <circle
              cx="16.001"
              cy="27.294"
              r="4.706"
              fill="currentColor"
            />

            <circle
              cx="27.294"
              cy="16"
              r="4.706"
              fill="currentColor"
            />
          </svg>

          <span className="photoflux-pill-brand-name">
            PhotoFlux
          </span>
        </Link>

        {/* Desktop links */}
        {isLoggedIn && (
          <div className="photoflux-pill-desktop-links">
            <NavLink
              to="/"
              end
              className={getNavClass}
            >
              <DesktopNavText>
                Home
              </DesktopNavText>
            </NavLink>

            <NavLink
              to="/feed"
              className={getNavClass}
            >
              <DesktopNavText>
                Feed
              </DesktopNavText>
            </NavLink>

            <NavLink
              to="/local-users"
              className={getNavClass}
            >
              <DesktopNavText>
                Discover
              </DesktopNavText>
            </NavLink>

            <NavLink
              to="/remote-search"
              className={getNavClass}
            >
              <DesktopNavText>
                Remote
              </DesktopNavText>
            </NavLink>

            <NavLink
              to={`/followers/${username}`}
              className={getNavClass}
            >
              <DesktopNavText>
                Connections
              </DesktopNavText>
            </NavLink>

            <NavLink
              to={`/users/${username}/outbox`}
              className={getNavClass}
            >
              <DesktopNavText>
                Outbox
              </DesktopNavText>
            </NavLink>
          </div>
        )}

        {/* Right actions */}
        <div className="photoflux-pill-actions">
          {isLoggedIn ? (
            <>
              <Link
                to="/post"
                className="photoflux-pill-outline-button"
              >
                <FaPlus />
                <span>Create</span>
              </Link>

              <Link
                to={`/followers/${username}`}
                className="photoflux-pill-profile"
                title="Open profile"
              >
                <div className="photoflux-pill-avatar">
                  {renderUserAvatar()}
                </div>

                <span>{username || "User"}</span>
              </Link>

              <button
                type="button"
                className="photoflux-pill-main-button photoflux-pill-logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="photoflux-pill-outline-button"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="photoflux-pill-main-button"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            className="photoflux-pill-menu-button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`photoflux-pill-mobile-menu ${
          menuOpen
            ? "photoflux-pill-mobile-menu-open"
            : ""
        }`}
      >
        {isLoggedIn ? (
          <>
            <Link
              to={`/followers/${username}`}
              className="photoflux-mobile-profile"
            >
              <div className="photoflux-pill-avatar">
                {renderUserAvatar()}
              </div>

              <div>
                <strong>@{username || "User"}</strong>
                <span>PhotoFlux account</span>
              </div>
            </Link>

            <NavLink
              to="/"
              end
              className={getNavClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/feed"
              className={getNavClass}
            >
              <MdDynamicFeed />
              Feed
            </NavLink>

            <NavLink
              to="/post"
              className={getNavClass}
            >
              <FaPlus />
              Create post
            </NavLink>

            <NavLink
              to="/local-users"
              className={getNavClass}
            >
              <MdExplore />
              Discover users
            </NavLink>

            <NavLink
              to="/remote-search"
              className={getNavClass}
            >
              <FaSearch />
              Remote search
            </NavLink>

            <NavLink
              to={`/followers/${username}`}
              className={getNavClass}
            >
              <FaUserFriends />
              Connections
            </NavLink>

            <NavLink
              to={`/users/${username}/outbox`}
              className={getNavClass}
            >
              <FaImages />
              My outbox
            </NavLink>

            <button
              type="button"
              className="photoflux-mobile-logout-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </>
        ) : (
          <div className="photoflux-mobile-auth-buttons">
            <Link
              to="/login"
              className="photoflux-pill-outline-button"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="photoflux-pill-main-button"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;

