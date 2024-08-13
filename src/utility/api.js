import { LANGUAGE_VERSIONS } from "./constants";

const API_BASE_URL = "https://emkc.org/api/v2/piston";

export const executeCode = async (language, sourceCode) => {
  const response = await fetch(`${API_BASE_URL}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
