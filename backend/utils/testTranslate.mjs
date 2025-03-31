import translate from "@vitalets/google-translate-api";

translate("Hello", { to: "fr" })
  .then(res => {
    console.log("Translated text:", res.text);
  })
  .catch(err => {
    console.error("Translation error:", err);
  });
