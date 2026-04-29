import OpenAI from "openai";

// 1. Initialize OpenAI outside the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 2. Validate Method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const { question } = req.body;

    // 3. Validate Input
    if (!question) {
      return res.status(400).json({ error: "Missing 'question' in request body." });
    }

    // 4. AI Completion logic
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
      temperature: 0.7,
    });

    // 5. Return the result
    return res.status(200).json({
      answer: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("SmartSurplus Error:", error);
    return res.status(500).json({
      error: "An internal error occurred.",
      details: error.message
    });
  }
}
