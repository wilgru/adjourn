import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import Delta from "quill-delta";
import type { Note } from "src/notes/Note.type";
import type { NoteSchema } from "src/notes/notes.schema";
import type { Tag } from "src/tags/Tag.type";
import type { Task } from "src/tasks/Task.type";

dayjs.extend(utc);

type MapNoteOptions = {
  tags?: Tag[];
  tasks?: Task[];
};

export const mapNote = (
  note: NoteSchema,
  options: MapNoteOptions = {},
): Note => {
  return {
    id: note.id,
    title: note.title,
    tasks: options.tasks ?? [],
    content: note.content ? new Delta(JSON.parse(note.content)) : new Delta(),
    isBookmarked: note.isBookmarked,
    tags: options.tags ?? [],
    updateCount: 0,
    deleted: note.deleted ? dayjs.utc(note.deleted).local() : null,
    created: dayjs.utc(note.created).local(),
    updated: dayjs.utc(note.updated).local(),
  };
};
