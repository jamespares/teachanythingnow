import PptxGenJS from "pptxgenjs";

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

  // Add title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(topic, {
    x: 1,
    y: 2,
    w: 8,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: "363636",
    align: "center",
  });
  titleSlide.addText("Educational Presentation", {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.8,
    fontSize: 24,
    color: "666666",
    align: "center",
  });

  // Add content slides
  slides.forEach((slide) => {
    const contentSlide = pptx.addSlide();
    
    // Add title
    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: "2E5090",
    });

    // Add bullet points
    slide.content.forEach((point, index) => {
      contentSlide.addText(point, {
        x: 0.5,
        y: 1.5 + index * 0.8,
        w: 9,
        h: 0.7,
        fontSize: 18,
        color: "363636",
        bullet: true,
      });
    });
  });

  // Generate buffer
  const buffer = await pptx.write({ outputType: "nodebuffer" });
  return buffer as Buffer;
}

