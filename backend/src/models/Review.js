const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: function () {
        const langMap = { cpp: "C++", java: "Java", python: "Python", javascript: "JavaScript" };
        return `${langMap[this.language] || this.language} ${this.mode} review`;
      },
    },
    language: {
      type: String,
      required: true,
      enum: ["cpp", "java", "python", "javascript"],
    },
    mode: {
      type: String,
      required: true,
      enum: ["beginner", "interview"],
    },
    code: {
      type: String,
      required: true,
    },
    aiResponse: {
      bugs: [String],
      suggestions: [String],
      readability: [String],
      optimization: [String],
      timeComplexity: String,
      spaceComplexity: String,
    },
  },
  { timestamps: true }
);

// Compound index for efficient user-specific queries sorted by date
reviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
