import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDocuments } from "../services/documentService";
import {
  generateQuiz,
  submitQuizResult,
} from "../services/quizService";
import LanguageSelector from "../components/LanguageSelector";

function Quiz() {
  const [documents, setDocuments] =
    useState([]);

  const [selectedDoc,
    setSelectedDoc] =
    useState("");

  const [questions,
    setQuestions] =
    useState([]);

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  const [selectedAnswer,
    setSelectedAnswer] =
    useState("");

  const [score,
    setScore] =
    useState(0);

  const [loading,
    setLoading] =
    useState(false);

  const [quizStarted,
    setQuizStarted] =
    useState(false);

  const [quizFinished,
    setQuizFinished] =
    useState(false);

    const [language,
setLanguage] =
useState("English");

  const [showResult,
    setShowResult] =
    useState(false);

  const [isCorrect,
    setIsCorrect] =
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
          "Select a document first"
        );
        return;
      }

      try {

        setLoading(true);

        const result =
          await generateQuiz(
            selectedDoc
          );

        let quizData =
          result.quiz;

        if (
          typeof quizData ===
          "string"
        ) {
          quizData =
            JSON.parse(
              quizData
            );
        }

        setQuestions(
          quizData
        );

        setCurrentQuestion(0);
        setScore(0);

        setSelectedAnswer("");

        setQuizStarted(true);

        setQuizFinished(false);

      } catch (error) {

        console.log(error);

        alert(
          "Failed to generate quiz"
        );

      } finally {

        setLoading(false);

      }
    };

  const handleSubmitAnswer =
    () => {

      const current =
        questions[
          currentQuestion
        ];

      const correct =
        selectedAnswer ===
        current.answer;

      setIsCorrect(
        correct
      );

      if (correct) {
        setScore(
          (prev) =>
            prev + 1
        );
      }

      setShowResult(true);
    };

  const goToNextQuestion =
    async () => {

      setShowResult(false);

      setSelectedAnswer("");

      if (
        currentQuestion <
        questions.length - 1
      ) {

        setCurrentQuestion(
          (prev) =>
            prev + 1
        );

      } else {

        try {

          await submitQuizResult(
            selectedDoc,
            score,
            questions.length
          );

        } catch (error) {

          console.log(error);

        }

        setQuizFinished(
          true
        );
      }
    };

    <LanguageSelector
  language={language}
  setLanguage={setLanguage}
/>

  const getGrade =
    (percentage) => {

      if (
        percentage >= 90
      )
        return "O";

      if (
        percentage >= 80
      )
        return "A+";

      if (
        percentage >= 70
      )
        return "A";

      if (
        percentage >= 60
      )
        return "B";

      if (
        percentage >= 50
      )
        return "C";

      return "F";
    };

  const percentage =
    questions.length > 0
      ? (
          (score /
            questions.length) *
          100
        ).toFixed(2)
      : 0;

  return (
    <>
      <Navbar />

      <div className="container">

        {!quizStarted && (

          <div className="module-card">

            <h1>
              📝 AI Quiz Generator
            </h1>

            <select
              value={
                selectedDoc
              }
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
                    key={
                      doc._id
                    }
                    value={
                      doc._id
                    }
                  >
                    {
                      doc.fileName
                    }
                  </option>
                )
              )}

            </select>

            <button
              onClick={
                handleGenerate
              }
            >
              {loading
                ? "Generating..."
                : "Generate Quiz"}
            </button>

          </div>

        )}

        {quizStarted &&
          !quizFinished &&
          questions.length >
            0 && (

            <div className="module-card">

              <h2>
                Question{" "}
                {currentQuestion + 1}
                {" / "}
                {questions.length}
              </h2>

              <h3>
                {
                  questions[
                    currentQuestion
                  ].question
                }
              </h3>

              <div className="quiz-options">

                {questions[
                  currentQuestion
                ].options.map(
                  (
                    option,
                    index
                  ) => (

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
                        value={
                          option
                        }
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
                        {
                          String.fromCharCode(
                            65 +
                              index
                          )
                        }
                        . {option}
                      </span>

                    </label>

                  )
                )}

              </div>

              {showResult && (

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >

                  {isCorrect ? (

                    <div
                      style={{
                        color:
                          "green",
                        fontWeight:
                          "bold",
                      }}
                    >
                      ✅ Correct Answer
                    </div>

                  ) : (

                    <div
                      style={{
                        color:
                          "red",
                        fontWeight:
                          "bold",
                      }}
                    >
                      ❌ Wrong Answer

                      <br />

                      Correct Answer:
                      {" "}
                      {
                        questions[
                          currentQuestion
                        ].answer
                      }
                    </div>

                  )}

                </div>

              )}

              {!showResult ? (

                <button
                  onClick={
                    handleSubmitAnswer
                  }
                  disabled={
                    !selectedAnswer
                  }
                >
                  Submit Answer
                </button>

              ) : (

                <button
                  onClick={
                    goToNextQuestion
                  }
                >
                  {currentQuestion ===
                  questions.length -
                    1
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
              Score:
              {" "}
              {score}
              /
              {
                questions.length
              }
            </h2>

            <h2>
              Percentage:
              {" "}
              {percentage}%
            </h2>

            <h2>
              Grade:
              {" "}
              {getGrade(
                Number(
                  percentage
                )
              )}
            </h2>

          </div>

        )}

      </div>
    </>
  );
}

export default Quiz;
