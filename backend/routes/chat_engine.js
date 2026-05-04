import express from "express";
import aiResponse from "../services/AIService.js";
import { transformToVector } from "../services/embeddingService.js";
import { globalArray } from "../services/vectorStore.js";

const router = express.Router();

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

router.post("/", async (req, res, next) => {
  try {
    const userInquiry = req.body.question;
    if (!userInquiry || userInquiry.trim().length === 0) {
      res.send("Please enter a valid question.");
      return;
    }

    const searchEmbedding = await transformToVector(userInquiry);
    console.log("Search Embedding: ", searchEmbedding);

    let highestScore = -1;
    let bestMatch = null;
    for (const stored of globalArray) {
      const value = stored.embedding;
      const score = cosineSimilarity(searchEmbedding, value);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = stored;
      }
    }
    console.log(highestScore);
    console.log(bestMatch);
    if (highestScore < 0.5) {
      res.send("No relevant information found.1");
      console.log("The highest score is: ", highestScore);
      return;
    }

    if (!bestMatch) {
      res.send("No relevant information found.2");
      return;
    }

    const answer = await aiResponse(userInquiry, bestMatch.text);
    res.json({
      answer: answer,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong on our end.");
  }
});

export default router;
