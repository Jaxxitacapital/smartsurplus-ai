import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize using the API Key from your Vercel Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    // Use Gemini 1.5 Flash for the best speed/free-tier balance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are SmartSurplus AI, helping students with budgeting and loans."
    });

    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      answer: text,
      status: "SmartSurplus AI (Gemini) active 🚀"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI service is temporarily unavailable." });
  }
}
