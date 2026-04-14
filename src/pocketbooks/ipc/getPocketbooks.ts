import { eq, isNull } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";

export type GetPocketbooksInput = {
  userId: string | null;
};

export type GetPocketbooksResult = {
  pocketbooks: PocketbookSchema[];
};

createIpcHandler(
  "pocketbooks:getAll",
  ({ userId }: GetPocketbooksInput): GetPocketbooksResult => {
    const rows = db
      .select()
      .from(pocketbooks)
      .where(userId ? eq(pocketbooks.user, userId) : isNull(pocketbooks.user))
      .all();

    return { pocketbooks: rows };
  },
);
