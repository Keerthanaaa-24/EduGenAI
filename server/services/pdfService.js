const fs = require("fs");
const pdfParse = require("pdf-parse");
const extractPDFText = async (
  filePath
) => {
  try {
    console.log(
      "Reading PDF:",
      filePath
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `File not found: ${filePath}`
      );
    }

    const buffer =
      fs.readFileSync(filePath);

    const pdfData =
      await pdfParse(buffer);

    return pdfData.text;
  } catch (error) {
    console.error(error);

    throw new Error(
      error.message
    );
  }
};

module.exports = {
  extractPDFText,
};
