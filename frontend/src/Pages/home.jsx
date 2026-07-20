



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
  const username = localStorage.getItem("username") || "User";

  const dashboardActions = [
    {
      title: "View Feed",
      description: "See the latest posts from people you follow.",
      icon: <MdDynamicFeed />,
      link: "/feed",
      className: "dashboard-action-purple",
    },
    {
      title: "Create Post",
      description: "Share a new photo with your followers.",
      icon: <FaPlus />,
      link: "/post",
      className: "dashboard-action-blue",
    },
    {
      title: "Local Users",
      description: "Discover and follow PhotoFlux users.",
      icon: <MdExplore />,
      link: "/local-users",
      className: "dashboard-action-green",
    },
    {
      title: "Remote Search",
      description: "Find users from Mastodon and the Fediverse.",
      icon: <FaSearch />,
      link: "/remote-search",
      className: "dashboard-action-orange",
    },
    {
      title: "Connections",
      description: "View your followers and following list.",
      icon: <FaUserFriends />,
      link: `/followers/${username}`,
      className: "dashboard-action-pink",
    },
    {
      title: "My Outbox",
      description: "View posts published through ActivityPub.",
      icon: <FaImages />,
      link: `/users/${username}/outbox`,
      className: "dashboard-action-cyan",
    },
  ];

  const featuresData = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      ),
      title: "Federated Communication",
      description:
        "Connect and communicate with users across ActivityPub-compatible platforms.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
      ),
      title: "Photo Sharing",
      description:
        "Publish photos, explore posts and interact with local and remote users.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <circle cx="17.5" cy="17.5" r="3.5" />
        </svg>
      ),
      title: "Decentralized Network",
      description:
        "Your social experience is not controlled by one centralized platform.",
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
            <p className="dashboard-label">PHOTOFLUX DASHBOARD</p>

            <h1>
              Welcome back, <span>@{username}</span>
            </h1>

            <p className="dashboard-hero-description">
              Share photos, discover people and connect with users across the
              Fediverse.
            </p>

            <div className="dashboard-hero-buttons">
              <Link to="/post" className="dashboard-primary-button">
                <FaPlus />
                Create post
              </Link>

              <Link to="/feed" className="dashboard-secondary-button">
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
                Discoverable through WebFinger and ActivityPub
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

            <span>Everything you need in one place</span>
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

        {/* Features section */}
        <section className="dashboard-features-section">
          <div className="dashboard-features-heading">
            <p className="dashboard-features-label"style={{ color: '#241c1c' }} >
              FEATURES
            </p>

            <h2 style={{ color: '#241c1c' }}>
              Built for the Fediverse
            </h2>

            <span>
              Discover, connect and share across decentralized social networks.
            </span>
          </div>

          <div className="dashboard-features-grid">
            {featuresData.map((feature, index) => (
              <article
                key={feature.title}
                className={`dashboard-feature-card ${
                  index === 1 ? "dashboard-feature-highlighted" : ""
                }`}
              >
                <div className="dashboard-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
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
              PhotoFlux uses ActivityPub to communicate with compatible
              platforms such as Mastodon. Search remote users, follow their
              accounts and share public posts across servers.
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