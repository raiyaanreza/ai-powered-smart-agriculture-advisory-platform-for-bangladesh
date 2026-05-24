import { NextResponse } from 'next/server';

function splitTextIntoChunks(text: string, maxLength = 180): string[] {
  // Clean up markdown/unsupported characters
  const clean = text.replace(/[*#_\-+`]/g, " ").replace(/\s+/g, " ").trim();
  
  // Split on sentence boundaries: । (Bangla full stop), . (English full stop), ? (question), ! (exclamation), \n (newline), or , (comma)
  const sentences = clean.split(/([।.?!\n,])/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (let i = 0; i < sentences.length; i++) {
    const segment = sentences[i];
    if (!segment) continue;

    if ((currentChunk + segment).length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = segment;
    } else {
      currentChunk += segment;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function generateTTS(text: string) {
  const chunks = splitTextIntoChunks(text, 180);
  console.log(`[Google TTS Proxy] Splitting text (${text.length} chars) into ${chunks.length} chunks`);

  const buffers: Buffer[] = [];
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  // Fetch chunks sequentially to preserve order
  for (const chunk of chunks) {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) continue;
    
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(trimmedChunk)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent
      }
    });

    if (!response.ok) {
      throw new Error(`Google TTS API failed with status ${response.status} for chunk: "${trimmedChunk.substring(0, 20)}..."`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('audio/')) {
      const errText = await response.text();
      console.error(`[Google TTS Proxy] Expected audio response, got "${contentType}":`, errText.substring(0, 100));
      throw new Error(`Google TTS API returned non-audio response (${contentType}). You may be rate limited or blocked.`);
    }

    const arrayBuffer = await response.arrayBuffer();
    buffers.push(Buffer.from(arrayBuffer));
  }

  if (buffers.length === 0) {
    throw new Error('No audio generated');
  }

  const finalBuffer = Buffer.concat(buffers);
  console.log(`[Google TTS Proxy] Successfully concatenated audio. Total size: ${finalBuffer.length} bytes`);

  return new Response(finalBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    
    if (!text) {
      return NextResponse.json({ success: false, error: 'Text parameter is required' }, { status: 400 });
    }

    return await generateTTS(text);
  } catch (err: any) {
    console.error("Error in Google TTS proxy route (GET):", err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.text;
    
    if (!text) {
      return NextResponse.json({ success: false, error: 'Text parameter is required' }, { status: 400 });
    }

    return await generateTTS(text);
  } catch (err: any) {
    console.error("Error in Google TTS proxy route (POST):", err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 });
  }
}
