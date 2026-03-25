import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { updates } from "src/updates/updates.schema";

type GetDatesWithUpdatesInput = {
  journalId: string;
};

type DateWithUpdatesRow = {
  id: string;
  created: string;
  hasBookmarked: boolean;
};

type GetDatesWithUpdatesResult = {
  dates: DateWithUpdatesRow[];
};

export const getDatesWithUpdates = createServerFn({ method: "GET" })
  .inputValidator((input: GetDatesWithUpdatesInput) => input)
  .handler(async ({ data }): Promise<GetDatesWithUpdatesResult> => {
    const rows = db
      .select({ created: updates.created })
      .from(updates)
      .where(eq(updates.journal, data.journalId))
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
  });
