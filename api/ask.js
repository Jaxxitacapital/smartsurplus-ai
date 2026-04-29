import OpenAI from "openai";

// Initialize outside the handler to take advantage of "warm starts"
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 1. Validate Method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const { question } = req.body;

    // 2. Validate Input
    if (!question) {
      return res.status(400).json({ error: "Missing 'question' in request body." });
    }

    // 3. AI Completion
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective for 2026
      messages: [
        {
          role: "system",
          content: "You are SmartSurplus AI, a helpful assistant for students. Provide expert advice on budgeting, student loans, saving strategies, and general financial literacy. Keep answers concise and encouraging.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7, // Adds a touch of personality to the advice
    });

    // 4. Successful Response
    return res.status(200).json({
      answer: response.choices[0].message.content,
      usage: response.usage, // Optional: helpful for tracking token costs
    });

  } catch (error) {
    console.error("SmartSurplus Error:", error);
    
    // Check for specific OpenAI authentication errors
    if (error.status === 401) {
      return res.status(401).json({ error: "Invalid API Key. Check Vercel Environment Variables." });
    }

    return res.status(500).json({
      error: "An internal error occurred. Please try again later.",
      details: error.message
    });
  }
}
