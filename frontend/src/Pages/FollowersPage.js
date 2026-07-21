

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  FaCamera,
  FaExternalLinkAlt,
  FaTimes,
  FaTrashAlt,
  FaUpload,
  FaUserFriends,
  FaUserMinus,
  FaPen,
  FaCheck,
} from "react-icons/fa";

import "./FollowersPage.css";

const FollowersPage = () => {
  const { username } = useParams();

  const [view, setView] = useState("followers");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [currentUsername, setCurrentUsername] =
    useState("");

  const [profilePic, setProfilePic] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [bioDraft, setBioDraft] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioSaving, setBioSaving] = useState(false);
  const [bioMessage, setBioMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionUser, setActionUser] = useState("");
  const [error, setError] = useState("");

  const [profileModalOpen, setProfileModalOpen] =
    useState(false);

  const [
    selectedProfileFile,
    setSelectedProfileFile,
  ] = useState(null);

  const [profilePreview, setProfilePreview] =
    useState("");

  const [profileUploading, setProfileUploading] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState("");

  const profileInputRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const loggedInUsername = useMemo(() => {
    try {
      if (token) {
        const decoded = jwtDecode(token);
        return (
          decoded?.username ||
          localStorage.getItem("username") ||
          ""
        );
      }
    } catch (decodeError) {
      console.error("[ProfileDebug] Token decode error:", decodeError);
    }

    return localStorage.getItem("username") || "";
  }, [token]);

  const headers = useMemo(
    () => ({
      Authorization: token
        ? `Bearer ${token}`
        : "",

      Accept: "application/activity+json",

      "ngrok-skip-browser-warning": "true",
    }),
    [token]
  );

  
  const getProfilePictureUrl = useCallback((data) => {
    return (
      data?.profilePic?.url ||
      data?.user?.profilePic?.url ||
      data?.user?.profilePic ||
      data?.profilePic ||
      data?.icon?.url ||
      ""
    );
  }, []);

  useEffect(() => {
    setCurrentUsername(loggedInUsername);
  }, [loggedInUsername]);

  
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const cleanProfileUrl = useCallback((item) => {
    if (!item) return "";

    const rawUrl =
      typeof item === "string"
        ? item
        : item.id ||
          item.url ||
          item.href ||
          item.actor ||
          "";

    if (!rawUrl) return "";

    try {
      const parsed = new URL(rawUrl);

      return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(
        /\/+$/,
        ""
      );
    } catch {
      return String(rawUrl).replace(
        /\/+$/,
        ""
      );
    }
  }, []);

  const getUsernameFromUrl = useCallback((profileUrl) => {
    if (!profileUrl) return "user";

    try {
      const parsed = new URL(profileUrl);

      const parts = parsed.pathname
        .split("/")
        .filter(Boolean);

      return (
        parts[parts.length - 1]
          ?.replace(/^@/, "") || "user"
      );
    } catch {
      const parts = String(profileUrl)
        .split("/")
        .filter(Boolean);

      return (
        parts[parts.length - 1]
          ?.replace(/^@/, "") || "user"
      );
    }
  }, []);

  const normalizeUserItem = useCallback((item) => {
    const profileUrl =
      cleanProfileUrl(item);

    const isObject =
      typeof item === "object" &&
      item !== null;

    const normalizedUsername = isObject
      ? item.preferredUsername ||
        item.username ||
        getUsernameFromUrl(profileUrl)
      : getUsernameFromUrl(profileUrl);

    const displayName = isObject
      ? item.name ||
        item.displayName ||
        normalizedUsername
      : normalizedUsername;

    const avatar = isObject
      ? item.icon?.url ||
        item.avatar?.url ||
        item.avatar ||
        item.profilePic?.url ||
        item.profilePic ||
        ""
      : "";

    let domain = "";

    try {
      domain = profileUrl
        ? new URL(profileUrl).hostname
        : "";
    } catch {
      domain = "";
    }

    return {
      username: normalizedUsername,
      displayName,
      profileUrl,
      avatar,
      domain,
    };
  }, [cleanProfileUrl, getUsernameFromUrl]);

  /*
   * Duplicate followers/following remove.
   */
  const processCollection = useCallback((data) => {
    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (
      Array.isArray(data?.orderedItems)
    ) {
      items = data.orderedItems;
    } else if (
      Array.isArray(
        data?.first?.orderedItems
      )
    ) {
      items = data.first.orderedItems;
    } else if (
      Array.isArray(data?.items)
    ) {
      items = data.items;
    }

    const uniqueMap = new Map();

    items
      .map(normalizeUserItem)
      .forEach((user) => {
        const uniqueKey =
          user.profileUrl
            ?.toLowerCase()
            .replace(/\/+$/, "") ||
          `${user.username?.toLowerCase()}@${user.domain?.toLowerCase()}`;

        if (
          uniqueKey &&
          !uniqueMap.has(uniqueKey)
        ) {
          uniqueMap.set(
            uniqueKey,
            user
          );
        }
      });

    return Array.from(
      uniqueMap.values()
    );
  }, [normalizeUserItem]);

  
  const fetchProfilePicture = useCallback(async () => {
    if (!username || !apiUrl) return;

    const ownProfile =
      Boolean(token) &&
      loggedInUsername.toLowerCase() ===
        username.toLowerCase();

    const endpoint = ownProfile
      ? `${apiUrl}/api/users/me`
      : `${apiUrl}/users/${username}`;

    console.log("[ProfileDebug] refresh fetch:", {
      routeUsername: username,
      loggedInUsername,
      ownProfile,
      endpoint,
    });

    try {
      setProfileLoading(true);

      const response = await axios.get(endpoint, {
        headers: ownProfile
          ? {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            }
          : {
              Accept: "application/activity+json",
              "ngrok-skip-browser-warning": "true",
            },
      });

      console.log(
        "[ProfileDebug] profile response:",
        JSON.stringify(response.data, null, 2)
      );

      const permanentUrl = getProfilePictureUrl(response.data);

      console.log(
        "[ProfileDebug] extracted profile URL:",
        permanentUrl
      );

      const profileBio =
        response.data?.bio ||
        response.data?.summary ||
        response.data?.user?.bio ||
        response.data?.user?.summary ||
        "";

      setBio(profileBio);
      setBioDraft(profileBio);

      if (permanentUrl) {
        setProfilePic(permanentUrl);

        if (ownProfile) {
          localStorage.setItem("profilePic", permanentUrl);
        }
      } else {
        console.error(
          "[ProfileDebug] profile URL missing:",
          response.data
        );

        if (ownProfile) {
          setProfilePic(
            localStorage.getItem("profilePic") || ""
          );
        } else {
          setProfilePic("");
        }
      }
    } catch (requestError) {
      console.error(
        "[ProfileDebug] profile fetch failed:",
        requestError.response?.data ||
          requestError.message
      );

      if (ownProfile) {
        setProfilePic(
          localStorage.getItem("profilePic") || ""
        );
      } else {
        setProfilePic("");
      }
    } finally {
      setProfileLoading(false);
    }
  }, [
    username,
    apiUrl,
    token,
    loggedInUsername,
    getProfilePictureUrl,
  ]);

  const fetchData = useCallback(async () => {
    if (!username || !apiUrl) {
      setError(
        "Username or API URL is missing."
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        followersResponse,
        followingResponse,
      ] = await Promise.all([
        axios.get(
          `${apiUrl}/users/${username}/followers`,
          {
            headers,
          }
        ),

        axios.get(
          `${apiUrl}/users/${username}/following`,
          {
            headers,
          }
        ),
      ]);

      setFollowers(
        processCollection(
          followersResponse.data
        )
      );

      setFollowing(
        processCollection(
          followingResponse.data
        )
      );
    } catch (requestError) {
      console.error(
        "Failed to load connections:",
        requestError.response?.data ||
          requestError.message
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Failed to load followers and following."
      );
    } finally {
      setLoading(false);
    }
  }, [username, apiUrl, headers, processCollection]);

  
  useEffect(() => {
    fetchData();
    fetchProfilePicture();

    
  }, [fetchData, fetchProfilePicture]);

  const isRemoteConnection = useCallback(
    (connectionUser) => {
      if (!connectionUser) return false;

      const profileUrl =
        connectionUser.profileUrl ||
        connectionUser.actorUrl ||
        "";

      if (!profileUrl) return false;

      try {
        const connectionHost = new URL(
          profileUrl
        ).hostname;
        const apiHost = new URL(
          apiUrl
        ).hostname;

        return connectionHost !== apiHost;
      } catch {
        return Boolean(
          connectionUser.domain &&
            connectionUser.domain !==
              "fediverse.onrender.com"
        );
      }
    },
    [apiUrl]
  );

  const removeFollower = async (
    connectionUser
  ) => {
    if (!connectionUser || actionUser) {
      return;
    }

    const targetUsername = String(
      connectionUser.username || ""
    ).replace(/^@/, "");

    if (!targetUsername) return;

    const confirmed = window.confirm(
      `Remove @${targetUsername} from your followers?`
    );

    if (!confirmed) return;

    try {
      setActionUser(
        `remove-${connectionUser.username}`
      );
      setError("");

      if (isRemoteConnection(connectionUser)) {
        const remoteActorUrl =
          connectionUser.profileUrl ||
          connectionUser.actorUrl;

        if (!remoteActorUrl) {
          throw new Error(
            "Remote actor URL is missing."
          );
        }

        await axios.delete(
          `${apiUrl}/follow/${username}/remote-follower`,
          {
            headers,
            data: { remoteActorUrl },
          }
        );
      } else {
        await axios.delete(
          `${apiUrl}/api/users/${username}/followers/${targetUsername}`,
          { headers }
        );
      }

      setFollowers((current) =>
        current.filter(
          (user) =>
            user.profileUrl !==
              connectionUser.profileUrl ||
            user.username !==
              connectionUser.username
        )
      );
    } catch (requestError) {
      console.error(
        "Remove follower failed:",
        requestError.response?.data ||
          requestError.message
      );

      setError(
        requestError.response?.data?.error ||
          requestError.response?.data
            ?.message ||
          requestError.message ||
          `Could not remove @${targetUsername}.`
      );
    } finally {
      setActionUser("");
    }
  };

  const unfollowUser = async (
    connectionUser
  ) => {
    if (!connectionUser || actionUser) {
      return;
    }

    const targetUsername = String(
      connectionUser.username || ""
    ).replace(/^@/, "");

    if (!targetUsername) return;

    const confirmed = window.confirm(
      `Unfollow @${targetUsername}?`
    );

    if (!confirmed) return;

    try {
      setActionUser(
        `unfollow-${connectionUser.username}`
      );
      setError("");

      if (isRemoteConnection(connectionUser)) {
        const remoteActorUrl =
          connectionUser.profileUrl ||
          connectionUser.actorUrl;

        if (!remoteActorUrl) {
          throw new Error(
            "Remote actor URL is missing."
          );
        }

        await axios.delete(
          `${apiUrl}/follow/${username}/remote-unfollow`,
          {
            headers,
            data: { remoteActorUrl },
          }
        );
      } else {
        await axios.delete(
          `${apiUrl}/api/users/${username}/following/${targetUsername}`,
          { headers }
        );
      }

      setFollowing((current) =>
        current.filter(
          (user) =>
            user.profileUrl !==
              connectionUser.profileUrl ||
            user.username !==
              connectionUser.username
        )
      );
    } catch (requestError) {
      console.error(
        "Unfollow failed:",
        requestError.response?.data ||
          requestError.message
      );

      setError(
        requestError.response?.data?.error ||
          requestError.response?.data
            ?.message ||
          requestError.message ||
          `Could not unfollow @${targetUsername}.`
      );
    } finally {
      setActionUser("");
    }
  };

  const handleProfileFileSelect = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setProfileMessage(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setProfileMessage(
        "Profile picture must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (profilePreview) {
      URL.revokeObjectURL(
        profilePreview
      );
    }

    setSelectedProfileFile(file);

    setProfilePreview(
      URL.createObjectURL(file)
    );

    setProfileMessage("");
    setProfileModalOpen(true);

    event.target.value = "";
  };

  const resetProfileModal = () => {
    if (profilePreview) {
      URL.revokeObjectURL(
        profilePreview
      );
    }

    setProfileModalOpen(false);
    setSelectedProfileFile(null);
    setProfilePreview("");
    setProfileMessage("");
  };

  const closeProfileModal = () => {
    if (profileUploading) return;

    resetProfileModal();
  };

  /*
   * Profile picture upload.
   */
  const uploadProfilePicture =
    async () => {
      if (!selectedProfileFile) {
        setProfileMessage(
          "Please select a profile picture."
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "profilePic",
        selectedProfileFile
      );

      try {
        setProfileUploading(true);
        setProfileMessage("");

        const response =
          await axios.put(
            `${apiUrl}/api/users/me/profile-picture`,
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "ngrok-skip-browser-warning":
                  "true",
              },
            }
          );

        const permanentUrl =
          getProfilePictureUrl(
            response.data
          );

       
        if (!permanentUrl) {
          throw new Error(
            "Backend did not return profile picture URL."
          );
        }

        
        setProfilePic(permanentUrl);

        localStorage.setItem(
          "profilePic",
          permanentUrl
        );

        
        window.dispatchEvent(
          new CustomEvent(
            "profile-picture-updated",
            {
              detail: permanentUrl,
            }
          )
        );

        setProfileMessage(
          "Profile picture updated successfully."
        );

        window.setTimeout(() => {
          resetProfileModal();

          
          fetchProfilePicture();
        }, 700);
      } catch (requestError) {
        console.error(
          "Profile picture update failed:",
          requestError.response?.data ||
            requestError.message
        );

        setProfileMessage(
          requestError.response?.data
            ?.message ||
            requestError.message ||
            "Failed to update profile picture."
        );
      } finally {
        setProfileUploading(false);
      }
    };


  const updateBio = async () => {
    if (!isOwnProfile || bioSaving) return;

    const cleanedBio = bioDraft.trim();

    if (cleanedBio.length > 160) {
      setBioMessage("Bio cannot exceed 160 characters.");
      return;
    }

    try {
      setBioSaving(true);
      setBioMessage("");

      const response = await axios.put(
        `${apiUrl}/api/users/me/bio`,
        { bio: cleanedBio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const updatedBio =
        response.data?.user?.bio ??
        response.data?.bio ??
        cleanedBio;

      setBio(updatedBio);
      setBioDraft(updatedBio);
      setEditingBio(false);
      setBioMessage("Bio updated successfully.");
    } catch (requestError) {
      console.error(
        "Bio update failed:",
        requestError.response?.data || requestError.message
      );

      setBioMessage(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Failed to update bio."
      );
    } finally {
      setBioSaving(false);
    }
  };

  const isOwnProfile =
    Boolean(currentUsername) &&
    currentUsername.toLowerCase() ===
      username?.toLowerCase();

  const displayedUsers =
    view === "followers"
      ? followers
      : following;

  const getInitial = (value) =>
    value
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <main className="connections-page">
      <section className="connections-container">
        <header className="connections-profile-card">
          <div
            className={`connections-profile-avatar ${
              isOwnProfile
                ? "connections-profile-avatar-editable"
                : ""
            }`}
            onClick={() => {
              if (
                isOwnProfile &&
                !profileUploading
              ) {
                profileInputRef.current?.click();
              }
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt={`${username} profile`}
                onLoad={() => {
                  console.log(
                    "[ProfileDebug] image loaded:",
                    profilePic
                  );
                }}
                onError={(event) => {
                  const failedUrl =
                    event.currentTarget.src;

                  console.error(
                    "[ProfileDebug] image failed to load:",
                    failedUrl
                  );

                  event.currentTarget.onerror = null;

                  if (failedUrl === profilePic) {
                    setProfilePic("");
                  }
                }}
              />
            ) : (
              <span>
                {getInitial(username)}
              </span>
            )}

            {isOwnProfile && (
              <div className="connections-profile-camera">
                <FaCamera />
              </div>
            )}
          </div>

          {isOwnProfile && (
            <input
              ref={profileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handleProfileFileSelect
              }
              hidden
            />
          )}

          <div className="connections-profile-info">
            <div className="connections-profile-topline">
              <p className="connections-label">PHOTOFLUX PROFILE</p>
              <span className="connections-fediverse-badge">Fediverse</span>
            </div>

            <h1>@{username}</h1>

            <div className="connections-bio-section">
              {editingBio ? (
                <div className="connections-bio-editor">
                  <textarea
                    value={bioDraft}
                    onChange={(event) => {
                      setBioDraft(event.target.value);
                      setBioMessage("");
                    }}
                    maxLength={160}
                    rows={3}
                    placeholder="Write something about yourself..."
                    autoFocus
                  />

                  <div className="connections-bio-editor-footer">
                    <span>{bioDraft.length}/160</span>
                    <div>
                      <button
                        type="button"
                        className="connections-bio-cancel"
                        onClick={() => {
                          setBioDraft(bio);
                          setEditingBio(false);
                          setBioMessage("");
                        }}
                        disabled={bioSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="connections-bio-save"
                        onClick={updateBio}
                        disabled={bioSaving}
                      >
                        <FaCheck />
                        {bioSaving ? "Saving..." : "Save bio"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="connections-bio-display">
                  <p>{bio || "No bio added yet."}</p>
                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        setBioDraft(bio);
                        setEditingBio(true);
                        setBioMessage("");
                      }}
                    >
                      <FaPen />
                      {bio ? "Edit bio" : "Add bio"}
                    </button>
                  )}
                </div>
              )}

              {bioMessage && (
                <p className={`connections-bio-message ${
                  bioMessage.includes("successfully") ? "success" : "error"
                }`}>
                  {bioMessage}
                </p>
              )}
            </div>
          </div>

          <div className="connections-stats">
            <div>
              <strong>
                {followers.length}
              </strong>

              <span>Followers</span>
            </div>

            <div>
              <strong>
                {following.length}
              </strong>

              <span>Following</span>
            </div>
          </div>
        </header>

        <div className="connections-tabs">
          <button
            type="button"
            className={
              view === "followers"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("followers")
            }
          >
            Followers
            <span>
              {followers.length}
            </span>
          </button>

          <button
            type="button"
            className={
              view === "following"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("following")
            }
          >
            Following
            <span>
              {following.length}
            </span>
          </button>
        </div>

        {error && (
          <div className="connections-error">
            <span>!</span>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        )}

        <section className="connections-list-card">
          <div className="connections-list-header">
            <div>
              <h2>
                {view === "followers"
                  ? "Followers"
                  : "Following"}
              </h2>

              <p>
                {displayedUsers.length}{" "}
                connections
              </p>
            </div>

            <FaUserFriends />
          </div>

          {loading ? (
            <div className="connections-loading">
              <div className="connections-spinner" />
              <p>Loading...</p>
            </div>
          ) : displayedUsers.length ===
            0 ? (
            <div className="connections-empty">
              <div className="connections-empty-icon">
                <FaUserFriends />
              </div>

              <h3>
                {view === "followers"
                  ? "No followers yet"
                  : "Not following anyone"}
              </h3>
            </div>
          ) : (
            <div className="connections-list">
              {displayedUsers.map(
                (
                  connectionUser,
                  index
                ) => {
                  const removeLoading =
                    actionUser ===
                    `remove-${connectionUser.username}`;

                  const unfollowLoading =
                    actionUser ===
                    `unfollow-${connectionUser.username}`;

                  return (
                    <article
                      className="connection-user-row"
                      key={
                        connectionUser.profileUrl ||
                        `${connectionUser.username}-${index}`
                      }
                    >
                      <div className="connection-user-main">
                        <div className="connection-avatar">
                          {connectionUser.avatar ? (
                            <img
                              src={
                                connectionUser.avatar
                              }
                              alt={
                                connectionUser.username
                              }
                            />
                          ) : (
                            <span>
                              {getInitial(
                                connectionUser.username
                              )}
                            </span>
                          )}
                        </div>

                        <div className="connection-user-info">
                          <h3>
                            {connectionUser.displayName ||
                              connectionUser.username}
                          </h3>

                          <p>
                            @
                            {
                              connectionUser.username
                            }
                          </p>

                          {connectionUser.domain && (
                            <small>
                              {
                                connectionUser.domain
                              }
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="connection-actions">

                        {connectionUser.profileUrl && (
                          connectionUser.domain === "fediverse.onrender.com" ? (
                            <Link
                              to={`/followers/${connectionUser.username}`}
                              className="connection-view-button"
                            >
                              <FaExternalLinkAlt />
                              View
                            </Link>
                          ) : (
                            <a
                              href={connectionUser.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="connection-view-button"
                            >
                              <FaExternalLinkAlt />
                              View
                            </a>
                          )

                        {connectionUser.username && (
                          <Link
                            to={`/followers/${encodeURIComponent(
                              connectionUser.username
                            )}`}
                            className="connection-view-button"
                          >
                            <FaExternalLinkAlt />
                            View
                          </Link>

                        )}

                        {isOwnProfile &&
                          view ===
                            "followers" && (
                            <button
                              type="button"
                              className="connection-remove-button"
                              onClick={() =>
                                removeFollower(
                                  connectionUser
                                )
                              }
                              disabled={
                                removeLoading ||
                                Boolean(
                                  actionUser
                                )
                              }
                            >
                              <FaTrashAlt />

                              {removeLoading
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          )}

                        {isOwnProfile &&
                          view ===
                            "following" && (
                            <button
                              type="button"
                              className="connection-remove-button"
                              onClick={() =>
                                unfollowUser(
                                  connectionUser
                                )
                              }
                              disabled={
                                unfollowLoading ||
                                Boolean(
                                  actionUser
                                )
                              }
                            >
                              <FaUserMinus />

                              {unfollowLoading
                                ? "Unfollowing..."
                                : "Unfollow"}
                            </button>
                          )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </section>

      {profileModalOpen && (
        <div
          className="profile-update-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeProfileModal();
            }
          }}
        >
          <section className="profile-update-modal">
            <div className="profile-update-header">
              <div>
                <p>PROFILE PICTURE</p>
                <h2>Update picture</h2>
              </div>

              <button
                type="button"
                onClick={
                  closeProfileModal
                }
                disabled={
                  profileUploading
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="profile-update-body">
              <div className="profile-update-preview">
                {profilePreview ? (
                  <img
                    src={
                      profilePreview
                    }
                    alt="Profile preview"
                  />
                ) : (
                  <span>
                    {getInitial(
                      username
                    )}
                  </span>
                )}
              </div>

              <h3>@{username}</h3>

              {selectedProfileFile && (
                <div className="profile-update-file">
                  <span>
                    {
                      selectedProfileFile.name
                    }
                  </span>

                  <small>
                    {(
                      selectedProfileFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </small>
                </div>
              )}

              {profileMessage && (
                <div
                  className={`profile-update-message ${
                    profileMessage.includes(
                      "successfully"
                    )
                      ? "success"
                      : "error"
                  }`}
                >
                  {profileMessage}
                </div>
              )}
            </div>

            <div className="profile-update-actions">
              <button
                type="button"
                className="profile-update-change"
                onClick={() =>
                  profileInputRef.current?.click()
                }
                disabled={
                  profileUploading
                }
              >
                <FaCamera />
                Choose another
              </button>

              <button
                type="button"
                className="profile-update-save"
                onClick={
                  uploadProfilePicture
                }
                disabled={
                  profileUploading ||
                  !selectedProfileFile
                }
              >
                <FaUpload />

                {profileUploading
                  ? "Uploading..."
                  : "Save picture"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default FollowersPage;