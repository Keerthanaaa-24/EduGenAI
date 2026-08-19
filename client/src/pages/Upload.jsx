import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import UploadDocument from "../components/UploadDocument";

import {
  getDocuments,
  deleteDocument,
} from "../services/documentService";

function Upload() {
  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadDocuments =
    async () => {
      try {
        setLoading(true);

        const result =
          await getDocuments();

        setDocuments(
          result.documents || []
        );

      } catch (error) {
        console.error(
          "Failed to load documents:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadDocuments();
  }, []);

  /*
  Delete document
  */

  const handleDelete =
    async (documentId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this document? This cannot be undone."
        );

      if (!confirmed) {
        return;
      }

      try {

        await deleteDocument(
          documentId
        );

        /*
        Remove immediately
        from the screen
        */

        setDocuments(
          (previousDocuments) =>
            previousDocuments.filter(
              (document) =>
                document._id !==
                documentId
            )
        );

        alert(
          "Document deleted successfully."
        );

      } catch (error) {

        console.error(
          "Delete error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
          "Failed to delete document."
        );
      }
    };

  /*
  Upload completed
  */

  const handleUploadComplete =
    () => {
      loadDocuments();
    };

  return (
    <>
      <Navbar />

      <div className="container">

        <h1 className="page-title">
          Upload Notes
        </h1>

        <UploadDocument
          onUploadComplete={
            handleUploadComplete
          }
        />

        {/* SAVED DOCUMENTS */}

        <div
          className="module-card"
          style={{
            marginTop: "30px",
          }}
        >

          <h2>
            📚 My Documents
          </h2>

          {loading ? (

            <p>
              Loading documents...
            </p>

          ) : documents.length === 0 ? (

            <p
              style={{
                color: "#777",
              }}
            >
              No documents uploaded
              yet.
            </p>

          ) : (

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "12px",
                marginTop:
                  "20px",
              }}
            >

              {documents.map(
                (document) => (

                  <div
                    key={
                      document._id
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      padding:
                        "14px 16px",
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "10px",
                      background:
                        "#fff",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        minWidth: 0,
                      }}
                    >

                      <span
                        style={{
                          fontSize:
                            "24px",
                        }}
                      >
                        📄
                      </span>

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >

                        <strong>
                          {
                            document.fileName
                          }
                        </strong>

                        <div
                          style={{
                            fontSize:
                              "12px",
                            color:
                              "#888",
                            marginTop:
                              "4px",
                          }}
                        >
                          Uploaded{" "}
                          {document.createdAt
                            ? new Date(
                                document.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </div>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          document._id
                        )
                      }
                      style={{
                        background:
                          "#fee2e2",
                        color:
                          "#dc2626",
                        border:
                          "none",
                        borderRadius:
                          "8px",
                        padding:
                          "8px 12px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
                        marginLeft:
                          "12px",
                      }}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Upload;