import React, { useState } from "react";

const DragFile = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...e.dataTransfer.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: "2px dashed #aaa",
        padding: "40px",
        borderRadius: "10px",
        textAlign: "center",
        background: "#f9f9f9",
      }}
    >
      <p>Drag and drop files here, or</p>
      <input type="file" multiple onChange={handleFileChange} />
      <ul style={{ marginTop: "20px" }}>
        {files.length > 0 &&
          Array.from(files).map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
      </ul>
    </div>
  );
};

export default DragFile;
