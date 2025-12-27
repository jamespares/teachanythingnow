import PptxGenJS from "pptxgenjs";

// Professional color scheme for educational presentations
const COLORS = {
  primary: "1E3A5F",      // Deep blue - professional, trustworthy
  secondary: "2E86AB",    // Bright blue - engaging
  accent: "F18F01",       // Orange - highlights, energy
  text: "2C3E50",         // Dark slate - readable
  textLight: "5D6D7E",    // Medium gray - secondary text
  background: "F8F9FA",   // Light gray - clean background
  white: "FFFFFF",
};

export async function generatePPT(
  slides: Array<{ title: string; content: string[] }>,
  topic: string
): Promise<Buffer> {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.author = "Teach Anything Now";
  pptx.company = "Teach Anything Now";
  pptx.title = `${topic} - Educational Presentation`;
  pptx.subject = `Educational content about ${topic}`;
  pptx.layout = "LAYOUT_16x9"; // Modern widescreen format

  // Add professional title slide
  const titleSlide = pptx.addSlide();
  
  // Background accent bar
  titleSlide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.15,
    fill: { color: COLORS.primary },
  });
  
  // Main title
  titleSlide.addText(topic, {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 1.2,
    fontSize: 44,
    bold: true,
    color: COLORS.primary,
    align: "center",
    fontFace: "Arial",
  });
  
  // Subtitle
  titleSlide.addText("Educational Presentation", {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.6,
    fontSize: 22,
    color: COLORS.textLight,
    align: "center",
    fontFace: "Arial",
  });
  
  // Decorative accent line
  titleSlide.addShape("rect", {
    x: 3.5,
    y: 4.3,
    w: 3,
    h: 0.05,
    fill: { color: COLORS.accent },
  });
  
  // Footer with branding
  titleSlide.addText("Created with Teach Anything Now", {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.4,
    fontSize: 12,
    color: COLORS.textLight,
    align: "center",
    fontFace: "Arial",
  });

  // Add content slides with professional styling
  slides.forEach((slide, slideIndex) => {
    const contentSlide = pptx.addSlide();
    
    // Header bar
    contentSlide.addShape("rect", {
      x: 0,
      y: 0,
      w: "100%",
      h: 1.1,
      fill: { color: COLORS.primary },
    });
    
    // Slide title on header
    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.25,
      w: 9,
      h: 0.7,
      fontSize: 28,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });
    
    // Content area with bullet points
    const bulletOptions = {
      x: 0.7,
      y: 1.4,
      w: 8.6,
      h: 3.8,
      fontSize: 18,
      color: COLORS.text,
      fontFace: "Arial",
      bullet: { 
        type: "bullet" as const,
        style: "arabicPeriod" as const,
      },
      paraSpaceBefore: 12,
      paraSpaceAfter: 8,
      lineSpacingMultiple: 1.3,
    };
    
    // Format content as bullet list
    const bulletContent = slide.content.map((point, index) => ({
      text: point,
      options: {
        bullet: { code: "2022" }, // Bullet character
        indentLevel: 0,
        color: COLORS.text,
        fontSize: 18,
        paraSpaceBefore: index === 0 ? 0 : 12,
      },
    }));
    
    contentSlide.addText(bulletContent, bulletOptions);
    
    // Slide number
    contentSlide.addText(`${slideIndex + 2}`, {
      x: 9,
      y: 5,
      w: 0.5,
      h: 0.3,
      fontSize: 10,
      color: COLORS.textLight,
      align: "right",
    });
    
    // Bottom accent line
    contentSlide.addShape("rect", {
      x: 0,
      y: 5.2,
      w: 2,
      h: 0.05,
      fill: { color: COLORS.accent },
    });
  });

  // Add summary/thank you slide
  const endSlide = pptx.addSlide();
  
  endSlide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: { color: COLORS.primary },
  });
  
  endSlide.addText("Thank You", {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1,
    fontSize: 44,
    bold: true,
    color: COLORS.white,
    align: "center",
    fontFace: "Arial",
  });
  
  endSlide.addText(`Questions about ${topic}?`, {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.6,
    fontSize: 22,
    color: COLORS.white,
    align: "center",
    fontFace: "Arial",
  });

  // Generate buffer
  const buffer = await pptx.write({ outputType: "nodebuffer" });
  return buffer as Buffer;
}

