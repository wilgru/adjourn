import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { tags } from "src/tags/tags.schema";

export type DeleteTagInput = { tagId: string };

createIpcHandler("tags:delete", ({ tagId }: DeleteTagInput): string => {
  db.delete(tags).where(eq(tags.id, tagId)).run();

  return tagId;
});
