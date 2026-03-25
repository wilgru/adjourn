import type { UpdateSchema } from "./updates.schema";
import type { Dayjs } from "dayjs";
import type Delta from "quill-delta";
import type { Note } from "src/notes/Note.type";

export type UpdateTint = "red" | "yellow" | "green" | "blue";

export type Update = Omit<
  UpdateSchema,
  "content" | "tint" | "journal" | "user" | "created" | "updated"
> & {
  content: Delta;
  tint: UpdateTint | null;
  notes: Note[];
  created: Dayjs;
  updated: Dayjs;
};

export type UpdatesGroup = {
  title: string;
  updates: Update[];
};
