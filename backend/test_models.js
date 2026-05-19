const axios = require('axios');
require('dotenv').config();

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await axios.get(url);
    
    console.log("AVAILABLE MODELS:");
    const models = response.data.models;
    models.forEach(m => {
      console.log(`- ${m.name} (generateContent supported: ${m.supportedGenerationMethods.includes('generateContent')})`);
    });
  } catch (err) {
    console.error("ERROR:");
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

listModels();
