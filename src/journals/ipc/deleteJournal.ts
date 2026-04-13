import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";

export type DeleteJournalInput = { journalId: string };

createIpcHandler(
  "journals:delete",
  ({ journalId }: DeleteJournalInput): string => {
    db.delete(journals).where(eq(journals.id, journalId)).run();

    return journalId;
  },
);
