import {
  useEffect,
  useState,
} from "react";

import jsPDF from "jspdf";

import Navbar from "../components/Navbar";
import LanguageSelector from "../components/LanguageSelector";

import {
  getDocuments,
} from "../services/documentService";

import {
  generateSummary,
} from "../services/summaryService";

function Summary() {
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
    summary,
    setSummary,
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
  GENERATE SUMMARY
  ==========================================
  */

  const handleGenerate = async () => {
    if (!selectedDoc) {
      alert(
        "Please select a document."
      );

      return;
    }

    try {
      setLoading(true);

      setSummary("");

      const result =
        await generateSummary(
          selectedDoc,
          language
        );

      setSummary(
        result.summary || ""
      );

    } catch (error) {
      console.error(
        "Summary Generation Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Summary generation failed."
      );

    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================
  DOWNLOAD SUMMARY AS PDF
  ==========================================
  */

  const downloadSummaryPDF = () => {
    if (!summary) {
      alert(
        "Please generate a summary first."
      );

      return;
    }

    try {
      /*
      Create PDF
      */

      const pdf =
        new jsPDF();

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 15;

      const contentWidth =
        pageWidth -
        margin * 2;

      let y = 20;

      /*
      Find selected document
      */

      const selectedDocument =
        documents.find(
          (doc) =>
            doc._id ===
            selectedDoc
        );

      /*
      ======================================
      PAGE SPACE CHECK
      ======================================
      */

      const checkPageSpace = (
        height = 10
      ) => {
        if (
          y + height >
          pageHeight - 20
        ) {
          pdf.addPage();

          y = 20;
        }
      };

      /*
      ======================================
      TITLE
      ======================================
      */

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(20);

      pdf.text(
        "EduGen AI - Smart Summary",
        pageWidth / 2,
        y,
        {
          align: "center",
        }
      );

      y += 15;

      /*
      ======================================
      DOCUMENT INFORMATION
      ======================================
      */

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(11);

      if (
        selectedDocument
      ) {
        const documentName =
          selectedDocument.fileName ||
          "Study Material";

        const documentLines =
          pdf.splitTextToSize(
            `Document: ${documentName}`,
            contentWidth
          );

        documentLines.forEach(
          (line) => {
            checkPageSpace(8);

            pdf.text(
              line,
              margin,
              y
            );

            y += 6;
          }
        );
      }

      checkPageSpace(8);

      pdf.text(
        `Language: ${language}`,
        margin,
        y
      );

      y += 10;

      /*
      ======================================
      SEPARATOR
      ======================================
      */

      pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 12;

      /*
      ======================================
      SUMMARY HEADING
      ======================================
      */

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(15);

      pdf.text(
        "Generated Revision Notes",
        margin,
        y
      );

      y += 10;

      /*
      ======================================
      SUMMARY CONTENT
      ======================================
      */

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(10.5);

      /*
      Split summary into paragraphs
      */

      const paragraphs =
        summary.split(/\n+/);

      paragraphs.forEach(
        (paragraph) => {
          const cleanText =
            paragraph.trim();

          if (!cleanText) {
            y += 4;
            return;
          }

          /*
          Handle markdown headings
          */

          let text =
            cleanText;

          let isHeading =
            false;

          if (
            text.startsWith("#")
          ) {
            text =
              text.replace(
                /^#+\s*/,
                ""
              );

            isHeading = true;
          }

          /*
          Handle bullet points
          */

          if (
            text.startsWith("- ")
          ) {
            text =
              "• " +
              text.substring(2);
          }

          if (
            text.startsWith("* ")
          ) {
            text =
              "• " +
              text.substring(2);
          }

          /*
          Heading styling
          */

          if (isHeading) {
            pdf.setFont(
              "helvetica",
              "bold"
            );

            pdf.setFontSize(13);

            y += 4;
          } else {
            pdf.setFont(
              "helvetica",
              "normal"
            );

            pdf.setFontSize(10.5);
          }

          /*
          Wrap long text
          */

          const lines =
            pdf.splitTextToSize(
              text,
              contentWidth
            );

          lines.forEach(
            (line) => {
              checkPageSpace(7);

              pdf.text(
                line,
                margin,
                y
              );

              y +=
                isHeading
                  ? 7
                  : 5.5;
            }
          );

          y +=
            isHeading
              ? 3
              : 2;
        }
      );

      /*
      ======================================
      FOOTER ON EVERY PAGE
      ======================================
      */

      const totalPages =
        pdf.internal.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pdf.setPage(page);

        pdf.setFont(
          "helvetica",
          "italic"
        );

        pdf.setFontSize(8);

        pdf.text(
          `EduGen AI • Summary Report • Page ${page} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          {
            align: "center",
          }
        );
      }

      /*
      ======================================
      FILE NAME
      ======================================
      */

      let fileName =
        "Study-Summary";

      if (
        selectedDocument &&
        selectedDocument.fileName
      ) {
        fileName =
          selectedDocument.fileName
            .replace(
              /\.pdf$/i,
              ""
            )
            .replace(
              /[^a-z0-9]/gi,
              "-"
            );
      }

      /*
      ======================================
      DOWNLOAD
      ======================================
      */

      pdf.save(
        `EduGen-AI-${fileName}-Summary.pdf`
      );

    } catch (error) {
      console.error(
        "PDF Generation Error:",
        error
      );

      alert(
        "Failed to create the PDF."
      );
    }
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
            GENERATE SUMMARY CARD
        ================================== */}

        <div className="module-card">

          <h1>
            📄 AI Smart Summary
          </h1>

          <p>
            Generate complete
            revision notes from
            your uploaded PDF in
            your preferred language.
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

          {/* LANGUAGE */}

          <div
            style={{
              marginTop:
                "20px",
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
              !selectedDoc
            }
            style={{
              width:
                "100%",
              marginTop:
                "20px",
            }}
          >

            {loading
              ? "Generating Summary..."
              : "Generate Summary"}

          </button>

        </div>

        {/* ==================================
            GENERATED SUMMARY
        ================================== */}

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
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {summary}
            </div>

            {/* =================================
                DOWNLOAD BUTTON
            ================================= */}

            <button
              onClick={
                downloadSummaryPDF
              }
              style={{
                width:
                  "100%",
                marginTop:
                  "20px",
              }}
            >
              📥 Download Summary as PDF
            </button>

          </div>

        )}

      </div>
    </>
  );
}

export default Summary;