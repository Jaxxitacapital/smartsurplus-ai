import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API Key missing in Vercel" });

  try {
    // Force the SDK to use the stable v1 endpoint
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use the most basic model string
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
    });

    const { question } = req.body;

    // Use a more structured request to ensure compatibility
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: question || "Hello" }] }],
    });

    const response = await result.response;
    
    return res.status(200).json({
      answer: response.text(),
      status: "SmartSurplus Live 🚀"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: "API Version Mismatch", 
      details: error.message 
    });
  }
}
