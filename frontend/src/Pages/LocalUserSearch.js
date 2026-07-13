
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const LocalUserSearch = () => {
//   const [users, setUsers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const currentUsername = localStorage.getItem("username");

//   useEffect(() => {
//     const fetchUsersAndFollowing = async () => {
//       try {
//         // Fetch all users
//         const usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "ngrok-skip-browser-warning": "true",
//           },
//         });

//         // Fetch following list (ActivityPub style)
//         const followingRes = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/users/${currentUsername}/following`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );

//         const processFollowing = (data) => {
//           if (data.orderedItems) return data.orderedItems;
//           if (data.first?.orderedItems) return data.first.orderedItems;
//           if (Array.isArray(data)) return data;
//           return [];
//         };

//         const followingList = processFollowing(followingRes.data);

//         const followingUsernames = followingList.map(url => {
//           const parts = url.split('/');
//           return parts[parts.length - 1];
//         });

//         setFollowing(followingUsernames);
//         setUsers(usersRes.data.filter(u => u.username !== currentUsername));
//       } catch (err) {
//         console.error("Error fetching data", err);
//         setError("Failed to load users.");
//       }
//     };

//     fetchUsersAndFollowing();
//   }, [currentUsername]);

//   const followUser = async (username) => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/users/${username}/follow`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setFollowing(prev => [...prev, username]);
//     } catch (err) {
//       console.error("Follow failed", err);
//       alert("Follow failed");
//     }
//   };

//   const unfollowUser = async (username) => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/users/${username}/unfollow`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setFollowing(prev => prev.filter(u => u !== username));
//     } catch (err) {
//       console.error("Unfollow failed", err);
//       alert("Unfollow failed");
//     }
//   };

//   const filteredUsers = users.filter(user =>
//     user.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container py-4" style={{ maxWidth: "700px" }}>
//       <div className="text-center mb-4">
//         <h2 style={{ fontFamily: "cursive" }}>📸 Photoflux Network</h2>
//         <p className="text-muted">Follow people to see their posts on your feed</p>
//       </div>

//       {/* Search Bar */}
//       <div className="input-group mb-4 shadow-sm">
//         <span className="input-group-text bg-white border-end-0">
//           <i className="bi bi-search"></i>
//         </span>
//         <input
//           type="text"
//           className="form-control border-start-0"
//           placeholder="Search by username..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       {filteredUsers.length === 0 ? (
//         <p className="text-muted text-center">No users found</p>
//       ) : (
//         <div className="row g-3">
//           {filteredUsers.map((user) => {
//             const isFollowing = following.includes(user.username);

//             return (
//               <div key={user._id} className="col-md-6">
//                 <div className="card shadow-sm h-100 border-0">
//                   <div className="card-body d-flex align-items-center">
//                     <img
//                       src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff&size=64`}
//                       alt={user.username}
//                       className="rounded-circle me-3"
//                       style={{ width: "64px", height: "64px" }}
//                     />
//                     <div className="flex-grow-1">
//                       <Link
//                         to={`/profile/${user.username}`}
//                         className="text-dark text-decoration-none"
//                       >
//                         <h6 className="mb-1">@{user.username}</h6>
//                       </Link>
//                       <small className="text-muted">
//                         {user.displayName || "No display name"}
//                       </small>
//                     </div>
//                     <div>
//                       {isFollowing ? (
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => unfollowUser(user.username)}
//                         >
//                           Unfollow
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-outline-success btn-sm"
//                           onClick={() => followUser(user.username)}
//                         >
//                           Follow
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div className="text-center mt-5 text-muted small">
//         © {new Date().getFullYear()} Photoflux
//       </div>
//     </div>
//   );
// };

// export default LocalUserSearch;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LocalUserSearch.css";

