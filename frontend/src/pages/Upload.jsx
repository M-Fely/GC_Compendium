import { useState } from "react";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("docs", file);

    try {
      const response = await fetch("http://localhost:3000/upload/file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Upload successful!");
        console.log("Clicked");
      } else {
        setMessage("Upload failed");
      }
      console.log("I got clicnked");
    } catch (error) {
      console.error("Error: ", error);
      setMessage("Error uploading file");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Documents (Admin Only)</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <br />

      <button onClick={handleUpload}>Upload</button>

      <p>{message}</p>
    </div>
  );
}
export default Upload;
