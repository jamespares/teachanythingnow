// Audio generation using OpenAI TTS API
// Uses high-definition TTS model for professional podcast-quality audio
import OpenAI from "openai";

// Lazy initialization of OpenAI client to avoid errors when API key is missing
function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 120000, // 120 seconds for audio generation (larger files)
    maxRetries: 2,
  });
}

export interface AudioResult {
  buffer: Buffer;
  isAudio: boolean; // true for MP3, false for text fallback
}

export async function generateAudio(script: string, topic: string): Promise<AudioResult> {
  const openai = getOpenAIClient();
  
  // If OpenAI API key is not configured, return a placeholder text file
  if (!openai) {
    console.warn("OPENAI_API_KEY not set, returning text file placeholder");
    const audioScript = `Podcast Script for ${topic}\n\n${script}\n\nNote: Configure OPENAI_API_KEY to generate actual audio.`;
    return {
      buffer: Buffer.from(audioScript, "utf-8"),
      isAudio: false,
    };
  }

  try {
    // Clean and optimize script for TTS
    // Remove markdown formatting, excessive punctuation, and normalize spacing
    const cleanedScript = script
      .replace(/#{1,6}\s*/g, '') // Remove markdown headers
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic markdown
      .replace(/_{1,2}([^_]+)_{1,2}/g, '$1') // Remove underline markdown
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .replace(/\s{2,}/g, ' ') // Normalize multiple spaces
      .trim();
    
    // Use OpenAI TTS to generate high-quality podcast-style audio
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd", // High-definition model for best audio quality
      voice: "nova", // "nova" sounds conversational and professional for podcast content
      input: cleanedScript,
      speed: 0.95, // Slightly slower for clearer educational content
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return {
      buffer,
      isAudio: true,
    };
  } catch (error) {
    console.error("Error generating audio:", error);
    // Fallback to text file if TTS fails
    const audioScript = `Podcast Script for ${topic}\n\n${script}\n\nError: Could not generate audio. Please check your OpenAI API configuration.`;
    return {
      buffer: Buffer.from(audioScript, "utf-8"),
      isAudio: false,
    };
  }
}

