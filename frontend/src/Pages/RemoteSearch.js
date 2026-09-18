
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

  // const resolveActor = async () => {
  //   const cleanHandle = handle.trim().replace(/^@/, "");
  //   const parts = cleanHandle.split("@");

  //   setError("");
  //   setActor(null);
  //   setFollowStatus("");

  //   if (parts.length !== 2) {
  //     setError("Enter the handle as username@domain");
  //     return;
  //   }

  //   const [username, domain] = parts;

  //   if (!username || !domain) {
  //     setError("Enter the handle as username@domain");
  //     return;
  //   }

  //   try {
  //     setSearchLoading(true);

  //     const resource = encodeURIComponent(`acct:${cleanHandle}`);

  //     const webfingerRes = await axios.get(
  //       `https://${domain}/.well-known/webfinger?resource=${resource}`
  //     );

  //     const selfLink = webfingerRes.data.links?.find(
  //       (link) => link.rel === "self"
  //     );

  //     if (!selfLink?.href) {
  //       setError("Actor profile URL was not found.");
  //       return;
  //     }

  //     const actorProfile = await axios.get(selfLink.href, {
  //       headers: {
  //         Accept: "application/activity+json",
  //       },
  //     });

  //     setActor({
  //       ...actorProfile.data,
  //       searchedHandle: cleanHandle,
  //       domain,
  //     });
  //   } catch (err) {
  //     console.error(
  //       "Actor resolve failed:",
  //       err.response?.data || err.message
  //     );

  //     setError(
  //       err.response?.data?.message ||
  //         "Remote user could not be found. Check the handle and try again."
  //     );
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };



















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

    // 1. WebFinger
    const resource = encodeURIComponent(`acct:${cleanHandle}`);

    const webfingerRes = await axios.get(
      `https://${domain}/.well-known/webfinger?resource=${resource}`
    );

    const selfLink = webfingerRes.data.links?.find(
      (link) =>
        link.rel === "self" &&
        link.type === "application/activity+json"
    );

    if (!selfLink?.href) {
      setError("Actor profile URL was not found.");
      return;
    }

    // 2. Ask OUR backend to fetch the remote Actor
    const actorRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/remote/resolve`,
      {
        params: {
          actorUrl: selfLink.href,
        },
      }
    );

    setActor({
      ...actorRes.data,
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
