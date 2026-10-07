import axios from "axios";
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://edugenai-8ix8.onrender.com"
).replace(/\/+$/, "");

const API = `${BASE_URL}/api/summary`;
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
