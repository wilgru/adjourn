import { createServerFn } from "@tanstack/react-start";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";
import type { UpdateSchema } from "src/updates/updates.schema";

type CreateUpdateInput = {
  content: string | null;
  tint: string | null;
  noteIds: string[];
  pocketbookId: string | null;
  userId: string | null;
};

export const createUpdate = createServerFn({ method: "POST" })
  .inputValidator((input: CreateUpdateInput) => input)
  .handler(async ({ data }): Promise<UpdateSchema> => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(updates)
      .values({
        id,
        content: data.content,
        tint: data.tint,
        pocketbook: data.pocketbookId,
        user: data.userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    if (data.noteIds.length > 0) {
      db.insert(updateNotes)
        .values(data.noteIds.map((noteId) => ({ updateId: id, noteId })))
        .run();
    }

    return inserted;
  });
