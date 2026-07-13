

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";
// import { 
//   FaHeart, 
//   FaRegHeart, 
//   FaShare, 
  
  
//   FaCommentDots,
//   FaTrash,
//   FaEdit
// } from "react-icons/fa";

// const FeedPage = () => {
//   const [feed, setFeed] = useState([]);

//   const { token, user: authUser } = useContext(AuthContext);
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentProfilePic, setCurrentProfilePic] = useState(
//     localStorage.getItem("profilePic") || ""
//   );

//   // Comments
//   const [showModal, setShowModal] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingComment, setEditingComment] = useState(null);
//   const [editCommentText, setEditCommentText] = useState("");

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         if (token) {
//           const decoded = jwtDecode(token);
//           setUserId(decoded.id);
//         }

//         await Promise.all([fetchFeed(), fetchMyProfilePicture()]);
//       } catch (err) {
//         console.error("Initialization error:", err);
//         setError("Failed to initialize. Please refresh the page.");
//       }
//     };

//     initialize();
//   }, [token]);

//   useEffect(() => {
//     const handleProfilePictureUpdate = (event) => {
//       const updatedUrl = event?.detail || localStorage.getItem("profilePic") || "";
//       setCurrentProfilePic(updatedUrl);
//     };

//     window.addEventListener(
//       "profile-picture-updated",
//       handleProfilePictureUpdate
//     );

//     return () => {
//       window.removeEventListener(
//         "profile-picture-updated",
//         handleProfilePictureUpdate
//       );
//     };
//   }, []);

//   const fetchMyProfilePicture = async () => {
//     if (!token) return;

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/api/users/me`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//           },
//         }
//       );

//       const profileUrl =
//         response.data?.profilePic?.url ||
//         response.data?.user?.profilePic?.url ||
//         "";

//       if (profileUrl) {
//         setCurrentProfilePic(profileUrl);
//         localStorage.setItem("profilePic", profileUrl);
//       }
//     } catch (err) {
//       console.error(
//         "Failed to fetch current profile picture:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   const getProfilePictureUrl = (person, username = "") => {
//     const imageUrl =
//       person?.profilePic?.url ||
//       person?.profilePic ||
//       person?.icon?.url ||
//       person?.avatar?.url ||
//       person?.avatar ||
//       "";

//     if (typeof imageUrl === "string" && imageUrl.trim()) {
//       return imageUrl;
//     }

//     const loggedUsername =
//       authUser?.username || localStorage.getItem("username") || "";

//     if (username && username === loggedUsername && currentProfilePic) {
//       return currentProfilePic;
//     }

//     return "";
//   };

//   const getPostAuthorName = (post) =>
//     post.author?.username || post.username || "unknown";

//   const getCommentAuthor = (comment) =>
//     comment.user || comment.author || {};

//   const getCommentAuthorName = (comment) => {
//     const author = getCommentAuthor(comment);

//     return (
//       author.username ||
//       author.preferredUsername ||
//       comment.username ||
//       "User"
//     );
//   };

//   const fetchFeed = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/feed`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "ngrok-skip-browser-warning": "true",
//         },
//       });
//       setFeed(res.data || []);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching feed:", err);
//       setError("Failed to load feed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async (postId) => {
//     if (!token || !postId) return;

//     try {
//       setFeed(prevFeed =>
//         prevFeed.map(post => {
//           if (post._id === postId) {
//             const likesArray = post.likes || [];
//             const isLiked = likesArray.includes(userId);
//             return {
//               ...post,
//               likes: isLiked
//                 ? likesArray.filter(id => id !== userId)
//                 : [...likesArray, userId]
//             };
//           }
//           return post;
//         })
//       );

//       const targetPost = feed.find(p => p._id === postId);
//       const currentLikes = targetPost?.likes || [];
//       const method = currentLikes.includes(userId) ? "delete" : "post";

//       await axios({
//         method,
//         url: `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "ngrok-skip-browser-warning": "true",
//         },
//       });
//     } catch (err) {
//       console.error("Like action failed:", err);
//       fetchFeed();
//     }
//   };

//   const copyShareLink = (postId) => {
//     navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
//     alert("Link copied to clipboard!");
//   };

//   const openCommentModal = async (postId) => {
//     setSelectedPostId(postId);
//     setShowModal(true);
//     setEditingComment(null);
//     setEditCommentText("");

//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//           },
//         }
//       );
//       const commentsArray = Array.isArray(res.data) ? res.data : [];
//       setComments(commentsArray);
//     } catch (err) {
//       console.error("❌ Failed to fetch comments", err);
//       setComments([]);
//     }
//   };

//   const handleCommentSubmit = async () => {
//     if (!newComment.trim()) return;
//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/posts/${selectedPostId}/comment`,
//         { content: newComment },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setComments(prev => [...prev, res.data]);
//       setNewComment("");
//     } catch (err) {
//       console.error("❌ Failed to post comment", err);
//     }
//   };

//   // Delete Comment Function
//   const handleDeleteComment = async (commentId) => {
//     if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       // Remove comment from state
//       setComments(prev => prev.filter(comment => comment._id !== commentId));
//     } catch (err) {
//       console.error("❌ Failed to delete comment", err);
//       alert("Failed to delete comment");
//     }
//   };

//   // Edit Comment Functions
//   const startEditComment = (comment) => {
//     setEditingComment(comment._id);
//     setEditCommentText(comment.content);
//   };

//   const cancelEditComment = () => {
//     setEditingComment(null);
//     setEditCommentText("");
//   };

//   const handleEditComment = async (commentId) => {
//     if (!editCommentText.trim()) return;
    
//     try {
//       const res = await axios.put(
//         `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
//         { content: editCommentText },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       // Update comment in state
//       setComments(prev => 
//         prev.map(comment => 
//           comment._id === commentId ? res.data : comment
//         )
//       );
      
//       setEditingComment(null);
//       setEditCommentText("");
//     } catch (err) {
//       console.error("❌ Failed to edit comment", err);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedPostId(null);
//     setNewComment("");
//     setComments([]);
//     setEditingComment(null);
//     setEditCommentText("");
//   };

//   // Format date to show time ago
//   const formatDate = (dateString) => {
//     if (!dateString) return "Recently";
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
    
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//         <div className="text-center">
//           <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3 text-muted">Loading your feed...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
//         <div className="text-center p-5">
//           <div className="display-1 mb-3">😕</div>
//           <h4 className="mb-3">Something went wrong</h4>
//           <p className="text-muted mb-4">{error}</p>
//           <button className="btn btn-primary px-4" onClick={fetchFeed}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100 bg-light">
     
      

//       <div className="container py-4">
//         <div className="row">
//           {/* Main Feed */}
//           <div className="col-lg-8 mx-auto">
//             {feed.length === 0 ? (
//               <div className="text-center py-5">
//                 <div className="card border-0 shadow-sm">
//                   <div className="card-body py-5">
//                     <div className="display-1 text-muted mb-3">📷</div>
//                     <h4 className="card-title mb-3">No Posts Yet</h4>
//                     <p className="card-text text-muted mb-4">Follow users to see their posts or create your own!</p>
//                     <button className="btn btn-primary px-4">
//                       Create Your First Post
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="feed-container">
//                 {feed.map((post) => {
//                   const isLiked = (post.likes || []).includes(userId);
//                   const likeCount = (post.likes || []).length;
//                   const hasImage = post.image || post.imageUrl;
//                   const authorName = getPostAuthorName(post);
//                   const authorProfilePic = getProfilePictureUrl(
//                     post.author,
//                     authorName
//                   );

//                   return (
//                     <div className="card mb-4 shadow-sm border-0 rounded-3 overflow-hidden" key={post._id}>
//                       {/* Post Header */}
//                       <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
//                         <div className="d-flex align-items-center">
//                           <div
//                             className="rounded-circle overflow-hidden me-3 border border-3 border-primary profile-avatar"
//                             style={{ width: "50px", height: "50px" }}
//                           >
//                             {authorProfilePic ? (
//                               <img
//                                 src={authorProfilePic}
//                                 alt={`${authorName} profile`}
//                                 className="w-100 h-100 object-fit-cover"
//                                 onError={(event) => {
//                                   event.currentTarget.style.display = "none";
//                                   event.currentTarget.nextElementSibling.style.display =
//                                     "grid";
//                                 }}
//                               />
//                             ) : null}

//                             <span
//                               className="profile-avatar-fallback"
//                               style={{
//                                 display: authorProfilePic ? "none" : "grid",
//                               }}
//                             >
//                               {authorName.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                           <div>
//                             <h6 className="mb-0 fw-bold">{authorName}</h6>
//                             <small className="text-muted">
//                               <i className="fas fa-clock me-1"></i>
//                               {post.createdAt ? formatDate(post.createdAt) : "Recently"}
//                             </small>
//                           </div>
//                         </div>
//                         <button className="btn btn-link text-muted">
//                           <i className="fas fa-ellipsis-h"></i>
//                         </button>
//                       </div>

//                       {/* Post Content */}
//                       <div className="card-body p-0">
//                         {/* Post Image */}
//                         {hasImage && (
//                           <div className="post-image">
//                             <img
//                               src={post.image || post.imageUrl}
//                               className="w-100"
//                               alt="Post content"
//                               style={{ height: "400px", objectFit: "cover" }}
//                               onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
//                               }}
//                             />
//                           </div>
//                         )}

//                         {/* Medical Data Display (like your screenshot) */}
//                         {post.caption?.includes("Diabetes Care") && (
//                           <div className="p-4 border-bottom">
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Pregnancies</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 2</div>
//                                 </div>
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Blood Pressure</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 70</div>
//                                 </div>
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Insulin Level</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 85</div>
//                                 </div>
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Diabetes Pedigree</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 0.45</div>
//                                 </div>
//                               </div>
//                               <div className="col-md-6">
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Glucose Level</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 130</div>
//                                 </div>
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Skin Thickness</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 32</div>
//                                 </div>
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">BMI</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 28.5</div>
//                                 </div>
//                                 <div className="mb-3">
//                                   <small className="text-muted d-block mb-1">Age</small>
//                                   <div className="badge bg-info text-white px-3 py-2">e.g. 35</div>
//                                 </div>
//                               </div>
//                             </div>
//                             <button className="btn btn-success w-100 mt-3">
//                               <i className="fas fa-chart-line me-2"></i>
//                               Get Prediction
//                             </button>
//                           </div>
//                         )}

//                         {/* Post Caption */}
//                         <div className="p-4">
//                           <h5 className="fw-bold mb-3">{post.caption || "No caption"}</h5>
                          
//                           {/* Post Actions */}
//                           <div className="d-flex justify-content-between align-items-center mb-3">
//                             <div className="d-flex gap-3">
//                               <button 
//                                 className="btn btn-link p-0 text-decoration-none"
//                                 onClick={() => handleLike(post._id)}
//                               >
//                                 {isLiked ? (
//                                   <FaHeart className="text-danger" size={24} />
//                                 ) : (
//                                   <FaRegHeart className="text-dark" size={24} />
//                                 )}
//                               </button>
//                               <button 
//                                 className="btn btn-link p-0 text-decoration-none"
//                                 onClick={() => openCommentModal(post._id)}
//                               >
//                                 <FaCommentDots className="text-dark" size={24} />
//                               </button>
//                               <button 
//                                 className="btn btn-link p-0 text-decoration-none"
//                                 onClick={() => copyShareLink(post._id)}
//                               >
//                                 <FaShare className="text-dark" size={24} />
//                               </button>
//                             </div>
//                             <span className="text-muted">
//                               <i className="fas fa-heart text-danger me-1"></i>
//                               {likeCount} likes
//                             </span>
//                           </div>

//                           {/* Quick Links (like your screenshot) */}
//                           {post.caption?.includes("Diabetes Care") && (
//                             <div className="mt-4 pt-3 border-top">
//                               <h6 className="fw-bold mb-3">Quick Links</h6>
//                               <div className="d-flex flex-wrap gap-2">
//                                 <a href="/" className="btn btn-outline-primary btn-sm rounded-pill">
//                                   View Dashboard
//                                 </a>
//                                 <a href="/" className="btn btn-outline-success btn-sm rounded-pill">
//                                   Lifestyle Check
//                                 </a>
//                                 <a href="/" className="btn btn-outline-info btn-sm rounded-pill">
//                                   Explore Data
//                                 </a>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* COMMENT MODAL with Delete Feature */}
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content rounded-4 border-0 shadow-lg">
//               <div className="modal-header bg-primary text-white border-0 rounded-top-4">
//                 <h5 className="modal-title fw-bold mb-0">
//                   <i className="fas fa-comments me-2"></i>
//                   Comments
//                 </h5>
//                 <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
//               </div>
              
//               <div className="modal-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                 {comments.length === 0 ? (
//                   <div className="text-center py-5">
//                     <div className="display-1 text-muted mb-3">💬</div>
//                     <h5>No comments yet</h5>
//                     <p className="text-muted">Be the first to comment!</p>
//                   </div>
//                 ) : (
//                   <div className="p-4">
//                     {comments.map((comment) => {
//                       const commentAuthor = getCommentAuthor(comment);
//                       const commentAuthorName =
//                         getCommentAuthorName(comment);
//                       const commentProfilePic = getProfilePictureUrl(
//                         commentAuthor,
//                         commentAuthorName
//                       );

//                       return (
//                       <div key={comment._id} className="mb-4 pb-3 border-bottom">
//                         <div className="d-flex justify-content-between align-items-start mb-2">
//                           <div className="d-flex align-items-center">
//                             <div
//                               className="rounded-circle overflow-hidden me-3 profile-avatar"
//                               style={{ width: "40px", height: "40px" }}
//                             >
//                               {commentProfilePic ? (
//                                 <img
//                                   src={commentProfilePic}
//                                   alt={`${commentAuthorName} profile`}
//                                   className="w-100 h-100 object-fit-cover"
//                                   onError={(event) => {
//                                     event.currentTarget.style.display = "none";
//                                     event.currentTarget.nextElementSibling.style.display =
//                                       "grid";
//                                   }}
//                                 />
//                               ) : null}

//                               <span
//                                 className="profile-avatar-fallback"
//                                 style={{
//                                   display: commentProfilePic ? "none" : "grid",
//                                 }}
//                               >
//                                 {commentAuthorName.charAt(0).toUpperCase()}
//                               </span>
//                             </div>
//                             <div>
//                               <h6 className="mb-0 fw-bold">
//                                 {commentAuthorName}
//                               </h6>
//                               <small className="text-muted">
//                                 {formatDate(comment.createdAt)}
//                               </small>
//                             </div>
//                           </div>
                          
//                           {/* Edit/Delete buttons (only for comment owner or post owner) */}
//                           {(commentAuthor?._id === userId || comment.userId === userId || comment.authorId === userId) && (
//                             <div className="dropdown">
//                               <button 
//                                 className="btn btn-link text-muted p-0"
//                                 data-bs-toggle="dropdown"
//                               >
//                                 <i className="fas fa-ellipsis-h"></i>
//                               </button>
//                               <ul className="dropdown-menu dropdown-menu-end">
//                                 <li>
//                                   <button 
//                                     className="dropdown-item"
//                                     onClick={() => startEditComment(comment)}
//                                   >
//                                     <FaEdit className="me-2" /> Edit
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <button 
//                                     className="dropdown-item text-danger"
//                                     onClick={() => handleDeleteComment(comment._id)}
//                                   >
//                                     <FaTrash className="me-2" /> Delete
//                                   </button>
//                                 </li>
//                               </ul>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Comment Content - Edit Mode or View Mode */}
//                         {editingComment === comment._id ? (
//                           <div className="mt-3">
//                             <textarea
//                               className="form-control mb-2"
//                               value={editCommentText}
//                               onChange={(e) => setEditCommentText(e.target.value)}
//                               rows="2"
//                             />
//                             <div className="d-flex gap-2">
//                               <button 
//                                 className="btn btn-sm btn-success"
//                                 onClick={() => handleEditComment(comment._id)}
//                               >
//                                 Save
//                               </button>
//                               <button 
//                                 className="btn btn-sm btn-outline-secondary"
//                                 onClick={cancelEditComment}
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <p className="mb-0 ps-5">{comment.content}</p>
//                         )}
//                       </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
              
//               <div className="modal-footer border-0 bg-light rounded-bottom-4">
//                 <div className="w-100">
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       className="form-control rounded-pill border-0 shadow-sm"
//                       placeholder="Write a comment..."
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
//                     />
//                     <button 
//                       className="btn btn-primary rounded-pill ms-2 px-4"
//                       onClick={handleCommentSubmit}
//                       disabled={!newComment.trim()}
//                     >
//                       <i className="fas fa-paper-plane me-2"></i>
//                       Post
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom CSS */}
//       <style jsx>{`
//         .profile-avatar {
//           position: relative;
//           flex-shrink: 0;
//           background: linear-gradient(135deg, #4f46e5, #7c3aed);
//         }
//         .profile-avatar-fallback {
//           position: absolute;
//           inset: 0;
//           place-items: center;
//           width: 100%;
//           height: 100%;
//           color: #ffffff;
//           font-weight: 700;
//         }
//         .feed-container .card {
//           transition: all 0.3s ease;
//           border: none;
//         }
//         .feed-container .card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
//         }
//         .post-image {
//           position: relative;
//           overflow: hidden;
//         }
//         .post-image img {
//           transition: transform 0.5s ease;
//         }
//         .post-image:hover img {
//           transform: scale(1.05);
//         }
//         .badge.bg-info {
//           background: linear-gradient(45deg, #17a2b8, #20c997) !important;
//           font-size: 0.9rem;
//         }
//         .modal-content {
//           animation: modalSlideIn 0.3s ease-out;
//         }
//         @keyframes modalSlideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
      
//       {/* Add Font Awesome for icons */}
//       <link 
//         rel="stylesheet" 
//         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
//       />
//       {/* Add Google Fonts */}
//       <link 
//         href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" 
//         rel="stylesheet"
//       />
//     </div>
//   );
// };

// export default FeedPage;


import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { 
  FaHeart, 
  FaRegHeart, 
  FaShare, 
  
  
  FaCommentDots,
  FaTrash,
  FaEdit
} from "react-icons/fa";

const FeedPage = () => {
  const [feed, setFeed] = useState([]);

  const { token, user: authUser } = useContext(AuthContext);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

  // Comments
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const handleProfilePictureUpdate = (event) => {
      const updatedUrl = event?.detail || localStorage.getItem("profilePic") || "";
      setCurrentProfilePic(updatedUrl);
    };

    window.addEventListener(
      "profile-picture-updated",
      handleProfilePictureUpdate
    );

    return () => {
      window.removeEventListener(
        "profile-picture-updated",
        handleProfilePictureUpdate
      );
    };
  }, []);

  const fetchMyProfilePicture = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const profileUrl =
        response.data?.profilePic?.url ||
        response.data?.user?.profilePic?.url ||
        "";

      if (profileUrl) {
        setCurrentProfilePic(profileUrl);
        localStorage.setItem("profilePic", profileUrl);
      }
    } catch (err) {
      console.error(
        "Failed to fetch current profile picture:",
        err.response?.data || err.message
      );
    }
  }, [token]);

  const getProfilePictureUrl = (person, username = "") => {
    const imageUrl =
      person?.profilePic?.url ||
      person?.profilePic ||
      person?.icon?.url ||
      person?.avatar?.url ||
      person?.avatar ||
      "";

    if (typeof imageUrl === "string" && imageUrl.trim()) {
      return imageUrl;
    }

    const loggedUsername =
      authUser?.username || localStorage.getItem("username") || "";

    if (username && username === loggedUsername && currentProfilePic) {
      return currentProfilePic;
    }

    return "";
  };

  const getPostAuthorName = (post) =>
    post.author?.username || post.username || "unknown";

  const getCommentAuthor = (comment) =>
    comment.user || comment.author || {};

  const getCommentAuthorName = (comment) => {
    const author = getCommentAuthor(comment);

    return (
      author.username ||
      author.preferredUsername ||
      comment.username ||
      "User"
    );
  };

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setFeed(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Failed to load feed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.id);
        }

        await Promise.all([fetchFeed(), fetchMyProfilePicture()]);
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize. Please refresh the page.");
      }
    };

    initialize();
  }, [token, fetchFeed, fetchMyProfilePicture]);

  const handleLike = async (postId) => {
    if (!token || !postId) return;

    try {
      setFeed(prevFeed =>
        prevFeed.map(post => {
          if (post._id === postId) {
            const likesArray = post.likes || [];
            const isLiked = likesArray.includes(userId);
            return {
              ...post,
              likes: isLiked
                ? likesArray.filter(id => id !== userId)
                : [...likesArray, userId]
            };
          }
          return post;
        })
      );

      const targetPost = feed.find(p => p._id === postId);
      const currentLikes = targetPost?.likes || [];
      const method = currentLikes.includes(userId) ? "delete" : "post";

      await axios({
        method,
        url: `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
    } catch (err) {
      console.error("Like action failed:", err);
      fetchFeed();
    }
  };

  const copyShareLink = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    alert("Link copied to clipboard!");
  };

  const openCommentModal = async (postId) => {
    setSelectedPostId(postId);
    setShowModal(true);
    setEditingComment(null);
    setEditCommentText("");

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const commentsArray = Array.isArray(res.data) ? res.data : [];
      setComments(commentsArray);
    } catch (err) {
      console.error("❌ Failed to fetch comments", err);
      setComments([]);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${selectedPostId}/comment`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(prev => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Failed to post comment", err);
    }
  };

  // Delete Comment Function
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Remove comment from state
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error("❌ Failed to delete comment", err);
      alert("Failed to delete comment");
    }
  };

  // Edit Comment Functions
  const startEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.content);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
        { content: editCommentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update comment in state
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId ? res.data : comment
        )
      );
      
      setEditingComment(null);
      setEditCommentText("");
    } catch (err) {
      console.error("❌ Failed to edit comment", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPostId(null);
    setNewComment("");
    setComments([]);
    setEditingComment(null);
    setEditCommentText("");
  };

  // Format date to show time ago
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center p-5">
          <div className="display-1 mb-3">😕</div>
          <h4 className="mb-3">Something went wrong</h4>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary px-4" onClick={fetchFeed}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
     
      

      <div className="container py-4">
        <div className="row">
          {/* Main Feed */}
          <div className="col-lg-8 mx-auto">
            {feed.length === 0 ? (
              <div className="text-center py-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-5">
                    <div className="display-1 text-muted mb-3">📷</div>
                    <h4 className="card-title mb-3">No Posts Yet</h4>
                    <p className="card-text text-muted mb-4">Follow users to see their posts or create your own!</p>
                    <button className="btn btn-primary px-4">
                      Create Your First Post
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="feed-container">
                {feed.map((post) => {
                  const isLiked = (post.likes || []).includes(userId);
                  const likeCount = (post.likes || []).length;
                  const hasImage = post.image || post.imageUrl;
                  const authorName = getPostAuthorName(post);
                  const authorProfilePic = getProfilePictureUrl(
                    post.author,
                    authorName
                  );

                  return (
                    <div className="card mb-4 shadow-sm border-0 rounded-3 overflow-hidden" key={post._id}>
                      {/* Post Header */}
                      <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle overflow-hidden me-3 border border-3 border-primary profile-avatar"
                            style={{ width: "50px", height: "50px" }}
                          >
                            {authorProfilePic ? (
                              <img
                                src={authorProfilePic}
                                alt={`${authorName} profile`}
                                className="w-100 h-100 object-fit-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                  event.currentTarget.nextElementSibling.style.display =
                                    "grid";
                                }}
                              />
                            ) : null}

                            <span
                              className="profile-avatar-fallback"
                              style={{
                                display: authorProfilePic ? "none" : "grid",
                              }}
                            >
                              {authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold">{authorName}</h6>
                            <small className="text-muted">
                              <i className="fas fa-clock me-1"></i>
                              {post.createdAt ? formatDate(post.createdAt) : "Recently"}
                            </small>
                          </div>
                        </div>
                        <button className="btn btn-link text-muted">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="card-body p-0">
                        {/* Post Image */}
                        {hasImage && (
                          <div className="post-image">
                            <img
                              src={post.image || post.imageUrl}
                              className="w-100"
                              alt="Post content"
                              style={{ height: "400px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                              }}
                            />
                          </div>
                        )}

                        {/* Medical Data Display (like your screenshot) */}
                        {post.caption?.includes("Diabetes Care") && (
                          <div className="p-4 border-bottom">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Pregnancies</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 2</div>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Blood Pressure</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 70</div>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Insulin Level</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 85</div>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Diabetes Pedigree</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 0.45</div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Glucose Level</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 130</div>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Skin Thickness</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 32</div>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">BMI</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 28.5</div>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-1">Age</small>
                                  <div className="badge bg-info text-white px-3 py-2">e.g. 35</div>
                                </div>
                              </div>
                            </div>
                            <button className="btn btn-success w-100 mt-3">
                              <i className="fas fa-chart-line me-2"></i>
                              Get Prediction
                            </button>
                          </div>
                        )}

                        {/* Post Caption */}
                        <div className="p-4">
                          <h5 className="fw-bold mb-3">{post.caption || "No caption"}</h5>
                          
                          {/* Post Actions */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex gap-3">
                              <button 
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => handleLike(post._id)}
                              >
                                {isLiked ? (
                                  <FaHeart className="text-danger" size={24} />
                                ) : (
                                  <FaRegHeart className="text-dark" size={24} />
                                )}
                              </button>
                              <button 
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => openCommentModal(post._id)}
                              >
                                <FaCommentDots className="text-dark" size={24} />
                              </button>
                              <button 
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => copyShareLink(post._id)}
                              >
                                <FaShare className="text-dark" size={24} />
                              </button>
                            </div>
                            <span className="text-muted">
                              <i className="fas fa-heart text-danger me-1"></i>
                              {likeCount} likes
                            </span>
                          </div>

                          {/* Quick Links (like your screenshot) */}
                          {post.caption?.includes("Diabetes Care") && (
                            <div className="mt-4 pt-3 border-top">
                              <h6 className="fw-bold mb-3">Quick Links</h6>
                              <div className="d-flex flex-wrap gap-2">
                                <a href="/" className="btn btn-outline-primary btn-sm rounded-pill">
                                  View Dashboard
                                </a>
                                <a href="/" className="btn btn-outline-success btn-sm rounded-pill">
                                  Lifestyle Check
                                </a>
                                <a href="/" className="btn btn-outline-info btn-sm rounded-pill">
                                  Explore Data
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMMENT MODAL with Delete Feature */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0 rounded-top-4">
                <h5 className="modal-title fw-bold mb-0">
                  <i className="fas fa-comments me-2"></i>
                  Comments
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              
              <div className="modal-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {comments.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-1 text-muted mb-3">💬</div>
                    <h5>No comments yet</h5>
                    <p className="text-muted">Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="p-4">
                    {comments.map((comment) => {
                      const commentAuthor = getCommentAuthor(comment);
                      const commentAuthorName =
                        getCommentAuthorName(comment);
                      const commentProfilePic = getProfilePictureUrl(
                        commentAuthor,
                        commentAuthorName
                      );

                      return (
                      <div key={comment._id} className="mb-4 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle overflow-hidden me-3 profile-avatar"
                              style={{ width: "40px", height: "40px" }}
                            >
                              {commentProfilePic ? (
                                <img
                                  src={commentProfilePic}
                                  alt={`${commentAuthorName} profile`}
                                  className="w-100 h-100 object-fit-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                    event.currentTarget.nextElementSibling.style.display =
                                      "grid";
                                  }}
                                />
                              ) : null}

                              <span
                                className="profile-avatar-fallback"
                                style={{
                                  display: commentProfilePic ? "none" : "grid",
                                }}
                              >
                                {commentAuthorName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold">
                                {commentAuthorName}
                              </h6>
                              <small className="text-muted">
                                {formatDate(comment.createdAt)}
                              </small>
                            </div>
                          </div>
                          
                          {/* Edit/Delete buttons (only for comment owner or post owner) */}
                          {(commentAuthor?._id === userId || comment.userId === userId || comment.authorId === userId) && (
                            <div className="dropdown">
                              <button 
                                className="btn btn-link text-muted p-0"
                                data-bs-toggle="dropdown"
                              >
                                <i className="fas fa-ellipsis-h"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => startEditComment(comment)}
                                  >
                                    <FaEdit className="me-2" /> Edit
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDeleteComment(comment._id)}
                                  >
                                    <FaTrash className="me-2" /> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        {/* Comment Content - Edit Mode or View Mode */}
                        {editingComment === comment._id ? (
                          <div className="mt-3">
                            <textarea
                              className="form-control mb-2"
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              rows="2"
                            />
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleEditComment(comment._id)}
                              >
                                Save
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={cancelEditComment}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mb-0 ps-5">{comment.content}</p>
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="modal-footer border-0 bg-light rounded-bottom-4">
                <div className="w-100">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow-sm"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    />
                    <button 
                      className="btn btn-primary rounded-pill ms-2 px-4"
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                    >
                      <i className="fas fa-paper-plane me-2"></i>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .profile-avatar {
          position: relative;
          flex-shrink: 0;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
        }
        .profile-avatar-fallback {
          position: absolute;
          inset: 0;
          place-items: center;
          width: 100%;
          height: 100%;
          color: #ffffff;
          font-weight: 700;
        }
        .feed-container .card {
          transition: all 0.3s ease;
          border: none;
        }
        .feed-container .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .post-image {
          position: relative;
          overflow: hidden;
        }
        .post-image img {
          transition: transform 0.5s ease;
        }
        .post-image:hover img {
          transform: scale(1.05);
        }
        .badge.bg-info {
          background: linear-gradient(45deg, #17a2b8, #20c997) !important;
          font-size: 0.9rem;
        }
        .modal-content {
          animation: modalSlideIn 0.3s ease-out;
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Add Font Awesome for icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      {/* Add Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" 
        rel="stylesheet"
      />
    </div>
  );
};

export default FeedPage;