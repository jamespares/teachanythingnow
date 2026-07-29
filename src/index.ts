import { Hono } from "hono";
import { getAuth } from "./lib/auth";
import { getDb } from "./lib/db";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import { ResetPassword } from "./pages/ResetPassword";
import { Terms } from "./pages/Terms";
import { packages } from "./db/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { generatePPT } from "./lib/ppt-generator";
import { generateAudio } from "./lib/audio-generator";
import { generateContent } from "./lib/content-generator";
import { generateWorksheet } from "./lib/worksheet-generator";
import { generateImages, downloadImages } from "./lib/image-generator";
import { R2Storage } from "./lib/storage";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  AI: Ai;
  SEND_EMAIL: SendEmail;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

// Free tier: each signed-in user can generate this many lesson packages per day
const DAILY_FREE_LIMIT = 5;

const app = new Hono<{ Bindings: Bindings }>();

// Redirect www → non-www (before auth sees mismatched origins)
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === "lastminutelessons.com") {
    url.hostname = "www.lastminutelessons.com";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// --- UI Routes ---

app.get("/", async (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  return c.html(Home({ user: session?.user }) as any);
});

app.get("/login", (c) => {
  return c.html(Auth() as any);
});

app.get("/reset-password", (c) => {
  return c.html(ResetPassword() as any);
});

app.get("/terms", (c) => {
  return c.html(Terms() as any);
});

app.get("/privacy", (c) => {
  return c.redirect("https://jamespares.me/privacy/");
});

app.get("/dashboard", async (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) return c.redirect("/login");

  const userPackages = await db
    .select()
    .from(packages)
    .where(eq(packages.userId, session.user.id))
    .orderBy(desc(packages.createdAt));

  return c.html(Dashboard({ user: session.user, packages: userPackages }) as any);
});

// --- Auth Routes ---

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  return auth.handler(c.req.raw);
});

// --- API Routes ---

app.post("/api/generate", async (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const { topic, curriculum, yearLevel, duration, objectives } = await c.req.json();

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return c.json({ error: "Please provide a topic" }, 400);
  }

  // Enforce the daily free limit (resets at midnight UTC)
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [usage] = await db
    .select({ count: sql<number>`count(*)` })
    .from(packages)
    .where(and(
      eq(packages.userId, session.user.id),
      gte(packages.createdAt, startOfToday)
    ));

  if ((usage?.count ?? 0) >= DAILY_FREE_LIMIT) {
    return c.json({
      error: `You've used your ${DAILY_FREE_LIMIT} free generations for today. Come back tomorrow for ${DAILY_FREE_LIMIT} more!`
    }, 429);
  }

  const storage = new R2Storage(c.env.BUCKET);
  const safeTopic = topic.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const fileId = `${safeTopic}_${Date.now()}`;

  try {
    // 1. Generate Content (Workers AI: Kimi K2.6 primary, Llama 3.3 70B fallback)
    const content = await generateContent(topic.trim(), curriculum || "General", yearLevel || "All ages", c.env.AI, duration, objectives);

    // 2. Parallel Generation Tasks
    const pptTask = async () => {
      const pptBuffer = await generatePPT(content.slides, topic);
      await storage.upload(pptBuffer, `${fileId}.pptx`, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
      return `${fileId}.pptx`;
    };

    const audioTask = async () => {
      const audioRes = await generateAudio(content.podcastScript, topic, c.env.AI);
      await storage.upload(audioRes.buffer, `${fileId}.mp3`, "audio/mpeg");
      return `${fileId}.mp3`;
    };

    const worksheetTask = async () => {
      const worksheetBuffer = await generateWorksheet(topic, content.worksheet.questions);
      await storage.upload(worksheetBuffer, `${fileId}_worksheet.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      return `${fileId}_worksheet.docx`;
    };

    const imageTask = async () => {
      const imageResult = await generateImages(topic, content.slides, c.env.AI);
      const downloadedImages = await downloadImages(imageResult.images);
      const savedImages: string[] = [];
      for (let i = 0; i < downloadedImages.length; i++) {
        const name = `${fileId}_img_${i}.png`;
        await storage.upload(downloadedImages[i], name, "image/png");
        savedImages.push(name);
      }
      return savedImages;
    };

    const [presentation, audio, worksheet, images] = await Promise.all([
      pptTask(),
      audioTask(),
      worksheetTask(),
      imageTask()
    ]);

    // Save Package
    await db.insert(packages).values({
      userId: session.user.id,
      topic: topic.trim(),
      curriculum,
      yearLevel,
      duration,
      objectives,
      fileId,
      files: JSON.stringify({
        presentation,
        audio,
        worksheet,
        images
      }),
    });

    return c.json({ packageId: fileId });
  } catch (error: any) {
    console.error("Generation failed:", error?.message || error);
    return c.json({ error: "Content generation failed. Please try again — your free daily generations have not been affected." }, 500);
  }
});

app.get("/api/download", async (c) => {
  const fileName = c.req.query("file");
  if (!fileName) return c.text("Missing file name", 400);

  const object = await c.env.BUCKET.get(fileName);
  if (!object) return c.text("File not found", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

  return c.body(object.body, { headers });
});

export default app;
