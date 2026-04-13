import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { tags } from "src/tags/tags.schema";
import type { TagSchema } from "src/tags/tags.schema";
import type { ColourName } from "src/colours/Colour.type";

export type CreateTagInput = {
  name: string;
  colour: ColourName;
  icon: string;
  description: string | null;
  tagGroupId: string | null;
  journalId: string | null;
  userId: string | null;
};

createIpcHandler(
  "tags:create",
  ({
    name,
    colour,
    icon,
    description,
    tagGroupId,
    journalId,
    userId,
  }: CreateTagInput): TagSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(tags)
      .values({
        id,
        name,
        colour,
        icon,
        description,
        tagGroup: tagGroupId,
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
