"use client";

import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import "./globals.css";
import BackgroundImage from "@/components/BackgroundImage";

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
        <title>Teach Anything Now - AI Teaching Resources Generator | Create Lesson Materials, PowerPoint, Worksheets & Audio in Seconds</title>
        <meta name="title" content="Teach Anything Now - AI Teaching Resources Generator | Create Lesson Materials, PowerPoint, Worksheets & Audio in Seconds" />
        <meta name="description" content="AI-powered teaching resources generator for teachers. Generate complete lesson materials including PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images instantly. Save hours of preparation time with AI." />
        <meta name="keywords" content="AI teaching resources, AI lesson materials generator, teaching resources generator, AI for teachers, educational AI tools, lesson materials creator, PowerPoint generator for teachers, worksheet generator, AI education tools, teaching resources, teacher AI assistant, lesson materials generator, education technology, EdTech AI, teaching materials generator" />
        <meta name="author" content="Teach Anything Now" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://teachanythingnow.com/" />
        <meta property="og:title" content="Teach Anything Now - AI Teaching Resources Generator" />
        <meta property="og:description" content="Generate complete teaching resources and lesson materials in seconds with AI. PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images for any topic." />
        <meta property="og:image" content="https://teachanythingnow.com/logo.png" />
        <meta property="og:image:alt" content="Teach Anything Now Logo" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Teach Anything Now" />
        <meta property="og:locale" content="en_GB" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://teachanythingnow.com/" />
        <meta name="twitter:title" content="Teach Anything Now - AI Teaching Resources Generator" />
        <meta name="twitter:description" content="Generate complete teaching resources and lesson materials in seconds with AI. PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images for any topic." />
        <meta name="twitter:image" content="https://teachanythingnow.com/logo.png" />
        <meta name="twitter:image:alt" content="Teach Anything Now Logo" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&display=swap" rel="stylesheet" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://teachanythingnow.com/" />
        
        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#00a884" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Teach Anything Now",
            "applicationCategory": "EducationalApplication",
            "url": "https://teachanythingnow.com/",
            "logo": "https://teachanythingnow.com/logo.png",
            "offers": {
              "@type": "Offer",
              "price": "1.00",
              "priceCurrency": "GBP",
              "availability": "https://schema.org/InStock"
            },
            "description": "AI-powered teaching resources generator for teachers. Generate complete lesson materials and teaching resources including PowerPoint presentations, podcast audio, worksheets, answer sheets, and educational images instantly.",
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
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            }
          })
        }} />
        
        {/* Favicons - Multiple sizes for different devices */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
      </head>
      <body>
        <BackgroundImage />
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
