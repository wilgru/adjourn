import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

export type GetUpdatesInput = {
  journalId: string;
};

export type GetUpdatesResult = {
  updates: Array<UpdateSchema & { noteIds: string[] }>;
};

createIpcHandler(
  "updates:getAll",
  ({ journalId }: GetUpdatesInput): GetUpdatesResult => {
    const rows = db
      .select()
      .from(updates)
      .where(eq(updates.journal, journalId))
      .all();

    const allUpdateNotes =
      rows.length > 0 ? db.select().from(updateNotes).all() : [];

    const noteIdsByUpdateId = new Map<string, string[]>();
    for (const updateNote of allUpdateNotes) {
      const existing = noteIdsByUpdateId.get(updateNote.updateId) ?? [];
      existing.push(updateNote.noteId);
      noteIdsByUpdateId.set(updateNote.updateId, existing);
    }

    return {
      updates: rows.map((row: UpdateSchema) => ({
        ...row,
        noteIds: noteIdsByUpdateId.get(row.id) ?? [],
      })),
    };
  },
);
