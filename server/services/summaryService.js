const client =
  require("../config/openrouter");

const MODEL =
  require("../config/model");
/*
==================================================
GENERATE SUMMARY
==================================================
*/

const generateSummary =
  async (
    text,
    language = "English"
  ) => {

    /*
    Validate input
    */

    if (
      !text ||
      !text.trim()
    ) {
      throw new Error(
        "Study material is empty."
      );
    }

    const studyMaterial =
      text.substring(
        0,
        12000
      );

    const prompt = `
You are EduGen AI, an intelligent educational study assistant.

Create detailed revision notes from the study material provided below.

LANGUAGE:
${language}

STRICT REQUIREMENTS:

1. Use ONLY information from the provided study material.
2. Write the complete response in ${language}.
3. Do not invent information.
4. Do not use information that is not present in the study material.
5. Organize the notes clearly using headings and subheadings.
6. Include important definitions.
7. Include important concepts and key points.
8. Include formulas only when they are present in the material.
9. Include important examples when present in the material.
10. Include exam-oriented points.
11. Include a short revision summary at the end.
12. Keep the content useful for engineering students.
13. Do not mention that you are an AI.
14. Do not add information from outside sources.

Suggested structure:

# Revision Notes

## 1. Main Topic

### Definition

### Important Concepts

### Key Points

### Examples

## 2. Next Topic

### Definition

### Important Concepts

### Key Points

## Important Exam Points

## Quick Revision

STUDY MATERIAL:

${studyMaterial}
`;

    try {

      console.log(
        "========== SUMMARY AI REQUEST =========="
      );

      console.log(
        "Model:",
        MODEL
      );

      console.log(
        "Language:",
        language
      );

      /*
      Call AI
      */

      const response =
        await client.chat.completions.create({

          model:
            MODEL,

          temperature:
            0.3,

          messages: [

            {
              role:
                "system",

              content:
                "You are EduGen AI. Generate accurate educational revision notes using only the supplied study material.",

            },

            {
              role:
                "user",

              content:
                prompt,

            },

          ],
        });

      /*
      Get response
      */

      const summary =
        response
          ?.choices?.[0]
          ?.message
          ?.content;

      if (
        !summary ||
        !summary.trim()
      ) {
        throw new Error(
          "AI returned an empty summary."
        );
      }

      console.log(
        "========== SUMMARY GENERATED =========="
      );

      console.log(
        `Summary length: ${summary.length} characters`
      );

      return summary.trim();

    } catch (error) {

      console.error(
        "========== SUMMARY SERVICE ERROR =========="
      );

      console.error(
        error
      );

      throw new Error(
        error.message ||
        "Failed to generate summary."
      );
    }
  };

module.exports = {
  generateSummary,
};