const LocalUserSearch = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionUser, setActionUser] = useState("");
  const [error, setError] = useState("");

  const currentUsername = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL;

  const headers = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersResponse, followingResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/users`, {
            headers,
          }),

          axios.get(
            `${apiUrl}/api/users/${currentUsername}/following`,
            {
              headers,
            }
          ),
        ]);

        const processFollowing = (data) => {
          if (Array.isArray(data)) {
            return data;
          }

          if (Array.isArray(data?.orderedItems)) {
            return data.orderedItems;
          }

          if (Array.isArray(data?.first?.orderedItems)) {
            return data.first.orderedItems;
          }

          return [];
        };

        const followingItems = processFollowing(
          followingResponse.data
        );

        const followingUsernames = followingItems
          .map((item) => {
            if (typeof item === "object") {
              return item.username || item.preferredUsername;
            }

            if (typeof item === "string") {
              const parts = item
                .split("/")
                .filter(Boolean);

              return parts[parts.length - 1];
            }

            return null;
          })
          .filter(Boolean);

        const allUsers = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data?.users || [];

        setFollowing(followingUsernames);

        setUsers(
          allUsers.filter(
            (user) => user.username !== currentUsername
          )
        );
      } catch (requestError) {
        console.error(
          "Error fetching users:",
          requestError.response?.data || requestError.message
        );

        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUsername && token) {
      fetchUsersAndFollowing();
    } else {
      setLoading(false);
      setError("Please login again.");
    }
  }, [apiUrl, currentUsername, token]);

  const followUser = async (username) => {
    try {
      setActionUser(username);
      setError("");

      await axios.post(
        `${apiUrl}/api/users/${username}/follow`,
        {},
        {
          headers,
        }
      );

      setFollowing((currentFollowing) => [
        ...new Set([...currentFollowing, username]),
      ]);
    } catch (requestError) {
      console.error(
        "Follow failed:",
        requestError.response?.data || requestError.message
      );

      setError(
        requestError.response?.data?.message ||
          `Could not follow @${username}.`
      );
    } finally {
      setActionUser("");
    }
  };

  const unfollowUser = async (username) => {
    try {
      setActionUser(username);
      setError("");

      await axios.post(
        `${apiUrl}/api/users/${username}/unfollow`,
        {},
        {
          headers,
        }
      );

      setFollowing((currentFollowing) =>
        currentFollowing.filter(
          (followingUsername) =>
            followingUsername !== username
        )
      );
    } catch (requestError) {
      console.error(
        "Unfollow failed:",
        requestError.response?.data ||
          requestError.message
      );

      setError(
        requestError.response?.data?.message ||
          `Could not unfollow @${username}.`
      );
    } finally {
      setActionUser("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const username = user.username || "";
    const displayName = user.displayName || "";

    const searchValue = searchTerm
      .trim()
      .toLowerCase()
      .replace(/^@/, "");

    return (
      username.toLowerCase().includes(searchValue) ||
      displayName.toLowerCase().includes(searchValue)
    );
  });

  const getProfileImage = (user) =>
    user.profilePic?.url ||
    user.profilePic ||
    user.avatar?.url ||
    user.avatar ||
    "";

  const getInitial = (username) =>
    username?.charAt(0)?.toUpperCase() || "U";

  if (loading) {
    return (
      <div className="local-users-loading">
        <div className="local-users-spinner" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <main className="local-users-page">
      <section className="local-users-container">
        <header className="local-users-header">
          <div className="local-users-header-icon">
            P
          </div>

          <div>
            <p className="local-users-label">
              PHOTOFLUX NETWORK
            </p>

            <h1>Discover people</h1>

            <p>
              Follow local PhotoFlux users and see their
              latest posts in your feed.
            </p>
          </div>
        </header>

        <div className="local-users-search">
          <span className="local-search-icon">
            &#128269;
          </span>

          <input
            type="text"
            placeholder="Search by username or display name"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="local-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="local-users-result-info">
          <span>
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1
              ? "user"
              : "users"}{" "}
            found
          </span>

          {following.length > 0 && (
            <span>
              Following {following.length}
            </span>
          )}
        </div>

        {error && (
          <div className="local-users-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {filteredUsers.length === 0 ? (
          <div className="local-users-empty">
            <div className="local-users-empty-icon">
              &#128100;
            </div>

            <h2>No users found</h2>

            <p>
              Try searching with another username.
            </p>
          </div>
        ) : (
          <div className="local-users-grid">
            {filteredUsers.map((user) => {
              const isFollowing = following.includes(
                user.username
              );

              const isActionLoading =
                actionUser === user.username;

              const profileImage =
                getProfileImage(user);

              return (
                <article
                  className="local-user-card"
                  key={user._id}
                >
                  <Link
                    to={`/profile/${user.username}`}
                    className="local-user-profile-link"
                  >
                    <div className="local-user-avatar">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={user.username}
                        />
                      ) : (
                        <span>
                          {getInitial(user.username)}
                        </span>
                      )}
                    </div>

                    <div className="local-user-info">
                      <h2>
                        {user.displayName ||
                          user.username}
                      </h2>

                      <p>@{user.username}</p>
                    </div>
                  </Link>

                  {isFollowing ? (
                    <button
                      type="button"
                      className="local-user-button local-unfollow-button"
                      onClick={() =>
                        unfollowUser(user.username)
                      }
                      disabled={isActionLoading}
                    >
                      {isActionLoading
                        ? "Removing..."
                        : "Following"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="local-user-button local-follow-button"
                      onClick={() =>
                        followUser(user.username)
                      }
                      disabled={isActionLoading}
                    >
                      {isActionLoading
                        ? "Following..."
                        : "Follow"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default LocalUserSearch;