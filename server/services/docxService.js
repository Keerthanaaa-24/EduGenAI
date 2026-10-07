import axios from "axios";
const BASE_URL = (
  (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
  "https://edugenai-8ix8.onrender.com"
).replace(/\/+$/, "");
const API = `${BASE_URL}/api/documents`;

export const uploadDocument =
  async (file) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.post(
        `${API}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const getDocuments =
  async () => {
    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(
        `${API}/my-documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
