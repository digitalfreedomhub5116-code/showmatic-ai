import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assets } from '@/lib/db/schema';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { eq, desc } from 'drizzle-orm';

// GET /api/assets — list all assets for current workspace
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const allAssets = await db
    .select()
    .from(assets)
    .where(eq(assets.workspaceId, workspace.id))
    .orderBy(desc(assets.createdAt));

  return NextResponse.json({ assets: allAssets });
}

// POST /api/assets — upload a file to Supabase Storage and save metadata
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getUserWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'video/mp4'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  // Max 50MB
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
  }

  // Upload to Supabase Storage
  const supabase = await createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${workspace.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('assets')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('assets')
    .getPublicUrl(fileName);

  // Determine asset type
  let assetType = 'image';
  if (file.type.startsWith('video/')) assetType = 'video';
  if (file.name.toLowerCase().includes('logo')) assetType = 'logo';
  if (file.name.toLowerCase().includes('screenshot')) assetType = 'screenshot';

  // Save metadata to DB
  const [asset] = await db
    .insert(assets)
    .values({
      name: file.name,
      type: assetType,
      mimeType: file.type,
      url: publicUrl,
      size: file.size,
      workspaceId: workspace.id,
      uploadedById: user.id,
    })
    .returning();

  return NextResponse.json({ asset }, { status: 201 });
}
