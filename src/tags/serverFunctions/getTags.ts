import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { noteTags } from "src/notes/notes.schema";
import { tags } from "src/tags/tags.schema";
import type { TagSchema } from "src/tags/tags.schema";

type GetTagsInput = {
  pocketbookId: string;
};

type GetTagsResult = {
  tags: Array<TagSchema & { noteCount: number }>;
};

export const getTags = createServerFn({ method: "GET" })
  .inputValidator((input: GetTagsInput) => input)
  .handler(async ({ data }): Promise<GetTagsResult> => {
    const tagRows = db
      .select()
      .from(tags)
      .where(eq(tags.pocketbook, data.pocketbookId))
      .all();

    const allNoteTags =
      tagRows.length > 0 ? db.select().from(noteTags).all() : [];
    const countByTagId = new Map<string, number>();
    for (const nt of allNoteTags) {
      countByTagId.set(nt.tagId, (countByTagId.get(nt.tagId) ?? 0) + 1);
    }

    return {
      tags: tagRows.map((tag) => ({
        ...tag,
        noteCount: countByTagId.get(tag.id) ?? 0,
      })),
    };
  });
