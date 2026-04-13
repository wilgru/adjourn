import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import type { JournalSchema } from "src/journals/journals.schema";

export type GetJournalInput = { journalId: string };

createIpcHandler(
  "journals:getOne",
  ({ journalId }: GetJournalInput): JournalSchema => {
    const row = db
      .select()
      .from(journals)
      .where(eq(journals.id, journalId))
      .get();

    if (!row) {
      throw new Error(`Journal not found: ${journalId}`);
    }

    return row;
  },
);
