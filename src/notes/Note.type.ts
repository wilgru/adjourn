import type { Dayjs } from "dayjs";
import type Delta from "quill-delta";
import type { Tag } from "src/tags/Tag.type";
import type { Task } from "src/tasks/Task.type";

export type Note = {
  id: string;
  isDraft: boolean; // TODO: remove
  title: string | null;
  tasks: Task[];
  content: Delta;
  isPinned: boolean;
  isFlagged: boolean;
  tags: Tag[];
  deleted: Dayjs | null;
  created: Dayjs;
  updated: Dayjs;
};

export type NotesGroup = {
  title: string | null;
  notes: Note[];
  relevantNoteData: Partial<Note>;
  sortOrder?: number;
};

export type DateWithNotes = {
  id: string;
  created: Dayjs;
  hasFlagged: boolean;
};
