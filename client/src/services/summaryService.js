import axios from "axios";

const API =
  "http://localhost:5000/api/summary";
export const generateSummary =
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
