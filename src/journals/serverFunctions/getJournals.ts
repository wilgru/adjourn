import { createServerFn } from "@tanstack/react-start";
import { isNull, sql } from "drizzle-orm";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import type { JournalSchema } from "src/journals/journals.schema";

type GetJournalsResult = {
  journals: Array<JournalSchema & { noteCount: number; taskCount: number }>;
};

export const getJournals = createServerFn({ method: "GET" }).handler(
  async (): Promise<GetJournalsResult> => {
    const journalRows = db.select().from(journals).all();

    const noteCountRows = db
      .select({
        journal: notes.journal,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(notes)
      .where(isNull(notes.deleted))
      .groupBy(notes.journal)
      .all();
    const noteCountMap = new Map(
      noteCountRows.map((r) => [r.journal, r.count]),
    );

    const taskCountRows = db
      .select({
        journal: tasks.journal,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(tasks)
      .groupBy(tasks.journal)
      .all();
    const taskCountMap = new Map(
      taskCountRows.map((r) => [r.journal, r.count]),
    );

    return {
      journals: journalRows.map((j) => ({
        ...j,
        noteCount: noteCountMap.get(j.id) ?? 0,
        taskCount: taskCountMap.get(j.id) ?? 0,
      })),
    };
  },
);
