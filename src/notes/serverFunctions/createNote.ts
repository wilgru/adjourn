import { createServerFn } from "@tanstack/react-start";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";
import type { NoteSchema } from "src/notes/notes.schema";

type CreateNoteInput = {
  title: string | null;
  content: string | null;
  isBookmarked: boolean;
  tagIds: string[];
  journalId: string | null;
  userId: string | null;
};

export const createNote = createServerFn({ method: "POST" })
  .inputValidator((input: CreateNoteInput) => input)
  .handler(async ({ data }): Promise<NoteSchema> => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(notes)
      .values({
        id,
        title: data.title,
        content: data.content,
        isBookmarked: data.isBookmarked,
        journal: data.journalId,
        user: data.userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    if (data.tagIds.length > 0) {
      db.insert(noteTags)
        .values(data.tagIds.map((tagId) => ({ noteId: id, tagId })))
        .run();
    }

    return {
      id: inserted.id,
      title: inserted.title,
      content: inserted.content,
      isBookmarked: inserted.isBookmarked,
      journal: inserted.journal,
      user: inserted.user,
      deleted: inserted.deleted,
      created: inserted.created,
      updated: inserted.updated,
    };
  });
