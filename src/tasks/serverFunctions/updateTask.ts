import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import type { NoteSchema } from "src/notes/notes.schema";
import type { TaskSchema } from "src/tasks/tasks.schema";

type UpdateTaskInput = {
  taskId: string;
  title: string;
  description: string;
  link: string | null;
  isFlagged: boolean;
  noteId: string | null;
  dueDate: string | null;
  completedDate: string | null;
  cancelledDate: string | null;
};

type UpdateTaskResult = {
  task: TaskSchema;
  note: NoteSchema | null;
};

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateTaskInput) => input)
  .handler(async ({ data }): Promise<UpdateTaskResult> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(tasks)
      .set({
        title: data.title,
        description: data.description,
        link: data.link,
        isFlagged: data.isFlagged,
        note: data.noteId,
        dueDate: data.dueDate,
        completedDate: data.completedDate,
        cancelledDate: data.cancelledDate,
        updated: now,
      })
      .where(eq(tasks.id, data.taskId))
      .returning()
      .all();

    let noteRow: NoteSchema | null = null;
    if (updated.note) {
      noteRow =
        db.select().from(notes).where(eq(notes.id, updated.note)).get() ?? null;
    }

    return { task: updated, note: noteRow };
  });
