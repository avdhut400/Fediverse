// import React from "react";
// import img from "./1.jpg";

// function Footer() {
//   const linkStyle = {
//     background: "none",
//     border: "none",
//     padding: 0,
//     color: "#0d6efd",
//     cursor: "pointer",
//     textDecoration: "underline",
//   };

//   return (
//     <footer style={{ backgroundColor: "rgba(6, 6, 6, 1)" }}>
//       <div className="container border-top mt-5">
//         <div className="row mt-5">
//           <div className="col">
//             <img
//               src={img}
//               alt="PhotoFlux logo"
//               style={{ width: "100%" }}
//               className="rounded-circle"
//             />

//             <p style={{ color: "white" }}>
//               &copy; 2024 - 2026, PhotoFlux Ltd. All rights reserved.
//             </p>
//           </div>

//           <div className="col">
//             <p style={{ color: "white" }}>Company</p>

//             <button type="button" style={linkStyle}>About</button>
//             <br />

//             <button type="button" style={linkStyle}>Products</button>
//             <br />

//             <button type="button" style={linkStyle}>Pricing</button>
//             <br />

//             <button type="button" style={linkStyle}>
//               Referral programme
//             </button>
//             <br />

//             <button type="button" style={linkStyle}>Careers</button>
//             <br />

//             <button type="button" style={linkStyle}>PhotoFlux.tech</button>
//             <br />

//             <button type="button" style={linkStyle}>Press & media</button>
//             <br />

//             <button type="button" style={linkStyle}>
//               PhotoFlux cares (CSR)
//             </button>
//           </div>

//           <div className="col">
//             <p style={{ color: "white" }}>Support</p>

//             <a href="mailto:support@photoflux.social">Contact</a>
//             <br />

//             <button type="button" style={linkStyle}>Support portal</button>
//             <br />

//             <button type="button" style={linkStyle}>
//               Flux-Connect blog
//             </button>
//             <br />

//             <button type="button" style={linkStyle}>
//               List of charges
//             </button>
//             <br />

//             <button type="button" style={linkStyle}>
//               Downloads & resources
//             </button>
//           </div>

//           <div className="col">
//             <p style={{ color: "white" }}>Account</p>

//             <button type="button" style={linkStyle}>
//               Open an account
//             </button>
//             <br />

//             <button type="button" style={linkStyle}>
//               Fund transfer
//             </button>
//             <br />

//             <button type="button" style={linkStyle}>
//               60 day challenge
//             </button>
//           </div>
//         </div>

//         <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
//           <p style={{ color: "white" }}>
//             Photoflux is a federated photo-sharing platform powered by the
//             ActivityPub protocol. Hosting and federation services may vary
//             based on the policies of each instance administrator. User content
//             is decentralized and managed independently by each server.
//             Registered Address: Photoflux HQ, Open Source Commons, Bengaluru -
//             560078, Karnataka, India. For issues or takedown requests, contact
//             support@photoflux.social.
//           </p>

//           <p style={{ color: "white" }}>
//             To report abuse or a violation, use the Report button on the
//             relevant post or profile. Include the username, reason for the
//             report and supporting evidence.
//           </p>

//           <p style={{ color: "white" }}>
//             Content shared on Photoflux reflects the views of individual users.
//             Always verify information before relying on it.
//           </p>

//           <p style={{ color: "white" }}>
//             Keep your login credentials secure and never share your password.
//             Be cautious when accessing third-party Fediverse instances.
//             Photoflux does not solicit payments or offer financial advice.
//             Content that violates community guidelines may be hidden or
//             removed. By using Photoflux, you agree to follow the community
//             guidelines and terms of use.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;






import React from "react";
import img from "./1.jpg";
import "./Footer.css";

