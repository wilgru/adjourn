import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

type UpdateUpdateInput = {
  updateId: string;
  content: string | null;
  tint: string | null;
  noteIds: string[];
};

export const updateUpdate = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateUpdateInput) => input)
  .handler(async ({ data }): Promise<UpdateSchema> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(updates)
      .set({
        content: data.content,
        tint: data.tint,
        updated: now,
      })
      .where(eq(updates.id, data.updateId))
      .returning()
      .all();

    // Replace note associations
    db.delete(updateNotes).where(eq(updateNotes.updateId, data.updateId)).run();

    if (data.noteIds.length > 0) {
      db.insert(updateNotes)
        .values(
          data.noteIds.map((noteId) => ({
            updateId: data.updateId,
            noteId,
          })),
        )
        .run();
    }

    return updated;
  });
