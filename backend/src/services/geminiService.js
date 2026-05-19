const axios = require("axios");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────────────
// PROMPT TEMPLATES
// ─────────────────────────────────────────────

const beginnerPrompt = (language, code) => `
You are a friendly coding mentor helping a beginner learn to code.

Review the following ${language} code and explain everything in simple, easy-to-understand language.
Avoid advanced jargon. Focus on helping the learner understand their mistakes and how to improve.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with a valid JSON object. No markdown, no explanation outside the JSON.
Use this exact format:
{
  "bugs": ["list any bugs in simple terms"],
  "suggestions": ["list beginner-friendly suggestions"],
  "readability": ["list readability tips in plain language"],
  "optimization": ["list simple ways to improve the code"],
  "timeComplexity": "e.g. O(n) — explain what this means simply",
  "spaceComplexity": "e.g. O(1) — explain what this means simply"
}

If there are no items for a category, use an empty array [].
`;

const advancedPrompt = (language, code) => `
You are a senior software engineer conducting an advanced technical review.

Review the following ${language} code from an advanced perspective.
Focus strictly on edge cases, algorithmic efficiency, and DSA best practices like Time/Space complexity. Assume the code is meant for a high-performance, production-critical system.
Be concise, professional, and brutally honest.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY with a valid JSON object. No markdown, no explanation outside the JSON.
Use this exact format:
{
  "bugs": ["list any bugs or logical errors"],
  "suggestions": ["list interview-level suggestions and better approaches"],
  "readability": ["list code quality and clean code feedback"],
  "optimization": ["list DSA optimizations and efficiency improvements"],
  "timeComplexity": "e.g. O(n log n) — and suggest if it can be improved",
  "spaceComplexity": "e.g. O(n) — and suggest if it can be improved"
}

If there are no items for a category, use an empty array [].
`;

// ─────────────────────────────────────────────
// PROMPT SELECTOR
// ─────────────────────────────────────────────

const buildPrompt = (language, mode, code) => {
  if (mode === "beginner") return beginnerPrompt(language, code);
  if (mode === "interview") return advancedPrompt(language, code);
  throw new AppError("Invalid review mode.", 400);
};

// ─────────────────────────────────────────────
// MAIN GEMINI SERVICE FUNCTION
// Uses Gemini 2.0 Flash — gemini-pro is deprecated
// ─────────────────────────────────────────────

const getCodeReview = async (language, mode, code) => {
  const prompt = buildPrompt(language, mode, code);

  // Using the lite model to have a higher free tier threshold
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  };

  let retries = 4;
  let delay = 3000; // 3 seconds initial delay
  let response;

  try {
    // Retry loop for rate limits
    while (retries > 0) {
      try {
        if (process.env.NODE_ENV === "development") {
          console.log(`Sending ${language}/${mode} review to Gemini 2.5 Flash Lite (Attempt ${5 - retries})...`);
        }

        response = await axios.post(url, requestBody, {
          headers: { "Content-Type": "application/json" },
          timeout: 60000,
        });

        // Break loop if request succeeds
        break;
      } catch (error) {
        if (error.response && error.response.status === 429 && retries > 1) {
          console.warn(`Rate limit hit (429). Waiting ${delay / 1000}s before retrying...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          retries--;
        } else {
          // If out of retries or it's a different error, throw it so the outer catch can handle it
          throw error;
        }
      }
    }

    const rawText =
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0] &&
      response.data.candidates[0].content.parts[0].text;

    if (!rawText) {
      throw new AppError("No response received from Gemini API.", 502);
    }

    // Clean markdown fences if present
    const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new AppError("Failed to parse AI response. Please try again.", 502);
      }
    }

    return {
      bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      readability: Array.isArray(parsed.readability) ? parsed.readability : [],
      optimization: Array.isArray(parsed.optimization) ? parsed.optimization : [],
      timeComplexity: parsed.timeComplexity || "N/A",
      spaceComplexity: parsed.spaceComplexity || "N/A",
    };
  } catch (error) {
    if (error.isOperational) throw error;

    if (error instanceof SyntaxError) {
      throw new AppError("Failed to parse AI response. Please try again.", 502);
    }

    if (error.response) {
      const status = error.response.status;
      const msg =
        (error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        "Gemini API error";

      if (status === 400) {
        throw new AppError(`Gemini API rejected the request (400): ${msg}`, 400);
      }
      if (status === 429) {
        throw new AppError("Gemini rate limit exceeded after multiple retries. Please wait a moment and try again.", 429);
      }
      throw new AppError(`Gemini API Error (${status}): ${msg}`, 502);
    }

    if (error.code === "ECONNABORTED") {
      throw new AppError("Gemini API timed out. Please try again.", 504);
    }

    throw new AppError("Failed to connect to Gemini API. Please try again.", 503);
  }
};

module.exports = { getCodeReview };
