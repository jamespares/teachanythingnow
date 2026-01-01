// Content generation utility using OpenAI API (GPT-4o)
// This generates high-quality educational content for any topic
// All generation uses GPT-4o model for best quality output

import OpenAI from "openai";

// Lazy initialization of OpenAI client to avoid errors when API key is missing
function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000, // 60 second timeout for slow connections
    maxRetries: 2, // Retry failed requests
  });
}

export interface GeneratedContent {
  slides: Array<{
    title: string;
    content: string[];
  }>;
  podcastScript: string;
  worksheet: {
    questions: Array<{
      question: string;
      type: "multiple-choice" | "short-answer" | "essay";
      options?: string[];
      correctAnswer: string;
    }>;
  };
}

export async function generateContent(topic: string): Promise<GeneratedContent> {
  try {
    // Generate slides using AI - this is the foundation for all other content
    const slides = await generateSlidesWithAI(topic);
    
    // Generate podcast script - uses slides for consistency
    const podcastScript = await generatePodcastScriptWithAI(topic, slides);
    
    // Generate worksheet questions - uses slides for consistency
    const worksheet = await generateWorksheetWithAI(topic, slides);

    return {
      slides,
      podcastScript,
      worksheet,
    };
  } catch (error) {
    console.error("Error generating content with AI, falling back to template:", error);
    // Fallback to template-based generation if AI fails
    const slides = generateSlides(topic);
    const podcastScript = generatePodcastScript(topic, slides);
    const worksheet = generateWorksheet(topic, slides);

    return {
      slides,
      podcastScript,
      worksheet,
    };
  }
}

async function generateSlidesWithAI(topic: string): Promise<Array<{ title: string; content: string[] }>> {
  const openai = getOpenAIClient();
  if (!openai) {
    return generateSlides(topic);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for high quality output
      messages: [
        {
          role: "system",
          content: "You are an expert educator who creates engaging, clear educational content. Create professional slides that are well-structured and easy to understand. Return ONLY valid JSON in this exact format: {\"slides\": [{\"title\": \"...\", \"content\": [\"...\", \"...\"]}]}.",
        },
        {
          role: "user",
          content: `Create an educational presentation about "${topic}".

Create 6-8 slides with:
- Clear, descriptive titles
- 3-5 bullet points per slide (1-2 sentences each)
- Logical flow: introduction, main concepts, examples, summary
- Engaging, accurate content about "${topic}"
- Real-world examples where relevant

Make it educational and suitable for teaching.`,
        },
      ],
      temperature: 0.8, // Balanced creativity and consistency
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          return parsed.slides;
        }
      }
    }
  } catch (error) {
    console.error("Error generating slides with AI:", error);
  }

  return generateSlides(topic);
}

async function generatePodcastScriptWithAI(topic: string, slides: Array<{ title: string; content: string[] }>): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) {
    return generatePodcastScript(topic, slides);
  }

  try {
    const slideContent = slides.map(s => `${s.title}: ${s.content.join(" ")}`).join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for high quality output
      messages: [
        {
          role: "system",
          content: "You are an engaging podcast host who makes educational content interesting and accessible. Create conversational podcast scripts that sound natural when spoken. Write for the ear, not the eye - use natural spoken language.",
        },
        {
          role: "user",
          content: `Create a podcast script about "${topic}". The script MUST be under 3800 characters (approximately 600-800 words) to ensure it fits within technical limits.

Structure:
- Engaging introduction with a hook
- Main content covering key points
- Real-world examples and analogies
- Conclusion with key takeaways

Use natural, conversational language. Write in full paragraphs, not bullet points. Make it engaging and educational. Keep it concise and focused - prioritize clarity over length.

CRITICAL: The total script length must be under 3800 characters. Count your characters and ensure you stay under this limit.

Reference these slides for content:
${slideContent}`,
        },
      ],
      temperature: 0.8, // Creative and engaging
      max_tokens: 2000, // Limit tokens to ensure script stays under 3800 characters
    });

    const script = response.choices[0]?.message?.content;
    if (script && script.trim().length > 200) {
      const trimmedScript = script.trim();
      // Validate script length - warn if it exceeds TTS limit (truncation will happen in audio generator)
      if (trimmedScript.length > 4000) {
        console.warn(`Generated script (${trimmedScript.length} chars) exceeds TTS limit of 4000. Script will be truncated during audio generation.`);
      }
      return trimmedScript;
    }
  } catch (error) {
    console.error("Error generating podcast script with AI:", error);
  }

  return generatePodcastScript(topic, slides);
}

