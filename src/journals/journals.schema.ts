import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm/table";
import type { ColourName } from "src/colours/Colour.type";

export const journals = sqliteTable("journals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon").notNull().default(""),
  colour: text("colour").notNull().$type<ColourName>(),
  notesSortBy: text("notes_sort_by").notNull().default("created"),
  notesSortDirection: text("notes_sort_direction").notNull().default("asc"),
  notesGroupBy: text("notes_group_by"),
  bookmarkedSortBy: text("bookmarked_sort_by").notNull().default("created"),
  bookmarkedSortDirection: text("bookmarked_sort_direction")
    .notNull()
    .default("asc"),
  bookmarkedGroupBy: text("bookmarked_group_by"),
  user: text("user"),
  created: text("created").notNull(),
  updated: text("updated").notNull(),
});
export type JournalSchema = InferSelectModel<typeof journals>;
