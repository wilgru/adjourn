import { createServerFn } from "@tanstack/react-start";
import { isNull, sql } from "drizzle-orm";
import { db } from "src/db/connection";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";

type GetPocketbooksResult = {
  pocketbooks: Array<PocketbookSchema & { noteCount: number; taskCount: number }>;
};

export const getPocketbooks = createServerFn({ method: "GET" }).handler(
  async (): Promise<GetPocketbooksResult> => {
    const pocketbookRows = db.select().from(pocketbooks).all();

    const noteCountRows = db
      .select({
        pocketbook: notes.pocketbook,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(notes)
      .where(isNull(notes.deleted))
      .groupBy(notes.pocketbook)
      .all();
    const noteCountMap = new Map(
      noteCountRows.map((r) => [r.pocketbook, r.count]),
    );

    const taskCountRows = db
      .select({
        pocketbook: tasks.pocketbook,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(tasks)
      .groupBy(tasks.pocketbook)
      .all();
    const taskCountMap = new Map(
      taskCountRows.map((r) => [r.pocketbook, r.count]),
    );

    return {
      pocketbooks: pocketbookRows.map((j) => ({
        ...j,
        noteCount: noteCountMap.get(j.id) ?? 0,
        taskCount: taskCountMap.get(j.id) ?? 0,
      })),
    };
  },
);
