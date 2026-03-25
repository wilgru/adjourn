import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { tags, tagGroups } from "src/tags/tags.schema";

type DeleteTagGroupInput = {
  tagGroupId: string;
};

export const deleteTagGroup = createServerFn({ method: "POST" })
  .inputValidator((input: DeleteTagGroupInput) => input)
  .handler(async ({ data }): Promise<string> => {
    // Unlink all tags in this group
    db.update(tags)
      .set({ tagGroup: null })
      .where(eq(tags.tagGroup, data.tagGroupId))
      .run();

    // Delete the group
    db.delete(tagGroups).where(eq(tagGroups.id, data.tagGroupId)).run();

    return data.tagGroupId;
  });
