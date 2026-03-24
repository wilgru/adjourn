import { createServerFn } from "@tanstack/react-start";
import { db } from "src/db/connection";
import { tagGroups } from "src/tags/tags.schema";
import type { TagGroupSchema } from "src/tags/tags.schema";

type CreateTagGroupInput = {
  title: string;
  journalId: string | null;
  userId: string | null;
};

export const createTagGroup = createServerFn({ method: "POST" })
  .inputValidator((input: CreateTagGroupInput) => input)
  .handler(async ({ data }): Promise<TagGroupSchema> => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(tagGroups)
      .values({
        id,
        title: data.title,
        journal: data.journalId,
        user: data.userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    return inserted;
  });
