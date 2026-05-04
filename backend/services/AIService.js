import "dotenv/config";
import openAi from "openai";

const openai = new openAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function aiResponse(userInquiry, context) {
  try {
    const prompt = `You are a helpful document-based assistant for Gordon College. 
    You MUST use ONLY the provided context and must not use any external knowledge. 
    If the answer is not in the context, respond exactly: 'The information is not available in the document.'`;

    const dataInformation = `
    ### CONTEXT DATA
    ${context}
    ---
    ### USER QUESTION
    ${userInquiry}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: dataInformation,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error("AI Service failed: " + error.message);
  }
}

export default aiResponse;
