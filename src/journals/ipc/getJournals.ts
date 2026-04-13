import { eq, isNull } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import type { JournalSchema } from "src/journals/journals.schema";

export type GetJournalsInput = {
  userId: string | null;
};

export type GetJournalsResult = {
  journals: JournalSchema[];
};

createIpcHandler(
  "journals:getAll",
  ({ userId }: GetJournalsInput): GetJournalsResult => {
    const rows = db
      .select()
      .from(journals)
      .where(userId ? eq(journals.user, userId) : isNull(journals.user))
      .all();

    return { journals: rows };
  },
);
