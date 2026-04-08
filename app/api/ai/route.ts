// FILE: app/api/ai/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function POST(request: Request) {
  const { action, scriptContent, promptContent } = await request.json();

  let prompt = '';

  switch (action) {
    case 'generate-prompt':
      prompt = `You are an expert at writing visual AI prompts for Gemini, Google Flow, and Luma Dream Machine. Given this YouTube video script fragment in Spanish, generate ONE optimized prompt in English for image or video generation. Include: visual style, lighting, camera angle, materials, mood. Respond with the prompt only, no explanation.\n\nScript fragment: ${scriptContent}`;
      break;
    case 'improve-prompt':
      prompt = `You are an expert at writing visual AI prompts. Rewrite the given prompt to be more effective by adding: shot type, lighting style, photographic style, materials, dominant colors, and mood. Keep the original intent. Respond with the improved prompt only in English, no explanation.\n\nOriginal prompt: ${promptContent}`;
      break;
    case 'suggest-notes':
      prompt = `You are a YouTube video production director for an AI/tech channel. Given this script fragment and optional visual prompt, suggest 3-4 concrete production notes in Spanish: camera angle, lighting, edit rhythm, suggested transition or visual effect. Respond as a short bullet list, no headers.\n\nScript fragment: ${scriptContent}${promptContent ? `\nVisual prompt: ${promptContent}` : ''}`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
