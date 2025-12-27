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
  const cleanedScript = script
    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic markdown
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1') // Remove underline markdown
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
    .replace(/\s{2,}/g, ' ') // Normalize multiple spaces
    .trim();

  if (cleanedScript.length === 0) {
    throw new Error("Cannot generate audio: script is empty after cleaning");
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

