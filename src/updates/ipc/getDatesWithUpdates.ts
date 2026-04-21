import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { updates } from "src/updates/updates.schema";

export type GetDatesWithUpdatesInput = {
  pocketbookId: string;
};

export type DateWithUpdatesRow = {
  id: string;
  created: string;
  hasBookmarked: boolean;
};

export type GetDatesWithUpdatesResult = {
  dates: DateWithUpdatesRow[];
};

createIpcHandler(
  "updates:getDatesWithUpdates",
  ({ pocketbookId }: GetDatesWithUpdatesInput): GetDatesWithUpdatesResult => {
    const rows = db
      .select({ created: updates.created })
      .from(updates)
      .where(eq(updates.pocketbook, pocketbookId))
      .all();

    const uniqueDates = new Map<string, string>();
    for (const row of rows) {
      const dateStr = row.created.split("T")[0];
      if (!uniqueDates.has(dateStr)) {
        uniqueDates.set(dateStr, row.created);
      }
    }

    return {
      dates: Array.from(uniqueDates.entries()).map(([dateStr, created]) => ({
        id: dateStr,
        created,
        hasBookmarked: false,
      })),
    };
  },
);
