import { pgTable, uuid, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { workspaces } from './workspaces';

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'image', 'video', 'logo', 'screenshot'
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  url: text('url').notNull(),
  size: integer('size').notNull(), // bytes
  metadata: jsonb('metadata').$type<AssetMetadata>(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  uploadedById: uuid('uploaded_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const brandKits = pgTable('brand_kits', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }).unique(),
  colors: jsonb('colors').$type<BrandColors>().notNull(),
  fonts: jsonb('fonts').$type<BrandFonts>(),
  logoUrl: text('logo_url'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const assetsRelations = relations(assets, ({ one }) => ({
  workspace: one(workspaces, { fields: [assets.workspaceId], references: [workspaces.id] }),
  uploadedBy: one(users, { fields: [assets.uploadedById], references: [users.id] }),
}));

export const brandKitsRelations = relations(brandKits, ({ one }) => ({
  workspace: one(workspaces, { fields: [brandKits.workspaceId], references: [workspaces.id] }),
}));

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type BrandKit = typeof brandKits.$inferSelect;

export interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}
