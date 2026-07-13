// import React, { useState } from "react";
// import axios from "axios";

// const RemoteSearch = () => {
//   const [handle, setHandle] = useState("");
//   const [actor, setActor] = useState(null);
//   const [error, setError] = useState(null);

//   const resolveActor = async () => {
//     try {
//       setError(null);
//       const [username, domain] = handle.split("@");

//       if (!username || !domain) {
//         setError("⚠️ Invalid handle format. Use username@domain");
//         return;
//       }

//       const webfingerRes = await axios.get(
//         `https://${domain}/.well-known/webfinger?resource=acct:${handle}`
//       );

//       const actorUrl = webfingerRes.data.links.find(
//         (link) => link.rel === "self"
//       ).href;

//       const actorProfile = await axios.get(actorUrl, {
//         headers: {
//           Accept: "application/activity+json",
//         },
//       });

//       setActor(actorProfile.data);
//     } catch (err) {
//       console.error(err);
//       setError("❌ Failed to resolve actor.");
//       setActor(null);
//     }
//   };

//   const sendFollow = async () => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/follow/remote/${localStorage.getItem("username")}/follow`,
//         { remoteActorUrl: actor.id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       alert("✅ Follow request sent!");
//     } catch (err) {
//       console.error("Follow failed:", err.response?.data || err.message);
//       alert("❌ Follow failed");
//     }
//   };

//   return (
//     <div className="container mt-5 col-md-8">
//       <div className="card shadow p-4">
//         <h3 className="mb-3 text-center">🌐 Follow a Remote User</h3>

//         <div className="input-group mb-3">
//           <input
//             className="form-control"
//             value={handle}
//             onChange={(e) => setHandle(e.target.value)}
//             placeholder="e.g., avdhut_077@mastodon.social"
//           />
//           <button onClick={resolveActor} className="btn btn-primary">
//             🔍 Search
//           </button>
//         </div>

//         {error && <div className="alert alert-danger">{error}</div>}

//         {actor && (
//           <div className="card mt-3 p-3 bg-light border border-success">
//             <h5 className="mb-1">@{actor.preferredUsername}</h5>
//             <small className="text-muted">{actor.id}</small>
//             {actor.summary && (
//               <p
//                 className="mt-2"
//                 dangerouslySetInnerHTML={{ __html: actor.summary }}
//               ></p>
//             )}
//             <button className="btn btn-success mt-2" onClick={sendFollow}>
//                Follow
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RemoteSearch;



























// import React, { useState } from "react";
// import axios from "axios";

// const RemoteSearch = () => {
//   const [handle, setHandle] = useState("");
//   const [actor, setActor] = useState(null);
//   const [error, setError] = useState(null);

//   const [followStatus, setFollowStatus] = useState("");
//   const [followLoading, setFollowLoading] = useState(false);

//   const resolveActor = async () => {
//     try {
//       setError(null);
//       setActor(null);
//       setFollowStatus("");

//       const cleanHandle = handle.trim().replace(/^@/, "");

//       const parts = cleanHandle.split("@");

//       if (parts.length !== 2) {
//         setError("⚠️ Invalid handle format. Use username@domain");
//         return;
//       }

//       const [username, domain] = parts;

//       if (!username || !domain) {
//         setError("⚠️ Invalid handle format. Use username@domain");
//         return;
//       }

//       const webfingerRes = await axios.get(
//         `https://${domain}/.well-known/webfinger?resource=acct:${cleanHandle}`
//       );

//       const selfLink = webfingerRes.data.links?.find(
//         (link) => link.rel === "self"
//       );

//       if (!selfLink?.href) {
//         setError("❌ Actor URL not found.");
//         return;
//       }

//       const actorProfile = await axios.get(selfLink.href, {
//         headers: {
//           Accept: "application/activity+json",
//         },
//       });

//       setActor(actorProfile.data);
//     } catch (err) {
//       console.error("Actor resolve failed:", err.response?.data || err.message);

//       setError(
//         err.response?.data?.message || "❌ Failed to resolve actor."
//       );

//       setActor(null);
//     }
//   };

//   const sendFollow = async () => {
//     if (!actor?.id) {
//       setFollowStatus("❌ Remote actor not found.");
//       return;
//     }

