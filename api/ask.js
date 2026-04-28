import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { question } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SmartSurplus AI assistant helping students with finance and budgeting.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    res.status(200).json({
      answer: response.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
