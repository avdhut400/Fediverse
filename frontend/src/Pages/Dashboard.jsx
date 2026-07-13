// import React from "react";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const username = localStorage.getItem("username");

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4 text-center">📷 Photoflux Dashboard</h2>

//       <div className="d-flex justify-content-around mb-4">
//         <Link to="/search" className="btn btn-outline-dark">🔍 Search Users</Link>
//         <Link to={`/users/${username}`} className="btn btn-outline-dark">👤 My Profile</Link>
//         <Link to={`/users/${username}/followers`} className="btn btn-outline-dark">👥 Followers</Link>
//       </div>

//       <div className="text-center mt-5">
//         <p className="text-muted">Welcome @{username} to your dashboard.</p>
//         <p className="text-muted">Explore local users, view profiles, and share your content!</p>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






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