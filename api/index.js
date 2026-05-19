require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../backend/src/app");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully for Serverless");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message
    });
  }
  return app(req, res);
};
