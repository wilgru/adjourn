import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import type { JournalSchema } from "src/journals/journals.schema";
import type { ColourName } from "src/colours/Colour.type";

export type UpdateJournalInput = {
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

createIpcHandler(
  "journals:update",
  ({
    journalId,
    title,
    icon,
    colour,
    notesSortBy,
    notesSortDirection,
    notesGroupBy,
    bookmarkedSortBy,
    bookmarkedSortDirection,
    bookmarkedGroupBy,
  }: UpdateJournalInput): JournalSchema => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(journals)
      .set({
        title,
        icon,
        colour,
        notesSortBy,
        notesSortDirection,
        notesGroupBy,
        bookmarkedSortBy,
        bookmarkedSortDirection,
        bookmarkedGroupBy,
        updated: now,
      })
      .where(eq(journals.id, journalId))
      .returning()
      .all();

    return updated;
  },
);
