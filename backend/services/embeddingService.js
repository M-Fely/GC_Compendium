import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transformToVector(text) {
  try {
    if (
      text == null ||
      (typeof text === "string" && text.trim().length === 0)
    ) {
      return null;
    } else {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      return embedding.data[0].embedding;
    }
  } catch (error) {
    throw new Error("Failed to generate embedding: " + error.message);
  }
}
