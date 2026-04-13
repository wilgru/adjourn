import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { tags, tagGroups } from "src/tags/tags.schema";
import type { TagSchema, TagGroupSchema } from "src/tags/tags.schema";

export type GetTagsInput = {
  journalId: string;
};

export type GetTagsResult = {
  tags: TagSchema[];
  tagGroups: TagGroupSchema[];
};

createIpcHandler(
  "tags:getAll",
  ({ journalId }: GetTagsInput): GetTagsResult => {
    const tagRows = db
      .select()
      .from(tags)
      .where(eq(tags.journal, journalId))
      .all();

    const tagGroupRows = db
      .select()
      .from(tagGroups)
      .where(eq(tagGroups.journal, journalId))
      .all();

    return { tags: tagRows, tagGroups: tagGroupRows };
  },
);
