import { createServerFn } from "@tanstack/react-start";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "src/db/connection";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import { updates } from "src/updates/updates.schema";

type GetJournalContentCountsInput = {
  journalId: string;
};

type GetJournalContentCountsResult = {
  noteCount: number;
  bookmarkedCount: number;
  taskCount: number;
  updateCount: number;
};

export const getJournalContentCounts = createServerFn({ method: "GET" })
  .inputValidator((input: GetJournalContentCountsInput) => input)
  .handler(async ({ data }): Promise<GetJournalContentCountsResult> => {
    const noteCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(notes)
        .where(and(eq(notes.journal, data.journalId), isNull(notes.deleted)))
        .get()?.count ?? 0;

    const bookmarkedCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(notes)
        .where(
          and(
            eq(notes.journal, data.journalId),
            isNull(notes.deleted),
            eq(notes.isBookmarked, true),
          ),
        )
        .get()?.count ?? 0;

    const taskCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(eq(tasks.journal, data.journalId))
        .get()?.count ?? 0;

    const updateCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(updates)
        .where(eq(updates.journal, data.journalId))
        .get()?.count ?? 0;

    return { noteCount, bookmarkedCount, taskCount, updateCount };
  });
