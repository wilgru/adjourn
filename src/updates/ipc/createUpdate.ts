import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

export type CreateUpdateInput = {
  content: string | null;
  tint: string | null;
  noteIds: string[];
  pocketbookId: string | null;
  userId: string | null;
};

createIpcHandler(
  "updates:create",
  ({
    content,
    tint,
    noteIds,
    pocketbookId,
    userId,
  }: CreateUpdateInput): UpdateSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(updates)
      .values({
        id,
        content,
        tint,
        pocketbook: pocketbookId,
        user: userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    if (noteIds.length > 0) {
      db.insert(updateNotes)
        .values(noteIds.map((noteId) => ({ updateId: id, noteId })))
        .run();
    }

    return inserted;
  },
);
