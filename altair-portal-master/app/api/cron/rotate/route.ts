import { NextRequest, NextResponse } from 'next/server';
import { rotateInactiveLeads } from '@/lib/lead-rotation';

async function handleRotation(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // GPT-Codex (G) BEGIN: delegate cron rotation to the shared no-N+1 service.
    const result = await rotateInactiveLeads();
    return NextResponse.json({ success: true, ...result });
    // GPT-Codex (G) END: route only handles auth/HTTP, while rotation rules live in one service.
  } catch (error: unknown) {
    // Log full error server-side only; never expose error.message in the response body.
    console.error('Cron Rotate Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return handleRotation(req);
}

// GPT-Codex (G) BEGIN: GET must never mutate lead assignments; cron callers must use POST + Bearer secret.
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
// GPT-Codex (G) END: cron rotation side effects are POST-only.
