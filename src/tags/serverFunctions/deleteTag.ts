import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { noteTags } from "src/notes/notes.schema";
import { tags } from "src/tags/tags.schema";

type DeleteTagInput = {
  tagId: string;
};

export const deleteTag = createServerFn({ method: "POST" })
  .inputValidator((input: DeleteTagInput) => input)
  .handler(async ({ data }): Promise<string> => {
    db.delete(noteTags).where(eq(noteTags.tagId, data.tagId)).run();
    db.delete(tags).where(eq(tags.id, data.tagId)).run();

    return data.tagId;
  });
