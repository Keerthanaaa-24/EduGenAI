import { useState } from "react";
import { askQuestion } from "../services/chatService";

function ChatWindow({ documentId }) {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleAsk = async () => {
    /*
    Validate question
    */

    if (!question.trim()) {
      alert(
        "Please enter a question."
      );
      return;
    }

    /*
    Validate document
    */

    if (!documentId) {
      alert(
        "Please select a document first."
      );
      return;
    }

    try {
      setLoading(true);

      setAnswer("");
      setErrorMessage("");

      console.log(
        "========== FRONTEND CHAT =========="
      );

      console.log(
        "Document ID:",
        documentId
      );

      console.log(
        "Question:",
        question
      );

      /*
      Call backend
      */

      const result =
        await askQuestion(
          documentId,
          question.trim()
        );

      console.log(
        "Chat API Response:",
        result
      );

      /*
      Make sure backend returned
      an answer
      */

      if (
        !result ||
        !result.answer
      ) {
        throw new Error(
          "The AI did not return an answer."
        );
      }

      /*
      Display answer
      */

      setAnswer(
        result.answer
      );

    } catch (error) {

      console.error(
        "========== FRONTEND CHAT ERROR =========="
      );

      console.error(
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      /*
      Get the actual backend
      error message safely
      */

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to get AI response.";

      setErrorMessage(
        message
      );

      alert(message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="card">

      <textarea
        rows="5"
        placeholder="Ask a question about your document..."
        value={question}
        disabled={loading}
        onChange={(e) =>
          setQuestion(
            e.target.value
          )
        }
      />

      <button
        onClick={handleAsk}
        disabled={
          loading ||
          !question.trim()
        }
        style={{
          marginTop: "15px",
        }}
      >
        {loading
          ? "Thinking..."
          : "Ask AI"}
      </button>

      {errorMessage && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background:
              "#fee2e2",
            color:
              "#b91c1c",
            borderRadius:
              "8px",
          }}
        >
          <strong>
            Error:
          </strong>{" "}
          {errorMessage}
        </div>
      )}

      {answer && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background:
              "#f5f3ff",
            borderRadius:
              "10px",
            lineHeight:
              "1.6",
          }}
        >

          <h3>
            🤖 AI Answer
          </h3>

          <p
            style={{
              whiteSpace:
                "pre-wrap",
            }}
          >
            {answer}
          </p>

        </div>
      )}

    </div>
  );
}

export default ChatWindow;