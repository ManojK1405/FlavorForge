const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/gateway/.env" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const list = await genAI.listModels();
    console.log("Available Models:");
    for (const m of list.models) {
      console.log(`- ${m.name} (${m.displayName})`);
    }
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

listModels();
