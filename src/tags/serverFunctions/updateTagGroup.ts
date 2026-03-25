import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { tagGroups } from "src/tags/tags.schema";
import type { TagGroupSchema } from "src/tags/tags.schema";

type UpdateTagGroupInput = {
  tagGroupId: string;
  title: string;
};

export const updateTagGroup = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateTagGroupInput) => input)
  .handler(async ({ data }): Promise<TagGroupSchema> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(tagGroups)
      .set({
        title: data.title,
        updated: now,
      })
      .where(eq(tagGroups.id, data.tagGroupId))
      .returning()
      .all();

    return updated;
  });
