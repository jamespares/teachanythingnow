// Content generation utility using OpenAI API (GPT-5)
// This generates high-quality educational content for any topic
// All generation uses GPT-5 model for best quality output

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
      model: "gpt-5", // Using GPT-5 for highest quality output
      messages: [
        {
          role: "system",
          content: `You are a world-class educator with 20+ years of experience in curriculum design and instructional pedagogy. You specialize in creating engaging, memorable educational content that follows evidence-based learning principles.

Your expertise includes:
- Bloom's Taxonomy for learning objectives
- Cognitive load theory for information presentation
- Scaffolded learning progression
- Active learning principles
- Universal Design for Learning (UDL)

Create professional, comprehensive educational slides that are pedagogically sound and visually structured. Return ONLY valid JSON in this exact format: {"slides": [{"title": "...", "content": ["...", "..."]}]}. Each slide should be clear, well-organized, and follow best practices in educational design.

Quality standards:
- Content must be factually accurate and up-to-date
- Use clear, accessible language without unnecessary jargon
- Include concrete examples and real-world applications
- Build knowledge progressively from foundational to advanced
- End with actionable takeaways`,
        },
        {
          role: "user",
          content: `Create a high-quality educational presentation about: "${topic}".

CRITICAL: This topic "${topic}" is the central focus. All content must be directly relevant to and consistent with this specific topic.

Requirements:
- Create 6-8 comprehensive slides that progressively build knowledge about "${topic}"
- Each slide must have a clear, descriptive title that relates directly to "${topic}"
- Include 3-5 well-formatted bullet points per slide that are:
  * Concise yet informative (1-2 complete sentences each)
  * Properly structured with parallel construction
  * Free of grammatical errors
  * Educational and engaging
  * Directly related to "${topic}" and its key concepts
- Follow this logical structure:
  1. Introduction slide (hook + overview of "${topic}")
  2. Background/Context slide about "${topic}"
  3. 3-4 core concept slides covering the main aspects of "${topic}"
  4. Practical applications/examples slide showing real-world uses of "${topic}"
  5. Summary/Key takeaways slide reinforcing learning about "${topic}"
- Use professional language appropriate for the subject matter
- Include specific examples, data, or real-world applications directly related to "${topic}"
- Ensure content is accurate, up-to-date, and educational
- Maintain consistency in terminology, examples, and concepts throughout all slides

Make the content engaging, memorable, and suitable for presentation. Every slide should clearly connect back to "${topic}".`,
        },
      ],
      temperature: 0.6, // Lower temperature for more consistent, focused educational content
      max_tokens: 3000, // Increased for comprehensive coverage
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          // Validate slides have proper structure
          const validSlides = parsed.slides.filter((slide: { title?: string; content?: string[] }) => 
            slide.title && 
            Array.isArray(slide.content) && 
            slide.content.length >= 2
          );
          if (validSlides.length >= 4) {
            return validSlides;
          }
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
      model: "gpt-5", // Using GPT-5 for highest quality output
      messages: [
        {
          role: "system",
          content: `You are an award-winning educational podcast host known for making complex topics accessible, engaging, and memorable. You combine the storytelling ability of a great teacher with the production quality of professional podcasters.

Your signature style:
- Hook listeners immediately with compelling openings
- Use the "explain like I'm a smart friend" approach
- Weave in relatable analogies and real-world examples
- Create "aha moments" through clear explanations
- Use rhythm and pacing to maintain engagement
- End with memorable takeaways that stick

Create professional podcast scripts that sound natural when spoken aloud. Avoid written language conventions - write for the ear, not the eye. The tone should be warm, enthusiastic, and knowledgeable while remaining professional.`,
        },
        {
          role: "user",
          content: `Create a professional, engaging podcast-style script about "${topic}". 

CRITICAL: The entire script must focus consistently on "${topic}". Use the same examples, terminology, and concepts from the slides to ensure perfect alignment.

Script Requirements:
- Duration: 5-8 minutes of spoken content (approximately 800-1200 words)
- Style: Conversational yet educational, as if speaking to an intelligent listener
- Structure:
  1. Compelling introduction with a hook about "${topic}" (question, interesting fact, or story)
  2. Clear preview of what will be covered about "${topic}"
  3. Well-organized main content sections covering "${topic}" with smooth transitions
  4. Real-world examples, analogies, or stories about "${topic}" to illustrate key points
  5. Engaging conclusion with key takeaways about "${topic}" and thought-provoking closing

Content Guidelines:
- Use natural, spoken language (contractions, rhetorical questions, direct address)
- Include smooth transitions between topics ("Now let's explore...", "Here's where it gets interesting...")
- Break down complex concepts about "${topic}" into digestible explanations
- Add personality and enthusiasm while remaining professional
- Include verbal signposts to help listeners follow along
- Avoid bullet points - write in full paragraphs as spoken word
- Use the EXACT same examples, terminology, and key concepts from the slides below
- Maintain consistency: if the slides mention specific examples or concepts, reference them in the script

Reference this slide content for accuracy and coverage - use the same examples and concepts:
${slideContent}

Make it sound like a real podcast that people would enjoy listening to - informative, engaging, and professionally produced. Ensure every section clearly relates back to "${topic}".`,
        },
      ],
      temperature: 0.75, // Balanced for engaging yet consistent content
      max_tokens: 2500, // Increased for comprehensive scripts
    });

    const script = response.choices[0]?.message?.content;
    if (script && script.length > 500) { // Ensure we got substantial content
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
      model: "gpt-5", // Using GPT-5 for highest quality output
      messages: [
        {
          role: "system",
          content: `You are an expert assessment designer with deep knowledge of educational measurement and evaluation. You create assessments that accurately measure learning while promoting deeper understanding.

Your assessment philosophy:
- Questions should assess understanding, not just memorization
- Use Bloom's Taxonomy levels: Remember, Understand, Apply, Analyze, Evaluate, Create
- Multiple-choice distractors should reflect common misconceptions
- Short-answer questions should require synthesis of information
- Essay questions should prompt critical thinking and application
- All correct answers must be thorough and demonstrate mastery

Return ONLY valid JSON in this exact format: {"questions": [{"question": "...", "type": "multiple-choice"|"short-answer"|"essay", "options": ["..."], "correctAnswer": "..."}]}. 

Quality standards:
- Questions must be clear, specific, and unambiguous
- Avoid double negatives and trick questions
- Ensure one clearly correct answer for multiple choice
- Provide detailed, educational correct answers`,
        },
        {
          role: "user",
          content: `Create a comprehensive assessment for the topic: "${topic}"

CRITICAL: All questions must directly assess understanding of "${topic}". Use the same examples, terminology, and concepts from the slides to ensure perfect consistency.

Requirements:
- Generate 8-10 diverse, high-quality questions about "${topic}"
- Include a balanced mix:
  * 4-5 multiple-choice questions (for knowledge/comprehension of "${topic}")
  * 2-3 short-answer questions (for application/analysis related to "${topic}")
  * 2 essay questions (for synthesis/evaluation of "${topic}")

Question Quality Guidelines:
- Write clear, unambiguous questions free of grammatical errors
- All questions must directly relate to "${topic}" and the concepts covered in the slides
- Multiple-choice questions should have:
  * One clearly correct answer about "${topic}"
  * Three plausible distractors (avoid obvious wrong answers)
  * Options that are grammatically parallel and similar in length
- Short-answer questions should:
  * Require 2-4 sentence responses about "${topic}"
  * Test application or analysis, not just recall
  * Have specific, accurate correct answers that reference the exact concepts from the slides (be detailed and complete)
- Essay questions should:
  * Prompt higher-order thinking about "${topic}" (analysis, synthesis, evaluation)
  * Be open-ended yet focused on "${topic}"
  * Include rubric-worthy guidance in the correct answer

Content Coverage - Use these exact concepts and examples:
${slideContent}

Ensure questions:
- Cover all major concepts about "${topic}" from the content above
- Use the SAME examples, terminology, and key points mentioned in the slides
- Progress from easier to more challenging questions about "${topic}"
- Are appropriate for the subject matter and learning level
- Have well-written, detailed correct answers that demonstrate mastery of "${topic}"
- Maintain consistency: if slides mention specific examples, use them in questions

Format all correctly as valid JSON.`,
        },
      ],
      temperature: 0.6, // Lower temperature for consistent, accurate assessments
      max_tokens: 3000, // Increased for comprehensive questions with detailed answers
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          // Validate questions have proper structure
          const validQuestions = parsed.questions.filter((q: { question?: string; type?: string; correctAnswer?: string; options?: string[] }) => 
            q.question && 
            q.type && 
            q.correctAnswer &&
            (q.type !== 'multiple-choice' || (Array.isArray(q.options) && q.options.length >= 3))
          );
          if (validQuestions.length >= 4) {
            return { questions: validQuestions };
          }
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

