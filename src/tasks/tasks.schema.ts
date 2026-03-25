import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { journals } from "src/journals/journals.schema";
import { notes } from "src/notes/notes.schema";
import type { InferSelectModel } from "drizzle-orm/table";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  link: text("link"),
  isFlagged: integer("is_flagged", { mode: "boolean" })
    .notNull()
    .default(false),
  note: text("note").references(() => notes.id),
  dueDate: text("due_date"),
  completedDate: text("completed_date"),
  cancelledDate: text("cancelled_date"),
  journal: text("journal").references(() => journals.id),
  user: text("user"),
  created: text("created").notNull(),
  updated: text("updated").notNull(),
});
export type TaskSchema = InferSelectModel<typeof tasks>;
