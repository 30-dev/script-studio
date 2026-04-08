// FILE: lib/docx-parser.ts
import mammoth from 'mammoth';

export async function parseDocx(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;

  // Split by headings or double newlines
  // This is a simple heuristic: split by lines that look like headings or by double newlines
  const sections = text.split(/\n\n+/).filter(s => s.trim().length > 0);

  return sections.map((content, index) => ({
    title: `Escena ${index + 1}`,
    content: content.trim(),
  }));
}
