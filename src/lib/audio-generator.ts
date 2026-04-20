// Audio generation using OpenAI TTS API
// Uses high-quality HD models for professional podcast audio

export interface AudioResult {
  buffer: Buffer;
  isAudio: boolean; // Always true - MP3 audio buffer
}

export async function generateAudio(script: string, topic: string, apiKey: string, gatewayUrl?: string, gatewayToken?: string): Promise<AudioResult> {
  // Validate that we have a script to convert
  if (!script || script.trim().length === 0) {
    throw new Error("Cannot generate audio: script is empty");
  }

  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }

  // Clean and optimize script for TTS
  // Remove markdown formatting, excessive punctuation, and normalize spacing
  let cleanedScript = script
    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic markdown
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1') // Remove underline markdown
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
    .replace(/\s{2,}/g, ' ') // Normalize multiple spaces
    .trim();

  if (cleanedScript.length === 0) {
    throw new Error("Cannot generate audio: script is empty after cleaning");
  }

  // Google TTS limit is max 5000 bytes per request.
  const MAX_LENGTH = 4800; // Safe limit
  if (cleanedScript.length > MAX_LENGTH) {
    console.warn(`Script length (${cleanedScript.length}) exceeds TTS limit (${MAX_LENGTH}). Truncating at sentence boundary.`);
    
    const truncated = cleanedScript.substring(0, MAX_LENGTH);
    
    const sentenceEndRegex = /[.!?][\s\n]+/g;
    const matches: Array<{ index: number; length: number }> = [];
    let match: RegExpExecArray | null;
    
    sentenceEndRegex.lastIndex = 0;
    while ((match = sentenceEndRegex.exec(truncated)) !== null) {
      matches.push({ index: match.index, length: match[0].length });
    }
    
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      cleanedScript = cleanedScript.substring(0, lastMatch.index + lastMatch.length).trim();
      if (!cleanedScript.endsWith('.') && !cleanedScript.endsWith('!') && !cleanedScript.endsWith('?')) {
        cleanedScript += ".";
      }
      cleanedScript += "\n\nThank you for listening!";
    } else {
      const words = truncated.split(/\s+/);
      words.pop();
      cleanedScript = words.join(' ').trim() + "...";
    }
    
    console.log(`Truncated script to ${cleanedScript.length} characters`);
  }
  
  const endpoint = gatewayUrl ? `${gatewayUrl}/openai/v1/audio/speech` : `https://api.openai.com/v1/audio/speech`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  if (gatewayToken) {
    headers['cf-aig-authorization'] = `Bearer ${gatewayToken}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'tts-1-hd', // Latest high-definition model
      input: cleanedScript,
      voice: 'alloy', // Professional, neutral podcast voice
      response_format: 'mp3'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI TTS API Error:", errorText);
    throw new Error(`OpenAI TTS API failed with status ${response.status}`);
  }

  const audioBlob = await response.blob();
  const buffer = Buffer.from(await audioBlob.arrayBuffer());
  
  return {
    buffer,
    isAudio: true,
  };
}
