import axios from "axios";
const API =
  "http://localhost:5000/api/documents";

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
