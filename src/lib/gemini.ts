const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GenerateScriptInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  videoType: 'explainer' | 'feature_demo' | 'launch_teaser' | 'onboarding' | 'paid_ad' | 'testimonial';
  tone: 'professional' | 'casual' | 'energetic' | 'minimal';
  durationSeconds: number;
}

interface GeneratedScript {
  script: string;
  scenes: GeneratedScene[];
}

interface GeneratedScene {
  id: string;
  order: number;
  type: 'hook' | 'feature' | 'social_proof' | 'cta' | 'custom';
  title: string;
  content: string;
  narration: string;
  durationSeconds: number;
  transition: 'fade' | 'slide' | 'zoom' | 'none';
}

export async function generateVideoScript(input: GenerateScriptInput): Promise<GeneratedScript> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = buildPrompt(input);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response from Gemini API');
  }

  const parsed = JSON.parse(text) as GeneratedScript;

  // Ensure scene IDs are unique
  parsed.scenes = parsed.scenes.map((scene, i) => ({
    ...scene,
    id: `scene-${Date.now()}-${i}`,
    order: i,
  }));

  return parsed;
}

function buildPrompt(input: GenerateScriptInput): string {
  const videoTypeDescriptions: Record<string, string> = {
    explainer: 'a product explainer video that introduces the product, highlights key benefits, and ends with a CTA',
    feature_demo: 'a feature demo that walks through a specific feature step-by-step with clear narration',
    launch_teaser: 'a short, hype-building launch teaser with fast pacing and mystery',
    onboarding: 'a user onboarding video that guides new users through the product setup',
    paid_ad: 'a short-form paid ad optimized for social media with an attention-grabbing hook',
    testimonial: 'a customer testimonial video showcasing success stories and metrics',
  };

  return `You are a professional SaaS video scriptwriter. Generate a video script for the following:

Product: ${input.productName}
Description: ${input.productDescription}
Target Audience: ${input.targetAudience}
Video Type: ${videoTypeDescriptions[input.videoType] || 'a product video'}
Tone: ${input.tone}
Target Duration: ${input.durationSeconds} seconds

Generate a structured video script with scenes. Each scene should have narration text that would be read aloud, and on-screen text/visual direction.

Return ONLY valid JSON in this exact format:
{
  "script": "Full narration script as one continuous text",
  "scenes": [
    {
      "type": "hook" | "feature" | "social_proof" | "cta" | "custom",
      "title": "Short scene title",
      "content": "Visual direction - what appears on screen",
      "narration": "What the voiceover says for this scene",
      "durationSeconds": number (seconds for this scene),
      "transition": "fade" | "slide" | "zoom" | "none"
    }
  ]
}

Rules:
- Total scene durations should add up to approximately ${input.durationSeconds} seconds
- First scene must be type "hook" — grab attention immediately
- Last scene must be type "cta" — clear call to action
- Keep narration concise and punchy (around 2-3 words per second)
- Use the ${input.tone} tone consistently
- Include 3-6 scenes depending on duration
- Make the content specific to ${input.productName}, not generic`;
}

export type { GenerateScriptInput, GeneratedScript, GeneratedScene };
