import { useRef, useState } from "react";
import "./FileUpload.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function FileUpload() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  function validateFile(file) {
    if (!file) {
      setError("Please select an image.");
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be 5 MB or less.");
      return false;
    }

    return true;
  }

  function handleFile(file) {
    setError("");
    setMessage("");
    setUploadedFile(null);
    setProgress(0);

    if (!validateFile(file)) {
      setSelectedFile(null);
      setPreview("");
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  }

  function handleInputChange(event) {
    const file = event.target.files[0];

    if (file) {
      handleFile(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      handleFile(file);
    }
  }

  function openFilePicker() {
    fileInputRef.current.click();
  }

  function uploadFile() {
    if (!selectedFile) {
      setError("Please select an image before uploading.");
      return;
    }

    setError("");
    setMessage("");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();

    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload");

    xhr.upload.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        const percentage = Math.round(
          (event.loaded / event.total) * 100
        );

        setProgress(percentage);
      }
    });

    xhr.onload = function () {
      setUploading(false);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);

        setUploadedFile(response.file);
        setMessage("File uploaded successfully.");
        setProgress(100);
      } else {
        let response;

        try {
          response = JSON.parse(xhr.responseText);
        } catch {
          response = {
            message: "Upload failed.",
          };
        }

        setError(response.message);
        setProgress(0);
      }
    };

    xhr.onerror = function () {
      setUploading(false);
      setProgress(0);
      setError("Unable to connect to the server.");
    };

    xhr.send(formData);
  }

  function removeFile() {
    setSelectedFile(null);
    setPreview("");
    setError("");
    setMessage("");
    setUploadedFile(null);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="upload-card">
      <div className="upload-header">
        <h1>Image Upload</h1>

        <p>
          Upload an image using drag and drop
          or choose a file from your device.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        hidden
      />

      {!selectedFile && (
        <div
          className={`drop-zone ${
            dragActive ? "drag-active" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <div className="upload-icon">⬆️</div>

          <h2>Drag & Drop your image here</h2>

          <p>or click to browse files</p>

          <span>
            JPG, PNG or WEBP · Maximum 5 MB
          </span>
        </div>
      )}

      {selectedFile && (
        <div className="preview-section">
          <div className="preview-container">
            <img
              src={preview}
              alt="Selected preview"
            />
          </div>

          <div className="file-info">
            <h3>{selectedFile.name}</h3>

            <p>
              {(selectedFile.size / 1024 / 1024).toFixed(2)}
              {" MB"}
            </p>
          </div>

          {!uploading && !uploadedFile && (
            <div className="preview-actions">
              <button
                className="upload-button"
                onClick={uploadFile}
              >
                Upload Image
              </button>

              <button
                className="remove-button"
                onClick={removeFile}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {uploading && (
        <div className="progress-section">
          <div className="progress-info">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="message error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="message success-message">
          {message}
        </div>
      )}

      {uploadedFile && (
        <div className="uploaded-section">
          <h2>Uploaded Image</h2>

          <img
            className="uploaded-image"
            src={uploadedFile.url}
            alt={uploadedFile.originalName}
          />

          <p>{uploadedFile.originalName}</p>

          <a
            href={uploadedFile.url}
            target="_blank"
            rel="noreferrer"
          >
            Open Uploaded Image
          </a>
        </div>
      )}
    </div>
  );
}

export default FileUpload;