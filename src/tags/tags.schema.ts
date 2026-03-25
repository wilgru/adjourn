import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { journals } from "src/journals/journals.schema";
import type { InferSelectModel } from "drizzle-orm/table";
import type { ColourName } from "src/colours/Colour.type";

export const tagGroups = sqliteTable("tag_groups", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  journal: text("journal").references(() => journals.id),
  user: text("user"),
  created: text("created").notNull(),
  updated: text("updated").notNull(),
});
export type TagGroupSchema = InferSelectModel<typeof tagGroups>;

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  colour: text("colour").notNull().$type<ColourName>(),
  icon: text("icon").notNull().default(""),
  description: text("description"),
  groupBy: text("group_by"),
  sortBy: text("sort_by").notNull().default("created"),
  sortDirection: text("sort_direction").notNull().default("asc"),
  links: text("links").notNull().default("[]"),
  tagGroup: text("tag_group").references(() => tagGroups.id),
  journal: text("journal").references(() => journals.id),
  user: text("user"),
  created: text("created").notNull(),
  updated: text("updated").notNull(),
});
export type TagSchema = InferSelectModel<typeof tags>;
