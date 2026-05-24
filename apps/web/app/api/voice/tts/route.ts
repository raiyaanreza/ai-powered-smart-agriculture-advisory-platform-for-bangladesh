import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    
    if (!text) {
      return NextResponse.json({ success: false, error: 'Text parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyB8WKUO9x-J00N1w9Sw31QzcA_mKDHEfy0";
    const model = "gemini-3.1-flash-tts-preview";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log(`[Gemini TTS] Generating speech for text length: ${text.length} chars using model: ${model}`);
    
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
                text: text
              }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                // Aoede is a very clear and high-quality voice
                voiceName: "Aoede"
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Gemini TTS API] API call failed:", errText);
      return NextResponse.json({ success: false, error: `Gemini API failed with status ${response.status}` }, { status: 500 });
    }

    const resData = await response.json();
    const candidate = resData?.candidates?.[0];
    const part = candidate?.content?.parts?.find((p: any) => p.inlineData);
    
    if (!part || !part.inlineData || !part.inlineData.data) {
      console.error("[Gemini TTS API] No audio data in response:", JSON.stringify(resData));
      return NextResponse.json({ success: false, error: "No audio data returned from Gemini" }, { status: 500 });
    }

    const base64Pcm = part.inlineData.data;
    const pcmBuffer = Buffer.from(base64Pcm, 'base64');
    
    // Construct WAV file with header for 24000Hz, 16-bit, mono PCM
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    
    const wavHeader = Buffer.alloc(44);
    wavHeader.write("RIFF", 0); // ChunkID
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4); // ChunkSize
    wavHeader.write("WAVE", 8); // Format
    wavHeader.write("fmt ", 12); // Subchunk1ID
    wavHeader.writeUInt32LE(16, 16); // Subchunk1Size
    wavHeader.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
    wavHeader.writeUInt16LE(numChannels, 22); // NumChannels
    wavHeader.writeUInt32LE(sampleRate, 24); // SampleRate
    wavHeader.writeUInt32LE(byteRate, 28); // ByteRate
    wavHeader.writeUInt16LE(blockAlign, 32); // BlockAlign
    wavHeader.writeUInt16LE(bitsPerSample, 34); // BitsPerSample
    wavHeader.write("data", 36); // Subchunk2ID
    wavHeader.writeUInt32LE(pcmBuffer.length, 40); // Subchunk2Size
    
    const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
    
    return new Response(wavBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=86400',
      }
    });

  } catch (err: any) {
    console.error("Error in Gemini TTS route:", err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
