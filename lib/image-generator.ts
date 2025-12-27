// Image generation utility using OpenAI GPT-Image-1.5 API
// Generates high-quality educational images for presentations and materials
// GPT-Image-1.5 offers enhanced instruction following, faster generation (4x faster),
// improved text rendering, and precise editing capabilities

import OpenAI from "openai";

// Lazy initialization of OpenAI client to avoid errors when API key is missing
function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000, // 60 seconds - GPT-Image-1.5 is up to 4x faster than previous models
    maxRetries: 2,
  });
}

export interface ImageGenerationResult {
  images: Array<{
    url: string;
    description: string;
  }>;
  buffer?: Buffer; // For downloaded images
}

/**
 * Generates high-quality educational images related to the topic
 * Uses GPT-Image-1.5 for enhanced instruction following and faster generation
 * Images are generated to be consistent with the slide content and topic
 */
export async function generateImages(
  topic: string,
  slides: Array<{ title: string; content: string[] }>
): Promise<ImageGenerationResult> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    console.warn("OPENAI_API_KEY not set, skipping image generation");
    return {
      images: [],
    };
  }

  try {
    // Generate prompts for image generation based on the topic and ALL slides for consistency
    const imagePrompts = await generateImagePrompts(topic, slides);
    
    const images: Array<{ url: string; description: string }> = [];
    
    // Generate up to 3 high-quality images that are consistent with the topic and slide content
    for (let i = 0; i < Math.min(imagePrompts.length, 3); i++) {
      try {
        const prompt = imagePrompts[i];
        console.log(`Generating image ${i + 1} with prompt: ${prompt.prompt.substring(0, 100)}...`);
        
        // Ensure prompt explicitly excludes text
        const noTextPrompt = `${prompt.prompt}. CRITICAL: This image must contain NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO signs, and NO written content of any kind. Pure visual illustration only.`;
        
        // Try GPT-Image-1.5 first (latest model), fallback to DALL-E 3 if not available
        let response;
        try {
          response = await openai.images.generate({
            model: "gpt-image-1.5", // Using GPT-Image-1.5 - latest model with enhanced instruction following and faster generation
            prompt: noTextPrompt,
            n: 1,
            size: "1024x1024", // High resolution
            quality: "standard",
          });
        } catch (modelError: any) {
          // Fallback to DALL-E 3 if GPT-Image-1.5 is not available or model name is incorrect
          if (modelError?.code === "invalid_model" || modelError?.message?.includes("model")) {
            console.warn("GPT-Image-1.5 not available, falling back to DALL-E 3");
            response = await openai.images.generate({
              model: "dall-e-3",
              prompt: noTextPrompt,
              n: 1,
              size: "1024x1024",
              quality: "standard",
            });
          } else {
            throw modelError; // Re-throw if it's a different error
          }
        }

        console.log(`Image generation response:`, JSON.stringify(response, null, 2));
        
        const imageUrl = response.data?.[0]?.url;
        if (imageUrl) {
          console.log(`Successfully generated image ${i + 1}: ${imageUrl}`);
          images.push({
            url: imageUrl,
            description: prompt.description,
          });
        } else {
          console.warn(`No URL in response for image ${i + 1}:`, response);
        }
      } catch (error: any) {
        console.error(`Error generating image ${i + 1}:`, error?.message || error);
        console.error(`Full error:`, error);
        // Continue with other images even if one fails
      }
    }
    
    console.log(`Total images generated: ${images.length}`);

    return {
      images,
    };
  } catch (error) {
    console.error("Error generating images:", error);
    return {
      images: [],
    };
  }
}

/**
 * Downloads images from URLs and returns them as buffers
 */
export async function downloadImages(
  images: Array<{ url: string; description: string }>
): Promise<Buffer[]> {
  const buffers: Buffer[] = [];
  
  for (const image of images) {
    try {
      const response = await fetch(image.url);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        buffers.push(Buffer.from(arrayBuffer));
      }
    } catch (error) {
      console.error(`Error downloading image:`, error);
    }
  }
  
  return buffers;
}

/**
 * Generates appropriate image prompts using GPT-4o
 * Creates prompts that will generate educational, relevant images consistent with the topic and slides
 */
async function generateImagePrompts(
  topic: string,
  slides: Array<{ title: string; content: string[] }>
): Promise<Array<{ prompt: string; description: string }>> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    // Fallback prompts if OpenAI is not available - explicitly no text
    return [
      {
        prompt: `Professional educational illustration about ${topic}, clear and informative, suitable for teaching materials, high quality, visually engaging. NO text, NO words, NO labels, NO captions, NO written content. Pure visual illustration only.`,
        description: `Main illustration for ${topic}`,
      },
    ];
  }

  try {
    // Use ALL slides for comprehensive context to ensure consistency
    const fullSlideContent = slides
      .map((s, index) => `Slide ${index + 1} - ${s.title}: ${s.content.join(". ")}`)
      .join("\n\n");

    // Extract key visual concepts from all slides
    const keyConcepts = slides
      .flatMap(s => s.content)
      .filter((_, i) => i < 10) // Limit to avoid token overflow
      .join(", ");

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for high-quality prompt generation
      messages: [
        {
          role: "system",
          content: "You create image generation prompts for educational content. Return ONLY valid JSON: {\"prompts\": [{\"prompt\": \"...\", \"description\": \"...\"}]}. Create 2-3 detailed prompts (60-100 words each) for educational images. CRITICAL: Images must NEVER contain any text, words, letters, numbers, labels, captions, or written content of any kind. Only visual illustrations, diagrams, and graphics.",
        },
        {
          role: "user",
          content: `Create 2-3 image prompts for educational content about "${topic}".

Slide content:
${fullSlideContent}

Key concepts: ${keyConcepts}

CRITICAL REQUIREMENTS for each prompt (60-100 words):
- NO TEXT: The image must contain ZERO text, words, letters, numbers, labels, captions, signs, or written content
- Visual only: Pure illustration, diagram, or graphic representation
- Include explicit instruction: "no text, no words, no labels, no captions, no written content"
- Include style: "professional educational illustration, clean design, visual only"
- Focus on different key aspects of "${topic}"
- Make it suitable for presentations

Return JSON with prompts and descriptions.`,
        },
      ],
      temperature: 0.8, // Creative prompts
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.prompts && Array.isArray(parsed.prompts)) {
          return parsed.prompts;
        }
      }
    }
  } catch (error) {
    console.error("Error generating image prompts:", error);
  }

  // Enhanced fallback prompts that are more specific - explicitly no text
  const mainConcept = slides[0]?.title || topic;
  return [
    {
      prompt: `Professional educational illustration about ${topic}, specifically showing ${mainConcept}, clear and informative, suitable for teaching materials, high quality, visually engaging, educational style. CRITICAL: NO text, NO words, NO labels, NO captions, NO written content. Pure visual illustration only.`,
      description: `Main illustration for ${topic}: ${mainConcept}`,
    },
    {
      prompt: `Educational diagram or visual representation of key concepts in ${topic}, showing practical applications or examples mentioned in the lesson, professional style, suitable for presentations, clear and informative. CRITICAL: NO text, NO words, NO labels, NO captions, NO written content. Pure visual diagram only.`,
      description: `Conceptual diagram for ${topic}`,
    },
  ];
}

