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
  try {
    const { ingredients, mood, cuisine, foodDescription } = req.body;

    // 1. Get Recipe
    const recipeResponse = await axios.post(`${RECIPE_SERVICE_URL}/generate`, {
      ingredients, mood, cuisine, foodDescription
    }, { timeout: 60000 });
    
    // 2. Get Mood Vibe (depends on recipe name)
    const vibeResponse = await axios.post(`${MOOD_SERVICE_URL}/mood-vibe`, {
      mood, cuisine, dishName: recipeResponse.data.dishName
    }, { timeout: 60000 });

    res.json({
      recipe: recipeResponse.data,
      vibe: vibeResponse.data
    });

  } catch (error: any) {
    console.error("Gateway error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to coordinate services", 
      details: error.response?.data || error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "Gateway Up" });
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
