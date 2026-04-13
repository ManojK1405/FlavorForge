import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const RECIPE_SERVICE_URL = process.env.RECIPE_SERVICE_URL || 'http://localhost:5001';
const MOOD_SERVICE_URL = process.env.MOOD_SERVICE_URL || 'http://localhost:5002';

console.log(`Configured Recipe Service: ${RECIPE_SERVICE_URL}`);
console.log(`Configured Mood Service: ${MOOD_SERVICE_URL}`);

app.post('/api/orchestrate', async (req, res) => {
  console.log("Orchestrate request received:", req.body);
  
  if (!process.env.RECIPE_SERVICE_URL || !process.env.MOOD_SERVICE_URL) {
    console.warn("CRITICAL: RECIPE_SERVICE_URL or MOOD_SERVICE_URL environment variables are not set!");
  }

  try {
    const { ingredients, mood, cuisine, foodDescription } = req.body;

    // 1. Get Recipe
    console.log(`Calling Recipe Service at: ${RECIPE_SERVICE_URL}/generate`);
    let recipeResponse;
    try {
      recipeResponse = await axios.post(`${RECIPE_SERVICE_URL}/generate`, {
        ingredients, mood, cuisine, foodDescription
      }, { timeout: 60000 });
      console.log("Recipe Service success");
    } catch (e: any) {
      console.error("Recipe Service Call Failed:", e.message);
      return res.status(500).json({
        error: "Recipe Service unreachable or failed",
        step: "RECIPE_GENERATION",
        serviceUrl: RECIPE_SERVICE_URL,
        details: e.response?.data || e.message
      });
    }
    
    // 2. Get Mood Vibe (depends on recipe name)
    console.log(`Calling Mood Service at: ${MOOD_SERVICE_URL}/mood-vibe`);
    let vibeResponse;
    try {
      vibeResponse = await axios.post(`${MOOD_SERVICE_URL}/mood-vibe`, {
        mood, cuisine, dishName: recipeResponse.data.dishName
      }, { timeout: 60000 });
      console.log("Mood Service success");
    } catch (e: any) {
      console.error("Mood Service Call Failed:", e.message);
      return res.status(500).json({
        error: "Mood Service unreachable or failed",
        step: "MOOD_GENERATION",
        serviceUrl: MOOD_SERVICE_URL,
        details: e.response?.data || e.message
      });
    }

    res.json({
      recipe: recipeResponse.data,
      vibe: vibeResponse.data
    });

  } catch (error: any) {
    console.error("Unknown Gateway error:", error.message);
    res.status(500).json({ 
      error: "Gateway internal error", 
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "Gateway Up" });
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
