const {
  ChromaClient,
} = require("chromadb");

const chroma =
  new ChromaClient({
    path:
      process.env.CHROMA_URL,
  });

module.exports = chroma;