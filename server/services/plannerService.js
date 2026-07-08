const client =
  require("../config/openrouter");
const MODEL =
  require("../config/model");

const generateStudyPlan =
  async (
    subject,
    examDate,
    hoursPerDay,
    studyMaterial
  ) => {

    const prompt = `
You are EduGen AI.

Create a professional study planner.

Subject:
${subject}

Exam Date:
${examDate}

Hours Per Day:
${hoursPerDay}

Study Material:
${studyMaterial.substring(
  0,
  15000
)}

Requirements:

Analyse the study material.

Identify:
- Units
- Topics
- Important concepts
- Difficult concepts

Generate day-wise plan.

Format:

DAY 1

Topics:
• Topic 1
• Topic 2

Tasks:
• Read summary
• Practice quiz
• Revise notes

Hours:
${hoursPerDay}

--------------------------------

DAY 2

Topics:
• Topic 3
• Topic 4

Tasks:
• Complete revision
• Attempt 15 MCQs

Hours:
${hoursPerDay}

--------------------------------

Continue until exam preparation is complete.

Also include:

Important Revision Days

Mock Test Days

Final Revision Plan

Exam Strategy
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
  generateStudyPlan,
};
