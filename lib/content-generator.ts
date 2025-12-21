// Content generation utility using OpenAI API
// This generates educational content for the topic

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
    // Generate slides using AI
    const slides = await generateSlidesWithAI(topic);
    
    // Generate podcast script
    const podcastScript = await generatePodcastScriptWithAI(topic, slides);
    
    // Generate worksheet questions
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
      model: "gpt-5", // Best quality output
      messages: [
        {
          role: "system",
          content: "You are an expert educator. Create educational slides for presentations. Return ONLY valid JSON in this exact format: {\"slides\": [{\"title\": \"...\", \"content\": [\"...\", \"...\"]}]}. Create 5-7 slides covering the topic comprehensively.",
        },
        {
          role: "user",
          content: `Create educational slides about: ${topic}. Each slide should have a clear title and 3-5 bullet points. Make it educational and engaging.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500, // Limit response size for faster generation
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.slides && Array.isArray(parsed.slides)) {
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
      model: "gpt-5", // Best quality output
      messages: [
        {
          role: "system",
          content: "You are a podcast host. Create engaging, conversational podcast scripts that explain educational topics in a friendly, accessible way. Write as if speaking directly to the listener.",
        },
        {
          role: "user",
          content: `Create a podcast-style script (5-7 minutes) about ${topic}. Use this slide content as reference:\n\n${slideContent}\n\nMake it conversational, engaging, and educational. Include an introduction and conclusion.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000, // Limit for faster generation
    });

    const script = response.choices[0]?.message?.content;
    if (script) {
      return script;
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
      model: "gpt-5", // Best quality output
      messages: [
        {
          role: "system",
          content: "You are an expert educator creating assessment questions. Return ONLY valid JSON in this exact format: {\"questions\": [{\"question\": \"...\", \"type\": \"multiple-choice\"|\"short-answer\"|\"essay\", \"options\": [\"...\"], \"correctAnswer\": \"...\"}]}. Create 5-7 diverse questions.",
        },
        {
          role: "user",
          content: `Create assessment questions about ${topic}. Use this content as reference:\n\n${slideContent}\n\nInclude a mix of multiple-choice, short-answer, and essay questions. For multiple-choice, provide 4 options.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200, // Limit for faster generation
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions)) {
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

