import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

export type UpdateUpdateInput = {
  updateId: string;
  content: string | null;
  tint: string | null;
  noteIds: string[];
};

createIpcHandler(
  "updates:update",
  ({ updateId, content, tint, noteIds }: UpdateUpdateInput): UpdateSchema => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(updates)
      .set({ content, tint, updated: now })
      .where(eq(updates.id, updateId))
      .returning()
      .all();

    db.delete(updateNotes).where(eq(updateNotes.updateId, updateId)).run();

    if (noteIds.length > 0) {
      db.insert(updateNotes)
        .values(noteIds.map((noteId) => ({ updateId, noteId })))
        .run();
    }

    return updated;
  },
);
