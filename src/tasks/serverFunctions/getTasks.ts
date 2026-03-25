import { createServerFn } from "@tanstack/react-start";
import {
  and,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
} from "drizzle-orm";
import { db } from "src/db/connection";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import type { SQL } from "drizzle-orm";
import type { NoteSchema } from "src/notes/notes.schema";
import type { TaskSchema } from "src/tasks/tasks.schema";

type GetTasksInput = {
  journalId: string;
  isFlagged?: boolean;
  createdAfter?: string;
  createdBefore?: string;
};

type GetTasksResult = {
  tasks: TaskSchema[];
  notes: Record<string, NoteSchema>;
};

export const getTasks = createServerFn({ method: "GET" })
  .inputValidator((input: GetTasksInput) => input)
  .handler(async ({ data }): Promise<GetTasksResult> => {
    const conditions: (SQL | undefined)[] = [eq(tasks.journal, data.journalId)];

    if (data.isFlagged !== undefined) {
      conditions.push(eq(tasks.isFlagged, data.isFlagged));
    }

    if (data.createdAfter && data.createdBefore) {
      conditions.push(
        or(
          and(
            isNotNull(tasks.dueDate),
            lte(tasks.dueDate, data.createdBefore),
            isNull(tasks.completedDate),
            isNull(tasks.cancelledDate),
          ),
          and(
            isNotNull(tasks.completedDate),
            gte(tasks.completedDate, data.createdAfter),
            lte(tasks.completedDate, data.createdBefore),
          ),
          and(
            isNotNull(tasks.cancelledDate),
            gte(tasks.cancelledDate, data.createdAfter),
            lte(tasks.cancelledDate, data.createdBefore),
          ),
        ),
      );
    }

    const taskRows = db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.dueDate))
      .all();

    // Fetch referenced notes
    const noteIds = [
      ...new Set(taskRows.map((t) => t.note).filter(Boolean)),
    ] as string[];
    const noteRows =
      noteIds.length > 0
        ? db.select().from(notes).where(inArray(notes.id, noteIds)).all()
        : [];
    const noteMap: Record<string, NoteSchema> = {};
    for (const n of noteRows) {
      noteMap[n.id] = n;
    }

    return { tasks: taskRows, notes: noteMap };
  });
