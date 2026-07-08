const client =
  require("../config/openrouter");

const MODEL =
  require("../config/model");

const generateSummary =
  async (text) => {

    const prompt = `
You are EduGen AI.

Generate detailed revision notes from the study material.

Format:

# SUBJECT SUMMARY

## UNIT / MODULE NAME

### Important Concepts
- Point wise explanation

### Important Definitions
- Definition 1
- Definition 2

### Important Formulae
- Formula 1
- Formula 2

### Important Diagrams
- Mention diagrams student should practice

### Exam Tips
- Important areas for exams

### 2 Mark Questions
1.
2.
3.
4.
5.

### 16 Mark Questions
1.
2.
3.
4.
5.

Instructions:

1. Cover ALL topics found in the material.
2. Generate long notes (approximately 4–6 pages).
3. Use headings and subheadings.
4. Do not skip units.
5. Make it suitable for university exam preparation.

Study Material:

${text.substring(0, 25000)}
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
  generateSummary,
};
