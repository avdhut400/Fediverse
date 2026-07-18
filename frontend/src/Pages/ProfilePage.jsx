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
//               "ngrok-skip-browser-warning": "true",
//               Accept: "application/activity+json",
//             },
//             withCredentials: true,
//           }
//         );

//         const postsData = res.data?.orderedItems || []; // ✅ ensure it's always an array
//         setPosts(postsData);
//       } catch (err) {
//         console.error("Failed to fetch posts:", err);
//         setPosts([]); // fallback to empty array to prevent map error
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
//                     {new Date(post.createdAt).toLocaleString()}
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

// export default UserProfil;
