import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ category: "", city: "", area: "", urgency: "" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Basic fallback keyword matching
      const q = query.toLowerCase();
      let category = "";
      if (q.includes("plumber")) category = "Plumber";
      else if (q.includes("electrician") || q.includes("bijli")) category = "Electrician";
      else if (q.includes("ac") || q.includes("cool")) category = "AC Technician";
      else if (q.includes("tailor") || q.includes("silai")) category = "Tailor";
      else if (q.includes("tutor") || q.includes("math") || q.includes("tuition")) category = "Tutor";
      else if (q.includes("driver") || q.includes("gari")) category = "Driver";
      else if (q.includes("makeup") || q.includes("parlor")) category = "Makeup Artist";
      else if (q.includes("carpenter") || q.includes("wood")) category = "Carpenter";
      else if (q.includes("painter") || q.includes("paint")) category = "Painter";
      else if (q.includes("mehndi")) category = "Mehndi Artist";
      else if (q.includes("cook") || q.includes("khana")) category = "Home Cook";

      let city = "";
      if (q.includes("karachi") || q.includes("gulshan") || q.includes("dha") || q.includes("pechs")) city = "Karachi";
      else if (q.includes("lahore") || q.includes("gulberg") || q.includes("model town")) city = "Lahore";
      else if (q.includes("islamabad") || q.includes("f-8") || q.includes("g-11")) city = "Islamabad";
      else if (q.includes("rawalpindi") || q.includes("pindi")) city = "Rawalpindi";
      else if (q.includes("faisalabad")) city = "Faisalabad";

      let area = "";
      if (q.includes("gulshan")) area = "Gulshan-e-Iqbal";
      else if (q.includes("gulberg")) area = "Gulberg III";
      else if (q.includes("dha")) area = "DHA";
      else if (q.includes("f-8")) area = "F-8";

      return NextResponse.json({ category, city, area, urgency: "asap" });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const categoriesList = [
      "Electrician",
      "Plumber",
      "AC Technician",
      "Carpenter",
      "Tailor",
      "Tutor",
      "Driver",
      "Makeup Artist",
      "Painter",
      "Mehndi Artist",
      "Home Cook",
    ];

    const citiesList = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"];

    const prompt = `Analyze this natural language search query from a Pakistani customer looking for a local skilled service provider:
Query: "${query}"

Extract the following structured parameters:
1. category: Pick the closest exact string match from this list if applicable: ${categoriesList.join(", ")}. If not clear, return empty string "".
2. city: Pick the closest city from: ${citiesList.join(", ")}. If mentioned area belongs to a known city (e.g. Gulshan -> Karachi, Gulberg -> Lahore, F-8 -> Islamabad, Commercial Market -> Rawalpindi), infer the city. If not clear, return "".
3. area: Specific area or neighborhood mentioned (e.g. "Gulshan-e-Iqbal", "DHA Phase 5", "F-8", "Commercial Market", etc.). If not mentioned, return "".
4. urgency: Note on timing e.g. "urgent", "tomorrow morning", "this weekend" or "".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            city: { type: Type.STRING },
            area: { type: Type.STRING },
            urgency: { type: Type.STRING },
          },
        },
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const parsed = JSON.parse(jsonText);

    return NextResponse.json({
      category: parsed.category || "",
      city: parsed.city || "",
      area: parsed.area || "",
      urgency: parsed.urgency || "",
    });
  } catch (error) {
    console.error("AI Parse Search Error:", error);
    return NextResponse.json({ category: "", city: "", area: "", urgency: "" }, { status: 200 });
  }
}
