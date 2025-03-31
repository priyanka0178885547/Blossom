const translate = require("google-translate-api-x");

async function translateText(text, targetLang = "en") {
  try {
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
}

module.exports = translateText;
