import "dotenv/config";
import openAi from "openai";

const openai = new openAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function aiResponse(userInquiry, context) {
  try {
    const prompt = `
    You are an AI assistant for GC Compendium, a document-based knowledge system.

    Your job is to answer questions using ONLY the provided context.

    ---

    RULES:
    1. Use the context as the primary source of truth.
    2. If the answer is explicitly OR partially present, ALWAYS attempt to answer.
    3. You are allowed to infer missing connections using logical reasoning based on the context.
    4. The section "Methods", "Processes", or "Workflow" usually represents SERVICES or OPERATIONS.
    5. NEVER say information is missing if relevant details exist in the context.
    6. Only say you cannot find the answer if the context is completely unrelated to the question.
    7. Do NOT be overly strict or conservative.
    8. Do NOT refuse when partial but usable information exists.

    ---

    FORMAT RULES:
    - Use clear headings when needed
    - Use bullet points for lists
    - Keep answers structured and readable

`;

    /* You are an AI assistant for GC Compendium.

Answer the user's question using the provided document context.

RULES:
1. If the answer is directly stated in the context, answer clearly.
2. If the question requires reasoning, inference, comparison, or explanation:
   - Use logical reasoning based on the context.
   - Support the answer using document information.
3. If the answer is not directly written but can be inferred,
   provide the best logical answer.
4. Only say:
   "The uploaded documents do not contain enough information to answer that question."
   if the context is unrelated or insufficient.
5. Do not invent unrelated facts.
6. Format answers clearly and professionally.
7. Use proper spacing and line breaks.
8. When listing items:
   - Use bullet points or numbered lists.
   - Place each item on a separate line.
   - Never place multiple numbered items in one paragraph.
9. Organize long answers into readable sections when appropriate. */

    const dataInformation = `
    CONTEXT (from uploaded documents):
    ${context}

    QUESTION:
    ${userInquiry}

    INSTRUCTION:
    Answer using the context above. If relevant information exists, extract and explain it clearly.
`;
    /*   const dataInformation = `
    ### CONTEXT DATA
    ${context}
    ---
    ### USER QUESTION
    ${userInquiry}
    `;
 */
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
