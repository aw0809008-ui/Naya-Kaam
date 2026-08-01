import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { category, yearsExperience, description, city } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback bio if API key is not set yet
      return NextResponse.json({
        bio: `${yearsExperience || 5} saal se ${category || 'service'} ka kaam kar raha hoon ${city || 'Pakistan'} mein. Customer satisfaction aur high quality wiring/fitting meri pehli tarjeeh hai.`,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an AI assistant for "Naya Kaam", a local skilled worker marketplace in Pakistan.
Generate a concise, professional, and highly trustworthy 2-to-3 sentence bio written in clean Roman Urdu (with a few natural English words like "satisfaction", "experience", "quality" if natural).
Worker Details:
- Category / Trade: ${category}
- Years of Experience: ${yearsExperience} years
- City: ${city}
- Self Description / Skills: ${description || 'Hardworking, reliable service provider'}

Requirements:
- Must be 2-3 sentences.
- Tone must be respectful, professional, and reliable.
- Output ONLY the bio text without any quotation marks or commentary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const generatedBio = response.text?.trim() || `${yearsExperience} saal ka tajarba ${category} services mein. Behtareen kaam aur munasib daam ki guarantee.`;

    return NextResponse.json({ bio: generatedBio });
  } catch (error) {
    console.error("AI Bio Generation Error:", error);
    return NextResponse.json(
      {
        bio: "Experienced service provider committed to delivering top-notch, reliable work with complete customer satisfaction.",
      },
      { status: 200 }
    );
  }
}
