"use client";

import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Primary Meta Tags */}
        <title>Teach Anything Now - AI Lesson Plan Generator for Teachers | Create PowerPoint, Worksheets & Audio in Seconds</title>
        <meta name="title" content="Teach Anything Now - AI Lesson Plan Generator for Teachers | Create PowerPoint, Worksheets & Audio in Seconds" />
        <meta name="description" content="AI-powered lesson planning tool for teachers. Generate complete teaching packages with PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images instantly. Save hours of preparation time with AI." />
        <meta name="keywords" content="AI lesson planner, AI teaching assistant, lesson plan generator, AI for teachers, educational AI tools, automated lesson plans, PowerPoint generator for teachers, worksheet generator, AI education tools, teaching resources, teacher AI assistant, lesson materials generator, education technology, EdTech AI" />
        <meta name="author" content="Teach Anything Now" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teachanything.com/" />
        <meta property="og:title" content="Teach Anything Now - AI Lesson Plan Generator for Teachers" />
        <meta property="og:description" content="Create complete lesson materials in seconds with AI. PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images for any topic." />
        <meta property="og:image" content="https://teachanything.com/logo.png" />
        <meta property="og:site_name" content="Teach Anything Now" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://teachanything.com/" />
        <meta property="twitter:title" content="Teach Anything Now - AI Lesson Plan Generator for Teachers" />
        <meta property="twitter:description" content="Create complete lesson materials in seconds with AI. PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images for any topic." />
        <meta property="twitter:image" content="https://teachanything.com/logo.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&display=swap" rel="stylesheet" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Teach Anything Now",
            "applicationCategory": "EducationalApplication",
            "offers": {
              "@type": "Offer",
              "price": "1.00",
              "priceCurrency": "GBP"
            },
            "description": "AI-powered lesson planning tool for teachers. Generate complete teaching packages with PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images instantly.",
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "teacher"
            },
            "featureList": [
              "AI-generated PowerPoint presentations",
              "Podcast-style audio explanations",
              "Custom worksheets with questions",
              "Complete answer sheets",
              "Educational images and illustrations",
              "Instant generation for any topic"
            ]
          })
        }} />
        
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
        {/* Umami Analytics - Track page views, location, and referral data */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8a62bfd9-fe25-464e-a960-5ca951e57747"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
