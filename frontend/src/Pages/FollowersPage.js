
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const FollowersPage = () => {
//   const { username } = useParams();
//   const [view, setView] = useState("followers");
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalFollowers, setTotalFollowers] = useState(0);
//   const [totalFollowing, setTotalFollowing] = useState(0);
//   const [currentUser, setCurrentUser] = useState(null); // Add current user state

//   // Fetch current user (you'll need to implement this based on your auth system)
//   useEffect(() => {
//     // This is a placeholder - replace with your actual current user fetch logic
//     const fetchCurrentUser = async () => {
//       try {
//         const response = await axios.get('/api/me'); // Adjust this endpoint
//         setCurrentUser(response.data);
//       } catch (err) {
//         console.error("Error fetching current user:", err);
//       }
//     };
//     fetchCurrentUser();
//   }, []);

//   const fetchCollection = async (url) => {
//     try {
//       const headers = {
//         Accept: "application/activity+json",
//         "ngrok-skip-browser-warning": "true",
//       };

//       const response = await axios.get(url, { headers });
//       console.log(`Response from ${url}:`, response.data);

//       if (response.data.orderedItems) {
//         return {
//           items: response.data.orderedItems,
//           total: response.data.totalItems || 0
//         };
//       } else if (response.data.first?.orderedItems) {
//         return {
//           items: response.data.first.orderedItems,
//           total: response.data.first.totalItems || response.data.totalItems || 0
//         };
//       } else if (response.data.items) {
//         return {
//           items: response.data.items,
//           total: response.data.totalItems || 0
//         };
//       } else if (Array.isArray(response.data)) {
//         return {
//           items: response.data,
//           total: response.data.length
//         };
//       }

//       return { items: [], total: 0 };
//     } catch (err) {
//       console.error(`Error fetching ${url}:`, err);
//       throw err;
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const baseUrl = process.env.REACT_APP_API_URL || "https://5e52fc7be047.ngrok-free.app";
//       const followersUrl = `${baseUrl}/users/${username}/followers`;
//       const followingUrl = `${baseUrl}/users/${username}/following`;

//       const [followersData, followingData] = await Promise.all([
//         fetchCollection(followersUrl),
//         fetchCollection(followingUrl)
//       ]);

//       setFollowers(followersData.items);
//       setFollowing(followingData.items);
//       setTotalFollowers(followersData.total);
//       setTotalFollowing(followingData.total);

//     } catch (err) {
//       console.error("API Error:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFollower = async (followerUsername) => {
//     try {
//       const baseUrl = process.env.REACT_APP_API_URL || "https://5e52fc7be047.ngrok-free.app";
//       await axios.delete(`${baseUrl}/users/${username}/followers/${followerUsername}`);
      
//       // Update local state
//       setFollowers(followers.filter(f => {
//         const url = typeof f === 'string' ? f : f.url;
//         return !url.endsWith(`/users/${followerUsername}`);
//       }));
//       setTotalFollowers(totalFollowers - 1);
      
//     } catch (err) {
//       console.error("Error removing follower:", err);
//       setError(err.response?.data?.message || err.message || "Failed to remove follower");
//     }
//   };

//   const unfollowUser = async (followingUsername) => {
//     try {
//       const baseUrl = process.env.REACT_APP_API_URL || "https://5e52fc7be047.ngrok-free.app";
//       await axios.delete(`${baseUrl}/users/${username}/following/${followingUsername}`);
      
//       // Update local state
//       setFollowing(following.filter(f => {
//         const url = typeof f === 'string' ? f : f.url;
//         return !url.endsWith(`/users/${followingUsername}`);
//       }));
//       setTotalFollowing(totalFollowing - 1);
      
//     } catch (err) {
//       console.error("Error unfollowing user:", err);
//       setError(err.response?.data?.message || err.message || "Failed to unfollow user");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [username]);

//   const cleanProfileUrl = (url) => {
//     if (!url) return "";
//     try {
//       const urlObj = new URL(url);
//       return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.replace(/\/+$/, "");
//     } catch {
//       return url.toString().replace(/\/+$/, "");
//     }
//   };

//   const getUsernameFromUrl = (url) => {
//     try {
//       const cleaned = cleanProfileUrl(url);
//       const parts = cleaned.split('/');
//       return parts[parts.length - 1] || parts[parts.length - 2] || "user";
//     } catch {
//       return "user";
//     }
//   };

//   const renderUserItem = (url) => {
//     const profileUrl = cleanProfileUrl(url);
//     const uname = getUsernameFromUrl(profileUrl);
//     const avatarUrl = `https://ui-avatars.com/api/?name=${uname}&background=random&color=fff&size=48`;
//     const isCurrentUserProfile = currentUser && currentUser.username === username;

//     return (
//       <div key={profileUrl} className="list-group-item d-flex align-items-center">
//         <img
//           src={avatarUrl}
//           alt={uname}
//           className="rounded-circle me-3"
//           style={{ width: 50, height: 50, objectFit: "cover" }}
//           onError={(e) => {
//             e.target.src = `https://ui-avatars.com/api/?name=${uname}&background=random&color=fff&size=48`;
//           }}
//         />
//         <div className="flex-grow-1">
//           <strong>@{uname}</strong>
//           <div className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
//             {profileUrl}
//           </div>
//         </div>
//         <div className="d-flex gap-2">
//           <a
//             href={profileUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="btn btn-sm btn-outline-primary"
//           >
//             View
//           </a>
//           {isCurrentUserProfile && (
//             view === "followers" ? (
//               <button
//                 className="btn btn-sm btn-outline-danger"
//                 onClick={() => removeFollower(uname)}
//               >
//                 Remove
//               </button>
//             ) : (
//               <button
//                 className="btn btn-sm btn-outline-danger"
//                 onClick={() => unfollowUser(uname)}
//               >
//                 Unfollow
//               </button>
//             )
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ... rest of your component code remains the same ...

//   return (
//     <div className="instagram-theme" style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
//       <header className="navbar navbar-light bg-white border-bottom sticky-top">
//         <div className="container">
//           <a className="navbar-brand mx-auto" href="#">
//             <h3 className="m-0" style={{ fontFamily: "cursive" }}>SocialApp</h3>
//           </a>
//         </div>
//       </header>

//       <div className="container py-4">
//         <div className="row align-items-center">
//           <div className="col-md-2 text-center">
//             <img
//               src={`https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=96`}
//               alt="Profile"
//               className="rounded-circle"
//               style={{ width: "100px", height: "100px", border: "2px solid #e1306c" }}
//             />
//           </div>
//           <div className="col-md-10">
//             <h4 className="mb-1">@{username}</h4>
//             <div className="d-flex gap-4">
//               <span><strong>{totalFollowers}</strong> followers</span>
//               <span><strong>{totalFollowing}</strong> following</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container">
//         <div className="btn-group mb-3 w-100" role="group">
//           <button
//             className={`btn ${view === "followers" ? "btn-dark" : "btn-outline-dark"}`}
//             onClick={() => setView("followers")}
//           >
//             Followers
//           </button>
//           <button
//             className={`btn ${view === "following" ? "btn-dark" : "btn-outline-dark"}`}
//             onClick={() => setView("following")}
//           >
//             Following
//           </button>
//         </div>
//       </div>

//       <div className="container pb-5">
//         <div className="card shadow-sm">
//           <div className="card-body p-0">
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//                 <p className="mt-3">Loading {view}...</p>
//               </div>
//             ) : error ? (
//               <div className="alert alert-danger m-3">
//                 <strong>Error:</strong> {error}
//                 <button
//                   className="btn btn-sm btn-outline-danger ms-2"
//                   onClick={fetchData}
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : (
//               <div className="list-group list-group-flush">
//                 {(view === "followers" ? followers : following).length === 0 ? (
//                   <div className="text-center py-5 text-muted">
//                     {view === "followers" 
//                       ? "No followers yet" 
//                       : "Not following anyone"}
//                   </div>
//                 ) : (
//                   (view === "followers" ? followers : following).map(renderUserItem)
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <nav className="navbar fixed-bottom navbar-light bg-white border-top">
//         <div className="container justify-content-center">
//           <span className="navbar-text text-muted">
//             © {new Date().getFullYear()} SocialApp
//           </span>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default FollowersPage;



























// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import {
//   FaExternalLinkAlt,
//   FaTrashAlt,
//   FaUserFriends,
//   FaUserMinus,
// } from "react-icons/fa";
// import "./FollowersPage.css";

// const FollowersPage = () => {
//   const { username } = useParams();

//   const [view, setView] = useState("followers");
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);

