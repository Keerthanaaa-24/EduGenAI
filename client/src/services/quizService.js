import axios from "axios";

const API =
  "http://localhost:5000/api/quiz";

const RESULT_API =
  "http://localhost:5000/api/quiz-results";

/*
Generate Quiz
*/

export const generateQuiz =
  async (
    documentId,
    language = "English",
    numberOfQuestions = 15
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
          numberOfQuestions,
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

/*
Submit Quiz Result
*/

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

/*
Get Quiz History
*/

export const getQuizHistory =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(
        `${RESULT_API}/history`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };