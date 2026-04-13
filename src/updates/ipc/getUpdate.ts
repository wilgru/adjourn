import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

export type GetUpdateInput = { updateId: string };

export type GetUpdateResult = {
  update: UpdateSchema;
  noteIds: string[];
};

createIpcHandler(
  "updates:getOne",
  ({ updateId }: GetUpdateInput): GetUpdateResult => {
    const row = db.select().from(updates).where(eq(updates.id, updateId)).get();

    if (!row) {
      throw new Error(`Update not found: ${updateId}`);
    }

    const notes = db
      .select()
      .from(updateNotes)
      .where(eq(updateNotes.updateId, updateId))
      .all();

    return {
      update: row,
      noteIds: notes.map((n: { updateId: string; noteId: string }) => n.noteId),
    };
  },
);
