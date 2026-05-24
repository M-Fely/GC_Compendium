import express from "express";
import aiResponse from "../services/AIService.js";
import { transformToVector } from "../services/embeddingService.js";
import { Document } from "../models/documents.js";

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

router.post("/", async (req, res) => {
  try {
    const userInquiry = req.body.question;

    if (!userInquiry || userInquiry.trim().length === 0) {
      return res.json({ answer: "Please enter a valid question." });
    }

    const greetings = userInquiry.toLowerCase().trim();
    if (
      greetings.startsWith("hi") ||
      greetings.startsWith("hello") ||
      greetings.startsWith("hey")
    ) {
      return res.json({ answer: "Hello! How can I help you today?" });
    }

    const expandedQuery = `
          ${userInquiry}
          program course specialization track degree list details
          BSEMC BSCS BSIT curriculum
    `;

    const searchEmbedding = await transformToVector(expandedQuery);

    const chunkScore = [];
    const documents = await Document.find();

    for (const stored of documents) {
      if (!stored.embedding || stored.embedding.length === 0) continue;

      const score = cosineSimilarity(searchEmbedding, stored.embedding);

      const text = (stored.text || "").toLowerCase();
      const section = (stored.section || "").toLowerCase();

      /* if (
        text.includes("bsemc") ||
        text.includes("specialization") ||
        text.includes("entertainment") ||
        text.includes("game development") ||
        text.includes("digital animation") ||
        section.includes("bsemc") ||
        section.includes("bsit") ||
        section.includes("bscs")
      ) {
        score += 0.15;
      } */

      chunkScore.push({
        score,
        text: stored.text,
        section: stored.section,
        fileName: stored.fileName,
      });
    }

    const topMatches = chunkScore.sort((a, b) => b.score - a.score).slice(0, 5);

    /* const topMatches = chunkScore
      .filter((chunk) => chunk.score > 0.72)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); */

    console.log("TOP MATCHES:", topMatches);

    if (!topMatches.length) {
      return res.json({
        answer:
          "I couldn't find relevant information in the uploaded documents.",
      });
    }

    const context = topMatches
      .map((m, i) => {
        return `[${i + 1}] FILE: ${m.fileName} SECTION: ${m.section} CONTENT: ${m.text}`;
      })
      .join("\n");

    const answer = await aiResponse(userInquiry, context);

    /* return res.json({
      answer,
      sources: topMatches.map((m) => ({
        fileName: m.fileName,
        section: m.section,
        text: m.text,
        score: m.score,
      })),
    }); */

    const uniqueSources = [
      ...new Map(
        topMatches.map((m) => [
          `${m.fileName}-${m.section}`,
          {
            fileName: m.fileName,
            section: m.section,
          },
        ]),
      ).values(),
    ];

    return res.json({
      answer,
      sources: uniqueSources,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      answer: "Something went wrong on our end.",
    });
  }
});

export default router;

/* import express from "express";
import aiResponse from "../services/AIService.js";
import { transformToVector } from "../services/embeddingService.js";
import { Document } from "../models/documents.js";

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
      res.json({ answer: "Please enter a valid question." });
      return;
    }

    const greetings = userInquiry.toLowerCase().trim();
    if (
      greetings.startsWith("hi") ||
      greetings.startsWith("hello") ||
      greetings.startsWith("hey")
    ) {
      res.json({ answer: "Hello! How can I help you today?" });
      return;
    }

    const reasoningKeywords = [
      "why",
      "how",
      "most important",
      "effect",
      "impact",
      "compare",
      "better",
      "advantage",
      "disadvantage",
    ];

    const isReasoningQuestion = reasoningKeywords.some((keyword) =>
      userInquiry.toLowerCase().includes(keyword),
    );
    const searchEmbedding = await transformToVector(userInquiry);
    console.log("Search Embedding: ", searchEmbedding);

    const chunkScore = [];
    const documents = await Document.find();
    for (const stored of documents) {
      const value = stored.embedding;

      if (!value || value.length === 0) continue;
      const score = cosineSimilarity(searchEmbedding, value);
      chunkScore.push({
        score: score,
        text: stored.text,
        section: stored.section,
        fileName: stored.fileName,
      });
    }
    const topMatches = chunkScore
      .filter((m) => m.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    console.log(topMatches);

    if (topMatches.length === 0) {
      res.json({ answer: "No uploaded documents found" });
      return;
    }

    const context = topMatches
      .map((m, i) => {
        return `[${i + 1}] FILE: ${m.fileName} SECTION: ${m.section} CONTENT: ${m.text}`;
      })
      .join("\n");

    if (topMatches[0].score < 0.3) {
      res.json({ answer: "No relevant information found.1" });
      console.log("The highest score is: ", topMatches[0].score);
      return;
    }

    const answer = await aiResponse(userInquiry, context);
    res.json({
      answer: answer,
      sources: topMatches.map((m) => ({
        fileName: m.fileName,
        section: m.section,
        text: m.text,
        score: m.score,
      })),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ answer: "Something went wrong on our end." });
  }
});

export default router;
 */
