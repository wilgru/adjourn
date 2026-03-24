import { createServerFn } from "@tanstack/react-start";
import { and, eq, gte, isNull, lte } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";
import type { NoteSchema } from "src/notes/notes.schema";

type GetNotesInput = {
  journalId: string;
  isBookmarked?: boolean;
  createdAfter?: string;
  createdBefore?: string;
};

type GetNotesResult = {
  notes: Array<NoteSchema & { tagIds: string[] }>;
};

export const getNotes = createServerFn({ method: "GET" })
  .inputValidator((input: GetNotesInput) => input)
  .handler(async ({ data }): Promise<GetNotesResult> => {
    const conditions = [
      eq(notes.journal, data.journalId),
      isNull(notes.deleted),
    ];

    if (data.isBookmarked !== undefined) {
      conditions.push(eq(notes.isBookmarked, data.isBookmarked));
    }

    if (data.createdAfter) {
      conditions.push(gte(notes.created, data.createdAfter));
    }

    if (data.createdBefore) {
      conditions.push(lte(notes.created, data.createdBefore));
    }

    const rows = db
      .select()
      .from(notes)
      .where(and(...conditions))
      .all();

    const allNoteTags = rows.length > 0 ? db.select().from(noteTags).all() : [];

    const tagsByNoteId = new Map<string, string[]>();
    for (const nt of allNoteTags) {
      const existing = tagsByNoteId.get(nt.noteId) ?? [];
      existing.push(nt.tagId);
      tagsByNoteId.set(nt.noteId, existing);
    }

    return {
      notes: rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        isBookmarked: row.isBookmarked,
        journal: row.journal,
        user: row.user,
        deleted: row.deleted,
        created: row.created,
        updated: row.updated,
        tagIds: tagsByNoteId.get(row.id) ?? [],
      })),
    };
  });
