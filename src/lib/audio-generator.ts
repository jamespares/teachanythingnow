// Audio generation using Google Cloud Text-to-Speech API
// Uses Journey voices for professional podcast-quality audio

export interface AudioResult {
  buffer: Buffer;
  isAudio: boolean; // Always true - MP3 audio buffer
}

export async function generateAudio(script: string, topic: string, apiKey: string): Promise<AudioResult> {
  // Validate that we have a script to convert
  if (!script || script.trim().length === 0) {
    throw new Error("Cannot generate audio: script is empty");
  }

  if (!apiKey) {
    throw new Error("Google TTS API key is missing.");
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
  
  // Call Google Cloud TTS API
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text: cleanedScript },
      voice: { languageCode: 'en-US', name: 'en-US-Journey-F' },
      audioConfig: { audioEncoding: 'MP3' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google TTS API Error:", errorText);
    throw new Error(`Google TTS API failed with status ${response.status}`);
  }

  const data = await response.json();
  const buffer = Buffer.from(data.audioContent, 'base64');
  
  return {
    buffer,
    isAudio: true,
  };
}
