import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, workspaces, workspaceMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get the current authenticated user from Supabase and ensure they exist in our DB.
 * Creates the user + default workspace on first login.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Check if user exists in our DB
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.authId, authUser.id))
    .limit(1);

  if (existingUser) return existingUser;

  // First login — create user + default workspace
  const [newUser] = await db
    .insert(users)
    .values({
      authId: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
      avatarUrl: authUser.user_metadata?.avatar_url || null,
    })
    .returning();

  // Create default workspace
  const slug = authUser.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: `${newUser.name}'s Workspace`,
      slug: `${slug}-${Date.now().toString(36)}`,
      ownerId: newUser.id,
    })
    .returning();

  // Add user as owner member
  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId: newUser.id,
    role: 'owner',
  });

  return newUser;
}

/**
 * Get the user's active workspace (first one they own).
 */
export async function getUserWorkspace(userId: string) {
  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerId, userId))
    .limit(1);

  return workspace;
}
