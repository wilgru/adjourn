import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { noteTags } from "src/notes/notes.schema";
import { tags, tagGroups } from "src/tags/tags.schema";
import type { TagSchema, TagGroupSchema } from "src/tags/tags.schema";

type GetTagGroupsInput = {
  journalId: string;
};

type GetTagGroupsResult = {
  tagGroups: TagGroupSchema[];
  tags: Array<TagSchema & { noteCount: number }>;
};

export const getTagGroups = createServerFn({ method: "GET" })
  .inputValidator((input: GetTagGroupsInput) => input)
  .handler(async ({ data }): Promise<GetTagGroupsResult> => {
    const tagGroupRows = db
      .select()
      .from(tagGroups)
      .where(eq(tagGroups.journal, data.journalId))
      .all();

    const tagRows = db
      .select()
      .from(tags)
      .where(eq(tags.journal, data.journalId))
      .all();

    const allNoteTags =
      tagRows.length > 0 ? db.select().from(noteTags).all() : [];
    const countByTagId = new Map<string, number>();
    for (const nt of allNoteTags) {
      countByTagId.set(nt.tagId, (countByTagId.get(nt.tagId) ?? 0) + 1);
    }

    return {
      tagGroups: tagGroupRows,
      tags: tagRows.map((tag) => ({
        ...tag,
        noteCount: countByTagId.get(tag.id) ?? 0,
      })),
    };
  });
