const AppError = require("../utils/AppError");

const SUPPORTED_LANGUAGES = ["cpp", "java", "python", "javascript"];
const SUPPORTED_MODES = ["beginner", "interview"];
const MAX_CODE_LENGTH = 10000; // characters

// Validates the POST /api/review request body
const validateReviewInput = (req, res, next) => {
  const { language, mode, code } = req.body;

  // Check all fields are present
  if (!language || !mode || !code) {
    return next(new AppError("Please provide language, mode, and code.", 400));
  }

  // Check code is not empty
  if (code.trim().length === 0) {
    return next(new AppError("Code cannot be empty.", 400));
  }

  // Check code length
  if (code.length > MAX_CODE_LENGTH) {
    return next(
      new AppError(`Code is too long. Maximum ${MAX_CODE_LENGTH.toLocaleString()} characters allowed.`, 400)
    );
  }

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    return next(
      new AppError(
        `Unsupported language: "${language}". Supported languages: ${SUPPORTED_LANGUAGES.join(", ")}`,
        400
      )
    );
  }

  // Validate mode
  if (!SUPPORTED_MODES.includes(mode.toLowerCase())) {
    return next(
      new AppError(
        `Invalid mode: "${mode}". Supported modes: ${SUPPORTED_MODES.join(", ")}`,
        400
      )
    );
  }

  next();
};

module.exports = { validateReviewInput };