//   const [totalFollowers, setTotalFollowers] = useState(0);
//   const [totalFollowing, setTotalFollowing] = useState(0);

//   const [currentUsername, setCurrentUsername] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [actionUser, setActionUser] = useState("");
//   const [error, setError] = useState("");

//   const apiUrl = process.env.REACT_APP_API_URL;
//   const token = localStorage.getItem("token");

//   const headers = useMemo(
//     () => ({
//       Authorization: token ? `Bearer ${token}` : "",
//       Accept: "application/activity+json",
//       "ngrok-skip-browser-warning": "true",
//     }),
//     [token]
//   );

//   /*
//    * Get logged-in username from JWT.
//    * localStorage is used as fallback.
//    */
//   useEffect(() => {
//     try {
//       if (token) {
//         const decoded = jwtDecode(token);

//         setCurrentUsername(
//           decoded.username ||
//             localStorage.getItem("username") ||
//             ""
//         );
//       } else {
//         setCurrentUsername(
//           localStorage.getItem("username") || ""
//         );
//       }
//     } catch (decodeError) {
//       console.error("Token decode error:", decodeError);

//       setCurrentUsername(
//         localStorage.getItem("username") || ""
//       );
//     }
//   }, [token]);

//   const cleanProfileUrl = (value) => {
//     if (!value) return "";

//     const rawValue =
//       typeof value === "string"
//         ? value
//         : value.id ||
//           value.url ||
//           value.href ||
//           value.actor ||
//           "";

//     if (!rawValue) return "";

//     try {
//       const parsedUrl = new URL(rawValue);

//       return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`.replace(
//         /\/+$/,
//         ""
//       );
//     } catch {
//       return String(rawValue).replace(/\/+$/, "");
//     }
//   };

//   const getUsernameFromUrl = (url) => {
//     if (!url) return "user";

//     try {
//       const pathnameParts = new URL(url).pathname
//         .split("/")
//         .filter(Boolean);

//       return (
//         pathnameParts[pathnameParts.length - 1]
//           ?.replace(/^@/, "") || "user"
//       );
//     } catch {
//       const parts = String(url)
//         .split("/")
//         .filter(Boolean);

//       return (
//         parts[parts.length - 1]?.replace(/^@/, "") ||
//         "user"
//       );
//     }
//   };

//   const normalizeUserItem = (item) => {
//     const profileUrl = cleanProfileUrl(item);

//     const itemUsername =
//       typeof item === "object"
//         ? item.preferredUsername ||
//           item.username ||
//           getUsernameFromUrl(profileUrl)
//         : getUsernameFromUrl(profileUrl);

//     const displayName =
//       typeof item === "object"
//         ? item.name ||
//           item.displayName ||
//           itemUsername
//         : itemUsername;

//     const avatar =
//       typeof item === "object"
//         ? item.icon?.url ||
//           item.avatar?.url ||
//           item.avatar ||
//           item.profilePic?.url ||
//           item.profilePic ||
//           ""
//         : "";

//     let domain = "";

//     try {
//       domain = profileUrl
//         ? new URL(profileUrl).hostname
//         : "";
//     } catch {
//       domain = "";
//     }

//     return {
//       username: itemUsername,
//       displayName,
//       profileUrl,
//       avatar,
//       domain,
//     };
//   };

//   const processCollection = (data) => {
//     let items = [];

//     if (Array.isArray(data)) {
//       items = data;
//     } else if (Array.isArray(data?.orderedItems)) {
//       items = data.orderedItems;
//     } else if (
//       Array.isArray(data?.first?.orderedItems)
//     ) {
//       items = data.first.orderedItems;
//     } else if (Array.isArray(data?.items)) {
//       items = data.items;
//     }

//     const total =
//       data?.totalItems ??
//       data?.first?.totalItems ??
//       items.length;

//     return {
//       items: items.map(normalizeUserItem),
//       total,
//     };
//   };

//   const fetchCollection = async (url) => {
//     const response = await axios.get(url, {
//       headers,
//     });

//     return processCollection(response.data);
//   };

//   const fetchData = async () => {
//     if (!username || !apiUrl) {
//       setError("Username or API URL is missing.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const [followersData, followingData] =
//         await Promise.all([
//           fetchCollection(
//             `${apiUrl}/users/${username}/followers`
//           ),
//           fetchCollection(
//             `${apiUrl}/users/${username}/following`
//           ),
//         ]);

//       setFollowers(followersData.items);
//       setFollowing(followingData.items);

//       setTotalFollowers(followersData.total);
//       setTotalFollowing(followingData.total);
//     } catch (requestError) {
//       console.error(
//         "Failed to load followers data:",
//         requestError.response?.data ||
//           requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           "Failed to load followers and following."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [username, apiUrl]);

//   const removeFollower = async (targetUsername) => {
//     const shouldRemove = window.confirm(
//       `Remove @${targetUsername} from your followers?`
//     );

//     if (!shouldRemove) return;

//     try {
//       setActionUser(`remove-${targetUsername}`);
//       setError("");

//       await axios.delete(
//         `${apiUrl}/users/${username}/followers/${targetUsername}`,
//         {
//           headers,
//         }
//       );

//       setFollowers((currentFollowers) =>
//         currentFollowers.filter(
//           (follower) =>
//             follower.username !== targetUsername
//         )
//       );

//       setTotalFollowers((currentTotal) =>
//         Math.max(0, currentTotal - 1)
//       );
//     } catch (requestError) {
//       console.error(
//         "Remove follower failed:",
//         requestError.response?.data ||
//           requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           `Could not remove @${targetUsername}.`
//       );
//     } finally {
//       setActionUser("");
//     }
//   };

//   const unfollowUser = async (targetUsername) => {
//     const shouldUnfollow = window.confirm(
//       `Unfollow @${targetUsername}?`
//     );

//     if (!shouldUnfollow) return;

//     try {
//       setActionUser(`unfollow-${targetUsername}`);
//       setError("");

//       await axios.delete(
//         `${apiUrl}/users/${username}/following/${targetUsername}`,
//         {
//           headers,
//         }
//       );

//       setFollowing((currentFollowing) =>
//         currentFollowing.filter(
//           (followingUser) =>
//             followingUser.username !== targetUsername
//         )
//       );

//       setTotalFollowing((currentTotal) =>
//         Math.max(0, currentTotal - 1)
//       );
//     } catch (requestError) {
//       console.error(
//         "Unfollow failed:",
//         requestError.response?.data ||
//           requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           `Could not unfollow @${targetUsername}.`
//       );
//     } finally {
//       setActionUser("");
//     }
//   };

//   const isOwnProfile =
//     Boolean(currentUsername) &&
//     currentUsername === username;

//   const displayedUsers =
//     view === "followers" ? followers : following;

//   const getInitial = (value) =>
//     value?.trim()?.charAt(0)?.toUpperCase() || "U";

//   return (
//     <main className="connections-page">
//       <section className="connections-container">
//         {/* Profile header */}
//         <header className="connections-profile-card">
//           <div className="connections-profile-avatar">
//             {getInitial(username)}
//           </div>

//           <div className="connections-profile-info">
//             <p className="connections-label">
//               PHOTOFLUX CONNECTIONS
//             </p>

//             <h1>@{username}</h1>

//             <p>
//               View this user's local and remote
//               Fediverse connections.
//             </p>
//           </div>

//           <div className="connections-stats">
//             <div>
//               <strong>{totalFollowers}</strong>
//               <span>Followers</span>
//             </div>

//             <div>
//               <strong>{totalFollowing}</strong>
//               <span>Following</span>
//             </div>
//           </div>
//         </header>

//         {/* Tabs */}
//         <div className="connections-tabs">
//           <button
//             type="button"
//             className={
//               view === "followers" ? "active" : ""
//             }
//             onClick={() => setView("followers")}
//           >
//             Followers
//             <span>{totalFollowers}</span>
//           </button>

//           <button
//             type="button"
//             className={
//               view === "following" ? "active" : ""
//             }
//             onClick={() => setView("following")}
//           >
//             Following
//             <span>{totalFollowing}</span>
//           </button>
//         </div>

//         {error && (
//           <div className="connections-error">
//             <span>!</span>

//             <p>{error}</p>

//             <button type="button" onClick={fetchData}>
//               Retry
//             </button>
//           </div>
//         )}

//         <section className="connections-list-card">
//           <div className="connections-list-header">
//             <div>
//               <h2>
//                 {view === "followers"
//                   ? "Followers"
//                   : "Following"}
//               </h2>

//               <p>
//                 {displayedUsers.length}{" "}
//                 {displayedUsers.length === 1
//                   ? "connection"
//                   : "connections"}
//               </p>
//             </div>

