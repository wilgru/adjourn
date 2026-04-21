import { and, eq, isNull, sql } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import { updates } from "src/updates/updates.schema";

export type GetPocketbookContentCountsInput = {
  pocketbookId: string;
};

export type GetPocketbookContentCountsResult = {
  noteCount: number;
  bookmarkedCount: number;
  taskCount: number;
  updateCount: number;
};

createIpcHandler(
  "pocketbooks:getContentCounts",
  ({
    pocketbookId,
  }: GetPocketbookContentCountsInput): GetPocketbookContentCountsResult => {
    const noteCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(notes)
        .where(and(eq(notes.pocketbook, pocketbookId), isNull(notes.deleted)))
        .get()?.count ?? 0;

    const bookmarkedCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(notes)
        .where(
          and(
            eq(notes.pocketbook, pocketbookId),
            isNull(notes.deleted),
            eq(notes.isBookmarked, true),
          ),
        )
        .get()?.count ?? 0;

    const taskCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(eq(tasks.pocketbook, pocketbookId))
        .get()?.count ?? 0;

    const updateCount =
      db
        .select({ count: sql<number>`count(*)` })
        .from(updates)
        .where(eq(updates.pocketbook, pocketbookId))
        .get()?.count ?? 0;

    return { noteCount, bookmarkedCount, taskCount, updateCount };
  },
);
