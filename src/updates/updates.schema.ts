import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import { notes } from "src/notes/notes.schema";
import type { InferSelectModel } from "drizzle-orm/table";

export const updates = sqliteTable("updates", {
  id: text("id").primaryKey(),
  content: text("content"),
  tint: text("tint"),
  pocketbook: text("pocketbook").references(() => pocketbooks.id),
  user: text("user"),
  created: text("created").notNull(),
  updated: text("updated").notNull(),
});
export type UpdateSchema = InferSelectModel<typeof updates>;

export const updateNotes = sqliteTable("update_notes", {
  updateId: text("update_id")
    .notNull()
    .references(() => updates.id),
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id),
});
