import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";
import type { NoteSchema } from "src/notes/notes.schema";

export type CreateNoteInput = {
  title: string | null;
  content: string | null;
  isBookmarked: boolean;
  tagIds: string[];
  journalId: string | null;
  userId: string | null;
};

createIpcHandler(
  "notes:create",
  ({
    title,
    content,
    isBookmarked,
    tagIds,
    journalId,
    userId,
  }: CreateNoteInput): NoteSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(notes)
      .values({
        id,
        title,
        content,
        isBookmarked,
        journal: journalId,
        user: userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    if (tagIds.length > 0) {
      db.insert(noteTags)
        .values(tagIds.map((tagId) => ({ noteId: id, tagId })))
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
  },
);
