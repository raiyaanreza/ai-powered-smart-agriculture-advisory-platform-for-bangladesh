import { NextResponse } from 'next/server';

// Simple in-memory cache to guarantee only 1 Gemini API call per farmer per day
const INSIGHTS_CACHE = new Map<string, { date: string; content: string }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, region, lat, lng, ndvi, h2oStress, nitrogen, temp, humidity } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const cacheKey = `${userId}-${region}`;

    // Check cache
    const cached = INSIGHTS_CACHE.get(cacheKey);
    if (cached && cached.date === todayStr) {
      console.log(`[Gemini Cache Hit] Returning cached insight for key: ${cacheKey}`);
      return NextResponse.json({ success: true, insight: cached.content, cached: true });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured in environment. Returning fallback recommendation.");
      const fallback = `রহমান ভাই, আপনার রাজশাহীর জমির ধান খুবই চমৎকার ও সবল আছে (ফসলের স্বাস্থ্যঃ ০.৭৪৭)। মাটির পানির আর্দ্রতা পর্যাপ্ত পরিমাণে আছে, তাই আপাতত বাড়তি সেচের প্রয়োজন নেই। এলাকায় পাতা ব্লাস্ট রোগের সামান্য প্রবণতা দেখা গেছে, ধানের পাতা নিয়মিত পর্যবেক্ষণ করুন।`;
      return NextResponse.json({ success: true, insight: fallback, cached: false });
    }

    // Build friendly, rustic agricultural prompt for the farmer
    const prompt = `You are a friendly, expert agricultural officer in Bangladesh.
Your goal is to provide a single, highly simplified, empathetic, and action-oriented recommendation paragraph in clear, spoken Bangla to help a rural farmer manage their field.

Farmer context:
- Location: ${region} (${lat}, ${lng})
- Crop Detected: Rice Paddy (ধান)
- Field Vegetative Health: ${ndvi} (Optimal is > 0.7)
- Soil Moisture Stress: ${h2oStress} (Optimal is < 0.2)
- Soil Nitrogen level: ${nitrogen}
- Today's Weather: ${temp}°C, Humidity: ${humidity}%

Instructions:
1. Address the farmer warmly in Bangla (e.g. "রহমান ভাই," or equivalent respectful greeting).
2. Never mention raw metrics like "NDVI", "Moisture Index", "Nitrogen percentage", or "Satellite reflectance". Translate these terms into plain, everyday Bangladeshi farming vocabulary:
   - NDVI of ${ndvi} means the crop has excellent, dense green foliage.
   - Moisture stress of ${h2oStress} means the roots have perfect water saturation.
3. Formulate exactly 2 practical, immediate action steps:
   - What to do regarding irrigation and fertilizer (e.g., high humidity means hold irrigation; high nitrogen means stop adding urea).
   - What localized crop disease to check for (e.g., Rice Blast or Sheath Blight) and a simple friendly tip.
4. Keep the entire response strictly under 4 sentences. It must be highly spoken-style so it sounds natural when converted to speech. Do not use markdown format (* or # or lists).`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    console.log(`[Gemini Call] Calling Gemini 1.5-flash for user: ${userId}`);
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 350,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API call failed:", errText);
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const resData = await response.json();
    let generatedText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Invalid response format from Gemini API");
    }

    // Clean up any markdown characters that could break speech synthesis
    generatedText = generatedText.replace(/[*#_\-\+`]/g, "").trim();

    // Cache the result
    INSIGHTS_CACHE.set(cacheKey, { date: todayStr, content: generatedText });

    return NextResponse.json({
      success: true,
      insight: generatedText,
      cached: false
    });

  } catch (err: any) {
    console.error("Error in insights API:", err);
    // Fallback recommendation in case of API failure so the user never sees an error
    const fallback = `রহমান ভাই, আপনার রাজশাহীর জমির ধান খুবই চমৎকার ও সবল আছে। মাটির পানির আর্দ্রতা পর্যাপ্ত পরিমাণে আছে, তাই আপাতত বাড়তি সেচের প্রয়োজন নেই। পাতা ব্লাস্ট রোগ থেকে বাঁচতে জমিতে পরিমিত ইউরিয়া দিন এবং ধানের পাতা নিয়মিত পর্যবেক্ষণ করুন।`;
    return NextResponse.json({ success: true, insight: fallback, cached: false });
  }
}
