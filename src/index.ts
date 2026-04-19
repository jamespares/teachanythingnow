import { Hono } from "hono";
import { getAuth } from "./lib/auth";
import { getDb } from "./lib/db";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import { ResetPassword } from "./pages/ResetPassword";
import { Terms } from "./pages/Terms";
import { payments, packages } from "./db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { stripe } from "./lib/stripe";
import type Stripe from "stripe";
import { generatePPT } from "./lib/ppt-generator";
import { generateAudio } from "./lib/audio-generator";
import { generateContent } from "./lib/content-generator";
import { generateWorksheet } from "./lib/worksheet-generator";
import { generateImages, downloadImages } from "./lib/image-generator";
import { R2Storage } from "./lib/storage";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  STRIPE_SECRET_KEY: string;
  DEEPSEEK_API_KEY: string;
  GOOGLE_GEMINI_API_KEY: string;
  GOOGLE_TTS_API_KEY: string;
  SEND_EMAIL: SendEmail;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

};

const app = new Hono<{ Bindings: Bindings }>();

// Redirect www → non-www (before auth sees mismatched origins)
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === "www.teachanythingnow.com") {
    url.hostname = "teachanythingnow.com";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// --- UI Routes ---

app.get("/", async (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  return c.html(Home({ user: session?.user, stripeKey: c.env.STRIPE_PUBLISHABLE_KEY }));
});

app.get("/login", (c) => c.html(Auth({})));

app.get("/reset-password", (c) => c.html(ResetPassword({})));

app.get("/terms", (c) => c.html(Terms({})));

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

  return c.html(Dashboard({ user: session.user, packages: userPackages }));
});

// --- Auth Routes ---

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  return auth.handler(c.req.raw);
});

// --- API Routes ---

app.post("/api/payment/create", async (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const { topic } = await c.req.json();
  const stripeInstance = stripe(c.env.STRIPE_SECRET_KEY);

  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: 100, // £1.00
    currency: "gbp",
    metadata: { topic, userId: session.user.id },
  });

  await db.insert(payments).values({
    userId: session.user.id,
    stripePaymentIntentId: paymentIntent.id,
    stripeCustomerId: paymentIntent.customer as string || "guest",
    amount: 100,
    status: "pending",
    topic,
  });

  return c.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

app.post("/api/webhooks/stripe", async (c) => {
  const stripeInstance = stripe(c.env.STRIPE_SECRET_KEY);
  const signature = c.req.header("stripe-signature");
  const body = await c.req.text();

  if (!signature) {
    return c.text("Missing stripe-signature header", 400);
  }

  let event: Stripe.Event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      body,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return c.text(`Webhook Error: ${err.message}`, 400);
  }

  const db = getDb(c.env.DB);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await db
      .update(payments)
      .set({ status: "succeeded" })
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
  }

  return c.text("Received", 200);
});

app.post("/api/generate", async (c) => {
  const db = getDb(c.env.DB);
  const auth = getAuth(db, c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const { topic } = await c.req.json();
  
  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.userId, session.user.id),
        eq(payments.topic, topic),
        isNull(payments.usedAt)
      )
    )
    .limit(1);

  if (!payment) return c.json({ error: "No unused payment found for this topic" }, 400);

  // Verify payment succeeded (webhook or synchronous)
  if (payment.status !== "succeeded") {
    const stripeInstance = stripe(c.env.STRIPE_SECRET_KEY);
    const pi = await stripeInstance.paymentIntents.retrieve(payment.stripePaymentIntentId);

    if (pi.status !== "succeeded") {
      return c.json({ error: "Payment not completed" }, 400);
    }

    // Sync our DB since webhook may not have arrived yet
    await db
      .update(payments)
      .set({ status: "succeeded" })
      .where(eq(payments.id, payment.id));
  }

  // Mark as used
  await db.update(payments).set({ usedAt: new Date() }).where(eq(payments.id, payment.id));

  const storage = new R2Storage(c.env.BUCKET);
  const fileId = `${topic.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

  // 1. Generate Content
  const content = await generateContent(topic, c.env.DEEPSEEK_API_KEY);
  
  // 2. Parallel Generation Tasks
  const pptTask = async () => {
    const pptBuffer = await generatePPT(content.slides, topic);
    await storage.upload(pptBuffer, `${fileId}.pptx`, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    return `${fileId}.pptx`;
  };

  const audioTask = async () => {
    const audioRes = await generateAudio(content.podcastScript, topic, c.env.GOOGLE_TTS_API_KEY);
    await storage.upload(audioRes.buffer, `${fileId}.mp3`, "audio/mpeg");
    return `${fileId}.mp3`;
  };

  const worksheetTask = async () => {
    const worksheetBuffer = await generateWorksheet(topic, content.worksheet.questions);
    await storage.upload(worksheetBuffer, `${fileId}_worksheet.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    return `${fileId}_worksheet.docx`;
  };

  const imageTask = async () => {
    const imageResult = await generateImages(topic, content.slides, c.env.GOOGLE_GEMINI_API_KEY, c.env.DEEPSEEK_API_KEY);
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
    paymentId: payment.id,
    topic,
    fileId,
    files: JSON.stringify({
      presentation,
      audio,
      worksheet,
      images
    }),
  });

  return c.json({ packageId: fileId });
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
