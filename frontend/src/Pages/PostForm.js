

import React, { useState, useRef } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostForm() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (file) => {
    if (file) {
      // Validate type
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG and PNG files are allowed.");
        setImage(null);
        setPreview(null);
        return;
      }

      // Validate size (50MB = 52,428,800 bytes)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size exceeds the 50MB limit.");
        setImage(null);
        setPreview(null);
        return;
      }

      setError(null);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isUploading) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const startUpload = async () => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("username", localStorage.getItem("username"));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await API.post("/api/posts/po", formData, {
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "x-api-secret": process.env.REACT_APP_API_SECRET,
        },
      });
      alert("Post uploaded successfully!");
      navigate("/");
    } catch (err) {
      if (axios.isCancel(err) || err.name === "CanceledError") {
        console.log("Upload canceled by user");
        setError("Upload canceled by user.");
      } else {
        console.error(err);
        setError(err.response?.data?.message || "Error while posting. Please try again.");
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!image) {
      setError("Please select an image file first.");
      return;
    }
    if (!caption) {
      setError("Caption is required!");
      return;
    }

    // Secondary validation
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(image.type)) {
      setError("Only JPEG and PNG files are allowed.");
      return;
    }
    if (image.size > 50 * 1024 * 1024) {
      setError("File size exceeds the 50MB limit.");
      return;
    }

    startUpload();
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <div className="card p-4 shadow-lg animate-fade-in" style={{ width: "100%", maxWidth: "500px" }}>
        <h2 className="text-center text-primary mb-4">
          <i className="bi bi-image-fill me-2"></i>Create a Post
        </h2>

        {error && (
          <div
            className="alert alert-danger d-flex align-items-center justify-content-between mb-3 py-2 px-3 small"
            role="alert"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <span>{error}</span>
            </div>
            {!isUploading && image && caption && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-2 text-nowrap"
                onClick={() => handleSubmit()}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>Retry
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Caption Input */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">📋 Caption</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a caption..."
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (error && error.includes("caption")) setError(null);
              }}
              disabled={isUploading}
              required
            />
          </div>

          {/* Custom Upload Box */}
          <div
            className={`mb-3 text-center p-4 border border-2 rounded ${
              isDragOver ? "border-primary bg-light" : "border-secondary"
            }`}
            style={{
              borderStyle: "dashed",
              background: isDragOver ? "#e9ecef" : "#fafafa",
              cursor: isUploading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease-in-out",
              transform: isDragOver ? "scale(1.02)" : "scale(1)",
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!isUploading) {
                document.getElementById("fileInput").click();
              }
            }}
          >
            {preview ? (
              <div className="position-relative d-inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                />
                {!isUploading && (
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2 bg-white rounded-circle p-1 shadow"
                    style={{ fontSize: "0.8rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setPreview(null);
                      setError(null);
                    }}
                    aria-label="Remove image"
                  ></button>
                )}
              </div>
            ) : (
              <>
                <i className="bi bi-cloud-arrow-up fs-1 text-secondary"></i>
                <p className="mb-0 fw-semibold text-secondary">
                  Choose a file or drag & drop it here
                </p>
                <small className="text-muted">JPEG, PNG, up to 50MB</small>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files[0])}
              disabled={isUploading}
            />
          </div>

          {/* Progress / Status Indicator */}
          {isUploading && (
            <div className="mb-3 p-3 bg-light rounded border border-light-subtle">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted fw-semibold">
                  <span className="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </span>
                <span className="small fw-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="progress mb-3" style={{ height: "8px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleCancelUpload}
                >
                  <i className="bi bi-x-circle me-1"></i>Cancel Upload
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={isUploading || (!image && !preview)}
            >
              {isUploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                <>🚀 Post</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
