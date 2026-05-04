import "dotenv/config"
import openAi from "openai";

const openai = new openAi ({
    apiKey: process.env.OPENAI_API_KEY
})

export async function aiResponse(userInquiry) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{role: "user", content: userInquiry}],
        });

        return response.choices[0].message.content;
    } catch (error) {
        throw new Error("AI Service failed: " + error.message);
    }
}

export default aiResponse;