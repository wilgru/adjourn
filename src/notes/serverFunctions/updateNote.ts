import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";
import type { NoteSchema } from "src/notes/notes.schema";

type UpdateNoteInput = {
  noteId: string;
  title: string | null;
  content: string | null;
  isBookmarked: boolean;
  tagIds: string[];
};

export const updateNote = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateNoteInput) => input)
  .handler(async ({ data }): Promise<NoteSchema> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(notes)
      .set({
        title: data.title,
        content: data.content,
        isBookmarked: data.isBookmarked,
        updated: now,
      })
      .where(eq(notes.id, data.noteId))
      .returning()
      .all();

    // Replace tags: delete existing, insert new
    db.delete(noteTags).where(eq(noteTags.noteId, data.noteId)).run();

    if (data.tagIds.length > 0) {
      db.insert(noteTags)
        .values(data.tagIds.map((tagId) => ({ noteId: data.noteId, tagId })))
        .run();
    }

    return {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      isBookmarked: updated.isBookmarked,
      journal: updated.journal,
      user: updated.user,
      deleted: updated.deleted,
      created: updated.created,
      updated: updated.updated,
    };
  });
