// Image generation utility using OpenAI GPT Image 1 Mini API
// Generates high-quality educational images for presentations and materials

import OpenAI from "openai";

// Lazy initialization of OpenAI client to avoid errors when API key is missing
function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 120000, // 120 seconds for image generation (can be slow)
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
 * Uses GPT Image 1 Mini for cost-efficient, high-quality output
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
        
        const response = await openai.images.generate({
          model: "gpt-image-1-mini", // Using GPT Image 1 Mini for cost-efficient, high-quality images
          prompt: prompt.prompt, // Prompt already includes topic and slide context for consistency
          n: 1,
          size: "1024x1024", // High resolution
        });

        const imageUrl = response.data[0]?.url;
        if (imageUrl) {
          images.push({
            url: imageUrl,
            description: prompt.description,
          });
        }
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error);
        // Continue with other images even if one fails
      }
    }

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
 * Generates appropriate image prompts using GPT-5
 * Creates prompts that will generate educational, relevant images consistent with the topic and slides
 */
async function generateImagePrompts(
  topic: string,
  slides: Array<{ title: string; content: string[] }>
): Promise<Array<{ prompt: string; description: string }>> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    // Fallback prompts if OpenAI is not available
    return [
      {
        prompt: `Professional educational illustration about ${topic}, clear and informative, suitable for teaching materials, high quality, visually engaging`,
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
      model: "gpt-5", // Using GPT-5 for high-quality prompt generation
      messages: [
        {
          role: "system",
          content: `You are an expert educational visual designer specializing in creating compelling imagery for learning materials. You understand how visuals enhance comprehension and retention.

Your image design principles:
- Visual clarity: Simple, focused compositions that communicate one key concept
- Educational relevance: Images must directly support and illustrate the learning content
- Professional quality: Clean, modern aesthetic suitable for presentations
- Universal appeal: Appropriate for diverse audiences and learning contexts

Generate 2-3 specific, detailed image prompts that will create high-quality educational visuals. Return ONLY valid JSON in this exact format: {"prompts": [{"prompt": "...", "description": "..."}]}. 

Each prompt must:
- Be 80-150 words with specific visual details
- Focus on one key concept from the slides
- Include style guidance for professional educational aesthetics
- Avoid text/labels (image models render text poorly)
- Describe composition, colors, perspective, and style`,
        },
        {
          role: "user",
          content: `Create 2-3 image generation prompts for educational content about "${topic}".

CRITICAL: The images must visually represent and be consistent with the slide content below. Each image should illustrate a key concept that helps learners understand "${topic}".

Complete slide content for context:
${fullSlideContent}

Key concepts to visualize: ${keyConcepts}

For each image prompt, include:

1. SUBJECT: What is the main visual focus? (specific object, diagram, scene, or concept visualization)
2. COMPOSITION: How is it arranged? (centered, rule of thirds, close-up, wide shot)
3. STYLE: "Professional educational illustration, clean modern design, suitable for presentations"
4. COLORS: Suggest a professional color palette (blues, greens, or topic-appropriate colors)
5. DETAILS: Specific visual elements that reinforce the educational concept
6. MOOD: Professional, approachable, and educational

Requirements:
- Each prompt: 80-150 words with specific visual details
- NO text, labels, or words in the images
- Each image covers a DIFFERENT key aspect of "${topic}"
- Focus on concepts that benefit from visual explanation
- Professional quality suitable for classroom/business presentations

Return JSON with prompts and brief descriptions explaining how each image supports learning about "${topic}".`,
        },
      ],
      temperature: 0.7, // Lower temperature for more consistent, focused prompts
      max_tokens: 1200, // Increased for more detailed prompts
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

  // Enhanced fallback prompts that are more specific
  const mainConcept = slides[0]?.title || topic;
  return [
    {
      prompt: `Professional educational illustration about ${topic}, specifically showing ${mainConcept}, clear and informative, suitable for teaching materials, high quality, visually engaging, educational style`,
      description: `Main illustration for ${topic}: ${mainConcept}`,
    },
    {
      prompt: `Educational diagram or visual representation of key concepts in ${topic}, showing practical applications or examples mentioned in the lesson, professional style, suitable for presentations, clear and informative`,
      description: `Conceptual diagram for ${topic}`,
    },
  ];
}

