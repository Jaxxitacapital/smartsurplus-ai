import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Use the Vercel AI SDK to manage the connection
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { question } = req.body;
    
    // This is the cleanest, most modern way to call AI in 2026
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: question || "Explain the 50/30/20 rule for students.",
      temperature: 0.7,
    });

    return res.status(200).json({ answer: text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
