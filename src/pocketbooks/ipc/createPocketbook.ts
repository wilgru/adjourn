import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";
import type { ColourName } from "src/colours/Colour.type";

export type CreatePocketbookInput = {
  title: string;
  icon: string;
  colour: ColourName;
  userId: string | null;
};

createIpcHandler(
  "pocketbooks:create",
  ({ title, icon, colour, userId }: CreatePocketbookInput): PocketbookSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(pocketbooks)
      .values({
        id,
        title,
        icon,
        colour,
        user: userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    return inserted;
  },
);
