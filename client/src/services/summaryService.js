import axios from "axios";

const API =
  "http://localhost:5000/api/summary";

export const generateSummary =
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