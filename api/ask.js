import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST method" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing 'question' in body" });
    }

    // FIX: Using the fully qualified model name and the correct method
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: question }] }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      answer: text,
      status: "SmartSurplus AI Online 🚀"
    });

  } catch (error) {
    console.error("Detailed Gemini Error:", error);
    return res.status(500).json({ 
      error: "AI service failed to respond", 
      details: error.message 
    });
  }
}
