import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes, noteTags } from "src/notes/notes.schema";

type DeleteNoteInput = {
  noteId: string;
};

export const deleteNote = createServerFn({ method: "POST" })
  .inputValidator((input: DeleteNoteInput) => input)
  .handler(async ({ data }): Promise<string> => {
    db.delete(noteTags).where(eq(noteTags.noteId, data.noteId)).run();
    db.delete(notes).where(eq(notes.id, data.noteId)).run();

    return data.noteId;
  });
