// Worksheet generation utility
// Generates editable DOCX format worksheets for easy user editing
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Spacing,
  UnderlineType,
} from "docx";

export async function generateWorksheet(
  topic: string,
  questions: Array<{
    question: string;
    type: "multiple-choice" | "short-answer" | "essay";
    options?: string[];
  }>
): Promise<Buffer> {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: `Worksheet: ${topic}`,
      heading: HeadingLevel.TITLE,
      spacing: {
        after: 400,
      },
    })
  );

  // Name and Date fields (editable)
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Name: ",
          bold: true,
        }),
        new TextRun({
          text: "___________________",
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
        new TextRun({
          text: "    Date: ",
          bold: true,
        }),
        new TextRun({
          text: "___________",
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
      ],
      spacing: {
        after: 300,
      },
    })
  );

  // Questions
  questions.forEach((q, index) => {
    // Question number and text
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. `,
            bold: true,
          }),
          new TextRun({
            text: q.question,
            bold: true,
          }),
        ],
        spacing: {
          before: 200,
          after: 200,
        },
      })
    );

    if (q.type === "multiple-choice" && q.options) {
      // Multiple choice options
      q.options.forEach((option, optIndex) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `   ${String.fromCharCode(65 + optIndex)}. `,
              }),
              new TextRun({
                text: option,
              }),
            ],
            indent: {
              left: 360, // 0.25 inch indent
            },
            spacing: {
              after: 100,
            },
          })
        );
      });
    } else if (q.type === "short-answer") {
      // Short answer with underline for writing space
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Answer: ",
              bold: true,
            }),
            new TextRun({
              text: "________________________________________________________________",
              underline: {
                type: UnderlineType.SINGLE,
              },
            }),
          ],
          spacing: {
            after: 200,
          },
        })
      );
    } else if (q.type === "essay") {
      // Essay question with multiple lines
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Answer:",
              bold: true,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );

      // Add multiple blank lines for essay writing
      for (let i = 0; i < 8; i++) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "________________________________________________________________",
                underline: {
                  type: UnderlineType.SINGLE,
                },
              }),
            ],
            spacing: {
              after: 200,
            },
          })
        );
      }
    }

    // Add spacing after each question
    children.push(
      new Paragraph({
        text: "",
        spacing: {
          after: 200,
        },
      })
    );
  });

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  // Generate the buffer
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

// Answer sheet remains as PDF since it's for reference, not editing
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
