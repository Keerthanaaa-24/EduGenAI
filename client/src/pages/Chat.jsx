import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";

import {
  getDocuments,
} from "../services/documentService";

function Chat() {
  const [documents,
    setDocuments] =
    useState([]);

  const [selectedDoc,
    setSelectedDoc] =
    useState("");

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs =
    async () => {
      const result =
        await getDocuments();

      setDocuments(
        result.documents
      );
    };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="page-title">
          AI Chat
        </h1>

        <select
          value={selectedDoc}
          onChange={(e) =>
            setSelectedDoc(
              e.target.value
            )
          }
        >
          <option value="">
            Select Document
          </option>

          {documents.map(
            (doc) => (
              <option
                key={doc._id}
                value={doc._id}
              >
                {doc.fileName}
              </option>
            )
          )}
        </select>

        {selectedDoc && (
          <ChatWindow
            documentId={
              selectedDoc
            }
          />
        )}
      </div>
    </>
  );
}

export default Chat;