// FILE: app/api/ai/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  const { action, scriptContent, promptContent } = await request.json();

  let systemPrompt = '';
  let userMessage = '';

  switch (action) {
    case 'generate-prompt':
      systemPrompt = "You are an expert at writing visual AI prompts for Gemini, Google Flow, and Luma Dream Machine. Given a YouTube video script fragment in Spanish, generate ONE optimized prompt in English for image or video generation. Include: visual style, lighting, camera angle, materials, mood. Respond with the prompt only, no explanation.";
      userMessage = `Script fragment: ${scriptContent}`;
      break;
    case 'improve-prompt':
      systemPrompt = "You are an expert at writing visual AI prompts. Rewrite the given prompt to be more effective by adding: shot type, lighting style, photographic style, materials, dominant colors, and mood. Keep the original intent. Respond with the improved prompt only in English, no explanation.";
      userMessage = `Original prompt: ${promptContent}`;
      break;
    case 'suggest-notes':
      systemPrompt = "You are a YouTube video production director for an AI/tech channel. Given a script fragment and optional visual prompt, suggest 3-4 concrete production notes in Spanish: camera angle, lighting, edit rhythm, suggested transition or visual effect. Respond as a short bullet list, no headers.";
      userMessage = `Script fragment: ${scriptContent}${promptContent ? `\nVisual prompt: ${promptContent}` : ''}`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const result = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
