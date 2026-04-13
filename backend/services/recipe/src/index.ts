import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/generate', async (req, res) => {
  try {
    const { ingredients, mood, cuisine, foodDescription } = req.body;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = `
      You are a world-class chef. Based on these ingredients: ${ingredients.join(', ')}, 
      this mood: ${mood}, and this preferred cuisine: ${cuisine},${foodDescription ? `\n      The user also describes what they want: "${foodDescription}".` : ''}
      please suggest a specific dish and provide its full recipe.
      
      Respond in strictly JSON format with the following structure:
      {
        "dishName": "Name of the dish",
        "description": "Short appetizing description",
        "ingredients": ["list", "of", "ingredients", "with", "quantities"],
        "instructions": ["Step 1...", "Step 2..."],
        "cookingTime": "e.g., 30 mins",
        "difficulty": "Easy/Medium/Hard"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response text (to handle potential extra characters/markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response from AI");
    }
    
    const recipeData = JSON.parse(jsonMatch[0]);
    res.json(recipeData);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate recipe", details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "Recipe Service Up" });
});

app.listen(port, () => {
  console.log(`Recipe Service running on port ${port}`);
});
