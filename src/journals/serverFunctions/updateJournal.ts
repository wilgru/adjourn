import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import type { ColourName } from "src/colours/Colour.type";
import type { JournalSchema } from "src/journals/journals.schema";

type UpdateJournalInput = {
  journalId: string;
  title: string;
  icon: string;
  colour: ColourName;
  notesSortBy: string;
  notesSortDirection: string;
  notesGroupBy: string | null;
  bookmarkedSortBy: string;
  bookmarkedSortDirection: string;
  bookmarkedGroupBy: string | null;
};

export const updateJournal = createServerFn({ method: "POST" })
  .inputValidator((input: UpdateJournalInput) => input)
  .handler(async ({ data }): Promise<JournalSchema> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(journals)
      .set({
        title: data.title,
        icon: data.icon,
        colour: data.colour,
        notesSortBy: data.notesSortBy,
        notesSortDirection: data.notesSortDirection,
        notesGroupBy: data.notesGroupBy,
        bookmarkedSortBy: data.bookmarkedSortBy,
        bookmarkedSortDirection: data.bookmarkedSortDirection,
        bookmarkedGroupBy: data.bookmarkedGroupBy,
        updated: now,
      })
      .where(eq(journals.id, data.journalId))
      .returning()
      .all();

    return updated;
  });
