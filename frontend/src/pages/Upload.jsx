import { useState } from "react";
import "./Upload.css";
import { useEffect } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* useEffect(() => {
    fetchUploadedFiles();
  }, []); */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/files`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched  files: ", data);
        setUploadedFiles(data);
      }
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchUploadedFiles();
    }
  }, [user?.token]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("Please upload PDF files only.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    if (!user?.token) {
      setMessage("Authentication error. Please log in again");
      return;
    }

    const formData = new FormData();
    formData.append("docs", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Upload successful!");
        setFile(null);
        fetchUploadedFiles();
        console.log("Clicked");
      } else {
        setMessage(data.error || data.message || "Upload failed");
      }
      console.log("I got clicnked");
    } catch (error) {
      console.error("Error: ", error);
      setMessage(error.message || "Error uploading file");
    }
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/file/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.ok) {
        setUploadedFiles(uploadedFiles.filter((f) => f._id !== fileId));
        setMessage("File deleted successfully.");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file: ", error);
      setMessage("Error deleting file");
    }
  };

  return (
    <div className="uploadHolder">
      {message && (
        <div className="toastNotification">
          <span>{message}</span>
        </div>
      )}
      <div className="uploadHeader">
        <div>
          <h2>Upload files</h2>
          <p>Only official Gordon College documents should be uploaded here.</p>
          <p>PDF files ONLY.</p>
        </div>
      </div>

      <div className="mainContent">
        <div
          className={`drop ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFiles = e.dataTransfer.files[0];
            handleFileChange(droppedFiles);
          }}
        >
          <p>Choose a file or drag & drop it here.</p>
          <label className="browseBtn">
            Browse File
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e.target.files[0])}
              hidden
            />
          </label>
          {file && <p className="fileNameDisplay">Selected: {file.name}</p>}
        </div>

        <div className="fileList">
          <h3>Uploaded files</h3>

          <div className="uploadedFilesContainer">
            {uploadedFiles.length === 0 ? (
              <div className="noFiles">No files uploaded yet.</div>
            ) : (
              uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile._id || uploadedFile._id}
                  className="fileItem"
                >
                  <div className="fileInfo">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      /* width="20"
                      height="20" */
                      viewBox="0 0 24 24"
                      /* fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round" */
                      className="pdfIcon"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                    <span
                      className="uploadedFileName"
                      title={uploadedFile.fileName}
                    >
                      {uploadedFile.fileName}
                    </span>
                  </div>
                  <button
                    className="deleteBtn"
                    onClick={() =>
                      handleDelete(uploadedFile._id || uploadedFile._id)
                    }
                    title="Delete File"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      /* x="0px"
                      y="0px"
                      width="20"
                      height="20" */
                      viewBox="0 0 24 24"
                    >
                      <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <button className="uploadBtn" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
      {/*       {message && <p className="uploadMessage">{message}</p>} */}
    </div>
  );
}

export default Upload;
