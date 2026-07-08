import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateVideoScript, type GenerateScriptInput } from '@/lib/gemini';
import { z } from 'zod';

const generateSchema = z.object({
  productName: z.string().min(1).max(200),
  productDescription: z.string().min(10).max(2000),
  targetAudience: z.string().min(1).max(500),
  videoType: z.enum(['explainer', 'feature_demo', 'launch_teaser', 'onboarding', 'paid_ad', 'testimonial']),
  tone: z.enum(['professional', 'casual', 'energetic', 'minimal']),
  durationSeconds: z.number().min(10).max(180),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = generateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await generateVideoScript(parsed.data as GenerateScriptInput);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('[generate-script] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to generate script. Please try again.' },
      { status: 500 }
    );
  }
}
