// Audio generation using OpenAI TTS API
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
    // Use OpenAI TTS to generate podcast-style audio
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // "nova" sounds more conversational/podcast-like
      input: script,
      speed: 1.0, // Normal speaking speed
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

