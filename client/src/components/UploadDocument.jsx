import { useState } from "react";
import { uploadDocument } from "../services/documentService";

function UploadDocument() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] =
    useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }
    try {
      setLoading(true);

      await uploadDocument(file);

      alert(
        "File uploaded successfully!"
      );

      setFile(null);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          error.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-icon">
        ☁️
      </div>

      <h2>
        Upload Study Material
      </h2>

      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      {file && (
        <div className="file-info">
          {file.name}
        </div>
      )}

      <button
        onClick={handleUpload}
      >
        {loading
          ? "Uploading..."
          : "Upload File"}
      </button>
    </div>
  );
}

export default UploadDocument;
