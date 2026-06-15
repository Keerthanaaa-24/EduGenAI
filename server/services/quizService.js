const client =
  require("../config/openrouter");

const MODEL =
  require("../config/model");

const generateQuiz =
  async (text) => {

    const prompt = `
Generate EXACTLY 15 MCQs from the study material.

Return ONLY valid JSON.

Format:

[
  {
    "question":"Question text",
    "options":[
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer":"Option A"
  }
]

Do NOT add explanations.
Do NOT add markdown.
Do NOT add \`\`\`json.

Study Material:

${text.substring(
  0,
  10000
)}
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

    const content =
      response.choices[0]
        .message.content;

    try {

      const cleaned =
        content
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      return JSON.parse(
        cleaned
      );

    } catch (error) {

      console.log(
        "Quiz Parse Error:",
        error
      );

      return [];

    }
  };

module.exports = {
  generateQuiz,
};