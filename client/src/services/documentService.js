import axios from "axios";

const API =
  "http://localhost:5000/api/documents";

/*
==================================================
UPLOAD DOCUMENT
==================================================
*/

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
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

/*
==================================================
GET ALL USER DOCUMENTS
==================================================
*/

export const getDocuments =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(
        `${API}`,
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
==================================================
DELETE DOCUMENT
==================================================
*/

export const deleteDocument =
  async (documentId) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.delete(
        `${API}/${documentId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };