// Content generation utility using Cloudflare Workers AI
// Primary: @cf/moonshotai/kimi-k2.6 | Fallback: @cf/meta/llama-3.3-70b-instruct-fp8-fast
// This generates high-quality educational content for any topic

const PRIMARY_MODEL = "@cf/moonshotai/kimi-k2.6";
const FALLBACK_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

/**
 * Helper to call a single Workers AI text model.
 * Returns the generated text or null if the call fails.
 */
async function runTextModel(
  ai: Ai,
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number
): Promise<string | null> {
  try {
    console.log(`Calling Workers AI (${model})...`);
    const response = await ai.run(model as any, {
      messages,
      max_tokens: maxTokens,
    }) as { response?: string };

    if (response?.response) {
      console.log(`Workers AI (${model}) succeeded.`);
      return response.response;
    }
    console.warn(`Workers AI (${model}) returned empty response.`);
    return null;
  } catch (error: any) {
    console.error(`Workers AI (${model}) failed:`, error?.message || error);
    return null;
  }
}

/**
 * Calls Workers AI with the primary model, falling back to the secondary model.
 */
async function generateWithWorkersAI(
  ai: Ai,
  messages: Array<{ role: string; content: string }>,
  maxTokens = 3000
): Promise<string | null> {
  const primary = await runTextModel(ai, PRIMARY_MODEL, messages, maxTokens);
  if (primary) return primary;

  console.log(`Primary model failed, falling back to ${FALLBACK_MODEL}...`);
  return runTextModel(ai, FALLBACK_MODEL, messages, maxTokens);
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

export async function generateContent(topic: string, curriculum: string, yearLevel: string, ai: Ai, duration?: string, objectives?: string): Promise<GeneratedContent> {
  try {
    // Generate slides using AI - this is the foundation for all other content
    const slides = await generateSlidesWithAI(topic, curriculum, yearLevel, ai, duration, objectives);

    // Generate podcast script - uses slides for consistency
    const podcastScript = await generatePodcastScriptWithAI(topic, curriculum, yearLevel, slides, ai, duration, objectives);

    // Generate worksheet questions - uses slides for consistency
    const worksheet = await generateWorksheetWithAI(topic, curriculum, yearLevel, slides, ai, duration, objectives);

    return {
      slides,
      podcastScript,
      worksheet,
    };
  } catch (error) {
    console.error("Error generating content with AI, falling back to template:", error);
    // Fallback to template-based generation if AI fails
    const slides = generateSlides(topic, duration, objectives);
    const podcastScript = generatePodcastScript(topic, slides, duration, objectives);
    const worksheet = generateWorksheet(topic, slides, duration, objectives);

    return {
      slides,
      podcastScript,
      worksheet,
    };
  }
}

async function generateSlidesWithAI(topic: string, curriculum: string, yearLevel: string, ai: Ai, duration?: string, objectives?: string): Promise<Array<{ title: string; content: string[] }>> {
  const durationContext = duration ? `Design this for a ${duration} lesson.` : '';
  const objectivesContext = objectives ? `Focus on achieving these objectives: ${objectives}` : '';

  const systemPrompt = `You are an expert educator who creates engaging, clear educational content. Create professional slides that are well-structured and easy to understand.

CRITICAL: You MUST generate all content (titles, bullet points, labels) EXCLUSIVELY in English.

Return ONLY valid JSON in this exact format: {"slides": [{"title": "...", "content": ["...", "..."]}]}.`;

  const userPrompt = `Create an educational presentation about "${topic}" specialized for the "${curriculum}" curriculum and "${yearLevel}" students.

Guidelines:
- Align content specifically with "${curriculum}" learning standards.
- Ensure vocabulary and concept complexity is appropriate for "${yearLevel}".
- Use research-backed pedagogical standards (scaffolding, direct instruction).
${durationContext}
${objectivesContext}

Create 6-8 slides with:
- Clear, descriptive titles
- 3-5 bullet points per slide (1-2 sentences each)
- Logical flow: introduction, main concepts, examples, summary
- Engaging, accurate content about "${topic}"
- Real-world examples where relevant

Make it educational and suitable for teaching.`;

  try {
    const content = await generateWithWorkersAI(ai, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], 3000);

    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          return parsed.slides;
        }
      }
    }
  } catch (error) {
    console.error("Error generating slides with Workers AI:", error);
  }

  return generateSlides(topic);
}

