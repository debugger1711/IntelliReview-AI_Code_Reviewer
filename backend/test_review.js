const { getCodeReview } = require('./src/services/geminiService');
require('dotenv').config();

async function test() {
  try {
    const code = `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`;
    
    console.log("Testing getCodeReview...");
    const res = await getCodeReview('python', 'beginner', code);
    console.log("SUCCESS:");
    console.log(res);
  } catch (err) {
    console.error("FAILED:");
    console.error(err.message);
  }
}

test();
