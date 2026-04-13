import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/mood-vibe', async (req, res) => {
  try {
    const { mood, cuisine, dishName } = req.body;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = `
      You are a mood architect and music enthusiast. 
      The person is feeling: ${mood}, 
      prefers this cuisine: ${cuisine}, 
      and is going to cook: ${dishName}.
      
      IMPORTANT: You must recommend ONLY English and Hindi music.
      NEVER recommend songs by any artist with the surname Kakkar (e.g. Neha Kakkar, Tony Kakkar, Sonu Kakkar).
      Ensure the output is STRICTLY valid JSON. All string values MUST NOT contain any unescaped double quotes.
      
      Respond in strictly JSON format with the following structure:
      {
        "quote": "An uplifting quote based on the current mood and cuisine. Make it witty and appropriate.",
        "musicGenre": "A specific music genre or vibe consisting exclusively of English or Hindi music.",
        "playlistRecommendation": "A short description of the type of English or Hindi playlist to search for.",
        "trackRecommendations": ["Song 1 by Artist 1", "Song 2 by Artist 2", "Song 3 by Artist 3", "Song 4 by Artist 4"],
        "vibeCheck": "A small message check for the user."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response from AI");
    }
    
    const vibeData = JSON.parse(jsonMatch[0]);
    res.json(vibeData);

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate mood vibe", details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "Mood Service Up" });
});

app.listen(port, () => {
  console.log(`Mood/Music Service running on port ${port}`);
});
