import { eq } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";
import type { ColourName } from "src/colours/Colour.type";

export type UpdatePocketbookInput = {
  pocketbookId: string;
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
  "pocketbooks:update",
  ({
    pocketbookId,
    title,
    icon,
    colour,
    notesSortBy,
    notesSortDirection,
    notesGroupBy,
    bookmarkedSortBy,
    bookmarkedSortDirection,
    bookmarkedGroupBy,
  }: UpdatePocketbookInput): PocketbookSchema => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(pocketbooks)
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
      .where(eq(pocketbooks.id, pocketbookId))
      .returning()
      .all();

    return updated;
  },
);
