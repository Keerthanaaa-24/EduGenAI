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
  generatePlan,
} from "../services/plannerService";

function Planner() {
  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    selectedDoc,
    setSelectedDoc,
  ] = useState("");

  const [
    language,
    setLanguage,
  ] = useState("English");

  const [
    subject,
    setSubject,
  ] = useState("");

  const [
    days,
    setDays,
  ] = useState(7);

  const [
    hours,
    setHours,
  ] = useState(2);

  const [
    startTime,
    setStartTime,
  ] = useState("18:00");

  const [
    plan,
    setPlan,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
  ==========================================
  LOAD DOCUMENTS
  ==========================================
  */

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const result =
        await getDocuments();

      setDocuments(
        result.documents || []
      );

    } catch (error) {

      console.error(
        "Load Documents Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to load documents."
      );
    }
  };

  /*
  ==========================================
  GENERATE PLAN
  ==========================================
  */

  const handleGenerate = async () => {

    if (
      !selectedDoc ||
      !subject ||
      !days ||
      !hours ||
      !startTime
    ) {
      alert(
        "Please fill all fields."
      );

      return;
    }

    try {

      setLoading(true);

      setPlan("");

      const result =
        await generatePlan(
          subject,
          days,
          hours,
          startTime,
          selectedDoc,
          language
        );

      if (
        !result?.studyPlan?.plan
      ) {
        throw new Error(
          "No study plan was returned."
        );
      }

      setPlan(
        result.studyPlan.plan
      );

    } catch (error) {

      console.error(
        "Planner Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to generate study plan."
      );

    } finally {

      setLoading(false);

    }
  };

  /*
  ==========================================
  RESET PLAN
  ==========================================
  */

  const clearPlan = () => {
    setPlan("");
  };

  /*
  ==========================================
  UI
  ==========================================
  */

  return (
    <>
      <Navbar />

      <div className="container">

        {/* ==================================
            PLANNER FORM
        ================================== */}

        <div className="module-card">

          <h1>
            📅 AI Mini Study Planner
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Create a focused study schedule
            within one week using the main
            topics from your study material.
          </p>

          {/* DOCUMENT */}

          <label>
            Select Document
          </label>

          <select
            value={selectedDoc}
            onChange={(e) =>
              setSelectedDoc(
                e.target.value
              )
            }
            disabled={loading}
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

          {/* SUBJECT */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
            }}
          >
            Subject
          </label>

          <input
            type="text"
            placeholder="Example: Operating Systems"
            value={subject}
            onChange={(e) =>
              setSubject(
                e.target.value
              )
            }
            disabled={loading}
          />

          {/* NUMBER OF DAYS */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
            }}
          >
            Study Duration
          </label>

          <select
            value={days}
            onChange={(e) =>
              setDays(
                Number(
                  e.target.value
                )
              )
            }
            disabled={loading}
          >

            <option value={1}>
              1 Day
            </option>

            <option value={2}>
              2 Days
            </option>

            <option value={3}>
              3 Days
            </option>

            <option value={4}>
              4 Days
            </option>

            <option value={5}>
              5 Days
            </option>

            <option value={6}>
              6 Days
            </option>

            <option value={7}>
              7 Days
            </option>

          </select>

          <p
            style={{
              color: "#666",
              fontSize: "14px",
              marginTop: "6px",
            }}
          >
            Maximum study duration is 7 days.
          </p>

          {/* HOURS PER DAY */}

          <label
            style={{
              display: "block",
              marginTop: "15px",
            }}
          >
            Hours Per Day
          </label>

          <select
            value={hours}
            onChange={(e) =>
              setHours(
                Number(
                  e.target.value
                )
              )
            }
            disabled={loading}
          >

            <option value={1}>
              1 Hour
            </option>

            <option value={2}>
              2 Hours
            </option>

            <option value={3}>
              3 Hours
            </option>

            <option value={4}>
              4 Hours
            </option>

            <option value={5}>
              5 Hours
            </option>

            <option value={6}>
              6 Hours
            </option>

            <option value={8}>
              8 Hours
            </option>

          </select>

          {/* START TIME */}

          <label
            style={{
              display: "block",
              marginTop: "15px",
            }}
          >
            Study Start Time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(
                e.target.value
              )
            }
            disabled={loading}
          />

          {/* LANGUAGE */}

          <div
            style={{
              marginTop: "20px",
            }}
          >

            <LanguageSelector
              language={language}
              setLanguage={
                setLanguage
              }
            />

          </div>

          {/* GENERATE */}

          <button
            onClick={
              handleGenerate
            }
            disabled={
              loading ||
              !selectedDoc ||
              !subject
            }
            style={{
              width: "100%",
              marginTop: "20px",
            }}
          >

            {loading
              ? "Generating Mini Plan..."
              : "Generate Mini Plan"}

          </button>

        </div>

        {/* ==================================
            GENERATED PLAN
        ================================== */}

        {plan && (

          <div
            className="result-card"
            style={{
              marginTop: "30px",
            }}
          >

            <h2>
              📅 Your 7-Day Study Schedule
            </h2>

            <p
              style={{
                color: "#666",
              }}
            >
              Focus only on the main topics
              scheduled for each study session.
            </p>

            <div
              className="planner-output"
              style={{
                maxHeight: "700px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                marginTop: "20px",
              }}
            >
              {plan}
            </div>

            {/* CLEAR */}

            <button
              onClick={clearPlan}
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            >
              🔄 Create Another Plan
            </button>

          </div>

        )}

      </div>
    </>
  );
}

export default Planner;