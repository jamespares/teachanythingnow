import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const posts = [
      {
        slug: "5-tips-for-creating-engaging-lesson-plans",
        title: "5 Tips for Creating Engaging Lesson Plans",
        excerpt: "Discover how to transform dry topics into exciting learning experiences with these five proven strategies for lesson planning.",
        content: `
<h2>1. Start with a Hook</h2>
<p>The first five minutes of class are crucial. Capture your students' attention immediately with a thought-provoking question, a surprising fact, or a short video clip related to the topic.</p>

<h2>2. Incorporate Multimedia</h2>
<p>Different students learn in different ways. Mix text with images, audio, and video to cater to various learning styles and keep engagement high.</p>

<h2>3. Make it Relevant</h2>
<p>Connect the lesson material to real-world examples that students can relate to. When students see the practical application of what they're learning, they're more likely to be interested.</p>

<h2>4. Encourage Active Participation</h2>
<p>Don't just lecture. Include activities that require students to discuss, debate, or solve problems together. Group work and interactive quizzes can be very effective.</p>

<h2>5. End with a Reflection</h2>
<p>Wrap up the lesson by asking students to reflect on what they've learned. This helps reinforce the material and gives you valuable feedback on their understanding.</p>
        `,
        author: "Sarah Johnson",
        tags: ["Lesson Planning", "Engagement", "Teaching Tips"],
        published: true,
        featured: true,
        meta_title: "5 Tips for Creating Engaging Lesson Plans - Teach Anything Now",
        meta_description: "Learn how to create engaging lesson plans that capture students' attention and improve learning outcomes."
      },
      {
        slug: "how-ai-is-revolutionizing-the-classroom",
        title: "How AI is Revolutionizing the Classroom",
        excerpt: "Artificial Intelligence is not just a buzzword; it's a powerful tool that can help teachers save time and personalize learning.",
        content: `
<h2>Personalized Learning Paths</h2>
<p>AI-powered tools can analyze student performance and adapt the curriculum to meet individual needs, helping struggling students catch up while challenging those who are ahead.</p>

<h2>Automating Administrative Tasks</h2>
<p>Grading, attendance, and lesson planning can be time-consuming. AI can automate many of these administrative tasks, freeing up teachers to focus on what they do best: teaching.</p>

<h2>Intelligent Tutoring Systems</h2>
<p>AI tutors can provide students with immediate feedback and support outside of the classroom, reinforcing concepts learned during school hours.</p>

<h2>The Future is Collaborative</h2>
<p>AI won't replace teachers, but it will augment their capabilities. The future of education lies in the collaboration between human empathy and artificial intelligence.</p>
        `,
        author: "David Chen",
        tags: ["AI in Education", "EdTech", "Future of Learning"],
        published: true,
        featured: false,
        meta_title: "How AI is Revolutionizing the Classroom - Teach Anything Now",
        meta_description: "Explore the impact of Artificial Intelligence on education and how it can benefit both teachers and students."
      },
      {
        slug: "the-art-of-differentiated-instruction",
        title: "The Art of Differentiated Instruction",
        excerpt: "Every student is unique. Learn how to tailor your teaching methods to accommodate diverse learning needs in the classroom.",
        content: `
<h2>Understanding Differentiation</h2>
<p>Differentiated instruction is about tailoring your teaching to meet the individual needs of students. It involves modifying the content, process, product, and learning environment.</p>

<h2>Flexible Grouping</h2>
<p>Use a mix of whole-class instruction, small group work, and individual activities. Group students based on their readiness, interests, or learning profiles.</p>

<h2>Tiered Assignments</h2>
<p>Create assignments with different levels of complexity but the same learning goals. This allows all students to work at their own pace and level of understanding.</p>

<h2>Ongoing Assessment</h2>
<p>Regularly assess student progress to identify gaps in understanding and adjust your instruction accordingly. Formative assessments are key to effective differentiation.</p>
        `,
        author: "Maria Rodriguez",
        tags: ["Differentiation", "Inclusive Education", "Pedagogy"],
        published: true,
        featured: false,
        meta_title: "The Art of Differentiated Instruction - Teach Anything Now",
        meta_description: "Master the art of differentiated instruction to support diverse learners and create an inclusive classroom environment."
      }
    ];

    const results = [];
    
    for (const post of posts) {
      // Check if exists
      const { data: existing } = await supabaseAdmin
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (!existing) {
        const { data, error } = await supabaseAdmin
          .from('blog_posts')
          .insert(post)
          .select();
          
        if (error) {
          console.error(`Error inserting ${post.slug}:`, error);
          results.push({ slug: post.slug, status: 'error', error });
        } else {
          results.push({ slug: post.slug, status: 'created', data });
        }
      } else {
        results.push({ slug: post.slug, status: 'skipped (already exists)' });
      }
    }

    return NextResponse.json({
      message: "Seed completed",
      results
    });
  } catch (error) {
    console.error("Error in seed endpoint:", error);
    return NextResponse.json(
      { error: "Failed to seed blog posts" },
      { status: 500 }
    );
  }
}
