import axios from "axios";
import { useState } from "react";
import "../css/FileUpload.css";
import { SUPPORTED_FORMATS, MIME_TYPES } from "../utils/const";

export default function FileUpload({
  targetFormat = "png",
  sourceFormat = "",
  endpoint = "img-convert",
  acceptedFormats = [],
  converterType = "",
  converterIndex = null,
}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // File validation based on converter type
      if (sourceFormat === "pdf" || endpoint === "pdf-convert") {
        // PDF file validation
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        if (fileExtension !== "pdf" && !selectedFile.type.includes("pdf")) {
          setError("Please select a PDF file.");
          setFile(null);
          return;
        }
      } else if (sourceFormat === "image" && acceptedFormats.length > 0) {
        // Image file validation with accepted formats
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        const fileType = selectedFile.type.toLowerCase();

        const isValidFormat = acceptedFormats.some((format) => {
          return (
            fileExtension === format.toLowerCase() ||
            fileType === MIME_TYPES[format.toLowerCase()] ||
            (format.toLowerCase() === "jpg" &&
              (fileExtension === "jpeg" || fileType === "image/jpeg"))
          );
        });

        if (!isValidFormat) {
          setError(
            `Please select one of these formats: ${acceptedFormats
              .join(", ")
              .toUpperCase()}. Selected file appears to be ${fileExtension.toUpperCase()}.`
          );
          setFile(null);
          return;
        }
      } else if (sourceFormat && sourceFormat !== "image") {
        // Specific format validation
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        const fileType = selectedFile.type.toLowerCase();

        const isValidFormat =
          fileExtension === sourceFormat.toLowerCase() ||
          fileType === MIME_TYPES[sourceFormat.toLowerCase()] ||
          (sourceFormat.toLowerCase() === "jpg" &&
            (fileExtension === "jpeg" || fileType === "image/jpeg"));

        if (!isValidFormat) {
          setError(
            `Please select a ${sourceFormat.toUpperCase()} file. Selected file appears to be ${fileExtension.toUpperCase()}.`
          );
          setFile(null);
          return;
        }
      }

      setFile(selectedFile);
      setError("");
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);
    setError("");

    const formData = new FormData();

    formData.append("uploaded_pdf", file);

    formData.append("convertTo", targetFormat);

    const apiEndpoint = endpoint;

    console.log(`Attempting to call endpoint: ${apiEndpoint}`);
    console.log(
      `Source format: ${sourceFormat}, Target format: ${targetFormat}`
    );

    try {
      const res = await axios.post(
        `http://localhost:8888/${apiEndpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );
      console.log(res);

      const {
        success,
        error: apiError,
        download_link,
        input_filename,
      } = res.data;

      if (!success) {
        throw new Error(apiError || "Conversion failed");
      }

      if (!download_link) {
        throw new Error("Download link missing in response");
      }

      const downloadLinks = Array.isArray(download_link)
        ? download_link
        : [download_link];

      setStatus("success");
      setUploadProgress(100);

      for (let i = 0; i < downloadLinks.length; i++) {
        const link = downloadLinks[i];

        try {
          const cleanLink = link.startsWith("/") ? link.substring(1) : link;
          const downloadUrl = `http://localhost:8888/${cleanLink}`;

          console.log(`Downloading from: ${downloadUrl}`);

          const fileResponse = await axios.get(downloadUrl, {
            responseType: "blob",
          });

          let mimeType, fileExtension, fileName;

          if (targetFormat === "docx") {
            mimeType =
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            fileExtension = "docx";
            fileName =
              link.split("/").pop() || `converted_document.${fileExtension}`;
          } else if (targetFormat === "images" && endpoint === "pdf-convert") {
            mimeType = "image/jpeg";
            fileExtension = "jpg";
            fileName =
              link.split("/").pop() ||
              `converted_page_${i + 1}.${fileExtension}`;
          } else {
            mimeType =
              MIME_TYPES[targetFormat.toLowerCase()] || `image/${targetFormat}`;
            fileExtension = targetFormat;
            fileName =
              link.split("/").pop() || `converted_file.${fileExtension}`;
          }

          const blob = new Blob([fileResponse.data], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (downloadError) {
          console.error(`Failed to download file ${i + 1}:`, downloadError);
          setError(
            `Failed to download converted file ${i + 1}: ${
              downloadError.message
            }`
          );
        }
      }
    } catch (error) {
      console.error("Upload or conversion failed:", error);
      setStatus("error");
      setUploadProgress(0);

      if (error.response) {
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Conversion failed";
        setError(`Server error (${error.response.status}): ${errorMessage}`);
      } else if (error.request) {
        setError("Network error: Unable to reach the server");
      } else {
        setError(
          error.message || "An unexpected error occurred during conversion"
        );
      }
    }
  }

  const getAcceptAttribute = () => {
    if (sourceFormat === "pdf" || endpoint === "pdf-convert") {
      return "application/pdf,.pdf";
    } else if (sourceFormat === "image" && acceptedFormats.length > 0) {
      return acceptedFormats
        .map((format) => {
          if (format === "jpg") return "image/jpeg,.jpg,.jpeg";
          return `image/${format},.${format}`;
        })
        .join(",");
    } else if (sourceFormat && sourceFormat !== "image") {
      if (sourceFormat === "jpg") return "image/jpeg,.jpg,.jpeg";
      return `image/${sourceFormat},.${sourceFormat}`;
    }
    return "image/*";
  };

  const getFileInputHint = () => {
    if (sourceFormat === "pdf" || endpoint === "pdf-convert") {
      return `Select a PDF file to convert to ${targetFormat.toUpperCase()}`;
    } else if (sourceFormat === "image" && acceptedFormats.length > 0) {
      return `Select an image file (${acceptedFormats
        .join(", ")
        .toUpperCase()}) to convert to ${targetFormat.toUpperCase()}`;
    } else if (sourceFormat && sourceFormat !== "image") {
      return `Select a ${sourceFormat.toUpperCase()} file to convert to ${targetFormat.toUpperCase()}`;
    }
    return `Select a file to convert to ${targetFormat.toUpperCase()}`;
  };

  const getConversionDescription = () => {
    if (endpoint === "pdf-convert") {
      if (targetFormat === "docx") {
        return "PDF → DOCX";
      } else if (targetFormat === "images") {
        return "PDF → Images";
      }
    }
    return `${
      sourceFormat?.toUpperCase() || "File"
    } → ${targetFormat.toUpperCase()}`;
  };

  return (
    <div className="uploader-container">
      <div className="converter-info">
        <h3>File Converter</h3>
        <p>
          <strong>Converting:</strong> {getConversionDescription()}
        </p>
        {converterType && (
          <p>
            <strong>Converter:</strong> {converterType}
          </p>
        )}
        {acceptedFormats.length > 0 && (
          <p>
            <strong>Accepted formats:</strong>{" "}
            {acceptedFormats.join(", ").toUpperCase()}
          </p>
        )}
      </div>

      <div className="file-input-wrapper">
        <input
          type="file"
          onChange={handleFileChange}
          accept={getAcceptAttribute()}
        />
        <p className="file-input-hint">{getFileInputHint()}</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {file && (
        <div className="file-details">
          <h4>File Details:</h4>
          <p>
            <strong>File name:</strong> {file.name}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
          <p>
            <strong>Type:</strong> {file.name.split(".").pop().toUpperCase()}
          </p>
          <p>
            <strong>Will convert to:</strong> {targetFormat.toUpperCase()}
          </p>
        </div>
      )}

      {status === "uploading" && (
        <div className="progress-wrapper">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="progress-text">Converting... {uploadProgress}%</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <button
          className="upload-button"
          onClick={handleFileUpload}
          disabled={!!error}
        >
          Convert to {targetFormat.toUpperCase()}
        </button>
      )}

      {status === "success" && (
        <div className="success-message">
          <p className="success-text">✅ File converted successfully!</p>
          <p>
            Your converted {targetFormat.toUpperCase()} file(s) have been
            downloaded.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="error-message">
          <p className="error-text">❌ Conversion failed</p>
          <p>{error || "Please try again with a different file."}</p>
        </div>
      )}
    </div>
  );
}
