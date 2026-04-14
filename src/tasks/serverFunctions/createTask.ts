import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import type { NoteSchema } from "src/notes/notes.schema";
import type { TaskSchema } from "src/tasks/tasks.schema";

type CreateTaskInput = {
  title: string;
  description: string;
  link: string | null;
  isFlagged: boolean;
  noteId: string | null;
  dueDate: string | null;
  completedDate: string | null;
  cancelledDate: string | null;
  pocketbookId: string | null;
  userId: string | null;
};

type CreateTaskResult = {
  task: TaskSchema;
  note: NoteSchema | null;
};

export const createTask = createServerFn({ method: "POST" })
  .inputValidator((input: CreateTaskInput) => input)
  .handler(async ({ data }): Promise<CreateTaskResult> => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(tasks)
      .values({
        id,
        title: data.title,
        description: data.description,
        link: data.link,
        isFlagged: data.isFlagged,
        note: data.noteId,
        dueDate: data.dueDate,
        completedDate: data.completedDate,
        cancelledDate: data.cancelledDate,
        pocketbook: data.pocketbookId,
        user: data.userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    let noteRow: NoteSchema | null = null;
    if (inserted.note) {
      noteRow =
        db.select().from(notes).where(eq(notes.id, inserted.note)).get() ??
        null;
    }

    return { task: inserted, note: noteRow };
  });
