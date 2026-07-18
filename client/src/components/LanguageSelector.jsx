import React from "react";
function LanguageSelector({
  language,
  setLanguage,
}) {
  return (
    <select
      value={language}
      onChange={(e) =>
        setLanguage(e.target.value)
      }
    >
      <option value="English">
        🇬🇧 English
      </option>

      <option value="Tamil">
        🇮🇳 தமிழ்
      </option>

      <option value="Hindi">
        🇮🇳 हिन्दी
      </option>

      <option value="Telugu">
        🇮🇳 తెలుగు
      </option>

      <option value="Malayalam">
        🇮🇳 മലയാളം
      </option>

      <option value="Kannada">
        🇮🇳 ಕನ್ನಡ
      </option>
    </select>
  );
}

export default LanguageSelector;