//     try {
//       setFollowLoading(true);
//       setFollowStatus("");

//       const username = localStorage.getItem("username");
//       const token = localStorage.getItem("token");

//       if (!username || !token) {
//         setFollowStatus("❌ Please login again.");
//         return;
//       }

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/follow/remote/${username}/follow`,
//         {
//           remoteActorUrl: actor.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Follow response:", response.data);

//       setFollowStatus("✅ Follow request sent!");
//     } catch (err) {
//       console.error(
//         "Follow failed:",
//         err.response?.data || err.message
//       );

//       setFollowStatus(
//         err.response?.data?.message || "❌ Follow request failed."
//       );
//     } finally {
//       setFollowLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5 col-md-8">
//       <div className="card shadow p-4">
//         <h3 className="mb-3 text-center">
//           🌐 Follow a Remote User
//         </h3>

//         <div className="input-group mb-3">
//           <input
//             className="form-control"
//             value={handle}
//             onChange={(e) => setHandle(e.target.value)}
//             placeholder="e.g., avdhut_077@mastodon.social"
//           />

//           <button
//             onClick={resolveActor}
//             className="btn btn-primary"
//           >
//             🔍 Search
//           </button>
//         </div>

//         {error && (
//           <div className="alert alert-danger">
//             {error}
//           </div>
//         )}

//         {actor && (
//           <div className="card mt-3 p-3 bg-light border border-success">
//             <h5 className="mb-1">
//               @{actor.preferredUsername}
//             </h5>

//             <small className="text-muted">
//               {actor.id}
//             </small>

//             {actor.summary && (
//               <p
//                 className="mt-2"
//                 dangerouslySetInnerHTML={{
//                   __html: actor.summary,
//                 }}
//               />
//             )}

//             <button
//               className={
//                 followStatus.includes("sent")
//                   ? "btn btn-secondary mt-2"
//                   : "btn btn-success mt-2"
//               }
//               onClick={sendFollow}
//               disabled={
//                 followLoading ||
//                 followStatus.includes("sent")
//               }
//             >
//               {followLoading
//                 ? "Sending..."
//                 : followStatus.includes("sent")
//                 ? "Request Sent ✅"
//                 : "Follow"}
//             </button>

//             {followStatus && (
//               <div
//                 className={
//                   followStatus.includes("✅")
//                     ? "alert alert-success mt-3"
//                     : "alert alert-danger mt-3"
//                 }
//               >
//                 {followStatus}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RemoteSearch;




import React, { useState } from "react";
import axios from "axios";
import "./RemoteSearch.css";

const RemoteSearch = () => {
  const [handle, setHandle] = useState("");
  const [actor, setActor] = useState(null);
  const [error, setError] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState("");

  const removeHtmlTags = (html = "") => {
    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = html;

    return temporaryElement.textContent || temporaryElement.innerText || "";
  };

  const resolveActor = async () => {
    const cleanHandle = handle.trim().replace(/^@/, "");
    const parts = cleanHandle.split("@");

    setError("");
    setActor(null);
    setFollowStatus("");

    if (parts.length !== 2) {
      setError("Enter the handle as username@domain");
      return;
    }

    const [username, domain] = parts;

    if (!username || !domain) {
      setError("Enter the handle as username@domain");
      return;
    }

    try {
      setSearchLoading(true);

      const resource = encodeURIComponent(`acct:${cleanHandle}`);

      const webfingerRes = await axios.get(
        `https://${domain}/.well-known/webfinger?resource=${resource}`
      );

      const selfLink = webfingerRes.data.links?.find(
        (link) => link.rel === "self"
      );

      if (!selfLink?.href) {
        setError("Actor profile URL was not found.");
        return;
      }

      const actorProfile = await axios.get(selfLink.href, {
        headers: {
          Accept: "application/activity+json",
        },
      });

      setActor({
        ...actorProfile.data,
        searchedHandle: cleanHandle,
        domain,
      });
    } catch (err) {
      console.error(
        "Actor resolve failed:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Remote user could not be found. Check the handle and try again."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFollow = async () => {
    if (!actor?.id) {
      setFollowStatus("error:Remote actor was not found.");
      return;
    }

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
      setFollowStatus("error:Your login session has expired.");
      return;
    }

    try {
      setFollowLoading(true);
      setFollowStatus("");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/follow/remote/${username}/follow`,
        {
          remoteActorUrl: actor.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("Follow response:", response.data);

      setFollowStatus("success:Follow request sent successfully.");
    } catch (err) {
      console.error(
        "Follow failed:",
        err.response?.data || err.message
      );

      setFollowStatus(
        `error:${
          err.response?.data?.message || "Follow request failed."
        }`
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const actorImage =
    actor?.icon?.url ||
    actor?.image?.url ||
    actor?.avatar ||
    "";

  const actorName =
    actor?.name ||
    actor?.preferredUsername ||
    "Remote user";

  const actorHandle = actor?.searchedHandle
    ? `@${actor.searchedHandle}`
    : "";

  const followSuccessful = followStatus.startsWith("success:");
  const followMessage = followStatus.replace(
    /^(success|error):/,
    ""
  );

  return (
    <main className="remote-search-page">
      <section className="remote-search-container">
        <div className="remote-search-header">
          <div className="remote-search-icon">🌐</div>

          <div>
            <p className="remote-search-label">FEDIVERSE DISCOVERY</p>
            <h1>Follow a remote user</h1>
            <p className="remote-search-description">
              Find users from Mastodon and other compatible Fediverse
              platforms.
            </p>
          </div>
        </div>

        <div className="remote-search-box">
          <div className="remote-search-input-wrapper">
            <span className="remote-search-at">@</span>

            <input
              type="text"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  resolveActor();
                }
              }}
              placeholder="avdhut_077@mastodon.social"
              disabled={searchLoading}
            />

            {handle && !searchLoading && (
              <button
                type="button"
                className="remote-clear-button"
                onClick={() => {
                  setHandle("");
                  setActor(null);
                  setError("");
                  setFollowStatus("");
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="remote-search-button"
            onClick={resolveActor}
            disabled={searchLoading || !handle.trim()}
          >
            {searchLoading ? (
              <>
                <span className="remote-spinner" />
                Searching
              </>
            ) : (
              <>
                <span>⌕</span>
                Search
              </>
            )}
          </button>
        </div>

        <p className="remote-search-example">
          Example: <strong>username@mastodon.social</strong>
        </p>

        {error && (
          <div className="remote-message remote-error-message">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {actor && (
          <article className="remote-profile-card">
            <div className="remote-profile-main">
              <div className="remote-profile-avatar">
                {actorImage ? (
                  <img src={actorImage} alt={actorName} />
                ) : (
                  <span>
                    {actor.preferredUsername
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <div className="remote-profile-info">
                <div className="remote-profile-title">
                  <div>
                    <h2>{actorName}</h2>
                    <p>{actorHandle}</p>
                  </div>

                  <span className="remote-platform-badge">
                    Remote
                  </span>
                </div>

                {actor.summary && (
                  <p className="remote-profile-summary">
                    {removeHtmlTags(actor.summary)}
                  </p>
                )}

                <a
                  href={actor.id}
                  target="_blank"
                  rel="noreferrer"
                  className="remote-profile-link"
                >
                  View original profile
                </a>
              </div>
            </div>

            <div className="remote-profile-footer">
              <div className="remote-domain-info">
                <span>Server</span>
                <strong>{actor.domain}</strong>
              </div>

              <button
                type="button"
                className={`remote-follow-button ${
                  followSuccessful
                    ? "remote-follow-success"
                    : ""
                }`}
                onClick={sendFollow}
                disabled={followLoading || followSuccessful}
              >
                {followLoading
                  ? "Sending request..."
                  : followSuccessful
                  ? "Request sent ✓"
                  : "Follow"}
              </button>
            </div>

            {followStatus && (
              <div
                className={`remote-message ${
                  followSuccessful
                    ? "remote-success-message"
                    : "remote-error-message"
                }`}
              >
                <span>{followSuccessful ? "✓" : "!"}</span>
                <p>{followMessage}</p>
              </div>
            )}
          </article>
        )}
      </section>
    </main>
  );
};

export default RemoteSearch;