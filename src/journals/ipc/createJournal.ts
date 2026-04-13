import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import type { JournalSchema } from "src/journals/journals.schema";
import type { ColourName } from "src/colours/Colour.type";

export type CreateJournalInput = {
  title: string;
  icon: string;
  colour: ColourName;
  userId: string | null;
};

createIpcHandler(
  "journals:create",
  ({ title, icon, colour, userId }: CreateJournalInput): JournalSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(journals)
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
