




// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import React from "react";
// import "./Feed.css";

// const Home = () => {
//   return (
//     <div className="feed-container" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      
//       {/* Title */}
//       <div className="feed-text-wrapper text-center py-4 bg-dark bg-opacity-50 rounded-5 ">
//         <h1 className='text-white' style={{ fontFamily: "'Segoe UI Black', sans-serif", marginBottom: "10px" }}>
//           🌐 Welcome to <span style={{ color: "#ffe066" }}>Fediverse</span>
//         </h1>
//         <p style={{ fontSize: "18px", color: "#ffff", maxWidth: "700px", margin: "0 auto" }}>
//           Connect, share, and explore across the decentralized web — powered by freedom, community, and collaboration.
//         </p>
//       </div>

//       {/* Carousel */}
//       <div
//         id="carouselExampleCaptions"
//         className="carousel slide shadow-lg"
//         data-bs-ride="carousel"
//         data-bs-interval="3500"
//         style={{ height: "100vh" }} // Full viewport height
//       >
//         {/* Indicators */}
//         <div className="carousel-indicators">
//           <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active"></button>
//           <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"></button>
//           <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"></button>
//         </div>

//         {/* Slides */}
//         <div className="carousel-inner" style={{ height: "100%",width:"100%" }}>
          
//           {/* Slide 1 */}
//           <div className="carousel-item active" style={{ height: "100%",width:"100%" }}>
//             <img
//               src="https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/983/1120983-i-633ec2bcc241"
//               className="d-block w-100"
//               style={{ height: "100%", objectFit: "cover" }}
//               alt="Community"
//             />
//             <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
//               <h5>Join the Global Community</h5>
//               <p>Connect with people across a network without borders.</p>
//             </div>
//           </div>

//           {/* Slide 2 */}
//           <div className="carousel-item" style={{ height: "100%", width:"100%" }}>
//             <img
//               src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
//               className="d-block w-100"
//               style={{ height: "100%", objectFit: "cover" }}
//               alt="Technology"
//             />
//             <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
//               <h5>Open Technology</h5>
//               <p>Built on freedom, collaboration, and transparency.</p>
//             </div>
//           </div>

//           {/* Slide 3 */}
//           <div className="carousel-item" style={{ height: "100%",width:"100%" }}>
//             <img
//               src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
//               className="d-block w-100"
//               style={{ height: "100%", objectFit: "cover" }}
//               alt="Innovation"
//             />
//             <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
//               <h5>Innovate Together</h5>
//               <p>Shaping the future of the decentralized internet.</p>
//             </div>
//           </div>
//         </div>

//         {/* Controls */}
//         <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
//           <span className="carousel-control-prev-icon"></span>
//         </button>
//         <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
//           <span className="carousel-control-next-icon"></span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Home;





import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaGlobeAmericas,
  FaImages,
  FaPaperPlane,
  FaPlus,
  FaSearch,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { MdDynamicFeed, MdExplore } from "react-icons/md";
import "./Dashboard.css";

const Dashboard = () => {
  const username =
    localStorage.getItem("username") || "User";

  const dashboardActions = [
    {
      title: "View Feed",
      description:
        "See the latest posts from people you follow.",
      icon: <MdDynamicFeed />,
      link: "/feed",
      className: "dashboard-action-purple",
    },
    {
      title: "Create Post",
      description:
        "Share a new photo with your followers.",
      icon: <FaPlus />,
      link: "/post",
      className: "dashboard-action-blue",
    },
    {
      title: "Local Users",
      description:
        "Discover and follow PhotoFlux users.",
      icon: <MdExplore />,
      link: "/local-users",
      className: "dashboard-action-green",
    },
    {
      title: "Remote Search",
      description:
        "Find users from Mastodon and the Fediverse.",
      icon: <FaSearch />,
      link: "/remote-search",
      className: "dashboard-action-orange",
    },
    {
      title: "Connections",
      description:
        "View your followers and following list.",
      icon: <FaUserFriends />,
      link: `/followers/${username}`,
      className: "dashboard-action-pink",
    },
    {
      title: "My Outbox",
      description:
        "View posts published through ActivityPub.",
      icon: <FaImages />,
      link: `/users/${username}/outbox`,
      className: "dashboard-action-cyan",
    },
  ];

  return (
    <main className="dashboard-page">
      <div className="dashboard-background dashboard-circle-one" />
      <div className="dashboard-background dashboard-circle-two" />

      <section className="dashboard-container">
        {/* Welcome section */}
        <header className="dashboard-hero">
          <div className="dashboard-hero-content">
            <p className="dashboard-label">
              PHOTOFLUX DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              <span>@{username}</span>
            </h1>

            <p className="dashboard-hero-description">
              Share photos, discover people and connect
              with users across the Fediverse.
            </p>

            <div className="dashboard-hero-buttons">
              <Link
                to="/post"
                className="dashboard-primary-button"
              >
                <FaPlus />
                Create post
              </Link>

              <Link
                to="/feed"
                className="dashboard-secondary-button"
              >
                Explore feed
                <FaArrowRight />
              </Link>
            </div>
          </div>

          <div className="dashboard-hero-visual">
            <div className="dashboard-main-logo">
              <FaGlobeAmericas />
            </div>

            <div className="dashboard-floating-card dashboard-floating-one">
              <FaPaperPlane />
              <span>ActivityPub</span>
            </div>

            <div className="dashboard-floating-card dashboard-floating-two">
              <FaUserFriends />
              <span>Federated</span>
            </div>
          </div>
        </header>

        {/* Account summary */}
        <section className="dashboard-account-card">
          <div className="dashboard-user-section">
            <div className="dashboard-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <span>Signed in as</span>
              <h2>@{username}</h2>
            </div>
          </div>

          <div className="dashboard-account-divider" />

          <div className="dashboard-account-info">
            <FaGlobeAmericas />

            <div>
              <strong>Fediverse account</strong>
              <span>
                Discoverable through WebFinger and
                ActivityPub
              </span>
            </div>
          </div>

          <Link
            to={`/users/${username}`}
            className="dashboard-profile-button"
          >
            <FaUser />
            My profile
          </Link>
        </section>

        {/* Quick actions */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <p>QUICK ACCESS</p>
              <h2>Explore PhotoFlux</h2>
            </div>

            <span>
              Everything you need in one place
            </span>
          </div>

          <div className="dashboard-grid">
            {dashboardActions.map((action) => (
              <Link
                to={action.link}
                className={`dashboard-action-card ${action.className}`}
                key={action.title}
              >
                <div className="dashboard-action-icon">
                  {action.icon}
                </div>

                <div className="dashboard-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>

                <div className="dashboard-action-arrow">
                  <FaArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fediverse information */}
        <section className="dashboard-fediverse-card">
          <div className="dashboard-fediverse-icon">
            <FaGlobeAmericas />
          </div>

          <div className="dashboard-fediverse-content">
            <p>DECENTRALIZED SOCIAL NETWORK</p>

            <h2>Connected through the Fediverse</h2>

            <span>
              PhotoFlux uses ActivityPub to communicate
              with compatible platforms such as Mastodon.
              Search remote users, follow their accounts
              and share public posts across servers.
            </span>
          </div>

          <Link
            to="/remote-search"
            className="dashboard-fediverse-button"
          >
            Find remote users
            <FaArrowRight />
          </Link>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;