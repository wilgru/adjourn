import type { Dayjs } from "dayjs";
import type Delta from "quill-delta";
import type { Note } from "src/notes/Note.type";

export type UpdateTint = "red" | "yellow" | "green" | "blue";

export type Update = {
  id: string;
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
