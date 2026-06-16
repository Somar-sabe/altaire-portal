/**
 * @file app/api/leads/ai-helper/route.ts
 * @purpose Authenticated route that generates pipeline business insights via Gemini 3.5-flash.
 * @dependencies @google/genai, @/lib/ratelimit, @/lib/errors, @/lib/authz,
 *               @/lib/client-ip, next/server
 *
 * Rate-limited: 20 req / 60 s per trusted client IP via aiLimiter (sliding window).
 * Requires: session (401) + view_leads permission (403).
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/auth';
import { checkAiLimit } from '@/lib/ratelimit';
import { rateLimitError, serverError } from '@/lib/errors';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { getClientIp } from '@/lib/client-ip';

function isMockKey(key?: string): boolean {
  if (!key) return true;
  const k = key.trim().toLowerCase();
  return (
    k === '' ||
    k === 'placeholder' ||
    k.includes('your_api_key') ||
    k.startsWith('my_') ||
    k.includes('dummy') ||
    k.includes('api_key')
  );
}

function generateFallbackInsights(summary: Record<string, number> | null): string {
  const total = summary?.total ?? 0;
  const booked = summary?.booked ?? 0;
  const inProgress = summary?.inProgress ?? 0;
  const lost = summary?.lost ?? 0;
  const volume = summary?.activeVolume ?? 0;

  const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0;
  const avgValue = total > 0 ? Math.round(volume / total) : 0;

  let velocityClass = 'Stable';
  let velocityAdvice = 'Continue monitoring active assignee updates.';
  if (conversionRate < 15) {
    velocityClass = 'Critical Alert';
    velocityAdvice = 'Deploy localized follow-ups and implement strict lead rotation.';
  } else if (conversionRate > 35) {
    velocityClass = 'High Performance';
    velocityAdvice = 'Accelerate outbound campaigns to feed the high-converting channel.';
  }

  return `### Real-Time Business Intelligence Report

**Executive Summary:**
Pipeline tracking **${total} leads** with open valuation of **$${volume.toLocaleString()} USD**. Conversion rate: **${conversionRate}%** with **${booked} leads booked**.

#### Key Performance Metrics
- **Pipeline Health:** ${velocityClass} — avg lead value **$${avgValue.toLocaleString()} USD**
- **Active Follow-ups:** ${inProgress} pending | **${lost} lost/closed**

#### Strategic Recommendations
1. **Lead Rotation:** ${velocityAdvice}
2. **Conversion Pathing:** Standardize communications for the ${inProgress} active leads.
3. **Revenue Safeguards:** Prioritize high-value opportunities for immediate capture.`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Authentication + authorization guard — must be first.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await requirePermission('view_leads');
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return serverError();
  }

  const ip = getClientIp(req);
  const rl = await checkAiLimit(`ai:${ip}`);
  if (rl.limited) return rateLimitError(rl.reset);

  let leadsSummary: Record<string, number> | null = null;
  try {
    const body = await req.json();
    const prompt: string | undefined = body.prompt;
    leadsSummary = body.leadsSummary ?? null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (isMockKey(apiKey)) {
      return NextResponse.json({ text: generateFallbackInsights(leadsSummary) });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey!,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const contextualPrompt = `You are an expert sales analyst embedded within the Altair Unified SaaS Portal.
Analyze the following real-time lead pipeline statistics and write a concise, strategic summary in professional business English.

Active Pipeline Metrics:
- Total Leads: ${leadsSummary?.total ?? 0}
- Booked & Converted: ${leadsSummary?.booked ?? 0}
- Active Follow-ups: ${leadsSummary?.inProgress ?? 0}
- Open Pipeline Value: $${leadsSummary?.activeVolume ?? 0} USD
- Lost/Not Interested: ${leadsSummary?.lost ?? 0}

Keep the summary under 150 words, use bullet points and bold headers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt || contextualPrompt,
    });

    return NextResponse.json({ text: response.text ?? 'Unable to generate a summary at this time.' });
  } catch {
    return NextResponse.json({ text: generateFallbackInsights(leadsSummary) });
  }
}
