import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";

export type DeleteUpdateInput = { updateId: string };

createIpcHandler(
  "updates:delete",
  ({ updateId }: DeleteUpdateInput): string => {
    db.delete(updateNotes).where(eq(updateNotes.updateId, updateId)).run();
    db.delete(updates).where(eq(updates.id, updateId)).run();

    return updateId;
  },
);