//             <FaUserFriends />
//           </div>

//           {loading ? (
//             <div className="connections-loading">
//               <div className="connections-spinner" />
//               <p>Loading {view}...</p>
//             </div>
//           ) : displayedUsers.length === 0 ? (
//             <div className="connections-empty">
//               <div className="connections-empty-icon">
//                 <FaUserFriends />
//               </div>

//               <h3>
//                 {view === "followers"
//                   ? "No followers yet"
//                   : "Not following anyone"}
//               </h3>

//               <p>
//                 {view === "followers"
//                   ? "Followers will appear here."
//                   : "Follow people to build your network."}
//               </p>
//             </div>
//           ) : (
//             <div className="connections-list">
//               {displayedUsers.map((user, index) => {
//                 const removeLoading =
//                   actionUser ===
//                   `remove-${user.username}`;

//                 const unfollowLoading =
//                   actionUser ===
//                   `unfollow-${user.username}`;

//                 return (
//                   <article
//                     className="connection-user-row"
//                     key={
//                       user.profileUrl ||
//                       `${user.username}-${index}`
//                     }
//                   >
//                     <div className="connection-user-main">
//                       <div className="connection-avatar">
//                         {user.avatar ? (
//                           <img
//                             src={user.avatar}
//                             alt={user.username}
//                           />
//                         ) : (
//                           <span>
//                             {getInitial(user.username)}
//                           </span>
//                         )}
//                       </div>

//                       <div className="connection-user-info">
//                         <h3>
//                           {user.displayName ||
//                             user.username}
//                         </h3>

//                         <p>@{user.username}</p>

//                         {user.domain && (
//                           <small>{user.domain}</small>
//                         )}
//                       </div>
//                     </div>

//                     <div className="connection-actions">
//                       {user.profileUrl && (
//                         <a
//                           href={user.profileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="connection-view-button"
//                         >
//                           <FaExternalLinkAlt />
//                           View
//                         </a>
//                       )}

//                       {isOwnProfile &&
//                         view === "followers" && (
//                           <button
//                             type="button"
//                             className="connection-remove-button"
//                             onClick={() =>
//                               removeFollower(
//                                 user.username
//                               )
//                             }
//                             disabled={removeLoading}
//                           >
//                             <FaTrashAlt />

//                             {removeLoading
//                               ? "Removing..."
//                               : "Remove"}
//                           </button>
//                         )}

//                       {isOwnProfile &&
//                         view === "following" && (
//                           <button
//                             type="button"
//                             className="connection-remove-button"
//                             onClick={() =>
//                               unfollowUser(user.username)
//                             }
//                             disabled={unfollowLoading}
//                           >
//                             <FaUserMinus />

//                             {unfollowLoading
//                               ? "Unfollowing..."
//                               : "Unfollow"}
//                           </button>
//                         )}
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </section>
//     </main>
//   );
// };

// export default FollowersPage;




















// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import {
//   FaExternalLinkAlt,
//   FaTrashAlt,
//   FaUserFriends,
//   FaUserMinus,
// } from "react-icons/fa";
// import "./FollowersPage.css";

// const FollowersPage = () => {
//   const { username } = useParams();

//   const [view, setView] = useState("followers");

//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);

//   const [totalFollowers, setTotalFollowers] = useState(0);
//   const [totalFollowing, setTotalFollowing] = useState(0);

//   const [currentUsername, setCurrentUsername] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [actionUser, setActionUser] = useState("");
//   const [error, setError] = useState("");

//   const apiUrl = process.env.REACT_APP_API_URL;
//   const token = localStorage.getItem("token");

//   const headers = useMemo(
//     () => ({
//       Authorization: token ? `Bearer ${token}` : "",
//       Accept: "application/activity+json",
//       "ngrok-skip-browser-warning": "true",
//     }),
//     [token]
//   );

//   /*
//    * Logged-in username मिळवतो.
//    */
//   useEffect(() => {
//     try {
//       if (token) {
//         const decodedToken = jwtDecode(token);

//         setCurrentUsername(
//           decodedToken.username ||
//             localStorage.getItem("username") ||
//             ""
//         );
//       } else {
//         setCurrentUsername(
//           localStorage.getItem("username") || ""
//         );
//       }
//     } catch (decodeError) {
//       console.error("Token decode error:", decodeError);

//       setCurrentUsername(
//         localStorage.getItem("username") || ""
//       );
//     }
//   }, [token]);

//   /*
//    * String किंवा object मधून profile URL मिळवतो.
//    */
//   const cleanProfileUrl = (item) => {
//     if (!item) return "";

//     const rawUrl =
//       typeof item === "string"
//         ? item
//         : item.id ||
//           item.url ||
//           item.href ||
//           item.actor ||
//           "";

//     if (!rawUrl) return "";

//     try {
//       const parsedUrl = new URL(rawUrl);

//       return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`.replace(
//         /\/+$/,
//         ""
//       );
//     } catch {
//       return String(rawUrl).replace(/\/+$/, "");
//     }
//   };

//   /*
//    * Actor URL मधून username काढतो.
//    *
//    * उदाहरण:
//    * https://domain.com/users/roko
//    * result: roko
//    */
//   const getUsernameFromUrl = (profileUrl) => {
//     if (!profileUrl) return "user";

//     try {
//       const parsedUrl = new URL(profileUrl);

//       const pathParts = parsedUrl.pathname
//         .split("/")
//         .filter(Boolean);

//       return (
//         pathParts[pathParts.length - 1]
//           ?.replace(/^@/, "") || "user"
//       );
//     } catch {
//       const parts = String(profileUrl)
//         .split("/")
//         .filter(Boolean);

//       return (
//         parts[parts.length - 1]
//           ?.replace(/^@/, "") || "user"
//       );
//     }
//   };

//   /*
//    * प्रत्येक follower/following item एकाच format मध्ये convert करतो.
//    */
//   const normalizeUserItem = (item) => {
//     const profileUrl = cleanProfileUrl(item);

//     const normalizedUsername =
//       typeof item === "object" && item !== null
//         ? item.preferredUsername ||
//           item.username ||
//           getUsernameFromUrl(profileUrl)
//         : getUsernameFromUrl(profileUrl);

//     const displayName =
//       typeof item === "object" && item !== null
//         ? item.name ||
//           item.displayName ||
//           normalizedUsername
//         : normalizedUsername;

//     const avatar =
//       typeof item === "object" && item !== null
//         ? item.icon?.url ||
//           item.avatar?.url ||
//           item.avatar ||
//           item.profilePic?.url ||
//           item.profilePic ||
//           ""
//         : "";

//     let domain = "";

//     try {
//       domain = profileUrl
//         ? new URL(profileUrl).hostname
//         : "";
//     } catch {
//       domain = "";
//     }

//     return {
//       username: normalizedUsername,
//       displayName,
//       profileUrl,
//       avatar,
//       domain,
//     };
//   };

//   /*
//    * Same account duplicate असेल तर remove करतो.
//    *
//    * आधी profile URL वरून unique check.
//    * URL नसेल तर username + domain वरून check.
//    */
//   const removeDuplicateUsers = (users) => {
//     const uniqueUsersMap = new Map();

//     users.forEach((user) => {
//       const normalizedUrl = user.profileUrl
//         ?.trim()
//         .toLowerCase()
//         .replace(/\/+$/, "");

//       const normalizedUsername = user.username
//         ?.trim()
//         .toLowerCase();

//       const normalizedDomain = user.domain
//         ?.trim()
//         .toLowerCase();

//       const uniqueKey =
//         normalizedUrl ||
//         `${normalizedUsername}@${normalizedDomain}`;

//       if (!uniqueKey) return;

//       if (!uniqueUsersMap.has(uniqueKey)) {
//         uniqueUsersMap.set(uniqueKey, user);
//       }
//     });

//     return Array.from(uniqueUsersMap.values());
//   };

//   /*
//    * ActivityPub Collection चे वेगवेगळे response formats handle करतो.
//    */
//   const processCollection = (data) => {
//     let collectionItems = [];

//     if (Array.isArray(data)) {
//       collectionItems = data;
//     } else if (Array.isArray(data?.orderedItems)) {
//       collectionItems = data.orderedItems;
//     } else if (
//       Array.isArray(data?.first?.orderedItems)
//     ) {
//       collectionItems = data.first.orderedItems;
//     } else if (Array.isArray(data?.items)) {
//       collectionItems = data.items;
//     }

//     const normalizedUsers =
//       collectionItems.map(normalizeUserItem);

//     const uniqueUsers =
//       removeDuplicateUsers(normalizedUsers);

