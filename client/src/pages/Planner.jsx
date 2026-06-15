import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import {
  getDocuments,
} from "../services/documentService";

import {
  generatePlan,
} from "../services/plannerService";

function Planner() {

  const [documents,
    setDocuments] =
    useState([]);

  const [selectedDoc,
    setSelectedDoc] =
    useState("");

  const [subject,
    setSubject] =
    useState("");

  const [examDate,
    setExamDate] =
    useState("");

  const [hours,
    setHours] =
    useState("");

  const [plan,
    setPlan] =
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

      if (
        !subject ||
        !examDate ||
        !hours ||
        !selectedDoc
      ) {

        alert(
          "Fill all fields"
        );

        return;
      }

      try {

        setLoading(true);

        const result =
          await generatePlan(
            subject,
            examDate,
            hours,
            selectedDoc
          );

        setPlan(
          result.studyPlan.plan
        );

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Planner generation failed"
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
            📅 AI Study Planner
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

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) =>
              setSubject(
                e.target.value
              )
            }
          />

          <input
            type="date"
            value={examDate}
            onChange={(e) =>
              setExamDate(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Hours Per Day"
            value={hours}
            onChange={(e) =>
              setHours(
                e.target.value
              )
            }
          />

          <button
            onClick={
              handleGenerate
            }
          >
            {loading
              ? "Generating..."
              : "Generate Plan"}
          </button>

          {plan && (

            <div
              className="planner-output"
            >
              {plan}
            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Planner;