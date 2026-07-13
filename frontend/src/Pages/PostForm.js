
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaGlobeAmericas,
  FaImage,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import API from "../utils/api";
import "./PostForm.css";

const MAX_SIZE = 50 * 1024 * 1024;

function PostForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [dragging, setDragging] = useState(false);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");

  const username =
    localStorage.getItem("username") || "PhotoFlux User";

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setMessage("Image must be smaller than 50 MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const removeImage = (event) => {
    event.stopPropagation();

    if (preview) URL.revokeObjectURL(preview);

    setImage(null);
    setPreview("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    selectImage(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!caption.trim() || !image) {
      setMessage("Caption and image are required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    const formData = new FormData();

    formData.append("caption", caption.trim());
    formData.append("image", image);
    formData.append("username", username);

    try {
      setPosting(true);
      setMessage("");

      await API.post("/api/posts/po", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Post published successfully!");

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to publish the post."
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="post-create-page">
      <div className="post-create-background-circle circle-one" />
      <div className="post-create-background-circle circle-two" />

      <section className="post-create-wrapper">
        <header className="post-create-topbar">
          <button
            type="button"
            className="post-create-back"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>

          <div>
            <span>PHOTOFLUX STUDIO</span>
            <h1>Create new post</h1>
          </div>

          <div className="post-create-public">
            <FaGlobeAmericas />
            Public
          </div>
        </header>

        <form
          className="post-create-card"
          onSubmit={handleSubmit}
        >
          {/* Left side preview */}
          <div className="post-create-preview-section">
            <div
              className={`post-create-upload ${
                dragging ? "dragging" : ""
              } ${preview ? "has-preview" : ""}`}
              onClick={() =>
                !posting && fileInputRef.current?.click()
              }
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Post preview"
                    className="post-create-preview-image"
                  />

                  <div className="post-create-preview-overlay">
                    <FaImage />
                    <span>Click to change image</span>
                  </div>

                  <button
                    type="button"
                    className="post-create-remove"
                    onClick={removeImage}
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <div className="post-create-placeholder">
                  <div className="post-create-upload-icon">
                    <FaCloudUploadAlt />
                  </div>

                  <h2>
                    {dragging
                      ? "Drop your image here"
                      : "Upload your photo"}
                  </h2>

                  <p>
                    Drag and drop an image or click to browse
                    from your device.
                  </p>

                  <button type="button">
                    Choose image
                  </button>

                  <small>
                    JPG, PNG or WEBP — maximum 50 MB
                  </small>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                disabled={posting}
                onChange={(event) =>
                  selectImage(event.target.files?.[0])
                }
              />
            </div>
          </div>

          {/* Right side form */}
          <div className="post-create-details">
            <div className="post-create-user">
              <div className="post-create-avatar">
                {username.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>@{username}</strong>
                <span>
                  Posting to your public ActivityPub outbox
                </span>
              </div>
            </div>

            <div className="post-create-caption">
              <div className="post-create-label-row">
                <label htmlFor="caption">
                  Write a caption
                </label>

                <span>{caption.length}/500</span>
              </div>

              <textarea
                id="caption"
                rows="8"
                maxLength="500"
                value={caption}
                disabled={posting}
                placeholder="Share what is happening..."
                onChange={(event) =>
                  setCaption(event.target.value)
                }
              />
            </div>

            {image && (
              <div className="post-create-file">
                <div>
                  <FaImage />

                  <span>{image.name}</span>
                </div>

                <small>
                  {(image.size / (1024 * 1024)).toFixed(2)} MB
                </small>
              </div>
            )}

            <div className="post-create-info">
              <FaGlobeAmericas />

              <p>
                This post will be publicly available to local
                users and your Fediverse followers.
              </p>
            </div>

            {message && (
              <div
                className={`post-create-message ${
                  message.includes("successfully")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

            <div className="post-create-actions">
              <button
                type="button"
                className="post-create-cancel"
                disabled={posting}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="post-create-submit"
                disabled={
                  posting || !caption.trim() || !image
                }
              >
                {posting ? (
                  <>
                    <span className="post-create-spinner" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Publish post
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PostForm;