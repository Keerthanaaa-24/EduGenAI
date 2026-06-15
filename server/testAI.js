require("dotenv").config();

const client =
  require("./config/openrouter");

async function test() {
  try {
    const response =
      await client.chat.completions.create({
        model:
          "meta-llama/llama-3.1-8b-instruct",

        messages: [
          {
            role: "user",
            content:
              "Say Hello",
          },
        ],
      });

    console.log(
      response.choices[0]
        .message.content
    );
  } catch (error) {
    console.log(error);
  }
}

test();