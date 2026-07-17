const client =
  require("../config/openrouter");
const MODEL =
  require("../config/model");

const generateQuiz =
  async (
    text,
    language
  ) => {

    const prompt = `
You are EduGen AI.

Generate exactly 15 multiple-choice questions ONLY in ${language}.

Instructions:

- Use ONLY ${language}.
- Questions must come ONLY from the uploaded study material.
- Each question must have exactly 4 options.
- Only one option should be correct.
- Do NOT repeat questions.
- Cover all major topics.
- Return ONLY valid JSON.

Format:

[
{
"question":"",
"options":["","","",""],
"answer":""
}
]

Study Material:

${text.substring(0,12000)}
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
  generateQuiz,
};
