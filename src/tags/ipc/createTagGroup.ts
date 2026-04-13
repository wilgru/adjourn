import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { tagGroups } from "src/tags/tags.schema";
import type { TagGroupSchema } from "src/tags/tags.schema";

export type CreateTagGroupInput = {
  title: string;
  journalId: string | null;
  userId: string | null;
};

createIpcHandler(
  "tagGroups:create",
  ({ title, journalId, userId }: CreateTagGroupInput): TagGroupSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(tagGroups)
      .values({
        id,
        title,
        journal: journalId,
        user: userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    return inserted;
  },
);
