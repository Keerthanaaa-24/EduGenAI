const client =
  require("../config/openrouter");
const MODEL =
  require("../config/model");

const generateStudyPlan =
  async (
    text,
    subject,
    examDate,
    hoursPerDay,
    language
  ) => {

    const prompt = `
You are EduGen AI.

Generate the study plan ONLY in ${language}.

Study Material:
${text.substring(0,12000)}

Subject:
${subject}

Exam Date:
${examDate}

Hours Per Day:
${hoursPerDay}

Create a professional study planner.

Format EXACTLY like this.

DAY 1

Topics

Task 1

Task 2

Hours

${hoursPerDay} Hours

---------------------

DAY 2

Topics

Task 1

Task 2

Hours

${hoursPerDay} Hours

Continue until the exam.

Also mention:

Daily Revision

Weekly Revision

Important Topics

Difficult Topics

Final Revision Day

Do not use tables.
Do not use markdown.

Everything should be aligned neatly.
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
