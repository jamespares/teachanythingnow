// Image generation utility using Google Gemini Nano Banana
// Generates high-quality educational images for presentations and materials
// Gemini Nano Banana offers fast, efficient image generation

// Lazy initialization to check if API key is available
function getGeminiApiKey(): string | null {
  // Check for common environment variable names
  return process.env.GOOGLE_GEMINI_API_KEY || 
         process.env.GEMINI_API_KEY || 
         process.env.BANANA_API_KEY ||
         null;
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
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    console.warn("Google Gemini API key not set, skipping image generation");
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
        console.log(`Generating image ${i + 1} with Gemini Nano Banana: ${prompt.prompt.substring(0, 100)}...`);
        
        // Ensure prompt explicitly excludes text
        const noTextPrompt = `${prompt.prompt}. CRITICAL: This image must contain NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO signs, and NO written content of any kind. Pure visual illustration only.`;
        
        // Use Google Gemini Nano Banana for image generation
        // Try Banana.dev API first (if using Banana.dev hosting)
        let response;
        let imageUrl: string | null = null;
        
        try {
          // Try Banana.dev endpoint first
          response = await fetch(
            `https://api.banana.dev/v1/models/gemini-2.5-flash-image-preview/generate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                prompt: noTextPrompt,
                num_outputs: 1,
                width: 1024,
                height: 1024,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            imageUrl = data.images?.[0]?.url || data.image_url || data.url;
            console.log(`Generated via Banana.dev API`);
          }
        } catch (bananaError) {
          console.log(`Banana.dev API failed, trying Google Gemini API directly...`);
        }

        // If Banana.dev didn't work, try Google Gemini API directly
        if (!imageUrl) {
          try {
            response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: noTextPrompt
                    }]
                  }],
                  generationConfig: {
                    temperature: 0.7,
                    responseModalities: ["IMAGE"],
                  }
                }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              const imageData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
              
              if (imageData) {
                // Convert base64 to data URL
                imageUrl = `data:image/png;base64,${imageData}`;
                console.log(`Generated via Google Gemini API`);
              }
            } else {
              const errorText = await response.text();
              console.error(`Gemini API error: ${response.status} - ${errorText}`);
            }
          } catch (geminiError: any) {
            console.error(`Error calling Gemini API:`, geminiError?.message || geminiError);
          }
        }

        if (imageUrl) {
          images.push({
            url: imageUrl,
            description: prompt.description,
          });
          console.log(`Successfully generated image ${i + 1} using Gemini Nano Banana`);
        } else {
          console.warn(`Failed to generate image ${i + 1} - no URL returned`);
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
 * Downloads images from URLs or converts base64 data URLs to buffers
 */
export async function downloadImages(
  images: Array<{ url: string; description: string }>
): Promise<Buffer[]> {
  const buffers: Buffer[] = [];
  
  for (const image of images) {
    try {
      // Check if it's a data URL (base64)
      if (image.url.startsWith('data:image')) {
        const base64Data = image.url.split(',')[1];
        if (base64Data) {
          buffers.push(Buffer.from(base64Data, 'base64'));
          continue;
        }
      }
      
      // Otherwise, fetch from URL
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
  // Generate prompts directly without needing OpenAI
  // Extract key visual concepts from slides
  const mainConcept = slides[0]?.title || topic;
  const keyConcepts = slides
    .flatMap(s => s.content)
    .filter((_, i) => i < 10) // Limit to avoid overflow
    .slice(0, 5)
    .join(", ");

  // Create 2-3 detailed prompts for educational images
  return [
    {
      prompt: `Professional educational illustration about ${topic}, specifically showing ${mainConcept}, clear and informative, suitable for teaching materials, high quality, visually engaging, educational style. CRITICAL: NO text, NO words, NO labels, NO captions, NO written content. Pure visual illustration only.`,
      description: `Main illustration for ${topic}: ${mainConcept}`,
    },
    {
      prompt: `Educational diagram or visual representation of key concepts in ${topic}, showing ${keyConcepts}, professional style, suitable for presentations, clear and informative. CRITICAL: NO text, NO words, NO labels, NO captions, NO written content. Pure visual diagram only.`,
      description: `Conceptual diagram for ${topic}`,
    },
    {
      prompt: `Visual example or practical application illustration related to ${topic}, showing real-world context, educational and engaging, professional quality. CRITICAL: NO text, NO words, NO labels, NO captions, NO written content. Pure visual example only.`,
      description: `Practical example for ${topic}`,
    },
  ];
}