async function generateWorksheetWithAI(topic: string, slides: Array<{ title: string; content: string[] }>): Promise<{
  questions: Array<{
    question: string;
    type: "multiple-choice" | "short-answer" | "essay";
    options?: string[];
    correctAnswer: string;
  }>;
}> {
  const openai = getOpenAIClient();
  if (!openai) {
    return generateWorksheet(topic, slides);
  }

  try {
    const slideContent = slides.map(s => `${s.title}: ${s.content.join(" ")}`).join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for high quality output
      messages: [
        {
          role: "system",
          content: "You are an expert educator creating assessment questions. Return ONLY valid JSON in this exact format: {\"questions\": [{\"question\": \"...\", \"type\": \"multiple-choice\"|\"short-answer\"|\"essay\", \"options\": [\"...\"], \"correctAnswer\": \"...\"}]}. Create clear, educational questions that assess understanding.",
        },
        {
          role: "user",
          content: `Create 8-10 assessment questions about "${topic}".

Include:
- 4-5 multiple-choice questions (with 4 options each)
- 2-3 short-answer questions
- 2 essay questions

Make questions clear and directly related to "${topic}". Use concepts from these slides:
${slideContent}

Provide detailed correct answers. Return valid JSON.`,
        },
      ],
      temperature: 0.7, // Balanced for quality questions
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error("Error generating worksheet with AI:", error);
  }

  return generateWorksheet(topic, slides);
}

function generateSlides(topic: string): Array<{ title: string; content: string[] }> {
  // Generate slide content structure
  // In production, use AI to generate this
  return [
    {
      title: `Introduction to ${topic}`,
      content: [
        `Welcome to our lesson on ${topic}`,
        `Today we'll explore the key concepts and principles`,
        `By the end, you'll have a solid understanding`
      ]
    },
    {
      title: `What is ${topic}?`,
      content: [
        `${topic} is a fundamental concept`,
        `It involves several key components`,
        `Understanding ${topic} helps us understand broader principles`
      ]
    },
    {
      title: `Key Concepts`,
      content: [
        `Concept 1: Fundamental principles`,
        `Concept 2: Important applications`,
        `Concept 3: Real-world examples`
      ]
    },
    {
      title: `Examples and Applications`,
      content: [
        `Let's look at practical examples`,
        `These examples illustrate the concepts`,
        `You can apply this knowledge in various contexts`
      ]
    },
    {
      title: `Summary`,
      content: [
        `We've covered the basics of ${topic}`,
        `Remember the key points we discussed`,
        `Practice and application will deepen your understanding`
      ]
    }
  ];
}

function generatePodcastScript(topic: string, slides: Array<{ title: string; content: string[] }>): string {
  // Generate a podcast-style script
  let script = `Welcome to Teach Anything Now. Today, we're diving deep into ${topic}.\n\n`;
  
  slides.forEach((slide, index) => {
    script += `${slide.title}.\n\n`;
    slide.content.forEach(point => {
      script += `${point} `;
    });
    script += `\n\n`;
  });

  script += `That wraps up our discussion on ${topic}. Thanks for listening, and remember to practice what you've learned.`;

  return script;
}

function generateWorksheet(topic: string, slides: Array<{ title: string; content: string[] }>): {
  questions: Array<{
    question: string;
    type: "multiple-choice" | "short-answer" | "essay";
    options?: string[];
    correctAnswer: string;
  }>;
} {
  return {
    questions: [
      {
        question: `What is ${topic}?`,
        type: "short-answer",
        correctAnswer: `${topic} is a fundamental concept that involves key principles and applications.`
      },
      {
        question: `Which of the following best describes ${topic}?`,
        type: "multiple-choice",
        options: [
          "A fundamental concept",
          "A simple idea",
          "An advanced topic",
          "A basic principle"
        ],
        correctAnswer: "A fundamental concept"
      },
      {
        question: `Explain the key concepts of ${topic} in your own words.`,
        type: "essay",
        correctAnswer: "Answers should demonstrate understanding of the key concepts discussed in the lesson."
      },
      {
        question: `What are some practical applications of ${topic}?`,
        type: "short-answer",
        correctAnswer: "Practical applications include real-world examples that illustrate the concepts."
      },
      {
        question: `How would you apply your knowledge of ${topic}?`,
        type: "essay",
        correctAnswer: "Answers should show practical understanding and application of the concepts."
      }
    ]
  };
}

