import { createServerFn } from "@tanstack/react-start";
import { eq, inArray } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";
import { tags } from "src/tags/tags.schema";
import type { NoteSchema } from "src/notes/notes.schema";
import type { TagSchema } from "src/tags/tags.schema";

type GetTagInput = {
  tagId: string;
};

type GetTagResult = {
  tag: TagSchema;
  noteCount: number;
  notes: NoteSchema[];
};

export const getTag = createServerFn({ method: "GET" })
  .inputValidator((input: GetTagInput) => input)
  .handler(async ({ data }): Promise<GetTagResult> => {
    const tag = db.select().from(tags).where(eq(tags.id, data.tagId)).get();

    if (!tag) {
      throw new Error(`Tag not found: ${data.tagId}`);
    }

    const noteTagRows = db
      .select()
      .from(noteTags)
      .where(eq(noteTags.tagId, data.tagId))
      .all();
    const noteIds = noteTagRows.map((r) => r.noteId);

    const noteRows =
      noteIds.length > 0
        ? db.select().from(notes).where(inArray(notes.id, noteIds)).all()
        : [];

    return {
      tag,
      noteCount: noteIds.length,
      notes: noteRows,
    };
  });
