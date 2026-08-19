import { useState } from "react";
import { uploadDocument } from "../services/documentService";

function UploadDocument({
  onUploadComplete,
}) {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleUpload =
    async () => {

      if (!file) {
        alert(
          "Please select a PDF file."
        );
        return;
      }

      try {

        setLoading(true);

        const result =
          await uploadDocument(
            file
          );

        alert(
          result.message ||
          "File uploaded successfully!"
        );

        /*
        Clear selected file
        */

        setFile(null);

        /*
        Tell Upload.jsx to
        refresh the document list
        */

        if (
          onUploadComplete
        ) {
          onUploadComplete();
        }

      } catch (error) {

        console.error(
          "Upload Error:",
          error
        );

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

  const handleFileChange =
    (event) => {

      const selectedFile =
        event.target.files?.[0];

      if (!selectedFile) {
        return;
      }

      /*
      Backend currently supports
      PDF files only.
      */

      const extension =
        selectedFile.name
          .split(".")
          .pop()
          ?.toLowerCase();

      if (
        extension !== "pdf"
      ) {

        alert(
          "Only PDF files are currently supported."
        );

        event.target.value = "";

        setFile(null);

        return;
      }

      setFile(
        selectedFile
      );
    };

  return (
    <div className="upload-card">

      <div className="upload-icon">
        ☁️
      </div>

      <h2>
        Upload Study Material
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "15px",
        }}
      >
        Upload your PDF study
        material to use it with
        AI Tutor, Quiz, Summary
        and Study Planner.
      </p>

      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={
          handleFileChange
        }
        disabled={loading}
      />

      {file && (

        <div
          className="file-info"
          style={{
            marginTop: "15px",
          }}
        >
          📄{" "}
          {file.name}
        </div>

      )}

      <button
        onClick={handleUpload}
        disabled={
          loading ||
          !file
        }
        style={{
          marginTop: "15px",
        }}
      >
        {loading
          ? "Uploading..."
          : "Upload File"}
      </button>

    </div>
  );
}

export default UploadDocument;