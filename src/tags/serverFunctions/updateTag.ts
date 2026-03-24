import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { tags } from "src/tags/tags.schema";
import type { ColourName } from "src/colours/Colour.type";
import type { TagSchema } from "src/tags/tags.schema";

type UpdateTagInput = {
  tagId: string;
  name: string;
  colour: ColourName;
  icon: string;
  description: string | null;
  groupBy: string | null;
  sortBy: string;
  sortDirection: string;
  links: string;
  tagGroupId: string | null;
};

export const updateTag = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateTagInput) => input)
  .handler(async ({ data }): Promise<TagSchema> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(tags)
      .set({
        name: data.name,
        colour: data.colour,
        icon: data.icon,
        description: data.description,
        groupBy: data.groupBy,
        sortBy: data.sortBy,
        sortDirection: data.sortDirection,
        links: data.links,
        tagGroup: data.tagGroupId,
        updated: now,
      })
      .where(eq(tags.id, data.tagId))
      .returning()
      .all();

    return updated;
  });
