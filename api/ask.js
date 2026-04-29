import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // 1. Check if the API key is present in the environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing in Vercel settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Use the base model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { question } = req.body;

    // 3. Simple generation call
    const result = await model.generateContent(question || "Hello");
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      answer: text,
      status: "SmartSurplus AI Online 🚀"
    });

  } catch (error) {
    console.error("Gemini Error Log:", error);
    return res.status(500).json({ 
      error: "Connection failed", 
      details: error.message,
      suggestion: "Check if your API key has 'Generative Language API' enabled in Google Cloud Console."
    });
  }
}
