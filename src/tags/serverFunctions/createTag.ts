import { createServerFn } from "@tanstack/react-start";
import { db } from "src/db/connection";
import { tags } from "src/tags/tags.schema";
import type { ColourName } from "src/colours/Colour.type";
import type { TagSchema } from "src/tags/tags.schema";

type CreateTagInput = {
  name: string;
  colour: ColourName;
  icon: string;
  description: string | null;
  sortBy: string;
  sortDirection: string;
  links: string;
  tagGroupId: string | null;
  journalId: string | null;
  userId: string | null;
};

export const createTag = createServerFn({ method: "POST" })
  .inputValidator((input: CreateTagInput) => input)
  .handler(async ({ data }): Promise<TagSchema> => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(tags)
      .values({
        id,
        name: data.name,
        colour: data.colour,
        icon: data.icon,
        description: data.description,
        groupBy: null,
        sortBy: data.sortBy,
        sortDirection: data.sortDirection,
        links: data.links,
        tagGroup: data.tagGroupId,
        journal: data.journalId,
        user: data.userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    return inserted;
  });
