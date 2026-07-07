import { pgTable, uuid, varchar, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { workspaces } from './workspaces';
import { templates } from './templates';

export const projectStatusEnum = pgEnum('project_status', [
  'draft',
  'scripting',
  'storyboarding',
  'editing',
  'rendering',
  'rendered',
  'archived',
]);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: projectStatusEnum('status').notNull().default('draft'),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  createdById: uuid('created_by_id').notNull().references(() => users.id),
  templateId: uuid('template_id').references(() => templates.id),
  script: text('script'),
  scenes: jsonb('scenes').$type<Scene[]>(),
  settings: jsonb('settings').$type<ProjectSettings>(),
  thumbnailUrl: text('thumbnail_url'),
  exportUrl: text('export_url'),
  durationSeconds: integer('duration_seconds'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, { fields: [projects.workspaceId], references: [workspaces.id] }),
  createdBy: one(users, { fields: [projects.createdById], references: [users.id] }),
  template: one(templates, { fields: [projects.templateId], references: [templates.id] }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export interface Scene {
  id: string;
  order: number;
  type: 'hook' | 'feature' | 'social_proof' | 'cta' | 'custom';
  title: string;
  content: string;
  durationSeconds: number;
  media?: {
    type: 'image' | 'video' | 'screenshot';
    url: string;
    alt?: string;
  };
  transition?: 'fade' | 'slide' | 'zoom' | 'none';
}

export interface ProjectSettings {
  resolution: '1080p' | '720p';
  aspectRatio: '16:9' | '9:16' | '1:1';
  brandColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fontFamily: string;
}
