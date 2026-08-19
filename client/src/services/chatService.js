import axios from "axios";

const API =
  "http://localhost:5000/api/chat";

/*
==================================================
ASK AI QUESTION
==================================================
*/

export const askQuestion =
  async (
    documentId,
    question
  ) => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      if (!documentId) {
        throw new Error(
          "Please select a document."
        );
      }

      if (
        !question ||
        !question.trim()
      ) {
        throw new Error(
          "Please enter a question."
        );
      }

      console.log(
        "========== CHAT SERVICE =========="
      );

      console.log(
        "Document ID:",
        documentId
      );

      console.log(
        "Question:",
        question
      );

      /*
      IMPORTANT:

      Backend route is:

      POST /api/chat

      NOT:

      POST /api/chat/ask
      */

      const response =
        await axios.post(
          API,
          {
            documentId,
            question:
              question.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "Chat Response:",
        response.data
      );

      return response.data;

    } catch (error) {

      console.error(
        "Chat Service Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      /*
      Create a useful error
      for ChatWindow.jsx
      */

      const message =
        error.response?.data
          ?.message ||
        error.response?.data
          ?.error ||
        error.message ||
        "Failed to get AI response.";

      throw new Error(
        message
      );
    }
  };