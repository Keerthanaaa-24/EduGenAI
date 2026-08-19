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
  generateQuiz,
  submitQuizResult,
} from "../services/quizService";

function Quiz() {
  /*
  ==================================================
  DOCUMENTS
  ==================================================
  */

  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [
    selectedDoc,
    setSelectedDoc,
  ] = useState("");

  /*
  ==================================================
  QUIZ SETTINGS
  ==================================================
  */

  const [
    language,
    setLanguage,
  ] = useState("English");

  const [
    numberOfQuestions,
    setNumberOfQuestions,
  ] = useState(5);

  /*
  ==================================================
  QUIZ DATA
  ==================================================
  */

  const [
    questions,
    setQuestions,
  ] = useState([]);

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  /*
  ==================================================
  USER ANSWERS

  Example:

  {
    0: "Option A",
    1: "Option C"
  }
  ==================================================
  */

  const [
    userAnswers,
    setUserAnswers,
  ] = useState({});

  /*
  ==================================================
  SCORE
  ==================================================
  */

  const [
    score,
    setScore,
  ] = useState(0);

  /*
  ==================================================
  LOADING
  ==================================================
  */

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
  ==================================================
  QUIZ STATES
  ==================================================
  */

  const [
    quizStarted,
    setQuizStarted,
  ] = useState(false);

  const [
    quizFinished,
    setQuizFinished,
  ] = useState(false);

  /*
  ==================================================
  LOAD DOCUMENTS
  ==================================================
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
        "Failed to load documents:",
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
  ==================================================
  GENERATE QUIZ
  ==================================================
  */

  const handleGenerate = async () => {
    if (!selectedDoc) {
      alert(
        "Please select a document first."
      );
      return;
    }

    try {
      setLoading(true);

      /*
      Clear previous quiz
      */

      setQuestions([]);
      setUserAnswers({});
      setScore(0);
      setCurrentQuestion(0);
      setQuizFinished(false);

      /*
      Generate quiz
      */

      const result =
        await generateQuiz(
          selectedDoc,
          language,
          Number(numberOfQuestions)
        );

      console.log(
        "Quiz API Response:",
        result
      );

      let quizData =
        result.quiz;

      /*
      If backend returns a string,
      clean and parse it.
      */

      if (
        typeof quizData === "string"
      ) {
        quizData =
          quizData
            .replace(
              /```json/gi,
              ""
            )
            .replace(
              /```/g,
              ""
            )
            .trim();

        /*
        Extract JSON array
        */

        const start =
          quizData.indexOf("[");

        const end =
          quizData.lastIndexOf("]");

        if (
          start !== -1 &&
          end !== -1 &&
          end > start
        ) {
          quizData =
            quizData.substring(
              start,
              end + 1
            );
        }

        quizData =
          JSON.parse(
            quizData
          );
      }

      /*
      Validate quiz
      */

      if (
        !Array.isArray(quizData)
      ) {
        throw new Error(
          "Invalid quiz format received from server."
        );
      }

      if (
        quizData.length === 0
      ) {
        throw new Error(
          "No questions were generated."
        );
      }

      /*
      Start quiz
      */

      setQuestions(
        quizData
      );

      setCurrentQuestion(0);

      setUserAnswers({});

      setScore(0);

      setQuizStarted(true);

      setQuizFinished(false);

    } catch (error) {
      console.error(
        "Quiz Generation Error:",
        error
      );

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

  /*
  ==================================================
  SELECT ANSWER
  ==================================================
  */

  const handleSelectAnswer = (
    option
  ) => {
    setUserAnswers(
      (previous) => ({
        ...previous,
        [currentQuestion]:
          option,
      })
    );
  };

  /*
  ==================================================
  SUBMIT ANSWER

  IMPORTANT:
  NO CORRECT ANSWER IS SHOWN HERE.
  NO SCORE IS SHOWN HERE.
  ==================================================
  */

  const handleSubmitAnswer = async () => {
    const selectedAnswer =
      userAnswers[
        currentQuestion
      ];

    if (!selectedAnswer) {
      alert(
        "Please select an answer before continuing."
      );
      return;
    }

    /*
    ================================================
    LAST QUESTION
    ================================================
    */

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      /*
      Calculate final score using
      every stored answer.

      Current answer is already stored
      in state because the user had to
      select it before clicking submit.
      */

      const finalScore =
        questions.reduce(
          (
            total,
            question,
            index
          ) => {
            const answer =
              userAnswers[index];

            return (
              total +
              (
                answer ===
                question.answer
                  ? 1
                  : 0
              )
            );
          },
          0
        );

      setScore(
        finalScore
      );

      /*
      Save quiz result
      */

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

      /*
      Finish quiz
      */

      setQuizFinished(true);

      return;
    }

    /*
    ================================================
    NEXT QUESTION
    ================================================
    
    No answer is revealed.
    */

    setCurrentQuestion(
      (previous) =>
        previous + 1
    );
  };

  /*
  ==================================================
  GET GRADE
  ==================================================
  */

  const getGrade = (
    percentage
  ) => {
    if (percentage >= 90)
      return "O";

    if (percentage >= 80)
      return "A+";

    if (percentage >= 70)
      return "A";

    if (percentage >= 60)
      return "B+";

    if (percentage >= 50)
      return "B";

    if (percentage >= 40)
      return "C";

    return "F";
  };

  /*
  ==================================================
  PERCENTAGE
  ==================================================
  */

  const percentage =
    questions.length > 0
      ? (
          (
            score /
            questions.length
          ) *
          100
        ).toFixed(2)
      : "0.00";

  /*
  ==================================================
  DOWNLOAD QUIZ REVIEW AS PDF
  ==================================================
  */

  const downloadReview = () => {
    if (
      !questions ||
      questions.length === 0
    ) {
      alert(
        "No quiz review available."
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
      Find selected document.

      IMPORTANT:
      We call this selectedDocument,
      NOT document, because document
      is a browser global.
      */

      const selectedDocument =
        documents.find(
          (doc) =>
            doc._id ===
            selectedDoc
        );

      /*
      ==============================================
      PAGE SPACE HELPER
      ==============================================
      */

      const checkPageSpace = (
        requiredHeight = 20
      ) => {
        if (
          y + requiredHeight >
          pageHeight - 20
        ) {
          pdf.addPage();

          y = 20;
        }
      };

      /*
      ==============================================
      TITLE
      ==============================================
      */

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(20);

      pdf.text(
        "EduGen AI - Quiz Review",
        pageWidth / 2,
        y,
        {
          align: "center",
        }
      );

      y += 15;

      /*
      ==============================================
      QUIZ INFORMATION
      ==============================================
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

      y += 7;

      pdf.text(
        `Total Questions: ${questions.length}`,
        margin,
        y
      );

      y += 7;

      pdf.text(
        `Score: ${score} / ${questions.length}`,
        margin,
        y
      );

      y += 7;

      pdf.text(
        `Percentage: ${percentage}%`,
        margin,
        y
      );

      y += 7;

      pdf.text(
        `Grade: ${getGrade(
          Number(percentage)
        )}`,
        margin,
        y
      );

      y += 12;

      /*
      ==============================================
      LINE
      ==============================================
      */

      pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 12;

      /*
      ==============================================
      REVIEW TITLE
      ==============================================
      */

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(16);

      pdf.text(
        "Detailed Answer Review",
        margin,
        y
      );

      y += 12;

      /*
      ==============================================
      EACH QUESTION
      ==============================================
      */

      questions.forEach(
        (
          question,
          index
        ) => {
          const userAnswer =
            userAnswers[index] ||
            "Not answered";

          const correctAnswer =
            question.answer;

          const isCorrect =
            userAnswer ===
            correctAnswer;

          /*
          Question heading
          */

          checkPageSpace(45);

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(13);

          pdf.text(
            `Question ${index + 1}`,
            margin,
            y
          );

          y += 8;

          /*
          Question text
          */

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(11);

          const questionLines =
            pdf.splitTextToSize(
              question.question ||
                "",
              contentWidth
            );

          questionLines.forEach(
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

          y += 4;

          /*
          Options
          */

          if (
            Array.isArray(
              question.options
            )
          ) {
            question.options.forEach(
              (
                option,
                optionIndex
              ) => {
                checkPageSpace(8);

                const letter =
                  String.fromCharCode(
                    65 +
                      optionIndex
                  );

                const optionLines =
                  pdf.splitTextToSize(
                    `${letter}. ${option}`,
                    contentWidth - 5
                  );

                optionLines.forEach(
                  (line) => {
                    checkPageSpace(8);

                    pdf.text(
                      line,
                      margin + 5,
                      y
                    );

                    y += 6;
                  }
                );
              }
            );
          }

          y += 4;

          /*
          Your Answer
          */

          checkPageSpace(15);

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.text(
            "Your Answer:",
            margin,
            y
          );

          pdf.setFont(
            "helvetica",
            "normal"
          );

          const userAnswerLines =
            pdf.splitTextToSize(
              userAnswer,
              contentWidth - 35
            );

          pdf.text(
            userAnswerLines,
            margin + 30,
            y
          );

          y +=
            6 *
            userAnswerLines.length;

          /*
          Correct Answer
          */

          checkPageSpace(15);

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.text(
            "Correct Answer:",
            margin,
            y
          );

          pdf.setFont(
            "helvetica",
            "normal"
          );

          const correctAnswerLines =
            pdf.splitTextToSize(
              correctAnswer,
              contentWidth - 40
            );

          pdf.text(
            correctAnswerLines,
            margin + 35,
            y
          );

          y +=
            6 *
            correctAnswerLines.length;

          /*
          Result
          */

          checkPageSpace(10);

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.text(
            `Result: ${
              isCorrect
                ? "Correct"
                : "Incorrect"
            }`,
            margin,
            y
          );

          y += 8;

          /*
          Separator
          */

          pdf.line(
            margin,
            y,
            pageWidth - margin,
            y
          );

          y += 10;
        }
      );

      /*
      ==============================================
      FOOTER
      ==============================================
      */

      pdf.setFont(
        "helvetica",
        "italic"
      );

      pdf.setFontSize(9);

      pdf.text(
        "Generated by EduGen AI - Smart Learning Assistant",
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );

      /*
      ==============================================
      FILE NAME
      ==============================================
      */

      let fileName =
        "Quiz";

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
      ==============================================
      DOWNLOAD
      ==============================================
      */

      pdf.save(
        `EduGen-AI-${fileName}-Quiz-Review.pdf`
      );

    } catch (error) {
      console.error(
        "PDF Download Error:",
        error
      );

      alert(
        "Failed to generate PDF review."
      );
    }
  };

  /*
  ==================================================
  GENERATE ANOTHER QUIZ
  ==================================================
  */

  const startNewQuiz = () => {
    setQuizStarted(false);

    setQuizFinished(false);

    setQuestions([]);

    setCurrentQuestion(0);

    setUserAnswers({});

    setScore(0);
  };

  /*
  ==================================================
  RENDER
  ==================================================
  */

  return (
    <>
      <Navbar />

      <div className="container">

        {/* =================================================
            QUIZ GENERATION SCREEN
        ================================================= */}

        {!quizStarted && (
          <div className="module-card">

            <h1>
              📝 AI Quiz Generator
            </h1>

            <p
              style={{
                color: "#666",
                marginBottom:
                  "20px",
              }}
            >
              Generate an AI-powered
              quiz from your uploaded
              study material.
            </p>

            {/* Document */}

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
                -- Select Document --
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

            {/* Language */}

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

            {/* Number of Questions */}

            <div
              style={{
                marginTop:
                  "20px",
              }}
            >

              <label>
                Number of Questions
              </label>

              <select
                value={
                  numberOfQuestions
                }
                onChange={(e) =>
                  setNumberOfQuestions(
                    Number(
                      e.target.value
                    )
                  )
                }
                disabled={loading}
              >

                <option value={5}>
                  5 Questions
                </option>

                <option value={10}>
                  10 Questions
                </option>

                <option value={15}>
                  15 Questions
                </option>

                <option value={20}>
                  20 Questions
                </option>

                <option value={25}>
                  25 Questions
                </option>

                <option value={30}>
                  30 Questions
                </option>

              </select>

              <p
                style={{
                  color:
                    "#666",
                  fontSize:
                    "14px",
                  marginTop:
                    "8px",
                }}
              >
                Choose between
                5 and 30 questions.
              </p>

            </div>

            {/* Generate */}

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
                ? "Generating Quiz..."
                : "Generate Quiz"}

            </button>

          </div>
        )}

        {/* =================================================
            ACTIVE QUIZ
        ================================================= */}

        {quizStarted &&
          !quizFinished &&
          questions.length > 0 && (

            <div
              className="module-card"
            >

              {/* Question Header */}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "25px",
                }}
              >

                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  Question{" "}
                  {
                    currentQuestion +
                    1
                  }{" "}
                  /{" "}
                  {
                    questions.length
                  }
                </h3>

              </div>

              {/* Progress Bar */}

              <div
                style={{
                  width:
                    "100%",
                  height:
                    "8px",
                  background:
                    "#e5e7eb",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "30px",
                  overflow:
                    "hidden",
                }}
              >

                <div
                  style={{
                    width:
                      `${
                        (
                          (
                            currentQuestion +
                            1
                          ) /
                          questions.length
                        ) *
                        100
                      }%`,
                    height:
                      "100%",
                    background:
                      "linear-gradient(90deg, #2563eb, #7c3aed)",
                    transition:
                      "width 0.3s ease",
                  }}
                />

              </div>

              {/* Question */}

              <div
                style={{
                  fontSize:
                    "22px",
                  fontWeight:
                    "700",
                  lineHeight:
                    "1.5",
                  marginBottom:
                    "25px",
                }}
              >

                {
                  questions[
                    currentQuestion
                  ].question
                }

              </div>

              {/* Options */}

              <div
                className="quiz-options"
              >

                {questions[
                  currentQuestion
                ].options.map(
                  (
                    option,
                    index
                  ) => {

                    const selected =
                      userAnswers[
                        currentQuestion
                      ] ===
                      option;

                    return (
                      <label
                        key={
                          index
                        }
                        className={`quiz-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        style={{
                          cursor:
                            "pointer",
                        }}
                      >

                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={
                            option
                          }
                          checked={
                            selected
                          }
                          onChange={() =>
                            handleSelectAnswer(
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
                          .{" "}
                          {
                            option
                          }
                        </span>

                      </label>
                    );
                  }
                )}

              </div>

              {/* Submit */}

              <button
                onClick={
                  handleSubmitAnswer
                }
                disabled={
                  !userAnswers[
                    currentQuestion
                  ]
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "30px",
                }}
              >

                {currentQuestion ===
                questions.length - 1
                  ? "Finish Quiz"
                  : "Submit Answer"}

              </button>

            </div>
          )}

        {/* =================================================
            FINAL RESULT
        ================================================= */}

        {quizFinished && (

          <div>

            {/* RESULT */}

            <div
              className="module-card"
              style={{
                textAlign:
                  "center",
              }}
            >

              <h1>
                🎉 Quiz Completed
              </h1>

              <p
                style={{
                  color:
                    "#666",
                }}
              >
                Great job! Your quiz
                has been completed.
              </p>

              <h2>
                Your Score
              </h2>

              <div
                style={{
                  fontSize:
                    "52px",
                  fontWeight:
                    "bold",
                  margin:
                    "20px 0",
                  color:
                    "#2563eb",
                }}
              >
                {score} /{" "}
                {questions.length}
              </div>

              <h3>
                Percentage:{" "}
                {percentage}%
              </h3>

              <h3>
                Grade:{" "}
                {getGrade(
                  Number(
                    percentage
                  )
                )}
              </h3>

              {/* PDF DOWNLOAD */}

              <button
                onClick={
                  downloadReview
                }
                style={{
                  marginTop:
                    "25px",
                  marginRight:
                    "10px",
                }}
              >
                📥 Download PDF Review
              </button>

              {/* NEW QUIZ */}

              <button
                onClick={
                  startNewQuiz
                }
                style={{
                  marginTop:
                    "25px",
                }}
              >
                🔄 Generate Another Quiz
              </button>

            </div>

            {/* =================================================
                ANSWER REVIEW
            ================================================= */}

            <div
              className="result-card"
              style={{
                marginTop:
                  "30px",
              }}
            >

              <h2>
                📚 Answer Review
              </h2>

              <p
                style={{
                  color:
                    "#666",
                  marginBottom:
                    "25px",
                }}
              >
                Review your answers
                and learn from your
                mistakes.
              </p>

              {questions.map(
                (
                  question,
                  index
                ) => {

                  const userAnswer =
                    userAnswers[
                      index
                    ] ||
                    "Not answered";

                  const correct =
                    userAnswer ===
                    question.answer;

                  return (
                    <div
                      key={
                        index
                      }
                      style={{
                        padding:
                          "20px",
                        marginBottom:
                          "20px",
                        border:
                          "1px solid #ddd",
                        borderRadius:
                          "12px",
                      }}
                    >

                      <h3>
                        Question{" "}
                        {
                          index +
                          1
                        }
                      </h3>

                      <p
                        style={{
                          fontWeight:
                            "600",
                          lineHeight:
                            "1.6",
                        }}
                      >
                        {
                          question.question
                        }
                      </p>

                      <p>
                        <strong>
                          Your Answer:
                        </strong>{" "}
                        {
                          userAnswer
                        }
                      </p>

                      <p>
                        <strong>
                          Correct Answer:
                        </strong>{" "}
                        {
                          question.answer
                        }
                      </p>

                      <p
                        style={{
                          fontWeight:
                            "bold",
                          color:
                            correct
                              ? "green"
                              : "red",
                        }}
                      >
                        {correct
                          ? "✓ Correct"
                          : "✗ Incorrect"}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Quiz;