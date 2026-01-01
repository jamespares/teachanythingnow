# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Samples section**: Added a new "Samples" section on the landing page where users can download sample resources (PowerPoint, audio, worksheets, answer keys) to preview quality
- **Google Gemini Nano Banana integration**: Updated image generation to use Google Gemini Nano Banana API for faster and more efficient image generation
- **Blog posts table migration**: Added SQL migration file for creating the blog_posts table in Supabase

### Changed
- **Logo updates**: Updated logo across all pages - removed text labels, increased size (250x83), and improved background blending with CSS mix-blend-mode
- **Header styling**: Removed grey border separator lines from all headers for cleaner design
- **Landing page**: Replaced "How It Works" section with "Samples" section to showcase resource quality

### Fixed
- **Podcast generation**: Fixed issue where podcast was outputting as text script instead of MP3 file. Now always generates MP3 audio or throws a clear error if generation fails (removed silent text fallback).

### Technical
- **Image generator**: Refactored to support Google Gemini API with fallback to Banana.dev API
- **Base64 image handling**: Updated download function to handle base64 data URLs from Gemini API

