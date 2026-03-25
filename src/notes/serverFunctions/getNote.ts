import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";
import type { NoteSchema } from "src/notes/notes.schema";

type GetNoteInput = {
  noteId: string;
};

type GetNoteResult = {
  note: NoteSchema;
  tagIds: string[];
};

export const getNote = createServerFn({ method: "GET" })
  .inputValidator((input: GetNoteInput) => input)
  .handler(async ({ data }): Promise<GetNoteResult> => {
    const row = db.select().from(notes).where(eq(notes.id, data.noteId)).get();

    if (!row) {
      throw new Error(`Note not found: ${data.noteId}`);
    }

    const tags = db
      .select()
      .from(noteTags)
      .where(eq(noteTags.noteId, data.noteId))
      .all();

    return {
      note: {
        id: row.id,
        title: row.title,
        content: row.content,
        isBookmarked: row.isBookmarked,
        journal: row.journal,
        user: row.user,
        deleted: row.deleted,
        created: row.created,
        updated: row.updated,
      },
      tagIds: tags.map((t) => t.tagId),
    };
  });