function Footer() {
  const FooterButton = ({ children }) => (
    <button type="button" className="photoflux-footer-link">
      {children}
    </button>
  );

  return (
    <div className="photoflux-footer-background">
      <footer className="photoflux-footer">
        <div className="container-fluid px-3 px-sm-4 px-md-5">
          <div className="row g-5">
            {/* Brand section */}
            <div className="col-12 col-lg-6">
              <div className="photoflux-footer-brand">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={img}
                    alt="PhotoFlux logo"
                    className="photoflux-footer-logo"
                  />

                  <div>
                    <h2 className="photoflux-brand-name mb-0">
                      PhotoFlux
                    </h2>

                    <span className="photoflux-brand-label">
                      Federated photo sharing
                    </span>
                  </div>
                </div>

                <p className="photoflux-footer-description">
                  PhotoFlux is a decentralized photo-sharing platform powered
                  by ActivityPub. Share photos, discover people and communicate
                  with users across compatible Fediverse platforms.
                </p>

                {/* Social icons */}
                <div className="photoflux-social-links">
                  <button
                    type="button"
                    className="photoflux-social-button"
                    aria-label="PhotoFlux on X"
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.291 19.491h2.039L6.486 3.24H4.298Z" />
                    </svg>
                  </button>

                  <a
                    href="https://github.com/avdhut400/Fediverse"
                    target="_blank"
                    rel="noreferrer"
                    className="photoflux-social-button"
                    aria-label="PhotoFlux GitHub repository"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>

                  <button
                    type="button"
                    className="photoflux-social-button"
                    aria-label="PhotoFlux on LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="photoflux-social-button"
                    aria-label="PhotoFlux on YouTube"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                      <path d="m10 15 5-3-5-3z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="photoflux-social-button"
                    aria-label="PhotoFlux on Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        width="20"
                        height="20"
                        x="2"
                        y="2"
                        rx="5"
                        ry="5"
                      />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line
                        x1="17.5"
                        x2="17.51"
                        y1="6.5"
                        y2="6.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer navigation */}
            <div className="col-12 col-lg-6">
              <div className="row g-4">
                <div className="col-6 col-md-4">
                  <h3 className="photoflux-footer-heading">
                    Company
                  </h3>

                  <ul className="photoflux-footer-list">
                    <li>
                      <FooterButton>About</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Products</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Pricing</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Careers</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Press &amp; media</FooterButton>
                    </li>
                    <li>
                      <FooterButton>PhotoFlux cares</FooterButton>
                    </li>
                  </ul>
                </div>

                <div className="col-6 col-md-4">
                  <h3 className="photoflux-footer-heading">
                    Support
                  </h3>

                  <ul className="photoflux-footer-list">
                    <li>
                      <a
                        href="mailto:support@photoflux.social"
                        className="photoflux-footer-link"
                      >
                        Contact
                      </a>
                    </li>
                    <li>
                      <FooterButton>Support portal</FooterButton>
                    </li>
                    <li>
                      <FooterButton>PhotoFlux blog</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Community guidelines</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Downloads</FooterButton>
                    </li>
                  </ul>
                </div>

                <div className="col-12 col-md-4">
                  <h3 className="photoflux-footer-heading">
                    Account
                  </h3>

                  <ul className="photoflux-footer-list">
                    <li>
                      <FooterButton>Open an account</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Find users</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Remote search</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Privacy policy</FooterButton>
                    </li>
                    <li>
                      <FooterButton>Terms of use</FooterButton>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Legal information */}
          <div className="photoflux-legal-section">
            <p>
              PhotoFlux is a federated photo-sharing platform powered by the
              ActivityPub protocol. Hosting and federation services may vary
              depending on the policies of each instance administrator. User
              content is decentralized and managed independently by each
              server.
            </p>

            <p>
              To report abuse or a violation, use the report option on the
              relevant post or profile. Include the username, reason for the
              report and any supporting evidence.
            </p>

            <p className="mb-0">
              Keep your login credentials secure and never share your
              password. Content shared on PhotoFlux reflects the views of
              individual users. By using PhotoFlux, you agree to follow the
              community guidelines and terms of use.
            </p>
          </div>

          {/* Copyright */}
          <div className="photoflux-footer-bottom">
            <p className="mb-0">
              © 2024–2026 PhotoFlux Ltd.
            </p>

            <p className="mb-0">
              All rights reserved.
            </p>
          </div>

          {/* Large footer text */}
          <div className="photoflux-footer-wordmark-wrapper">
            <div className="photoflux-footer-glow" />

            <h2 className="photoflux-footer-wordmark">
              PhotoFlux
            </h2>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

