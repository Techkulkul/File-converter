import axios from "axios";
import { useState } from "react";
import "../css/FileUpload.css"; // Import custom CSS

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  //   async function handleFileUpload() {
  //     if (!file) return;

  //     setStatus("uploading");
  //     setUploadProgress(0);

  //     const formData = new FormData();
  //     formData.append("uploaded_img", file);
  //     formData.append("convertTo", "png");

  //     try {
  //       const res = await axios.post(
  //         "http://localhost:8888/img-convert",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //           onUploadProgress: (progressEvent) => {
  //             const progress = progressEvent.total
  //               ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
  //               : 0;
  //             setUploadProgress(progress);
  //           },
  //         }
  //       );

  //       setStatus("success");
  //       setUploadProgress(100);

  //       console.log(123, res);
  //       const downloadLink = res.data?.downloadLink;
  //       if (downloadLink) {
  //         const a = document.createElement("a");
  //         a.href = "http://localhost:8888" + downloadLink;
  //         a.download = res.data.filename + ".png";
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);

  //         // const i = document.createElement("img");
  //         // i.src = "localhost:8888" + downloadLink;
  //         // document.body.appendChild(i);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setStatus("error");
  //       setUploadProgress(0);
  //     }
  //   }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("uploaded_img", file);
    formData.append("convertTo", "bmp");

    try {
      // Step 1: Upload file and get download link
      const res = await axios.post(
        "http://localhost:8888/img-convert",
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

      const { downloadLink, convertedFilename } = res.data;

      if (!downloadLink) {
        throw new Error("Download link missing in response");
      }

      // Step 2: Download converted image from download link
      const imageResponse = await axios.get(
        "http://localhost:8888" + downloadLink,
        {
          responseType: "blob",
        }
      );

      setStatus("success");
      setUploadProgress(100);

      // Step 3: Create download link and trigger it
      const blob = new Blob([imageResponse.data], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = convertedFilename || "converted_image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Cleanup
    } catch (error) {
      console.error("Upload or download failed:", error);
      setStatus("error");
      setUploadProgress(0);
    }
  }

  return (
    <div className="uploader-container">
      <input type="file" onChange={handleFileChange} />

      {file && (
        <div className="file-details">
          <p>
            <strong>File name:</strong> {file.name}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
          <p>
            <strong>Type:</strong> {file.type}
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
          <p className="progress-text">{uploadProgress}% uploaded</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <button className="upload-button" onClick={handleFileUpload}>
          Upload
        </button>
      )}

      {status === "success" && (
        <p className="success-text">File uploaded successfully!</p>
      )}

      {status === "error" && (
        <p className="error-text">Upload failed. Please try again.</p>
      )}
    </div>
  );
}
