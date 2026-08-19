const client = require("../config/openrouter");
const MODEL = require("../config/model");

const generateQuiz = async (text, language = "English") => {

  const prompt = `
You are EduGen AI.

Generate EXACTLY 15 multiple-choice questions from the study material.

IMPORTANT RULES:

1. Respond ONLY with a JSON array.
2. Do NOT write:
   - Here are your questions
   - Here is the quiz
   - Explanation
   - Markdown
   - \`\`\`json
   - \`\`\`
3. Output MUST begin with [
4. Output MUST end with ]
5. Every question must contain:
   - question
   - options (exactly 4)
   - answer
6. Use ONLY ${language}.
7. Questions must come ONLY from the study material.

Example:

[
  {
    "question":"What is AI?",
    "options":[
      "Artificial Intelligence",
      "Artificial Internet",
      "Automatic Input",
      "None"
    ],
    "answer":"Artificial Intelligence"
  }
]

Study Material:

${text.substring(0, 12000)}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let quiz =
    response.choices[0].message.content.trim();

  // Remove Markdown code fences
  quiz = quiz
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Keep only the JSON array
  const start = quiz.indexOf("[");
  const end = quiz.lastIndexOf("]");

  if (start !== -1 && end !== -1) {
    quiz = quiz.substring(start, end + 1);
  }

  // Validate JSON before returning
  try {
    JSON.parse(quiz);
  } catch (err) {
    console.error("Invalid AI JSON:");
    console.error(quiz);
    throw new Error(
      "AI returned invalid quiz JSON."
    );
  }

  return quiz;
};

module.exports = {
  generateQuiz,
};