//     return {
//       items: uniqueUsers,

//       /*
//        * API चा totalItems वापरत नाही,
//        * कारण त्यामध्ये duplicate count असू शकतो.
//        */
//       total: uniqueUsers.length,
//     };
//   };

//   const fetchCollection = useCallback(
//     async (url) => {
//       const response = await axios.get(url, {
//         headers,
//       });

//       return processCollection(response.data);
//     },
//     [headers]
//   );

//   const fetchData = useCallback(async () => {
//     if (!username) {
//       setError("Username is missing.");
//       setLoading(false);
//       return;
//     }

//     if (!apiUrl) {
//       setError(
//         "REACT_APP_API_URL is missing in the environment file."
//       );
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const followersUrl =
//         `${apiUrl}/users/${username}/followers`;

//       const followingUrl =
//         `${apiUrl}/users/${username}/following`;

//       const [followersData, followingData] =
//         await Promise.all([
//           fetchCollection(followersUrl),
//           fetchCollection(followingUrl),
//         ]);

//       setFollowers(followersData.items);
//       setFollowing(followingData.items);

//       setTotalFollowers(followersData.items.length);
//       setTotalFollowing(followingData.items.length);
//     } catch (requestError) {
//       console.error(
//         "Failed to fetch connections:",
//         requestError.response?.data ||
//           requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           "Failed to load followers and following."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl, fetchCollection, username]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   /*
//    * Follower remove.
//    */
//   const removeFollower = async (targetUsername) => {
//     if (!targetUsername || actionUser) return;

//     const shouldRemove = window.confirm(
//       `Remove @${targetUsername} from your followers?`
//     );

//     if (!shouldRemove) return;

//     try {
//       setActionUser(`remove-${targetUsername}`);
//       setError("");

//       await axios.delete(
//         `${apiUrl}/users/${username}/followers/${targetUsername}`,
//         {
//           headers,
//         }
//       );

//       setFollowers((currentFollowers) => {
//         const updatedFollowers =
//           currentFollowers.filter(
//             (follower) =>
//               follower.username !== targetUsername
//           );

//         setTotalFollowers(updatedFollowers.length);

//         return updatedFollowers;
//       });
//     } catch (requestError) {
//       console.error(
//         "Remove follower failed:",
//         requestError.response?.data ||
//           requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           `Could not remove @${targetUsername}.`
//       );
//     } finally {
//       setActionUser("");
//     }
//   };

//   /*
//    * Following मधून user unfollow.
//    */
//   const unfollowUser = async (targetUsername) => {
//     if (!targetUsername || actionUser) return;

//     const shouldUnfollow = window.confirm(
//       `Unfollow @${targetUsername}?`
//     );

//     if (!shouldUnfollow) return;

//     try {
//       setActionUser(`unfollow-${targetUsername}`);
//       setError("");

//       await axios.delete(
//         `${apiUrl}/users/${username}/following/${targetUsername}`,
//         {
//           headers,
//         }
//       );

//       setFollowing((currentFollowing) => {
//         /*
//          * Same username च्या सर्व duplicate entries remove होतील.
//          */
//         const updatedFollowing =
//           currentFollowing.filter(
//             (followingUser) =>
//               followingUser.username !==
//               targetUsername
//           );

//         setTotalFollowing(updatedFollowing.length);

//         return updatedFollowing;
//       });
//     } catch (requestError) {
//       console.error(
//         "Unfollow failed:",
//         requestError.response?.data ||
//           requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           `Could not unfollow @${targetUsername}.`
//       );
//     } finally {
//       setActionUser("");
//     }
//   };

//   const isOwnProfile =
//     Boolean(currentUsername) &&
//     currentUsername === username;

//   const displayedUsers =
//     view === "followers"
//       ? followers
//       : following;

//   const getInitial = (value) =>
//     value?.trim()?.charAt(0)?.toUpperCase() || "U";

//   return (
//     <main className="connections-page">
//       <section className="connections-container">
//         {/* Profile information */}

//         <header className="connections-profile-card">
//           <div className="connections-profile-avatar">
//             {getInitial(username)}
//           </div>

//           <div className="connections-profile-info">
//             <p className="connections-label">
//               PHOTOFLUX CONNECTIONS
//             </p>

//             <h1>@{username}</h1>

//             <p>
//               View this user's local and remote
//               Fediverse connections.
//             </p>
//           </div>

//           <div className="connections-stats">
//             <div>
//               <strong>{totalFollowers}</strong>
//               <span>Followers</span>
//             </div>

//             <div>
//               <strong>{totalFollowing}</strong>
//               <span>Following</span>
//             </div>
//           </div>
//         </header>

//         {/* Followers / Following tabs */}

//         <div className="connections-tabs">
//           <button
//             type="button"
//             className={
//               view === "followers" ? "active" : ""
//             }
//             onClick={() => {
//               setView("followers");
//               setError("");
//             }}
//           >
//             Followers
//             <span>{totalFollowers}</span>
//           </button>

//           <button
//             type="button"
//             className={
//               view === "following" ? "active" : ""
//             }
//             onClick={() => {
//               setView("following");
//               setError("");
//             }}
//           >
//             Following
//             <span>{totalFollowing}</span>
//           </button>
//         </div>

//         {/* Error */}

//         {error && (
//           <div className="connections-error">
//             <span>!</span>

//             <p>{error}</p>

//             <button
//               type="button"
//               onClick={fetchData}
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Users list */}

//         <section className="connections-list-card">
//           <div className="connections-list-header">
//             <div>
//               <h2>
//                 {view === "followers"
//                   ? "Followers"
//                   : "Following"}
//               </h2>

//               <p>
//                 {displayedUsers.length}{" "}
//                 {displayedUsers.length === 1
//                   ? "connection"
//                   : "connections"}
//               </p>
//             </div>

//             <FaUserFriends />
//           </div>

//           {loading ? (
//             <div className="connections-loading">
//               <div className="connections-spinner" />

//               <p>Loading {view}...</p>
//             </div>
//           ) : displayedUsers.length === 0 ? (
//             <div className="connections-empty">
//               <div className="connections-empty-icon">
//                 <FaUserFriends />
//               </div>

//               <h3>
//                 {view === "followers"
//                   ? "No followers yet"
//                   : "Not following anyone"}
//               </h3>

//               <p>
//                 {view === "followers"
//                   ? "Followers will appear here."
//                   : "Follow people to build your network."}
//               </p>
//             </div>
//           ) : (
//             <div className="connections-list">
//               {displayedUsers.map(
//                 (connectionUser, index) => {
//                   const removeLoading =
//                     actionUser ===
//                     `remove-${connectionUser.username}`;

//                   const unfollowLoading =
//                     actionUser ===
//                     `unfollow-${connectionUser.username}`;

//                   const uniqueKey =
//                     connectionUser.profileUrl ||
//                     `${connectionUser.username}-${connectionUser.domain}-${index}`;

//                   return (
//                     <article
//                       className="connection-user-row"
//                       key={uniqueKey}
//                     >
//                       <div className="connection-user-main">
//                         <div className="connection-avatar">
//                           {connectionUser.avatar ? (
//                             <img
//                               src={connectionUser.avatar}
//                               alt={
//                                 connectionUser.username
//                               }
//                               onError={(event) => {
//                                 event.currentTarget.style.display =
//                                   "none";
//                               }}
//                             />
//                           ) : (
//                             <span>
//                               {getInitial(
//                                 connectionUser.username
//                               )}
//                             </span>
//                           )}
//                         </div>

//                         <div className="connection-user-info">
//                           <h3>
//                             {connectionUser.displayName ||
//                               connectionUser.username}
//                           </h3>

//                           <p>
//                             @{connectionUser.username}
//                           </p>

//                           {connectionUser.domain && (
//                             <small>
//                               {connectionUser.domain}
//                             </small>
//                           )}
//                         </div>
//                       </div>

//                       <div className="connection-actions">
//                         {connectionUser.profileUrl && (
//                           <a
//                             href={
//                               connectionUser.profileUrl
//                             }
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="connection-view-button"
//                           >
//                             <FaExternalLinkAlt />
//                             View
//                           </a>
//                         )}

//                         {isOwnProfile &&
//                           view === "followers" && (
//                             <button
//                               type="button"
//                               className="connection-remove-button"
//                               onClick={() =>
//                                 removeFollower(
//                                   connectionUser.username
//                                 )
//                               }
//                               disabled={
//                                 removeLoading ||
//                                 Boolean(actionUser)
//                               }
//                             >
//                               <FaTrashAlt />

