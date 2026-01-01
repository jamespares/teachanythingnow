// Audio generation using OpenAI TTS API
// Uses high-definition TTS model for professional podcast-quality audio
import OpenAI from "openai";

// Initialize OpenAI client - throws error if API key is missing
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Please set it in your environment variables.");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 120000, // 120 seconds for audio generation (larger files)
    maxRetries: 2,
  });
}

export interface AudioResult {
  buffer: Buffer;
  isAudio: boolean; // Always true - MP3 audio buffer
}

export async function generateAudio(script: string, topic: string): Promise<AudioResult> {
  // Validate that we have a script to convert
  if (!script || script.trim().length === 0) {
    throw new Error("Cannot generate audio: script is empty");
  }

  const openai = getOpenAIClient();

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

  // OpenAI TTS API has a 4096 character limit
  // If script exceeds limit, truncate at sentence boundary
  // Use 4000 as safe limit to leave buffer for any encoding differences
  const MAX_LENGTH = 4000;
  if (cleanedScript.length > MAX_LENGTH) {
    console.warn(`Script length (${cleanedScript.length}) exceeds TTS limit (${MAX_LENGTH}). Truncating at sentence boundary.`);
    
    // Find the last sentence boundary before the limit
    // Look for sentence endings: . ! ? followed by space or newline
    const truncated = cleanedScript.substring(0, MAX_LENGTH);
    
    // Find all sentence endings - search backwards from the end
    const sentenceEndRegex = /[.!?][\s\n]+/g;
    const matches: Array<{ index: number; length: number }> = [];
    let match: RegExpExecArray | null;
    
    // Reset regex lastIndex to search from beginning
    sentenceEndRegex.lastIndex = 0;
    while ((match = sentenceEndRegex.exec(truncated)) !== null) {
      matches.push({ index: match.index, length: match[0].length });
    }
    
    if (matches.length > 0) {
      // Use the last complete sentence
      const lastMatch = matches[matches.length - 1];
      cleanedScript = cleanedScript.substring(0, lastMatch.index + lastMatch.length).trim();
      // Add a closing statement if we truncated
      if (!cleanedScript.endsWith('.') && !cleanedScript.endsWith('!') && !cleanedScript.endsWith('?')) {
        cleanedScript += ".";
      }
      cleanedScript += "\n\nThank you for listening!";
    } else {
      // No sentence boundary found, truncate at word boundary
      const words = truncated.split(/\s+/);
      words.pop(); // Remove last incomplete word
      cleanedScript = words.join(' ').trim() + "...";
    }
    
    console.log(`Truncated script to ${cleanedScript.length} characters`);
  }
  
  // Use OpenAI TTS to generate high-quality podcast-style audio
  // This will throw an error if TTS fails - no fallback to text
  const mp3 = await openai.audio.speech.create({
    model: "tts-1-hd", // High-definition model for best audio quality
    voice: "nova", // "nova" sounds conversational and professional for podcast content
    input: cleanedScript,
    speed: 0.95, // Slightly slower for clearer educational content
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  
  // Always return MP3 audio - never fallback to text
  return {
    buffer,
    isAudio: true,
  };
}

