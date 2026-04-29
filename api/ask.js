import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is missing." });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    /**
     * FORCE v1 Stable Endpoint
     * In 2026, gemini-1.5-flash is often disabled on v1beta.
     * We use gemini-2.0-flash for better 50/30/20 rule explanations.
     */
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
    });

    const { question } = req.body;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: question || "Hello" }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    const response = await result.response;
    
    return res.status(200).json({
      answer: response.text(),
      status: "SmartSurplus AI (v2.0) Live 🚀"
    });

  } catch (error) {
    console.error("Gemini Deployment Error:", error);
    return res.status(500).json({ 
      error: "Model not found or region restricted", 
      details: error.message,
      tip: "If this persists, go to AI Studio and check which models are listed as 'Available' for your region."
    });
  }
}
