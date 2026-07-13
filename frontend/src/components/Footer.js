import React from "react";
import img from "./1.jpg"
function Footer() {
  return (
    <footer style={{ backgroundColor: "rgba(6, 6, 6, 1)" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col">
            <img src={img} style={{ width: "100%" }} className="rounded-circle"/>
            <p style={{color:"white"}}>
              &copy; 2023 - 2025, PhotoFlux Ltd. All rights reserved.
            </p>
          </div>
          <div className="col">
            <p style={{color:"white"}}>Company</p>
            <a href="#">About</a>
            <br />
            <a href="#">Products</a>
            <br />
            <a href="#">Pricing</a>
            <br />
            <a href="#">Referral programme</a>
            <br />
            <a href="#">Careers</a>
            <br />
            <a href="#">PhotoFlux.tech</a>
            <br />
            <a href="#">Press & media</a>
            <br />
            <a href="#">photoFlux cares (CSR)</a>
            <br />
          </div>
          <div className="col">
            <p style={{color:"white"}}>Support</p>
            <a href="#">Contact</a>
            <br />
            <a href="#">Support portal</a>
            <br />
            <a href="#">Flux-Connect blog</a>
            <br />
            <a href="#">List of charges</a>
            <br />
            <a href="#">Downloads & resources</a>
            <br />
          </div>
          <div className="col">
            <p style={{color:"white"}}>Account</p>
            <a href="#">Open an account</a>
            <br />
            <a href="#">Fund transfer</a>
            <br />
            <a href="#">60 day challenge</a>
            <br />
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p style={{color:"white"}}>
            Photoflux: A federated photo-sharing platform powered by ActivityPub protocol.  
            Hosting and federation services may vary based on your instance administrator's policies.  
            All user content is decentralized and managed independently by each server.
            Registered Address: Photoflux HQ, Open Source Commons, Bengaluru - 560078, Karnataka, India.
            For any issues or takedown requests, please contact: support@photoflux.social.
            Please ensure you review the Fediverse Guidelines and our Community Code of Conduct.
          </p>

          <p style={{color:"white"}}>
            Procedure to report a violation or abuse on Photoflux: Use the "Report" button on any post or profile.  
            Mandatory details for submitting reports: Username, reason for report, and any supporting evidence.  
            Benefits: Transparent moderation, user-driven governance, and quicker issue resolution through your home instance admin.
          </p>

          <p style={{color:"white"}}>
            Content shared on Photoflux reflects the views of individual users;
            always verify before relying on any shared information.
          </p>

          <p style={{color:"white"}}>
            "Prevent unauthorized access to your Photoflux account. Always keep your login credentials secure and do not share your password with anyone. Be cautious when accessing third-party Fediverse instances or applications claiming to be associated with Photoflux.
             Official communication will only occur through trusted channels.Please ensure that your email and profile settings are up to date to receive important notifications regarding your posts, follows, and interactions. Photoflux is part of the decentralized Fediverse — 
             a network where each server (or instance) operates independently. Always verify the trustworthiness of external servers before following or interacting with remote users.
             Photoflux does not solicit payments, offer financial advice, or authorize anyone to act on our behalf for paid services. If you come across users or websites offering premium access, features, or monetized services using our name, report them via our support page immediately.
             As part of our content safety policy, all posts undergo automated moderation for NSFW or harmful content. If your post violates community guidelines, it may be hidden or removed without prior notice. Content flagged as inappropriate will not be visible in the public feed
             or discoverable via search.We are committed to an open and respectful social network where user safety and freedom coexist. If you encounter abusive content or behavior, please use the report feature or contact us at support@photoflux.app. Your privacy and safety are our top priorities.
             By using Photoflux, you agree to follow community guidelines and abide by our terms of use. We reserve the right to suspend or restrict access to users violating our trust policies."
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
