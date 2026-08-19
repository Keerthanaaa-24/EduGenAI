import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LanguageSelector from "../components/LanguageSelector";

import { getDocuments } from "../services/documentService";

import {
  generateQuiz,
  submitQuizResult,
} from "../services/quizService";

function Quiz() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [language, setLanguage] = useState("English");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);

  const [loading, setLoading] = useState(false);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const result = await getDocuments();
      setDocuments(result.documents || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedDoc) {
      alert("Please select a document first.");
      return;
    }

    try {
      setLoading(true);

      const result = await generateQuiz(
        selectedDoc,
        language
      );

      console.log("Quiz API Response:", result);

      let quizData = result.quiz;

      // Gemini may return JSON inside a markdown code block.
      if (typeof quizData === "string") {
        quizData = quizData
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        quizData = JSON.parse(quizData);
      }

      if (!Array.isArray(quizData)) {
        throw new Error(
          "Invalid quiz format received."
        );
      }

      setQuestions(quizData);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer("");
      setQuizStarted(true);
      setQuizFinished(false);
      setShowResult(false);
      setIsCorrect(false);
    } catch (error) {
      console.error("Quiz Generation Error:", error);
      console.error(
        "Backend Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate quiz."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    const current = questions[currentQuestion];

    const correct =
      selectedAnswer === current.answer;

    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setShowResult(true);
  };

  const goToNextQuestion = async () => {
    const current = questions[currentQuestion];

    // Calculate final score correctly because React state
    // updates asynchronously.
    const finalScore =
      selectedAnswer === current.answer
        ? score + 1
        : score;

    setShowResult(false);
    setSelectedAnswer("");

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setScore(finalScore);

      setCurrentQuestion(
        (prev) => prev + 1
      );

      return;
    }

    try {
      await submitQuizResult(
        selectedDoc,
        finalScore,
        questions.length
      );
    } catch (error) {
      console.error(
        "Quiz Result Error:",
        error
      );
    }

    setScore(finalScore);
    setQuizFinished(true);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "O";
    if (percentage >= 80) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B+";
    if (percentage >= 50) return "B";
    if (percentage >= 40) return "C";

    return "F";
  };

  const percentage =
    questions.length > 0
      ? (
          (score / questions.length) *
          100
        ).toFixed(2)
      : "0.00";

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <>
      <Navbar />

      <div className="container">
        {!quizStarted && (
          <div className="module-card">
            <h1>
              📝 AI Quiz Generator
            </h1>

            <p
              style={{
                color: "#666",
                marginBottom: "20px",
              }}
            >
              Generate an AI-powered quiz
              from your uploaded study
              material.
            </p>

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
            >
              <option value="">
                -- Select Document --
              </option>

              {documents.map((doc) => (
                <option
                  key={doc._id}
                  value={doc._id}
                >
                  {doc.fileName}
                </option>
              ))}
            </select>

            <br />
            <br />

            <LanguageSelector
              language={language}
              setLanguage={setLanguage}
            />

            <br />

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: "100%",
              }}
            >
              {loading
                ? "Generating Quiz..."
                : "Generate Quiz"}
            </button>
          </div>
        )}

        {quizStarted &&
          !quizFinished &&
          questions.length > 0 && (
            <div className="module-card">
              <h2>
                Question{" "}
                {currentQuestion + 1} /{" "}
                {questions.length}
              </h2>

              <div
                style={{
                  marginBottom: "20px",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                {
                  questions[
                    currentQuestion
                  ].question
                }
              </div>

              <div className="quiz-options">
                {questions[
                  currentQuestion
                ].options.map(
                  (option, index) => (
                    <label
                      key={index}
                      className={`quiz-option ${
                        selectedAnswer ===
                        option
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={
                          selectedAnswer ===
                          option
                        }
                        onChange={() =>
                          setSelectedAnswer(
                            option
                          )
                        }
                      />

                      <span>
                        {String.fromCharCode(
                          65 + index
                        )}
                        . {option}
                      </span>
                    </label>
                  )
                )}
              </div>

              {showResult && (
                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  {isCorrect ? (
                    <div
                      style={{
                        color: "green",
                        fontWeight:
                          "bold",
                        fontSize:
                          "18px",
                      }}
                    >
                      ✅ Correct Answer
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "red",
                        fontWeight:
                          "bold",
                        fontSize:
                          "18px",
                      }}
                    >
                      ❌ Wrong Answer
                      <br />
                      Correct Answer:
                      <br />
                      <strong>
                        {
                          questions[
                            currentQuestion
                          ].answer
                        }
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {!showResult ? (
                <button
                  onClick={
                    handleSubmitAnswer
                  }
                  disabled={!selectedAnswer}
                  style={{
                    marginTop: "25px",
                    width: "100%",
                  }}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={
                    goToNextQuestion
                  }
                  style={{
                    marginTop: "25px",
                    width: "100%",
                  }}
                >
                  {currentQuestion ===
                  questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                </button>
              )}
            </div>
          )}

        {quizFinished && (
          <div className="module-card">
            <h1>
              🎉 Quiz Completed
            </h1>

            <h2>
              Your Score
            </h2>

            <h1
              style={{
                color: "#4CAF50",
                fontSize: "50px",
              }}
            >
              {score} / {questions.length}
            </h1>

            <h2>
              Percentage: {percentage}%
            </h2>

            <h2>
              Grade:{" "}
              {getGrade(
                Number(percentage)
              )}
            </h2>

            <button
              style={{
                marginTop: "30px",
              }}
              onClick={resetQuiz}
            >
              Generate Another Quiz
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;