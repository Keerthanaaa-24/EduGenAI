const client =
  require("../config/openrouter");
const MODEL =
  require("../config/model");

const generateStudyPlan =
  async (
    text,
    subject,
    days,
    hoursPerDay,
    startTime,
    language
  ) => {

    /*
    ==========================================
    LIMIT DAYS TO MAXIMUM 7
    ==========================================
    */

    const totalDays =
      Math.min(
        Math.max(
          Number(days) || 7,
          1
        ),
        7
      );

    /*
    ==========================================
    CLEAN HOURS
    ==========================================
    */

    const dailyHours =
      Math.max(
        Number(hoursPerDay) || 1,
        1
      );

    /*
    ==========================================
    AI PROMPT
    ==========================================
    */

    const prompt = `
You are EduGen AI, an intelligent study planner.

Create a SHORT and PRACTICAL study schedule from the
provided study material.

IMPORTANT RULES:

1. Create EXACTLY ${totalDays} days.
2. NEVER create more than 7 days.
3. Use ONLY the provided study material.
4. Write ONLY in ${language}.
5. Do NOT create long explanations.
6. Do NOT create detailed notes.
7. Do NOT explain the topics.
8. Assign only the MAIN topic for each study session.
9. Divide large topics across different days when necessary.
10. Use the available ${dailyHours} hours per day.
11. Start the study schedule from ${startTime}.
12. Keep the schedule simple and realistic.
13. Prioritize important topics before minor topics.
14. Include revision toward the end.
15. The final day should preferably contain revision or self-test.
16. Do NOT continue until an exam date.
17. Do NOT generate a plan longer than ${totalDays} days.
18. Do NOT use tables.
19. Do NOT use Markdown.
20. Return ONLY the schedule.

SUBJECT:
${subject}

NUMBER OF DAYS:
${totalDays}

HOURS PER DAY:
${dailyHours}

DAILY START TIME:
${startTime}

STUDY MATERIAL:
${text.substring(0, 12000)}

Use EXACTLY this simple format:

DAY 1
Time: ${startTime} - [end time]
Topic: [Main topic]

DAY 2
Time: ${startTime} - [end time]
Topic: [Main topic]

DAY 3
Time: ${startTime} - [end time]
Topic: [Main topic]

Continue until DAY ${totalDays}.

Remember:
- Only main topics.
- No long descriptions.
- No tasks.
- No explanations.
- No extra sections.
`;

    /*
    ==========================================
    CALL OPENROUTER
    ==========================================
    */

    const response =
      await client.chat.completions.create({
        model: MODEL,

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content:
              "You are a concise AI study planner. Return only the requested study schedule.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],
      });

    /*
    ==========================================
    GET AI RESPONSE
    ==========================================
    */

    const plan =
      response
        ?.choices?.[0]
        ?.message
        ?.content;

    if (!plan) {
      throw new Error(
        "AI returned an empty study plan."
      );
    }

    return plan.trim();
  };

module.exports = {
  generateStudyPlan,
};
