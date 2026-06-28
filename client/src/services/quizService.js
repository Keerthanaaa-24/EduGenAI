import axios from "axios";
const API =
  "http://localhost:5000/api/quiz";

export const generateQuiz =
  async (
    documentId
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
