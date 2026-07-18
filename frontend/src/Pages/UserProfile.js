


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const UserProfile = () => {
//   const { username } = useParams();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL}/users/${username}`,
//           {
//             headers: {
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );
//         setUser(res.data);
//       } catch (err) {
//         console.error("User not found:", err);
//         setError("User not found.");
//       }
//     };

//     const fetchUserPosts = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL}/users/${username}/outbox`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               Accept: "application/activity+json",
//               "ngrok-skip-browser-warning": "true",
//             },
//             withCredentials: true,
//           }
//         );

//         const postsData = res.data?.orderedItems || [];
//         setPosts(postsData);
//       } catch (err) {
//         console.error("Failed to fetch posts:", err);
//         setPosts([]);
//       }
//     };

//     fetchUserData();
//     fetchUserPosts();
//   }, [username]);

//   if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
//   if (!user) return <div className="container mt-4">Loading profile...</div>;

//   return (
//     <div className="container mt-4">
//       <div className="text-center mb-4">
//         <img
//           src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff&size=128`}
//           className="rounded-circle mb-3"
//           alt={user.username}
//           style={{ width: "128px", height: "128px" }}
//         />
//         <h4>@{user.username}</h4>
//         <p className="text-muted">{user.displayName || "No display name"}</p>
//       </div>
//                                   <span
//                 className="badge bg-primary"
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   padding: "8px 16px",
//                   borderRadius: "50px",
//                   fontSize: "0.85rem",
//                   fontWeight: "600",
//                 }}
//               >
//                 Coming Soon
//               </span>
//       <h5 className="mt-4 mb-3">📸 Posts</h5>
//       {posts.length === 0 ? (
//         <p className="text-muted">No posts yet.</p>
//       ) : (
//         <div className="row">
//           {posts.map((post, i) => (
//             <div className="col-md-4 mb-3" key={i}>
//               <div className="card shadow-sm">
//                 {post.image && (
//                   <img
//                     src={post.image}
//                     alt="post"
//                     className="card-img-top"
//                     style={{ height: "200px", objectFit: "cover" }}
//                   />
//                 )}
//                 <div className="card-body">
//                   <p className="card-text">{post.content || "No caption"}</p>
//                   <small className="text-muted">
//                     {new Date(post.published || post.createdAt).toLocaleString()}
//                   </small>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;




const UserProfile = () => {

  return (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      minHeight: "100vh",
      background: "#0f172a",
      padding: "20px",
    }}
  >
    <div
      className="text-center"
      style={{
        maxWidth: "550px",
        width: "100%",
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "20px",
        padding: "50px 40px",
        boxShadow: "0 20px 60px rgba(0,0,0,.35)",
      }}
    >
      <div
        className="mx-auto mb-4 d-flex justify-content-center align-items-center"
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "#fff",
          fontSize: "2rem",
          fontWeight: "700",
        }}
      >
        PF
      </div>

      <span className="badge bg-primary px-3 py-2 mb-4">
        PHOTOFLUX
      </span>

      <h1
        className="fw-bold text-white mb-3"
        style={{ fontSize: "3rem" }}
      >
        Coming Soon
      </h1>

      <p
        className="mb-4"
        style={{
          color: "#94a3b8",
          fontSize: "1.05rem",
          lineHeight: "1.8",
        }}
      >
        We're building a richer profile experience with bio,
        media gallery, followers insights and more.
        Stay tuned for upcoming updates.
      </p>

      <button
        className="btn btn-primary px-4 py-2"
        disabled
      >
        Under Development
      </button>
    </div>
  </div>
);
};

export default UserProfile;
