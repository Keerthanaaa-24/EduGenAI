require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey:
    process.env.OPENROUTER_API_KEY || "missing_api_key",
  baseURL:
    "https://openrouter.ai/api/v1",
});

module.exports = client;
