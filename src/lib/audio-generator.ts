// Audio generation using Cloudflare Workers AI (Deepgram Aura-1)
// Context-aware TTS with natural pacing, billed through Cloudflare's unified billing.
// Model: @cf/deepgram/aura-1 — returns a ReadableStream of MP3 audio.

const AURA_MODEL = "@cf/deepgram/aura-1";
const AURA_SPEAKER = "asteria"; // Professional, clear English voice (enum: angus, asteria, arcas, orion, orpheus, athena, luna, zeus, perseus, helios, hera, stella)

// Aura-1 is optimised for conversational-length inputs; chunk long scripts at
// sentence boundaries and concatenate the resulting MP3 segments.
const MAX_CHUNK_LENGTH = 1500;

export interface AudioResult {
  buffer: Buffer;
  isAudio: boolean; // Always true - MP3 audio buffer
}

/**
 * Reads a ReadableStream into a single Buffer.
 */
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Buffer[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(Buffer.from(value instanceof Uint8Array ? value : new Uint8Array(value)));
    }
  }
  return Buffer.concat(chunks);
}

/**
 * Splits text into chunks of at most maxLen characters, breaking at sentence
 * boundaries where possible so each TTS segment ends naturally.
 */
function chunkText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    // Single sentence longer than maxLen: hard-split it
    if (sentence.length > maxLen) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      for (let i = 0; i < sentence.length; i += maxLen) {
        chunks.push(sentence.substring(i, i + maxLen).trim());
      }
      continue;
    }

    if ((current + sentence).length > maxLen) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(c => c.length > 0);
}

/**
 * Calls Aura-1 for a single text chunk and returns the MP3 bytes.
 */
async function synthesizeChunk(ai: Ai, text: string): Promise<Buffer> {
  const response: any = await ai.run(AURA_MODEL, {
    text,
    speaker: AURA_SPEAKER,
    encoding: "mp3",
  });

  if (response instanceof ReadableStream) {
    return streamToBuffer(response);
  }

  // Defensive: some runtimes may return raw bytes instead of a stream
  if (response instanceof Uint8Array) {
    return Buffer.from(response);
  }
  if (response instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(response));
  }

  throw new Error("Aura-1 returned an unexpected response type");
}

export async function generateAudio(script: string, topic: string, ai: Ai): Promise<AudioResult> {
  // Validate that we have a script to convert
  if (!script || script.trim().length === 0) {
    throw new Error("Cannot generate audio: script is empty");
  }

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

  const chunks = chunkText(cleanedScript, MAX_CHUNK_LENGTH);
  console.log(`Generating audio with Aura-1: ${cleanedScript.length} chars in ${chunks.length} chunk(s)`);

  const audioParts: Buffer[] = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const part = await synthesizeChunk(ai, chunks[i]);
      if (part.length > 0) {
        audioParts.push(part);
      } else {
        console.warn(`Aura-1 returned empty audio for chunk ${i + 1}/${chunks.length}`);
      }
    } catch (error: any) {
      console.error(`Aura-1 failed on chunk ${i + 1}/${chunks.length}:`, error?.message || error);
      throw new Error(`Audio generation failed: ${error?.message || error}`);
    }
  }

  if (audioParts.length === 0) {
    throw new Error("Audio generation produced no audio");
  }

  // MP3 frames concatenate cleanly — players treat the result as one file
  const buffer = Buffer.concat(audioParts);
  console.log(`Audio generated: ${buffer.length} bytes`);

  return {
    buffer,
    isAudio: true,
  };
}