async function generatePodcastScriptWithAI(topic: string, curriculum: string, yearLevel: string, slides: Array<{ title: string; content: string[] }>, ai: Ai, duration?: string, objectives?: string): Promise<string> {
  const slideContent = slides.map(s => `${s.title}: ${s.content.join(" ")}`).join("\n\n");
  const durationContext = duration ? `The lesson duration is ${duration}.` : '';
  const objectivesContext = objectives ? `Key objectives: ${objectives}` : '';

  const systemPrompt = `You are an engaging podcast host who makes educational content interesting and accessible. Create conversational podcast scripts that sound natural when spoken. Write for the ear, not the eye - use natural spoken language.

CRITICAL: You MUST write the script EXCLUSIVELY in English.`;

  const userPrompt = `Create a podcast script about "${topic}" for "${yearLevel}" students following the "${curriculum}" syllabus. The script MUST be under 3800 characters (approximately 600-800 words) to ensure it fits within technical limits.

Educational Context:
- Target Audience: "${yearLevel}"
- Curriculum: "${curriculum}"
${durationContext}
${objectivesContext}
- Tone: Engaging, age-appropriate, and aligned with research-backed learning standards.

Structure:
- Engaging introduction with a hook
- Main content covering key points
- Real-world examples and analogies
- Conclusion with key takeaways

Use natural, conversational language. Write in full paragraphs, not bullet points. Make it engaging and educational. Keep it concise and focused - prioritize clarity over length.

CRITICAL: The total script length must be under 3800 characters. Count your characters and ensure you stay under this limit.

Reference these slides for content:
${slideContent}`;

  try {
    const script = await generateWithWorkersAI(ai, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], 2000);

    if (script && script.trim().length > 200) {
      const trimmedScript = script.trim();
      if (trimmedScript.length > 4000) {
        console.warn(`Generated script (${trimmedScript.length} chars) exceeds TTS limit of 4000. Script will be chunked during audio generation.`);
      }
      return trimmedScript;
    }
  } catch (error) {
    console.error("Error generating podcast script with Workers AI:", error);
  }

  return generatePodcastScript(topic, slides);
}

async function generateWorksheetWithAI(topic: string, curriculum: string, yearLevel: string, slides: Array<{ title: string; content: string[] }>, ai: Ai, duration?: string, objectives?: string): Promise<{ questions: Array<{ question: string; type: "multiple-choice" | "short-answer" | "essay"; options?: string[]; correctAnswer: string; }> }> {
  const slideContent = slides.map(s => `${s.title}: ${s.content.join(" ")}`).join("\n\n");
  const durationContext = duration ? `The lesson duration is ${duration}.` : '';
  const objectivesContext = objectives ? `The objectives are: ${objectives}` : '';

  const systemPrompt = `You are an expert educator creating assessment questions.

CRITICAL: You MUST generate all questions and answers EXCLUSIVELY in English.

Return ONLY valid JSON in this exact format: {"questions": [{"question": "...", "type": "multiple-choice"|"short-answer"|"essay", "options": ["..."], "correctAnswer": "..."}]}. Create clear, educational questions that assess understanding.`;

  const userPrompt = `Create 8-10 assessment questions about "${topic}" for "${yearLevel}" following the "${curriculum}" curriculum.

Standards:
- Questions should map to "${curriculum}" assessment criteria.
- Difficulty and wording must be suitable for "${yearLevel}".
- Include clear, research-backed answer keys.
${durationContext}
${objectivesContext}

Include:
- 4-5 multiple-choice questions (with 4 options each)
- 2-3 short-answer questions
- 2 essay questions

CRITICAL ALIGNMENT RULE: Every question MUST test content that is explicitly covered in the slides or podcast script provided above. Do NOT ask about concepts, facts, or vocabulary that do not appear in the provided slides or podcast. Students must be able to answer every question using only the information in the lesson materials.

Make questions clear and directly related to "${topic}". Use concepts from these slides:
${slideContent}

Provide detailed correct answers. Return valid JSON.`;

  try {
    const content = await generateWithWorkersAI(ai, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], 3000);

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
    console.error("Error generating worksheet with Workers AI:", error);
  }

  return generateWorksheet(topic, slides);
}

function generateSlides(topic: string, duration?: string, objectives?: string): Array<{ title: string; content: string[] }> {
  // Generate slide content structure
  const durationText = duration ? ` (Duration: ${duration})` : '';
  const objectivesText = objectives ? ` Objectives: ${objectives}` : '';
  return [
    {
      title: `Introduction to ${topic}`,
      content: [
        `Welcome to our lesson on ${topic}${durationText}`,
        `${objectivesText}`,
        `Today we'll explore the key concepts and principles`
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

function generatePodcastScript(topic: string, slides: Array<{ title: string; content: string[] }>, duration?: string, objectives?: string): string {
  // Generate a podcast-style script
  let script = `Welcome to Last Minute Lessons. Today, we're diving deep into ${topic}.\n\n`;
  if (duration) {
    script += `This lesson is designed to take about ${duration}. `;
  }
  if (objectives) {
    script += `By the end, you should be able to: ${objectives}\n\n`;
  }

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

function generateWorksheet(topic: string, slides: Array<{ title: string; content: string[] }>, duration?: string, objectives?: string): {
  questions: Array<{
    question: string;
    type: "multiple-choice" | "short-answer" | "essay";
    options?: string[];
    correctAnswer: string;
  }>;
} {
  const contextPrefix = objectives ? `Based on the lesson objectives (${objectives}), ` : '';
  return {
    questions: [
      {
        question: `${contextPrefix}What is ${topic}?`,
        type: "short-answer",
        correctAnswer: `${topic} is a fundamental concept that involves key principles and applications.`
      },
      {
        question: `${contextPrefix}Which of the following best describes ${topic}?`,
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
        question: `${contextPrefix}Explain the key concepts of ${topic} in your own words.`,
        type: "essay",
        correctAnswer: "Answers should demonstrate understanding of the key concepts discussed in the lesson."
      },
      {
        question: `${contextPrefix}What are some practical applications of ${topic}?`,
        type: "short-answer",
        correctAnswer: "Practical applications include real-world examples that illustrate the concepts.`"
      },
      {
        question: `${contextPrefix}How would you apply your knowledge of ${topic}?`,
        type: "essay",
        correctAnswer: "Answers should show practical understanding and application of the concepts."
      }
    ]
  };
}
