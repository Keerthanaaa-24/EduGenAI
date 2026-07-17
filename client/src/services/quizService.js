import axios from "axios";
const API =
  "http://localhost:5000/api/quiz";

const RESULT_API =
  "http://localhost:5000/api/quiz-results";

export const generateQuiz =
  async (
    documentId,
    language
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.post(
        `${API}/generate`,
        {
          documentId,
          language,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const submitQuizResult =
  async (
    documentId,
    score,
    totalQuestions
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.post(
        `${RESULT_API}/submit`,
        {
          documentId,
          score,
          totalQuestions,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
