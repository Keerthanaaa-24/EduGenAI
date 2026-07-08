const Document =
  require("../models/Document");

const client =
  require("../config/openrouter");

const MODEL =
  require("../config/model");

const chunkText =
  require("../utils/chunkText");

const createContext =
  async (
    documentId
  ) => {
    const document =
      await Document.findById(
        documentId
      );

    if (!document) {
      throw new Error(
        "Document not found"
      );
    }

    const chunks =
      chunkText(
        document.extractedText,
        1000
      );

    return chunks.join("\n");
  };

const askQuestion =
  async (
    documentId,
    question
  ) => {
    const context =
      await createContext(
        documentId
      );

    const prompt = `
Answer ONLY from the study material.

Study Material:
${context}

Question:
${question}

If answer doesn't exist, say:
"Answer not found in uploaded document."
`;

    const response =
      await client.chat.completions.create({
        model: MODEL,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return response
      .choices[0]
      .message.content;
  };

module.exports = {
  askQuestion,
};