//                               {removeLoading
//                                 ? "Removing..."
//                                 : "Remove"}
//                             </button>
//                           )}

//                         {isOwnProfile &&
//                           view === "following" && (
//                             <button
//                               type="button"
//                               className="connection-remove-button"
//                               onClick={() =>
//                                 unfollowUser(
//                                   connectionUser.username
//                                 )
//                               }
//                               disabled={
//                                 unfollowLoading ||
//                                 Boolean(actionUser)
//                               }
//                             >
//                               <FaUserMinus />

//                               {unfollowLoading
//                                 ? "Unfollowing..."
//                                 : "Unfollow"}
//                             </button>
//                           )}
//                       </div>
//                     </article>
//                   );
//                 }
//               )}
//             </div>
//           )}
//         </section>
//       </section>
//     </main>
//   );
// };

// export default FollowersPage;

















// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import {
//   FaCamera,
//   FaExternalLinkAlt,
//   FaTimes,
//   FaTrashAlt,
//   FaUpload,
//   FaUserFriends,
//   FaUserMinus,
// } from "react-icons/fa";
// import "./FollowersPage.css";

// const FollowersPage = () => {
//   const { username } = useParams();

//   const [view, setView] = useState("followers");
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [currentUsername, setCurrentUsername] = useState("");
//   const [profilePic, setProfilePic] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [actionUser, setActionUser] = useState("");
//   const [error, setError] = useState("");

//   const [profileModalOpen, setProfileModalOpen] = useState(false);
//   const [selectedProfileFile, setSelectedProfileFile] = useState(null);
//   const [profilePreview, setProfilePreview] = useState("");
//   const [profileUploading, setProfileUploading] = useState(false);
//   const [profileMessage, setProfileMessage] = useState("");

//   const profileInputRef = useRef(null);

//   const apiUrl = process.env.REACT_APP_API_URL;
//   const token = localStorage.getItem("token");

//   const headers = useMemo(
//     () => ({
//       Authorization: token ? `Bearer ${token}` : "",
//       Accept: "application/activity+json",
//       "ngrok-skip-browser-warning": "true",
//     }),
//     [token]
//   );

//   useEffect(() => {
//     try {
//       if (token) {
//         const decoded = jwtDecode(token);
//         setCurrentUsername(
//           decoded.username || localStorage.getItem("username") || ""
//         );
//       } else {
//         setCurrentUsername(localStorage.getItem("username") || "");
//       }
//     } catch (decodeError) {
//       console.error("Token decode error:", decodeError);
//       setCurrentUsername(localStorage.getItem("username") || "");
//     }
//   }, [token]);

//   useEffect(() => {
//     return () => {
//       if (profilePreview) URL.revokeObjectURL(profilePreview);
//     };
//   }, [profilePreview]);

//   const cleanProfileUrl = (item) => {
//     if (!item) return "";

//     const rawUrl =
//       typeof item === "string"
//         ? item
//         : item.id || item.url || item.href || item.actor || "";

//     if (!rawUrl) return "";

//     try {
//       const parsed = new URL(rawUrl);
//       return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(
//         /\/+$/,
//         ""
//       );
//     } catch {
//       return String(rawUrl).replace(/\/+$/, "");
//     }
//   };

//   const getUsernameFromUrl = (profileUrl) => {
//     if (!profileUrl) return "user";

//     try {
//       const parsed = new URL(profileUrl);
//       const parts = parsed.pathname.split("/").filter(Boolean);
//       return parts[parts.length - 1]?.replace(/^@/, "") || "user";
//     } catch {
//       const parts = String(profileUrl).split("/").filter(Boolean);
//       return parts[parts.length - 1]?.replace(/^@/, "") || "user";
//     }
//   };

//   const normalizeUserItem = (item) => {
//     const profileUrl = cleanProfileUrl(item);
//     const isObject = typeof item === "object" && item !== null;

//     const normalizedUsername = isObject
//       ? item.preferredUsername || item.username || getUsernameFromUrl(profileUrl)
//       : getUsernameFromUrl(profileUrl);

//     const displayName = isObject
//       ? item.name || item.displayName || normalizedUsername
//       : normalizedUsername;

//     const avatar = isObject
//       ? item.icon?.url ||
//         item.avatar?.url ||
//         item.avatar ||
//         item.profilePic?.url ||
//         item.profilePic ||
//         ""
//       : "";

//     let domain = "";
//     try {
//       domain = profileUrl ? new URL(profileUrl).hostname : "";
//     } catch {
//       domain = "";
//     }

//     return {
//       username: normalizedUsername,
//       displayName,
//       profileUrl,
//       avatar,
//       domain,
//     };
//   };

//   const processCollection = (data) => {
//     let items = [];

//     if (Array.isArray(data)) items = data;
//     else if (Array.isArray(data?.orderedItems)) items = data.orderedItems;
//     else if (Array.isArray(data?.first?.orderedItems)) {
//       items = data.first.orderedItems;
//     } else if (Array.isArray(data?.items)) items = data.items;

//     const uniqueMap = new Map();

//     items.map(normalizeUserItem).forEach((user) => {
//       const uniqueKey =
//         user.profileUrl?.toLowerCase().replace(/\/+$/, "") ||
//         `${user.username?.toLowerCase()}@${user.domain?.toLowerCase()}`;

//       if (uniqueKey && !uniqueMap.has(uniqueKey)) {
//         uniqueMap.set(uniqueKey, user);
//       }
//     });

//     return Array.from(uniqueMap.values());
//   };

//   const fetchData = async () => {
//     if (!username || !apiUrl) {
//       setError("Username or API URL is missing.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const [followersResponse, followingResponse, actorResponse] =
//         await Promise.all([
//           axios.get(`${apiUrl}/users/${username}/followers`, { headers }),
//           axios.get(`${apiUrl}/users/${username}/following`, { headers }),
//           axios.get(`${apiUrl}/users/${username}`, {
//             headers: {
//               Accept: "application/activity+json",
//               "ngrok-skip-browser-warning": "true",
//             },
//           }),
//         ]);

//       setFollowers(processCollection(followersResponse.data));
//       setFollowing(processCollection(followingResponse.data));

//       setProfilePic(
//         actorResponse.data?.icon?.url ||
//           actorResponse.data?.profilePic?.url ||
//           actorResponse.data?.profilePic ||
//           ""
//       );
//     } catch (requestError) {
//       console.error(
//         "Failed to load profile connections:",
//         requestError.response?.data || requestError.message
//       );

//       setError(
//         requestError.response?.data?.message ||
//           "Failed to load followers and following."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [username, apiUrl, token]);

//   const removeFollower = async (targetUsername) => {
//     if (!targetUsername || actionUser) return;

//     if (!window.confirm(`Remove @${targetUsername} from your followers?`)) {
//       return;
//     }

//     try {
//       setActionUser(`remove-${targetUsername}`);
//       setError("");

//       await axios.delete(
//         `${apiUrl}/users/${username}/followers/${targetUsername}`,
//         { headers }
//       );

//       setFollowers((current) =>
//         current.filter((user) => user.username !== targetUsername)
//       );
//     } catch (requestError) {
//       setError(
//         requestError.response?.data?.message ||
//           `Could not remove @${targetUsername}.`
//       );
//     } finally {
//       setActionUser("");
//     }
//   };

//   const unfollowUser = async (targetUsername) => {
//     if (!targetUsername || actionUser) return;

//     if (!window.confirm(`Unfollow @${targetUsername}?`)) return;

//     try {
//       setActionUser(`unfollow-${targetUsername}`);
//       setError("");

//       await axios.delete(
//         `${apiUrl}/users/${username}/following/${targetUsername}`,
//         { headers }
//       );

//       setFollowing((current) =>
//         current.filter((user) => user.username !== targetUsername)
//       );
//     } catch (requestError) {
//       setError(
//         requestError.response?.data?.message ||
//           `Could not unfollow @${targetUsername}.`
//       );
//     } finally {
//       setActionUser("");
//     }
//   };

//   const handleProfileFileSelect = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       setProfileMessage("Only JPG, PNG and WEBP images are allowed.");
//       event.target.value = "";
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setProfileMessage("Profile picture must be less than 5 MB.");
//       event.target.value = "";
//       return;
//     }

//     if (profilePreview) URL.revokeObjectURL(profilePreview);

//     setSelectedProfileFile(file);
//     setProfilePreview(URL.createObjectURL(file));
//     setProfileMessage("");
//     setProfileModalOpen(true);
//     event.target.value = "";
//   };

//   const closeProfileModal = () => {
//     if (profileUploading) return;

//     if (profilePreview) URL.revokeObjectURL(profilePreview);

