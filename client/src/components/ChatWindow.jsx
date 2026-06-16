import {
  useState,
} from "react";
import {
  askQuestion,
} from "../services/chatService";

function ChatWindow({
  documentId,
}) {
  const [question,
    setQuestion] =
    useState("");

  const [answer,
    setAnswer] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const handleAsk =
    async () => {
      if (!question)
        return;

      try {
        setLoading(true);

        const result =
          await askQuestion(
            documentId,
            question
          );

        setAnswer(
          result.answer
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="card">
      <textarea
        rows="5"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) =>
          setQuestion(
            e.target.value
          )
        }
      />

      <button
        onClick={handleAsk}
      >
        {loading
          ? "Thinking..."
          : "Ask AI"}
      </button>

      {answer && (
        <div
          style={{
            marginTop:
              "20px",
          }}
        >
          <h3>
            Answer
          </h3>

          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
