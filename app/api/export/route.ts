// FILE: app/api/export/route.ts
import { NextResponse } from 'next/server';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType, LevelFormat,
} from 'docx';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BLOCK_LABELS: Record<string, string> = {
  script: 'GUION',
  prompt: 'PROMPT',
  note: 'NOTA',
  code: 'CÓDIGO',
  asset: 'ASSET',
};

const BLOCK_COLORS: Record<string, string> = {
  script: 'E6F1FB',
  prompt: 'EEEDFE',
  note: 'FAEEDA',
  code: 'EAF3DE',
  asset: 'FAECE7',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scriptId = searchParams.get('scriptId');

  if (!scriptId) {
    return NextResponse.json({ error: 'Missing scriptId' }, { status: 400 });
  }

  // Fetch all data
  const [{ data: script }, { data: nodes }, { data: blocks }] = await Promise.all([
    supabase.from('scripts').select('*').eq('id', scriptId).single(),
    supabase.from('nodes').select('*').eq('script_id', scriptId).order('position_x'),
    supabase.from('blocks').select('*').in(
      'node_id',
      (await supabase.from('nodes').select('id').eq('script_id', scriptId)).data?.map(n => n.id) ?? []
    ).order('position'),
  ]);

  if (!script || !nodes) {
    return NextResponse.json({ error: 'Script not found' }, { status: 404 });
  }

  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: script.title, bold: true, size: 48, font: 'Arial' })],
      spacing: { after: 400 },
    })
  );

  // Scenes
  for (const node of nodes ?? []) {
    const nodeBlocks = (blocks ?? []).filter((b: any) => b.node_id === node.id);

    // Scene title
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'ESCENA  ', bold: true, size: 18, color: '888888', font: 'Arial' }),
          new TextRun({ text: node.title, bold: true, size: 24, font: 'Arial' }),
        ],
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: '7F77DD' },
        },
        spacing: { before: 400, after: 200 },
      })
    );

    if (nodeBlocks.length === 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Sin bloques', italics: true, color: 'AAAAAA', font: 'Arial', size: 20 })],
          spacing: { after: 200 },
        })
      );
      continue;
    }

    for (const block of nodeBlocks) {
      // Block label badge
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `  ${BLOCK_LABELS[block.type] ?? block.type}  `,
              bold: true,
              size: 16,
              font: 'Arial',
              color: '444444',
              shading: { type: ShadingType.CLEAR, fill: BLOCK_COLORS[block.type] ?? 'F5F5F3' },
            }),
          ],
          spacing: { before: 160, after: 80 },
        })
      );

      // Block content
      if (block.type === 'asset') {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.asset_url ? `URL: ${block.asset_url}` : '(sin asset)',
                italics: true,
                color: '666666',
                font: 'Arial',
                size: 20,
              }),
            ],
            spacing: { after: 120 },
          })
        );
      } else if (block.content) {
        const lines = block.content.split('\n');
        for (const line of lines) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: line || ' ', font: 'Arial', size: 20 })],
              spacing: { after: 60 },
            })
          );
        }
      } else {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: '(vacío)', italics: true, color: 'AAAAAA', font: 'Arial', size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  const doc = new Document({
    numbering: { config: [] },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);

  const filename = `${script.title.replace(/[^a-z0-9]/gi, '_')}.docx`;

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
