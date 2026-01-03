// Image generation utility using Google Gemini Nano Banana
// Generates high-quality educational images for presentations and materials
// Gemini Nano Banana offers fast, efficient image generation

import OpenAI from "openai";

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
        
        // The prompt already includes text exclusion, but reinforce it for the API call
        // Also ensure hyper-realistic, photorealistic style (not animated/cartoon)
        const enhancedPrompt = `${prompt.prompt} ABSOLUTELY NO animated style, NO cartoon style, NO illustration style, NO artistic filters. Must be photorealistic and hyper-realistic only.`;
        
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
                prompt: enhancedPrompt,
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
        // Use gemini-2.5-flash-image which supports image generation
        if (!imageUrl) {
          try {
            // Try gemini-2.5-flash-image first (supports image generation)
            response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: enhancedPrompt
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
              // Check for inline image data
              const imageData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
              
              if (imageData) {
                // Convert base64 to data URL
                imageUrl = `data:image/png;base64,${imageData}`;
                console.log(`Generated via Google Gemini 2.5 Flash Image API`);
              } else {
                // Try alternative response structure
                const alternativeImageData = data.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData?.data)?.inlineData?.data;
                if (alternativeImageData) {
                  imageUrl = `data:image/png;base64,${alternativeImageData}`;
                  console.log(`Generated via Google Gemini 2.5 Flash Image API (alternative structure)`);
                } else {
                  console.warn(`No image data found in Gemini response:`, JSON.stringify(data).substring(0, 500));
                }
              }
            } else {
              const errorText = await response.text();
              console.error(`Gemini API error: ${response.status} - ${errorText}`);
              
              // Try imagen-4.0 as fallback
              if (response.status === 400) {
                console.log(`Trying imagen-4.0 as fallback...`);
                try {
                  const imagenResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0:generateContent?key=${apiKey}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        contents: [{
                          parts: [{
                            text: enhancedPrompt
                          }]
                        }],
                        generationConfig: {
                          temperature: 0.7,
                        }
                      }),
                    }
                  );
                  
                  if (imagenResponse.ok) {
                    const imagenData = await imagenResponse.json();
                    const imagenImageData = imagenData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                    if (imagenImageData) {
                      imageUrl = `data:image/png;base64,${imagenImageData}`;
                      console.log(`Generated via Imagen 4.0 API`);
                    }
                  }
                } catch (imagenError: any) {
                  console.error(`Error calling Imagen API:`, imagenError?.message || imagenError);
                }
              }
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
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      // Check if it's a data URL (base64)
      if (image.url.startsWith('data:image')) {
        const base64Data = image.url.split(',')[1];
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          if (buffer.length > 0) {
            buffers.push(buffer);
            console.log(`Successfully converted base64 image ${i + 1} to buffer (${buffer.length} bytes)`);
            continue;
          } else {
            console.warn(`Base64 image ${i + 1} resulted in empty buffer`);
          }
        } else {
          console.warn(`Base64 image ${i + 1} has no data after comma`);
        }
      } else {
        // Otherwise, fetch from URL
        console.log(`Fetching image ${i + 1} from URL: ${image.url.substring(0, 100)}...`);
        const response = await fetch(image.url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          if (buffer.length > 0) {
            buffers.push(buffer);
            console.log(`Successfully downloaded image ${i + 1} (${buffer.length} bytes)`);
          } else {
            console.warn(`Downloaded image ${i + 1} is empty`);
          }
        } else {
          console.error(`Failed to download image ${i + 1}: HTTP ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error(`Error downloading image ${i + 1}:`, error instanceof Error ? error.message : String(error));
      // Continue with other images
    }
  }
  
  console.log(`Downloaded ${buffers.length} out of ${images.length} images`);
  return buffers;
}

/**
 * Generates appropriate image prompts using GPT-4o
 * Identifies 3 specific key events, people, or places related to the topic
 * Creates prompts for hyper-realistic, photorealistic images
 */
async function generateImagePrompts(
  topic: string,
  slides: Array<{ title: string; content: string[] }>
): Promise<Array<{ prompt: string; description: string }>> {
  // Use OpenAI to identify 3 specific key subjects (events, people, or places)
  const openai = getOpenAIClient();
  
  if (openai) {
    try {
      // First, identify 3 specific key events, people, or places
      const identificationResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert educator who identifies the most important and visually interesting subjects for educational images. Identify exactly 3 specific key events, historical figures, or important places related to the topic. Each should be a single, specific subject (not combinations). Return ONLY valid JSON in this exact format: {\"subjects\": [{\"type\": \"event\" | \"person\" | \"place\", \"name\": \"specific name\", \"description\": \"brief description\"}]}.",
          },
          {
            role: "user",
            content: `For the topic "${topic}", identify exactly 3 specific key subjects that would make excellent educational images. Focus on:
- Important historical events (be specific: e.g., "The signing of the Declaration of Independence" not just "American Revolution")
- Key historical figures (be specific: e.g., "Albert Einstein in his laboratory" not just "scientists")
- Significant places or locations (be specific: e.g., "The Great Wall of China" not just "China")

Each subject should be ONE specific thing, not a combination. Prioritize subjects that are visually interesting and historically/educationally significant.

Topic: "${topic}"
Slides context: ${JSON.stringify(slides.map(s => s.title).slice(0, 5))}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const identificationContent = identificationResponse.choices[0]?.message?.content;
      if (identificationContent) {
        const jsonMatch = identificationContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.subjects && Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
            // Generate hyper-realistic image prompts for each subject
            return parsed.subjects.slice(0, 3).map((subject: { type: string; name: string; description: string }) => {
              const subjectName = subject.name;
              const subjectType = subject.type;
              
              // Create hyper-realistic, photorealistic prompts
              let prompt = `Hyper-realistic, photorealistic photograph of ${subjectName}`;
              
              if (subjectType === "event") {
                prompt = `Hyper-realistic, photorealistic photograph capturing the historical moment of ${subjectName}, documentary photography style, high detail, sharp focus, natural lighting, professional photojournalism quality`;
              } else if (subjectType === "person") {
                prompt = `Hyper-realistic, photorealistic portrait photograph of ${subjectName}, professional portrait photography, high detail, sharp focus, natural lighting, authentic and realistic`;
              } else if (subjectType === "place") {
                prompt = `Hyper-realistic, photorealistic landscape photograph of ${subjectName}, professional landscape photography, high detail, sharp focus, natural lighting, wide angle view, authentic and realistic`;
              }
              
              // Add style requirements and text exclusion
              prompt += `. Style: photorealistic, documentary photography, high resolution, professional quality, natural colors, realistic lighting, no artistic filters, no cartoon style, no animation, no illustration. CRITICAL: This image must contain ABSOLUTELY NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO signs, NO written content of any kind whatsoever. Pure visual photograph only with perfect, realistic detail.`;
              
              return {
                prompt,
                description: `${subjectType === "event" ? "Historical event" : subjectType === "person" ? "Historical figure" : "Historical place"}: ${subjectName}`,
              };
            });
          }
        }
      }
    } catch (error) {
      console.error("Error identifying key subjects with AI:", error);
      // Fall through to fallback
    }
  }
  
  // Fallback: Create prompts based on topic if AI fails
  // Still focus on hyper-realistic, single subjects
  return [
    {
      prompt: `Hyper-realistic, photorealistic photograph related to ${topic}, professional documentary photography style, high detail, sharp focus, natural lighting, authentic and realistic. Style: photorealistic, high resolution, professional quality, natural colors, realistic lighting, no artistic filters, no cartoon style, no animation, no illustration. CRITICAL: This image must contain ABSOLUTELY NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO signs, NO written content of any kind whatsoever. Pure visual photograph only.`,
      description: `Key subject for ${topic}`,
    },
    {
      prompt: `Hyper-realistic, photorealistic photograph of an important historical figure or event related to ${topic}, professional portrait or documentary photography style, high detail, sharp focus, natural lighting, authentic and realistic. Style: photorealistic, high resolution, professional quality, natural colors, realistic lighting, no artistic filters, no cartoon style, no animation, no illustration. CRITICAL: This image must contain ABSOLUTELY NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO signs, NO written content of any kind whatsoever. Pure visual photograph only.`,
      description: `Historical subject for ${topic}`,
    },
    {
      prompt: `Hyper-realistic, photorealistic photograph of a significant place or location related to ${topic}, professional landscape or architectural photography style, high detail, sharp focus, natural lighting, authentic and realistic. Style: photorealistic, high resolution, professional quality, natural colors, realistic lighting, no artistic filters, no cartoon style, no animation, no illustration. CRITICAL: This image must contain ABSOLUTELY NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO signs, NO written content of any kind whatsoever. Pure visual photograph only.`,
      description: `Significant location for ${topic}`,
    },
  ];
}

// Helper function to get OpenAI client (same pattern as content-generator.ts)
function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000,
    maxRetries: 2,
  });
}