//     setProfileModalOpen(false);
//     setSelectedProfileFile(null);
//     setProfilePreview("");
//     setProfileMessage("");
//   };

//   const uploadProfilePicture = async () => {
//     if (!selectedProfileFile) {
//       setProfileMessage("Please select a profile picture.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("profilePic", selectedProfileFile);

//     try {
//       setProfileUploading(true);
//       setProfileMessage("");

//       const response = await axios.put(
//         `${apiUrl}/api/users/me/profile-picture`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//           },
//         }
//       );

//       const updatedPicture =
//         response.data?.profilePic?.url ||
//         response.data?.user?.profilePic?.url ||
//         response.data?.profilePic ||
//         profilePreview;

//       setProfilePic(updatedPicture);
//       setProfileMessage("Profile picture updated successfully.");

//       window.setTimeout(() => closeProfileModal(), 700);
//     } catch (requestError) {
//       setProfileMessage(
//         requestError.response?.data?.message ||
//           "Failed to update profile picture."
//       );
//     } finally {
//       setProfileUploading(false);
//     }
//   };

//   const isOwnProfile =
//     Boolean(currentUsername) && currentUsername === username;

//   const displayedUsers = view === "followers" ? followers : following;

//   const getInitial = (value) =>
//     value?.trim()?.charAt(0)?.toUpperCase() || "U";

//   return (
//     <main className="connections-page">
//       <section className="connections-container">
//         <header className="connections-profile-card">
//           <div
//             className={`connections-profile-avatar ${
//               isOwnProfile ? "connections-profile-avatar-editable" : ""
//             }`}
//             onClick={() => {
//               if (isOwnProfile && !profileUploading) {
//                 profileInputRef.current?.click();
//               }
//             }}
//           >
//             {profilePic ? (
//               <img
//                 src={profilePic}
//                 alt={`${username} profile`}
//                 onError={() => setProfilePic("")}
//               />
//             ) : (
//               <span>{getInitial(username)}</span>
//             )}

//             {isOwnProfile && (
//               <div className="connections-profile-camera">
//                 <FaCamera />
//               </div>
//             )}
//           </div>

//           {isOwnProfile && (
//             <input
//               ref={profileInputRef}
//               type="file"
//               accept="image/jpeg,image/jpg,image/png,image/webp"
//               onChange={handleProfileFileSelect}
//               hidden
//             />
//           )}

//           <div className="connections-profile-info">
//             <p className="connections-label">PHOTOFLUX CONNECTIONS</p>
//             <h1>@{username}</h1>
//             <p>
//               View followers and following from the local network and the
//               Fediverse.
//             </p>
//           </div>

//           <div className="connections-stats">
//             <div>
//               <strong>{followers.length}</strong>
//               <span>Followers</span>
//             </div>
//             <div>
//               <strong>{following.length}</strong>
//               <span>Following</span>
//             </div>
//           </div>
//         </header>

//         <div className="connections-tabs">
//           <button
//             type="button"
//             className={view === "followers" ? "active" : ""}
//             onClick={() => setView("followers")}
//           >
//             Followers <span>{followers.length}</span>
//           </button>

//           <button
//             type="button"
//             className={view === "following" ? "active" : ""}
//             onClick={() => setView("following")}
//           >
//             Following <span>{following.length}</span>
//           </button>
//         </div>

//         {error && (
//           <div className="connections-error">
//             <span>!</span>
//             <p>{error}</p>
//             <button type="button" onClick={fetchData}>
//               Retry
//             </button>
//           </div>
//         )}

//         <section className="connections-list-card">
//           <div className="connections-list-header">
//             <div>
//               <h2>{view === "followers" ? "Followers" : "Following"}</h2>
//               <p>{displayedUsers.length} connections</p>
//             </div>
//             <FaUserFriends />
//           </div>

//           {loading ? (
//             <div className="connections-loading">
//               <div className="connections-spinner" />
//               <p>Loading...</p>
//             </div>
//           ) : displayedUsers.length === 0 ? (
//             <div className="connections-empty">
//               <div className="connections-empty-icon">
//                 <FaUserFriends />
//               </div>
//               <h3>
//                 {view === "followers"
//                   ? "No followers yet"
//                   : "Not following anyone"}
//               </h3>
//             </div>
//           ) : (
//             <div className="connections-list">
//               {displayedUsers.map((connectionUser, index) => {
//                 const removeLoading =
//                   actionUser === `remove-${connectionUser.username}`;
//                 const unfollowLoading =
//                   actionUser === `unfollow-${connectionUser.username}`;

//                 return (
//                   <article
//                     className="connection-user-row"
//                     key={
//                       connectionUser.profileUrl ||
//                       `${connectionUser.username}-${index}`
//                     }
//                   >
//                     <div className="connection-user-main">
//                       <div className="connection-avatar">
//                         {connectionUser.avatar ? (
//                           <img
//                             src={connectionUser.avatar}
//                             alt={connectionUser.username}
//                           />
//                         ) : (
//                           <span>{getInitial(connectionUser.username)}</span>
//                         )}
//                       </div>

//                       <div className="connection-user-info">
//                         <h3>
//                           {connectionUser.displayName || connectionUser.username}
//                         </h3>
//                         <p>@{connectionUser.username}</p>
//                         {connectionUser.domain && (
//                           <small>{connectionUser.domain}</small>
//                         )}
//                       </div>
//                     </div>

//                     <div className="connection-actions">
//                       {connectionUser.profileUrl && (
//                         <a
//                           href={connectionUser.profileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="connection-view-button"
//                         >
//                           <FaExternalLinkAlt /> View
//                         </a>
//                       )}

//                       {isOwnProfile && view === "followers" && (
//                         <button
//                           type="button"
//                           className="connection-remove-button"
//                           onClick={() =>
//                             removeFollower(connectionUser.username)
//                           }
//                           disabled={removeLoading || Boolean(actionUser)}
//                         >
//                           <FaTrashAlt />
//                           {removeLoading ? "Removing..." : "Remove"}
//                         </button>
//                       )}

//                       {isOwnProfile && view === "following" && (
//                         <button
//                           type="button"
//                           className="connection-remove-button"
//                           onClick={() =>
//                             unfollowUser(connectionUser.username)
//                           }
//                           disabled={unfollowLoading || Boolean(actionUser)}
//                         >
//                           <FaUserMinus />
//                           {unfollowLoading ? "Unfollowing..." : "Unfollow"}
//                         </button>
//                       )}
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </section>

//       {profileModalOpen && (
//         <div className="profile-update-backdrop">
//           <section className="profile-update-modal">
//             <div className="profile-update-header">
//               <div>
//                 <p>PROFILE PICTURE</p>
//                 <h2>Update picture</h2>
//               </div>
//               <button type="button" onClick={closeProfileModal}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="profile-update-body">
//               <div className="profile-update-preview">
//                 <img src={profilePreview} alt="Profile preview" />
//               </div>

//               <h3>@{username}</h3>

//               {selectedProfileFile && (
//                 <div className="profile-update-file">
//                   <span>{selectedProfileFile.name}</span>
//                   <small>
//                     {(selectedProfileFile.size / (1024 * 1024)).toFixed(2)} MB
//                   </small>
//                 </div>
//               )}

//               {profileMessage && (
//                 <div
//                   className={`profile-update-message ${
//                     profileMessage.includes("successfully")
//                       ? "success"
//                       : "error"
//                   }`}
//                 >
//                   {profileMessage}
//                 </div>
//               )}
//             </div>

//             <div className="profile-update-actions">
//               <button
//                 type="button"
//                 className="profile-update-change"
//                 onClick={() => profileInputRef.current?.click()}
//                 disabled={profileUploading}
//               >
//                 <FaCamera /> Choose another
//               </button>

//               <button
//                 type="button"
//                 className="profile-update-save"
//                 onClick={uploadProfilePicture}
//                 disabled={profileUploading || !selectedProfileFile}
//               >
//                 <FaUpload />
//                 {profileUploading ? "Uploading..." : "Save picture"}
//               </button>
//             </div>
//           </section>
//         </div>
//       )}
//     </main>
//   );
// };

// export default FollowersPage;
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  FaCamera,
  FaExternalLinkAlt,
  FaTimes,
  FaTrashAlt,
  FaUpload,
  FaUserFriends,
  FaUserMinus,
} from "react-icons/fa";

import "./FollowersPage.css";

