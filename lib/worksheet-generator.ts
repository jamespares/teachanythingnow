import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateWorksheet(
  topic: string,
  questions: Array<{
    question: string;
    type: "multiple-choice" | "short-answer" | "essay";
    options?: string[];
  }>
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([612, 792]); // US Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const margin = 50;
  let yPosition = currentPage.getHeight() - margin;
  const lineHeight = 20;
  const fontSize = 12;
  const titleSize = 24;

  // Header
  currentPage.drawText(`Worksheet: ${topic}`, {
    x: margin,
    y: yPosition,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= lineHeight * 2;

  currentPage.drawText(`Name: ___________________ Date: ___________`, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  yPosition -= lineHeight * 2;

  // Questions
  questions.forEach((q, index) => {
    // Check if we need a new page
    if (yPosition < margin + 100) {
      currentPage = pdfDoc.addPage([612, 792]);
      yPosition = currentPage.getHeight() - margin;
    }

    // Question number and text
    const questionText = `${index + 1}. ${q.question}`;
    currentPage.drawText(questionText, {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
      maxWidth: currentPage.getWidth() - margin * 2,
    });
    yPosition -= lineHeight * 1.5;

    if (q.type === "multiple-choice" && q.options) {
      q.options.forEach((option, optIndex) => {
        const optionText = `   ${String.fromCharCode(65 + optIndex)}. ${option}`;
        currentPage.drawText(optionText, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
          maxWidth: currentPage.getWidth() - margin * 2,
        });
        yPosition -= lineHeight;
      });
    } else if (q.type === "short-answer") {
      currentPage.drawText("Answer: _________________________________________________", {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    } else if (q.type === "essay") {
      currentPage.drawText("Answer:", {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
      // Add lines for essay
      for (let i = 0; i < 8; i++) {
        currentPage.drawLine({
          start: { x: margin, y: yPosition },
          end: { x: currentPage.getWidth() - margin, y: yPosition },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
      }
    }

    yPosition -= lineHeight;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function generateAnswerSheet(
  topic: string,
  questions: Array<{
    question: string;
    type: "multiple-choice" | "short-answer" | "essay";
    correctAnswer: string;
  }>
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([612, 792]); // US Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const margin = 50;
  let yPosition = currentPage.getHeight() - margin;
  const lineHeight = 20;
  const fontSize = 12;
  const titleSize = 24;

  // Header
  currentPage.drawText(`Answer Sheet: ${topic}`, {
    x: margin,
    y: yPosition,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= lineHeight * 3;

  // Answers
  questions.forEach((q, index) => {
    // Check if we need a new page
    if (yPosition < margin + 100) {
      currentPage = pdfDoc.addPage([612, 792]);
      yPosition = currentPage.getHeight() - margin;
    }

    // Question
    const questionText = `${index + 1}. ${q.question}`;
    currentPage.drawText(questionText, {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
      maxWidth: currentPage.getWidth() - margin * 2,
    });
    yPosition -= lineHeight * 1.5;

    // Answer
    const answerText = `Answer: ${q.correctAnswer}`;
    currentPage.drawText(answerText, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
      maxWidth: currentPage.getWidth() - margin * 2 - 20,
    });
    yPosition -= lineHeight * 2;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
