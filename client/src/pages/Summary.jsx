import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import LanguageSelector from "../components/LanguageSelector";

import {
  getDocuments,
} from "../services/documentService";

import {
  generateSummary,
} from "../services/summaryService";

function Summary() {

  const [documents,
    setDocuments] =
    useState([]);

  const [selectedDoc,
    setSelectedDoc] =
    useState("");

  const [language,
    setLanguage] =
    useState("English");

  const [summary,
    setSummary] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments =
    async () => {
      try {

        const result =
          await getDocuments();

        setDocuments(
          result.documents || []
        );

      } catch (error) {

        console.log(error);

      }
    };

  const handleGenerate =
    async () => {

      if (!selectedDoc) {

        alert(
          "Please select a document."
        );

        return;
      }

      try {

        setLoading(true);

        const result =
          await generateSummary(
            selectedDoc,
            language
          );

        setSummary(
          result.summary
        );

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Summary generation failed."
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="module-card">

          <h1>
            📄 AI Smart Summary
          </h1>

          <p>
            Generate complete
            revision notes from
            your uploaded PDF in
            your preferred
            language.
          </p>

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

          <LanguageSelector
            language={language}
            setLanguage={
              setLanguage
            }
          />

          <button
            onClick={
              handleGenerate
            }
          >
            {loading
              ? "Generating Summary..."
              : "Generate Summary"}
          </button>

        </div>

        {summary && (

          <div
            className="result-card"
            style={{
              marginTop:
                "30px",
            }}
          >

            <h2>
              📚 Generated Revision Notes
            </h2>

            <div
              className="planner-output"
              style={{
                maxHeight:
                  "700px",
                overflowY:
                  "auto",
              }}
            >
              {summary}
            </div>

          </div>

        )}

      </div>

    </>
  );
}
export default Summary;
