import React from "react";
import img from "./1.jpg";

function Footer() {
  const linkStyle = {
    background: "none",
    border: "none",
    padding: 0,
    color: "#0d6efd",
    cursor: "pointer",
    textDecoration: "underline",
  };

  return (
    <footer style={{ backgroundColor: "rgba(6, 6, 6, 1)" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col">
            <img
              src={img}
              alt="PhotoFlux logo"
              style={{ width: "100%" }}
              className="rounded-circle"
            />

            <p style={{ color: "white" }}>
              &copy; 2023 - 2026, PhotoFlux Ltd. All rights reserved.
            </p>
          </div>

          <div className="col">
            <p style={{ color: "white" }}>Company</p>

            <button type="button" style={linkStyle}>About</button>
            <br />

            <button type="button" style={linkStyle}>Products</button>
            <br />

            <button type="button" style={linkStyle}>Pricing</button>
            <br />

            <button type="button" style={linkStyle}>
              Referral programme
            </button>
            <br />

            <button type="button" style={linkStyle}>Careers</button>
            <br />

            <button type="button" style={linkStyle}>PhotoFlux.tech</button>
            <br />

            <button type="button" style={linkStyle}>Press & media</button>
            <br />

            <button type="button" style={linkStyle}>
              PhotoFlux cares (CSR)
            </button>
          </div>

          <div className="col">
            <p style={{ color: "white" }}>Support</p>

            <a href="mailto:support@photoflux.social">Contact</a>
            <br />

            <button type="button" style={linkStyle}>Support portal</button>
            <br />

            <button type="button" style={linkStyle}>
              Flux-Connect blog
            </button>
            <br />

            <button type="button" style={linkStyle}>
              List of charges
            </button>
            <br />

            <button type="button" style={linkStyle}>
              Downloads & resources
            </button>
          </div>

          <div className="col">
            <p style={{ color: "white" }}>Account</p>

            <button type="button" style={linkStyle}>
              Open an account
            </button>
            <br />

            <button type="button" style={linkStyle}>
              Fund transfer
            </button>
            <br />

            <button type="button" style={linkStyle}>
              60 day challenge
            </button>
          </div>
        </div>

        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p style={{ color: "white" }}>
            Photoflux is a federated photo-sharing platform powered by the
            ActivityPub protocol. Hosting and federation services may vary
            based on the policies of each instance administrator. User content
            is decentralized and managed independently by each server.
            Registered Address: Photoflux HQ, Open Source Commons, Bengaluru -
            560078, Karnataka, India. For issues or takedown requests, contact
            support@photoflux.social.
          </p>

          <p style={{ color: "white" }}>
            To report abuse or a violation, use the Report button on the
            relevant post or profile. Include the username, reason for the
            report and supporting evidence.
          </p>

          <p style={{ color: "white" }}>
            Content shared on Photoflux reflects the views of individual users.
            Always verify information before relying on it.
          </p>

          <p style={{ color: "white" }}>
            Keep your login credentials secure and never share your password.
            Be cautious when accessing third-party Fediverse instances.
            Photoflux does not solicit payments or offer financial advice.
            Content that violates community guidelines may be hidden or
            removed. By using Photoflux, you agree to follow the community
            guidelines and terms of use.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;