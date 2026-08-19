const client = require("../config/openrouter");
const MODEL = require("../config/model");

/*
==================================================
CLEAN AI JSON RESPONSE
==================================================
*/

const cleanAIResponse = (content) => {
  if (!content) {
    throw new Error(
      "AI returned an empty response."
    );
  }

  let cleaned = content.trim();

  /*
  Remove Markdown code fences
  */

  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  /*
  Find JSON array
  */

  const start =
    cleaned.indexOf("[");

  const end =
    cleaned.lastIndexOf("]");

  if (
    start === -1 ||
    end === -1 ||
    end <= start
  ) {
    console.error(
      "========== AI RESPONSE =========="
    );

    console.error(
      cleaned
    );

    throw new Error(
      "AI did not return a valid quiz JSON array."
    );
  }

  cleaned =
    cleaned.substring(
      start,
      end + 1
    );

  return cleaned;
};

/*
==================================================
VALIDATE QUIZ
==================================================
*/

const validateQuiz = (
  quiz,
  questionCount
) => {

  if (!Array.isArray(quiz)) {
    throw new Error(
      "Quiz response is not an array."
    );
  }

  if (quiz.length === 0) {
    throw new Error(
      "AI returned an empty quiz."
    );
  }

  /*
  We require the requested
  number of questions.
  */

  if (
    quiz.length !==
    questionCount
  ) {
    throw new Error(
      `AI generated ${quiz.length} questions instead of ${questionCount}. Please try again.`
    );
  }

  quiz.forEach(
    (item, index) => {

      if (
        !item ||
        typeof item !==
          "object"
      ) {
        throw new Error(
          `Invalid question ${index + 1}.`
        );
      }

      if (
        !item.question ||
        typeof item.question !==
          "string"
      ) {
        throw new Error(
          `Question ${index + 1} has no valid question text.`
        );
      }

      if (
        !Array.isArray(
          item.options
        )
      ) {
        throw new Error(
          `Question ${index + 1} has invalid options.`
        );
      }

      if (
        item.options.length !==
        4
      ) {
        throw new Error(
          `Question ${index + 1} must have exactly 4 options.`
        );
      }

      if (
        item.options.some(
          (option) =>
            typeof option !==
              "string" ||
            !option.trim()
        )
      ) {
        throw new Error(
          `Question ${index + 1} contains an invalid option.`
        );
      }

      if (
        !item.answer ||
        typeof item.answer !==
          "string"
      ) {
        throw new Error(
          `Question ${index + 1} has no correct answer.`
        );
      }

      /*
      Correct answer must
      exactly match an option
      */

      if (
        !item.options.includes(
          item.answer
        )
      ) {
        throw new Error(
          `Correct answer does not match an option in question ${index + 1}.`
        );
      }
    }
  );

  return true;
};

/*
==================================================
GENERATE QUIZ
==================================================
*/

const generateQuiz = async (
  text,
  language = "English",
  numberOfQuestions = 15
) => {

  /*
  Allow 5–30 questions
  */

  const questionCount =
    Math.min(
      Math.max(
        Number(
          numberOfQuestions
        ) || 15,
        5
      ),
      30
    );

  /*
  Make sure text exists
  */

  if (
    !text ||
    !text.trim()
  ) {
    throw new Error(
      "Study material is empty."
    );
  }

  /*
  Limit context.

  12000 characters can be
  unnecessarily large for a
  small quiz and can make the
  output less reliable.
  */

  const studyMaterial =
    text.substring(
      0,
      10000
    );

  const prompt = `
You are EduGen AI.

Create a multiple-choice quiz from the study material below.

Number of questions:
${questionCount}

Language:
${language}

STRICT REQUIREMENTS:

1. Generate EXACTLY ${questionCount} questions.
2. Use ONLY the supplied study material.
3. Every question must be written in ${language}.
4. Every option must be written in ${language}.
5. The correct answer must be written in ${language}.
6. Each question must have EXACTLY 4 options.
7. Only ONE option is correct.
8. Do not repeat questions.
9. Cover different topics from the material.
10. Do not use outside knowledge.
11. Do not provide explanations.
12. Do not provide answers outside the JSON.
13. Do not write introductory text.
14. Do not use Markdown.
15. Do not use code fences.
16. Return ONLY a JSON array.

IMPORTANT:
The "answer" value MUST be exactly identical to
one of the strings in the "options" array.

OUTPUT FORMAT:

[
  {
    "question": "Question",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2"
  }
]

STUDY MATERIAL:

${studyMaterial}
`;

  try {

    console.log(
      "========== QUIZ AI REQUEST =========="
    );

    console.log(
      "Model:",
      MODEL
    );

    console.log(
      "Language:",
      language
    );

    console.log(
      "Question Count:",
      questionCount
    );

    /*
    AI request
    */

    const response =
      await client.chat.completions.create({

        model:
          MODEL,

        temperature:
          0.1,

        /*
        Give the model enough
        room to generate 30 questions.
        */

        max_tokens:
          Math.min(
            12000,
            Math.max(
              3000,
              questionCount *
                350
            )
          ),

        messages: [

          {
            role: "system",

            content:
              "You are a strict JSON quiz generator. Return only a JSON array. Never add Markdown, explanations, or introductory text.",
          },

          {
            role: "user",

            content:
              prompt,
          },

        ],
      });

    /*
    Get AI content
    */

    const content =
      response
        ?.choices?.[0]
        ?.message
        ?.content;

    if (!content) {
      throw new Error(
        "AI returned an empty quiz response."
      );
    }

    console.log(
      "========== RAW QUIZ RESPONSE =========="
    );

    console.log(
      content
    );

    /*
    Clean response
    */

    const cleaned =
      cleanAIResponse(
        content
      );

    console.log(
      "========== CLEANED QUIZ JSON =========="
    );

    console.log(
      cleaned
    );

    /*
    Parse JSON
    */

    let parsedQuiz;

    try {

      parsedQuiz =
        JSON.parse(
          cleaned
        );

    } catch (parseError) {

      console.error(
        "========== QUIZ JSON PARSE ERROR =========="
      );

      console.error(
        parseError
      );

      console.error(
        "AI response:",
        cleaned
      );

      throw new Error(
        "AI returned malformed quiz JSON. Please try generating the quiz again."
      );
    }

    /*
    Validate
    */

    validateQuiz(
      parsedQuiz,
      questionCount
    );

    console.log(
      "========== QUIZ SUCCESS =========="
    );

    console.log(
      `Generated ${parsedQuiz.length} questions`
    );

    /*
    Return parsed array directly.

    This is important because
    frontend no longer needs to
    JSON.parse() it again.
    */

    return parsedQuiz;

  } catch (error) {

    console.error(
      "========== QUIZ SERVICE ERROR =========="
    );

    console.error(
      error
    );

    throw error;
  }
};

module.exports = {
  generateQuiz,
};