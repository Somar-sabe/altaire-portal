/**
 * @file app/api/gemini/chat/route.ts
 * @purpose Authenticated server-side route for workspace chat via Gemini 3.5-flash.
 * @dependencies @google/genai, @/lib/ratelimit, @/lib/errors, @/lib/client-ip,
 *               @/auth, next/server
 *
 * Rate-limited: 20 req / 60 s per trusted client IP via aiLimiter (sliding window).
 */

import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkAiLimit } from '@/lib/ratelimit';
import { rateLimitError, serverError } from '@/lib/errors';
import { getClientIp } from '@/lib/client-ip';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Authentication guard — must be first.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = await checkAiLimit(`ai:${ip}`);
  if (rl.limited) return rateLimitError(rl.reset);

  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const mockAnswers: Record<string, string> = {
        hi: 'Hello! I am **CogniAI**, your workspace assistant. How can I assist you today?',
        default: 'Hello! This is a simulation response from **CogniAI** since your `GEMINI_API_KEY` is not set. Once you add your secret key, I will respond live.',
      };
      const key = prompt.toLowerCase().trim();
      return NextResponse.json({ text: mockAnswers[key] ?? mockAnswers['default'], source: 'mock-fallback' });
    }

    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
    const systemInstruction = `You are CogniAI, the hyper-intelligent unified workspace AI assistant on the Altair SaaS Platform.
Your tone is professional, technical, helpful, and highly polished.
Keep responses concise, formatted cleanly in Markdown, and limit lists to high-relevance items.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { systemInstruction, temperature: 0.7 },
    });

    return NextResponse.json({ text: response.text ?? 'Unable to formulate a response.', source: 'live-gemini' });
  } catch {
    return serverError();
  }
}
