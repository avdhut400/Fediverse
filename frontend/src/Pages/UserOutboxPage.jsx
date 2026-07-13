
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaClock,
  FaGlobe,
  FaTrash,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import "./OutboxPage.css";

const stripHtml = (html = "") => {
  const temporaryElement =
    document.createElement("div");

  temporaryElement.innerHTML = html;

  return (
    temporaryElement.textContent ||
    temporaryElement.innerText ||
    ""
  );
};

const normalizeUsername = (value = "") => {
  return decodeURIComponent(String(value))
    .replace(/^@/, "")
    .trim()
    .toLowerCase();
};

const OutboxPage = () => {
  const params = useParams();

  const username =
    params.username ||
    params.userName ||
    params.name ||
    "";

  const { token } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loggedInUsername, setLoggedInUsername] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPostId, setDeletingPostId] =
    useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  /*
   * Decode JWT and get logged-in username.
   */
  useEffect(() => {
    if (!token) {
      setLoggedInUsername("");
      return;
    }

    try {
      const cleanToken = String(token)
        .replace(/^Bearer\s+/i, "")
        .replace(/^"|"$/g, "");

      const decodedToken = jwtDecode(cleanToken);

      const tokenUsername =
        decodedToken.username ||
        decodedToken.user?.username ||
        decodedToken.userName ||
        "";

      setLoggedInUsername(tokenUsername);
    } catch (decodeError) {
      console.error(
        "Token decode error:",
        decodeError
      );

      setLoggedInUsername("");
    }
  }, [token]);

  /*
   * Fetch ActivityPub outbox.
   */
  useEffect(() => {
    const fetchOutbox = async () => {
      if (!username) {
        setError("Username was not found.");
        setLoading(false);
        return;
      }

      if (!apiUrl) {
        setError(
          "REACT_APP_API_URL is not configured."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${apiUrl}/users/${username}/outbox`,
          {
            headers: {
              ...(token
                ? {
                    Authorization: `Bearer ${String(
                      token
                    ).replace(/^Bearer\s+/i, "")}`,
                  }
                : {}),
              Accept: "application/activity+json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const orderedItems =
          response.data?.orderedItems ||
          response.data?.first?.orderedItems ||
          [];

        setPosts(
          Array.isArray(orderedItems)
            ? orderedItems
            : []
        );
      } catch (requestError) {
        console.error(
          "Failed to fetch outbox:",
          requestError.response?.data ||
            requestError.message
        );

        setError(
          requestError.response?.data?.message ||
            requestError.response?.data?.error ||
            "Failed to load this user's outbox."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOutbox();
  }, [apiUrl, username, token]);

  /*
   * Check whether current outbox belongs
   * to logged-in user.
   */
  const isOwnOutbox =
    Boolean(token) &&
    Boolean(loggedInUsername) &&
    Boolean(username) &&
    normalizeUsername(loggedInUsername) ===
      normalizeUsername(username);

  /*
   * Extract MongoDB/post ID from either:
   * 66abc123...
   * or
   * https://example.com/posts/66abc123...
   */
  const extractPostId = (rawId = "") => {
    if (!rawId) return "";

    return String(rawId)
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .filter(Boolean)
      .pop();
  };

  /*
   * ActivityPub outbox may return:
   *
   * {
   *   type: "Create",
   *   id: ".../activities/...",
   *   object: {
   *     id: ".../posts/..."
   *   }
   * }
   *
   * Therefore object ID must be checked first.
   */
  const getRawPostId = (post) => {
    return (
      post?.object?._id ||
      post?.object?.id ||
      post?._id ||
      post?.id ||
      ""
    );
  };

  /*
   * Delete post.
   */
  const handleDelete = async (rawId) => {
    if (!token) {
      setError("Please login to delete this post.");
      return;
    }

    if (!isOwnOutbox) {
      setError(
        "You can delete only your own posts."
      );
      return;
    }

    if (!apiUrl) {
      setError(
        "REACT_APP_API_URL is not configured."
      );
      return;
    }

    const postId = extractPostId(rawId);

    if (!postId) {
      setError("Post ID was not found.");
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!shouldDelete) return;

    try {
      setDeletingPostId(postId);
      setError("");

      const cleanToken = String(token)
        .replace(/^Bearer\s+/i, "")
        .replace(/^"|"$/g, "");

      await axios.delete(
        `${apiUrl}/api/auth/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      /*
       * Remove deleted post from UI
       * without refreshing the page.
       */
      setPosts((previousPosts) =>
        previousPosts.filter((post) => {
          const currentRawId =
            getRawPostId(post);

          const currentPostId =
            extractPostId(currentRawId);

          return currentPostId !== postId;
        })
      );
    } catch (deleteError) {
      console.error(
        "Failed to delete post:",
        deleteError.response?.data ||
          deleteError.message
      );

      setError(
        deleteError.response?.data?.message ||
          deleteError.response?.data?.error ||
          "Failed to delete the post."
      );
    } finally {
      setDeletingPostId("");
    }
  };

  const getImageUrl = (post) => {
    return (
      post?.image?.url ||
      post?.image ||
      post?.imageUrl ||
      post?.object?.image?.url ||
      post?.object?.image ||
      post?.attachment?.[0]?.url ||
      post?.object?.attachment?.[0]?.url ||
      ""
    );
  };

  const getPostContent = (post) => {
    return (
      post?.content ||
      post?.object?.content ||
      post?.object?.caption ||
      post?.caption ||
      ""
    );
  };

  const getCreatedAt = (post) => {
    return (
      post?.createdAt ||
      post?.object?.createdAt ||
      post?.object?.published ||
      post?.published ||
      null
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPostIdentity = (post, index) => {
    return (
      getRawPostId(post) ||
      post?.id ||
      `post-${index}`
    );
  };

  if (loading) {
    return (
      <div className="outbox-loading-page">
        <div className="outbox-spinner" />
        <p>Loading outbox...</p>
      </div>
    );
  }

  return (
    <main className="outbox-page">
      <section className="outbox-container">
        <header className="outbox-header">
          <div className="outbox-header-icon">
            <FaGlobe />
          </div>

          <div>
            <p className="outbox-label">
              ACTIVITYPUB OUTBOX
            </p>

            <h1>@{username}</h1>

            <p>
              Public posts published by this
              PhotoFlux actor.
            </p>
          </div>
        </header>

        <div className="outbox-summary">
          <div>
            <strong>{posts.length}</strong>

            <span>
              {posts.length === 1
                ? "Post"
                : "Posts"}
            </span>
          </div>

          <span className="outbox-public-badge">
            <FaGlobe />
            Public
          </span>
        </div>

        {error && (
          <div className="outbox-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="outbox-empty">
            <div className="outbox-empty-icon">
              📤
            </div>

            <h2>No posts found</h2>

            <p>
              This actor has not published any
              posts yet.
            </p>
          </div>
        ) : (
          <div className="outbox-grid">
            {posts.map((post, index) => {
              const rawId =
                getRawPostId(post);

              const postId =
                extractPostId(rawId);

              const imageUrl =
                getImageUrl(post);

              const content = stripHtml(
                getPostContent(post)
              );

              const createdAt =
                getCreatedAt(post);

              const isDeleting =
                deletingPostId === postId;

              return (
                <article
                  className="outbox-card"
                  key={getPostIdentity(
                    post,
                    index
                  )}
                >
                  {imageUrl && (
                    <div className="outbox-image-wrapper">
                      <img
                        src={imageUrl}
                        alt={`Post by ${username}`}
                        className="outbox-image"
                        onError={(event) => {
                          const parentElement =
                            event.currentTarget
                              .parentElement;

                          if (parentElement) {
                            parentElement.style.display =
                              "none";
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="outbox-card-body">
                    <div className="outbox-author-row">
                      <div className="outbox-avatar">
                        {username
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </div>

                      <div>
                        <h2>@{username}</h2>

                        <p>
                          <FaClock />
                          {formatDate(createdAt)}
                        </p>
                      </div>

                      <span className="outbox-post-type">
                        Note
                      </span>
                    </div>

                    <p className="outbox-content">
                      {content || "No caption"}
                    </p>

                    <div className="outbox-card-footer">
                      <span>
                        <FaGlobe />
                        Visible to everyone
                      </span>

                      {isOwnOutbox && rawId && (
                        <button
                          type="button"
                          className="outbox-delete-button"
                          onClick={() =>
                            handleDelete(rawId)
                          }
                          disabled={isDeleting}
                        >
                          <FaTrash />

                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default OutboxPage;