const FollowersPage = () => {
  const { username } = useParams();

  const [view, setView] = useState("followers");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [currentUsername, setCurrentUsername] =
    useState("");

  const [profilePic, setProfilePic] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionUser, setActionUser] = useState("");
  const [error, setError] = useState("");

  const [profileModalOpen, setProfileModalOpen] =
    useState(false);

  const [
    selectedProfileFile,
    setSelectedProfileFile,
  ] = useState(null);

  const [profilePreview, setProfilePreview] =
    useState("");

  const [profileUploading, setProfileUploading] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState("");

  const profileInputRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      Authorization: token
        ? `Bearer ${token}`
        : "",

      Accept: "application/activity+json",

      "ngrok-skip-browser-warning": "true",
    }),
    [token]
  );

  
  const addCacheBuster = (url) => {
    if (!url) return "";

    const cleanUrl = String(url)
      .replace(
        /([?&])v=\d+(&|$)/,
        "$1"
      )
      .replace(/[?&]$/, "");

    const separator = cleanUrl.includes("?")
      ? "&"
      : "?";

    return `${cleanUrl}${separator}v=${Date.now()}`;
  };

  
  const getProfilePictureUrl = (data) => {
    return (
      data?.profilePic?.url ||
      data?.user?.profilePic?.url ||
      data?.user?.profilePic ||
      data?.profilePic ||
      data?.icon?.url ||
      ""
    );
  };

  
  useEffect(() => {
    try {
      if (token) {
        const decoded = jwtDecode(token);

        setCurrentUsername(
          decoded.username ||
            localStorage.getItem("username") ||
            ""
        );
      } else {
        setCurrentUsername(
          localStorage.getItem("username") || ""
        );
      }
    } catch (decodeError) {
      console.error(
        "Token decode error:",
        decodeError
      );

      setCurrentUsername(
        localStorage.getItem("username") || ""
      );
    }
  }, [token]);

  
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const cleanProfileUrl = (item) => {
    if (!item) return "";

    const rawUrl =
      typeof item === "string"
        ? item
        : item.id ||
          item.url ||
          item.href ||
          item.actor ||
          "";

    if (!rawUrl) return "";

    try {
      const parsed = new URL(rawUrl);

      return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(
        /\/+$/,
        ""
      );
    } catch {
      return String(rawUrl).replace(
        /\/+$/,
        ""
      );
    }
  };

  const getUsernameFromUrl = (profileUrl) => {
    if (!profileUrl) return "user";

    try {
      const parsed = new URL(profileUrl);

      const parts = parsed.pathname
        .split("/")
        .filter(Boolean);

      return (
        parts[parts.length - 1]
          ?.replace(/^@/, "") || "user"
      );
    } catch {
      const parts = String(profileUrl)
        .split("/")
        .filter(Boolean);

      return (
        parts[parts.length - 1]
          ?.replace(/^@/, "") || "user"
      );
    }
  };

  const normalizeUserItem = (item) => {
    const profileUrl =
      cleanProfileUrl(item);

    const isObject =
      typeof item === "object" &&
      item !== null;

    const normalizedUsername = isObject
      ? item.preferredUsername ||
        item.username ||
        getUsernameFromUrl(profileUrl)
      : getUsernameFromUrl(profileUrl);

    const displayName = isObject
      ? item.name ||
        item.displayName ||
        normalizedUsername
      : normalizedUsername;

    const avatar = isObject
      ? item.icon?.url ||
        item.avatar?.url ||
        item.avatar ||
        item.profilePic?.url ||
        item.profilePic ||
        ""
      : "";

    let domain = "";

    try {
      domain = profileUrl
        ? new URL(profileUrl).hostname
        : "";
    } catch {
      domain = "";
    }

    return {
      username: normalizedUsername,
      displayName,
      profileUrl,
      avatar,
      domain,
    };
  };

  /*
   * Duplicate followers/following remove.
   */
  const processCollection = (data) => {
    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (
      Array.isArray(data?.orderedItems)
    ) {
      items = data.orderedItems;
    } else if (
      Array.isArray(
        data?.first?.orderedItems
      )
    ) {
      items = data.first.orderedItems;
    } else if (
      Array.isArray(data?.items)
    ) {
      items = data.items;
    }

    const uniqueMap = new Map();

    items
      .map(normalizeUserItem)
      .forEach((user) => {
        const uniqueKey =
          user.profileUrl
            ?.toLowerCase()
            .replace(/\/+$/, "") ||
          `${user.username?.toLowerCase()}@${user.domain?.toLowerCase()}`;

        if (
          uniqueKey &&
          !uniqueMap.has(uniqueKey)
        ) {
          uniqueMap.set(
            uniqueKey,
            user
          );
        }
      });

    return Array.from(
      uniqueMap.values()
    );
  };

  
  const fetchProfilePicture = async () => {
    if (!username || !apiUrl) return;

    const loggedUsername =
      localStorage.getItem("username") ||
      "";

    try {
      let response;

    
      if (
        token &&
        loggedUsername === username
      ) {
        response = await axios.get(
          `${apiUrl}/api/users/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "ngrok-skip-browser-warning":
                "true",
            },
          }
        );
      } else {
        /*
         * दुसऱ्या user साठी actor endpoint.
         */
        response = await axios.get(
          `${apiUrl}/users/${username}`,
          {
            headers: {
              Accept:
                "application/activity+json",

              "ngrok-skip-browser-warning":
                "true",
            },
          }
        );
      }

      const permanentUrl =
        getProfilePictureUrl(
          response.data
        );

      if (permanentUrl) {
        setProfilePic(
          addCacheBuster(permanentUrl)
        );

        if (
          loggedUsername === username
        ) {
          localStorage.setItem(
            "profilePic",
            permanentUrl
          );
        }
      } else {
        setProfilePic("");
      }
    } catch (requestError) {
      console.error(
        "Profile picture fetch failed:",
        requestError.response?.data ||
          requestError.message
      );

      
      if (
        loggedUsername === username
      ) {
        const storedProfilePic =
          localStorage.getItem(
            "profilePic"
          );

        setProfilePic(
          storedProfilePic
            ? addCacheBuster(
                storedProfilePic
              )
            : ""
        );
      }
    }
  };

  /*
   * Followers आणि following fetch.
   */
  const fetchData = async () => {
    if (!username || !apiUrl) {
      setError(
        "Username or API URL is missing."
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        followersResponse,
        followingResponse,
      ] = await Promise.all([
        axios.get(
          `${apiUrl}/users/${username}/followers`,
          {
            headers,
          }
        ),

        axios.get(
          `${apiUrl}/users/${username}/following`,
          {
            headers,
          }
        ),
      ]);

      setFollowers(
        processCollection(
          followersResponse.data
        )
      );

      setFollowing(
        processCollection(
          followingResponse.data
        )
      );
    } catch (requestError) {
      console.error(
        "Failed to load connections:",
        requestError.response?.data ||
          requestError.message
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Failed to load followers and following."
      );
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchData();
    fetchProfilePicture();

    
  }, [username, apiUrl, token]);

  const removeFollower = async (
    targetUsername
  ) => {
    if (
      !targetUsername ||
      actionUser
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Remove @${targetUsername} from your followers?`
    );

    if (!confirmed) return;

    try {
      setActionUser(
        `remove-${targetUsername}`
      );

      setError("");

      await axios.delete(
        `${apiUrl}/users/${username}/followers/${targetUsername}`,
        {
          headers,
        }
      );

      setFollowers((current) =>
        current.filter(
          (user) =>
            user.username !==
            targetUsername
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          `Could not remove @${targetUsername}.`
      );
    } finally {
      setActionUser("");
    }
  };

  const unfollowUser = async (
    targetUsername
  ) => {
    if (
      !targetUsername ||
      actionUser
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Unfollow @${targetUsername}?`
    );

    if (!confirmed) return;

    try {
      setActionUser(
        `unfollow-${targetUsername}`
      );

      setError("");

      await axios.delete(
        `${apiUrl}/users/${username}/following/${targetUsername}`,
        {
          headers,
        }
      );

      setFollowing((current) =>
        current.filter(
          (user) =>
            user.username !==
            targetUsername
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
          `Could not unfollow @${targetUsername}.`
      );
    } finally {
      setActionUser("");
    }
  };

  const handleProfileFileSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setProfileMessage(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setProfileMessage(
        "Profile picture must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (profilePreview) {
      URL.revokeObjectURL(
        profilePreview
      );
    }

    setSelectedProfileFile(file);

    setProfilePreview(
      URL.createObjectURL(file)
    );

    setProfileMessage("");
    setProfileModalOpen(true);

    event.target.value = "";
  };

  const resetProfileModal = () => {
    if (profilePreview) {
      URL.revokeObjectURL(
        profilePreview
      );
    }

    setProfileModalOpen(false);
    setSelectedProfileFile(null);
    setProfilePreview("");
    setProfileMessage("");
  };

  const closeProfileModal = () => {
    if (profileUploading) return;

    resetProfileModal();
  };

  /*
   * Profile picture upload.
   */
  const uploadProfilePicture =
    async () => {
      if (!selectedProfileFile) {
        setProfileMessage(
          "Please select a profile picture."
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "profilePic",
        selectedProfileFile
      );

      try {
        setProfileUploading(true);
        setProfileMessage("");

        const response =
          await axios.put(
            `${apiUrl}/api/users/me/profile-picture`,
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "ngrok-skip-browser-warning":
                  "true",
              },
            }
          );

        const permanentUrl =
          getProfilePictureUrl(
            response.data
          );

       
        if (!permanentUrl) {
          throw new Error(
            "Backend did not return profile picture URL."
          );
        }

        
        setProfilePic(
          addCacheBuster(
            permanentUrl
          )
        );

        localStorage.setItem(
          "profilePic",
          permanentUrl
        );

        
        window.dispatchEvent(
          new CustomEvent(
            "profile-picture-updated",
            {
              detail: permanentUrl,
            }
          )
        );

        setProfileMessage(
          "Profile picture updated successfully."
        );

        window.setTimeout(() => {
          resetProfileModal();

          
          fetchProfilePicture();
        }, 700);
      } catch (requestError) {
        console.error(
          "Profile picture update failed:",
          requestError.response?.data ||
            requestError.message
        );

        setProfileMessage(
          requestError.response?.data
            ?.message ||
            requestError.message ||
            "Failed to update profile picture."
        );
      } finally {
        setProfileUploading(false);
      }
    };

  const isOwnProfile =
    Boolean(currentUsername) &&
    currentUsername === username;

  const displayedUsers =
    view === "followers"
      ? followers
      : following;

  const getInitial = (value) =>
    value
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <main className="connections-page">
      <section className="connections-container">
        <header className="connections-profile-card">
          <div
            className={`connections-profile-avatar ${
              isOwnProfile
                ? "connections-profile-avatar-editable"
                : ""
            }`}
            onClick={() => {
              if (
                isOwnProfile &&
                !profileUploading
              ) {
                profileInputRef.current?.click();
              }
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt={`${username} profile`}
                onError={() => {
                  const storedProfilePic =
                    localStorage.getItem(
                      "profilePic"
                    );

                  if (
                    storedProfilePic
                  ) {
                    setProfilePic(
                      addCacheBuster(
                        storedProfilePic
                      )
                    );
                  } else {
                    setProfilePic("");
                  }
                }}
              />
            ) : (
              <span>
                {getInitial(username)}
              </span>
            )}

            {isOwnProfile && (
              <div className="connections-profile-camera">
                <FaCamera />
              </div>
            )}
          </div>

          {isOwnProfile && (
            <input
              ref={profileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handleProfileFileSelect
              }
              hidden
            />
          )}

          <div className="connections-profile-info">
            <p className="connections-label">
              PHOTOFLUX CONNECTIONS
            </p>

            <h1>@{username}</h1>

            <p>
              View followers and following
              from the local network and the
              Fediverse.
            </p>
          </div>

          <div className="connections-stats">
            <div>
              <strong>
                {followers.length}
              </strong>

              <span>Followers</span>
            </div>

            <div>
              <strong>
                {following.length}
              </strong>

              <span>Following</span>
            </div>
          </div>
        </header>

        <div className="connections-tabs">
          <button
            type="button"
            className={
              view === "followers"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("followers")
            }
          >
            Followers
            <span>
              {followers.length}
            </span>
          </button>

          <button
            type="button"
            className={
              view === "following"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("following")
            }
          >
            Following
            <span>
              {following.length}
            </span>
          </button>
        </div>

        {error && (
          <div className="connections-error">
            <span>!</span>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        )}

        <section className="connections-list-card">
          <div className="connections-list-header">
            <div>
              <h2>
                {view === "followers"
                  ? "Followers"
                  : "Following"}
              </h2>

              <p>
                {displayedUsers.length}{" "}
                connections
              </p>
            </div>

            <FaUserFriends />
          </div>

          {loading ? (
            <div className="connections-loading">
              <div className="connections-spinner" />
              <p>Loading...</p>
            </div>
          ) : displayedUsers.length ===
            0 ? (
            <div className="connections-empty">
              <div className="connections-empty-icon">
                <FaUserFriends />
              </div>

              <h3>
                {view === "followers"
                  ? "No followers yet"
                  : "Not following anyone"}
              </h3>
            </div>
          ) : (
            <div className="connections-list">
              {displayedUsers.map(
                (
                  connectionUser,
                  index
                ) => {
                  const removeLoading =
                    actionUser ===
                    `remove-${connectionUser.username}`;

                  const unfollowLoading =
                    actionUser ===
                    `unfollow-${connectionUser.username}`;

                  return (
                    <article
                      className="connection-user-row"
                      key={
                        connectionUser.profileUrl ||
                        `${connectionUser.username}-${index}`
                      }
                    >
                      <div className="connection-user-main">
                        <div className="connection-avatar">
                          {connectionUser.avatar ? (
                            <img
                              src={
                                connectionUser.avatar
                              }
                              alt={
                                connectionUser.username
                              }
                            />
                          ) : (
                            <span>
                              {getInitial(
                                connectionUser.username
                              )}
                            </span>
                          )}
                        </div>

                        <div className="connection-user-info">
                          <h3>
                            {connectionUser.displayName ||
                              connectionUser.username}
                          </h3>

                          <p>
                            @
                            {
                              connectionUser.username
                            }
                          </p>

                          {connectionUser.domain && (
                            <small>
                              {
                                connectionUser.domain
                              }
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="connection-actions">
                        {connectionUser.profileUrl && (
                          <a
                            href={
                              connectionUser.profileUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="connection-view-button"
                          >
                            <FaExternalLinkAlt />
                            View
                          </a>
                        )}

                        {isOwnProfile &&
                          view ===
                            "followers" && (
                            <button
                              type="button"
                              className="connection-remove-button"
                              onClick={() =>
                                removeFollower(
                                  connectionUser.username
                                )
                              }
                              disabled={
                                removeLoading ||
                                Boolean(
                                  actionUser
                                )
                              }
                            >
                              <FaTrashAlt />

                              {removeLoading
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          )}

                        {isOwnProfile &&
                          view ===
                            "following" && (
                            <button
                              type="button"
                              className="connection-remove-button"
                              onClick={() =>
                                unfollowUser(
                                  connectionUser.username
                                )
                              }
                              disabled={
                                unfollowLoading ||
                                Boolean(
                                  actionUser
                                )
                              }
                            >
                              <FaUserMinus />

                              {unfollowLoading
                                ? "Unfollowing..."
                                : "Unfollow"}
                            </button>
                          )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </section>

      {profileModalOpen && (
        <div
          className="profile-update-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeProfileModal();
            }
          }}
        >
          <section className="profile-update-modal">
            <div className="profile-update-header">
              <div>
                <p>PROFILE PICTURE</p>
                <h2>Update picture</h2>
              </div>

              <button
                type="button"
                onClick={
                  closeProfileModal
                }
                disabled={
                  profileUploading
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="profile-update-body">
              <div className="profile-update-preview">
                {profilePreview ? (
                  <img
                    src={
                      profilePreview
                    }
                    alt="Profile preview"
                  />
                ) : (
                  <span>
                    {getInitial(
                      username
                    )}
                  </span>
                )}
              </div>

              <h3>@{username}</h3>

              {selectedProfileFile && (
                <div className="profile-update-file">
                  <span>
                    {
                      selectedProfileFile.name
                    }
                  </span>

                  <small>
                    {(
                      selectedProfileFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </small>
                </div>
              )}

              {profileMessage && (
                <div
                  className={`profile-update-message ${
                    profileMessage.includes(
                      "successfully"
                    )
                      ? "success"
                      : "error"
                  }`}
                >
                  {profileMessage}
                </div>
              )}
            </div>

            <div className="profile-update-actions">
              <button
                type="button"
                className="profile-update-change"
                onClick={() =>
                  profileInputRef.current?.click()
                }
                disabled={
                  profileUploading
                }
              >
                <FaCamera />
                Choose another
              </button>

              <button
                type="button"
                className="profile-update-save"
                onClick={
                  uploadProfilePicture
                }
                disabled={
                  profileUploading ||
                  !selectedProfileFile
                }
              >
                <FaUpload />

                {profileUploading
                  ? "Uploading..."
                  : "Save picture"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default FollowersPage;