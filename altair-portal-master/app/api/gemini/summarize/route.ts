/**
 * @file app/api/gemini/summarize/route.ts
 * @purpose Authenticated server-side API to audit and summarize workspace files via Gemini 3.5-flash.
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
    const { filename, content } = body;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const docContent = content || `Placeholder content for file: ${filename}.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        summary: `### AI CogniAI Draft Summary: ${filename}\n- Simulated summary (GEMINI_API_KEY not configured).`,
        source: 'mock-fallback',
      });
    }

    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
    const systemInstruction = `You are CogniAI, an elite file auditor and document integrity specialist.
Analyze the provided document and output a clean markdown audit with: high-level overview, 3 key bullet takeaways, and one actionable recommendation labeled "CogniAI Insight".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Summarize and audit the following workspace document:\nFile Name: ${filename}\nContent: ${docContent}`,
      config: { systemInstruction, temperature: 0.2 },
    });

    return NextResponse.json({ summary: response.text ?? 'Empty response. Try again.', source: 'live-gemini' });
  } catch {
    return serverError();
  }
}
