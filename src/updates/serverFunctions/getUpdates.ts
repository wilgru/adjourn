import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes } from "src/notes/notes.schema";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { NoteSchema } from "src/notes/notes.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

type GetUpdatesInput = {
  journalId: string;
  noteId?: string;
};

type GetUpdatesResult = {
  updates: Array<UpdateSchema & { noteIds: string[] }>;
  notes: NoteSchema[];
};

export const getUpdates = createServerFn({ method: "GET" })
  .inputValidator((input: GetUpdatesInput) => input)
  .handler(async ({ data }): Promise<GetUpdatesResult> => {
    let updateIds: string[] | null = null;

    if (data.noteId) {
      const relatedRows = db
        .select({ updateId: updateNotes.updateId })
        .from(updateNotes)
        .where(eq(updateNotes.noteId, data.noteId))
        .all();
      updateIds = relatedRows.map((r) => r.updateId);

      if (updateIds.length === 0) {
        return { updates: [], notes: [] };
      }
    }

    const conditions = [eq(updates.journal, data.journalId)];
    if (updateIds) {
      conditions.push(inArray(updates.id, updateIds));
    }

    const updateRows = db
      .select()
      .from(updates)
      .where(and(...conditions))
      .orderBy(desc(updates.created))
      .all();

    // Get note associations for these updates
    const allUpdateNoteRows =
      updateRows.length > 0 ? db.select().from(updateNotes).all() : [];

    const noteIdsByUpdateId = new Map<string, string[]>();
    const allNoteIds = new Set<string>();
    for (const un of allUpdateNoteRows) {
      const existing = noteIdsByUpdateId.get(un.updateId) ?? [];
      existing.push(un.noteId);
      noteIdsByUpdateId.set(un.updateId, existing);
      allNoteIds.add(un.noteId);
    }

    const noteRows =
      allNoteIds.size > 0
        ? db
            .select()
            .from(notes)
            .where(inArray(notes.id, [...allNoteIds]))
            .all()
        : [];

    return {
      updates: updateRows.map((u) => ({
        ...u,
        noteIds: noteIdsByUpdateId.get(u.id) ?? [],
      })),
      notes: noteRows,
    };
  });
