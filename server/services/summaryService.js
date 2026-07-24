const client =
  require("../config/openrouter");
const MODEL =
  require("../config/model");

const generateSummary =
  async (
    text,
    language
  ) => {

    const prompt = `
You are EduGen AI.

Generate comprehensive revision notes ONLY in ${language}.

Requirements:

• Use ONLY ${language}.
• Do not mix English unless absolutely necessary.
• Create approximately 5–6 pages of study notes.
• Include:
  - Headings
  - Sub-headings
  - Important definitions
  - Important formulas
  - Key points
  - Exam tips
  - 2-mark questions
  - 16-mark questions
  - Revision summary

Study Material:

${text.substring(0, 12000)}
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

    return response.choices[0].message.content;
  };

module.exports = {
  generateSummary,
};
