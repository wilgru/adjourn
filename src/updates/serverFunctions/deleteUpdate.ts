import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { updates, updateNotes } from "src/updates/updates.schema";

type DeleteUpdateInput = {
  updateId: string;
};

export const deleteUpdate = createServerFn({ method: "POST" })
  .inputValidator((input: DeleteUpdateInput) => input)
  .handler(async ({ data }): Promise<string> => {
    db.delete(updateNotes).where(eq(updateNotes.updateId, data.updateId)).run();
    db.delete(updates).where(eq(updates.id, data.updateId)).run();

    return data.updateId;
  });
